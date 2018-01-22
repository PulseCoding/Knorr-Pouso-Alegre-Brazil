var fs     = require('fs')
var modbus = require('jsmodbus')
// var PubNub = require('pubnub')

var Directory = 'C:/Pulse/FD12-01_LOGS/'
var numberOfMachines = 6
var machine = []

// Se crean todas las variables de las maquinas
for (var i = 0; i < numberOfMachines; i++) {
  machine.push(new MachineBuilder())
}

machine[0].logName    = 'bra_pou_Filler_FD12-01.log'
machine[1].logName    = 'bra_pou_Cartoner_FD12-01.log'
machine[2].logName    = 'bra_pou_Encoder_FD12-01.log'
machine[3].logName    = 'bra_pou_FillerDisplay_FD12-01.log'
machine[4].logName    = 'bra_pou_CasePacker_FD12-01.log'
machine[5].logName    = 'bra_pou_EOL_FD12-01.log'
machine[5].inFlowTime = false

// Logica Principal - lleva los tiempos del codigo
setInterval(function() {
  statesLogic()
  countsLogic()
  speedLogic()
}, 1000)

// >> States Logic Starts
var machinesInStop = 0
var ttFirstStoppedMachine = 0
var FirstStoppedMachine = 0
var timeStampGen = 0
function statesLogic() {
  // Run/Stop logic starts
  timeStampGen = Date.now()
  for (var p in machine) {
    if (machine[p].mainCounter > machine[p].actualCounter) { // Detect when machines is producing or not
      machine[p].saveTime = 1
      machine[p].state = 1
      machine[p].secondsStop = 0
    } else {
      machine[p].saveTime = 2
    }
    machine[p].actualCounter = machine[p].mainCounter
    if (machine[p].saveTime == 2) {
      machine[p].secondsStop++
    }
    if (machine[p].secondsStop == machine[p].timeStop) {
      machine[p].state = 2
    }
    if (machine[p].saveTime != machine[p].actualSaveTime) { // Save timestamp
      machine[p].actualSaveTime = machine[p].saveTime
      machine[p].timeStamp = timeStampGen
    }
    if (machine[p].state != machine[p].actualState) { // Printer logic when a change in the state is detected
      if (machine[p].counterEOL == 'not used') {
        machine[p].multiplePrintSeconds = 0
        machine[p].actualState = machine[p].state
        fs.appendFileSync(Directory + machine[p].logName, 'tt=' + machine[p].timeStamp + ',var=ST' + ',val='+ machine[p].state + '\n')
      }
    } else { // Imprime cada 5 minutos si se repite el estado
      machine[p].multiplePrintSeconds++
      if (machine[p].multiplePrintSeconds > 300) {
        machine[p].multiplePrintSeconds = 0
        fs.appendFileSync(Directory + machine[p].logName, 'tt=' + Date.now() + ',var=ST' + ',val='+ machine[p].state + '\n')
      }
    }
    if (machine[p].state != 2) { // revisa que todas las maquinas esten detenidas
      if (machine[p].counterEOL == 'not used') {
        machinesInStop++
      }
    }
  }
  // Run/Stop logic ends
  // Wait/Block logic starts
  if (machinesInStop == 0) {
    ttFirstStoppedMachine = Date.now()
    for (var p in machine) {
      if (machine[p].inFlowTime == true) {
        if (machine[p].timeStamp < ttFirstStoppedMachine) { // gives causal machine
          ttFirstStoppedMachine = machine[p].timeStamp
          FirstStoppedMachine = p
        }
      }
    }
    for (var p in machine) {
      if (ttFirstStoppedMachine != machine[p].timeStamp){
        if (machine[p].inFlowTime == true) {
          if (p < FirstStoppedMachine) { // mark the state as block
            machine[p].state = 4
            machine[p].timeStamp = machine[p].timeStamp + 100 // fix states for 1 sec
          }
          if (p > FirstStoppedMachine) { // mark the state as wait
            machine[p].state = 3
            machine[p].timeStamp = machine[p].timeStamp + 100 // fix states for 1 sec
          }
        }
      }
    }
  } else {
    machinesInStop = 0
  }
}
// >> Counts Logic Start
var secondsCounts = 0
var timeStampCounts = 0
var minutesInStandBy = 8
function countsLogic() {
  secondsCounts++
  if (secondsCounts == 60) {
    timeStampCounts = Date.now()
    for (var p in machine) {
      machine[p].results = {
        CPQI : machine[p].counterIn,
        CPQO : machine[p].counterOut,
        EOL  : machine[p].counterEOL
      }
      if (machine[p].commOK == true) {
        if (machine[p].results.CPQI == machine[p].actualResults.CPQI && machine[p].results.CPQO == machine[p].actualResults.CPQO
          && machine[p].results.EOL == machine[p].actualResults.EOL) {
          machine[p].pausePrint++
        } else {
          machine[p].pausePrint = 0
        }

        if (machine[p].pausePrint == 0) {
          for (var key in machine[p].results) {
            if(machine[p].results[key] != 'not used')
              fs.appendFileSync(Directory + machine[p].logName, 'tt=' + timeStampCounts + ',var=' + key + ',val='+ machine[p].results[key] + '\n')
          }
        }

        if (machine[p].pausePrint > minutesInStandBy) {
          machine[p].pausePrint = 0
          for (var key in machine[p].results) {
            if(machine[p].results[key] != 'not used')
              fs.appendFileSync(Directory + machine[p].logName, 'tt=' + timeStampCounts + ',var=' + key + ',val='+ machine[p].results[key] + '\n')
          }
        }
        machine[p].actualResults = {
          CPQI : machine[p].counterIn,
          CPQO : machine[p].counterOut,
          EOL  : machine[p].counterEOL
        }
      }
    }
    secondsCounts = 0
  }
}
// << Counts Logic Ends

// >> Speed Logic Start
function speedLogic() {
  for (var p in machine) {
    if (machine[p].commOK == true && machine[p].counterEOL == 'not used') {
      if (machine[p].state == 1) {
        machine[p].ons2 = false
        machine[p].speedSeconds++
        if (machine[p].ons0 == false) {
          machine[p].temporalSpeedCounter = machine[p].mainSpeedCounter
          machine[p].speedTimeStamp = machine[p].timeStamp
          machine[p].ons0 = true
          machine[p].ons1 = true
        }
        if (machine[p].speedSeconds == machine[p].speedTime) {
          machine[p].speed = (machine[p].mainSpeedCounter - machine[p].temporalSpeedCounter)*(60/machine[p].speedTime)
          machine[p].temporalSpeedCounter = machine[p].mainSpeedCounter
          machine[p].speedSeconds = 0
          if (machine[p].ons1 == true) {
            printSpeed(p, machine[p].speedTimeStamp, machine[p].speed)
            machine[p].ons1 = false
          } else {
            printSpeed(p, Date.now(), machine[p].speed)
          }
        }
      } else {
        machine[p].ons0 = false
        if (machine[p].speedSeconds < machine[p].speedTime && machine[p].ons1 == true) {
          machine[p].ons1 = false
          machine[p].speed = machine[p].mainSpeedCounter - machine[p].temporalSpeedCounter
          printSpeed(p, machine[p].speedTimeStamp, machine[p].speed)
        }
        machine[p].speedSeconds = 0
        if (machine[p].ons2 == false) {
          printSpeed(p, machine[p].timeStamp, 0)
          machine[p].ons2 = true
        }
      }
    }
  }
}
function printSpeed(machineNumber, printSpeedTimeStamp, speed) {
  fs.appendFileSync(Directory + machine[machineNumber].logName, 'tt=' + printSpeedTimeStamp + ',var=SP' + ',val='+ speed + '\n')
}
// << Speed Logic Ends

// >> Modbus Logic Starts
// >> Wise 1 Communication Logic Starts
var interval1
var ons1 = 0

var client1 = modbus.client.tcp.complete({
  'host':             "192.168.10.90",
  'port':             502,
  'autoReconnect':    true,
  'timeout':          5000,
  'logEnabled':       true,
  'reconnectTimeout': 1000
})
client1.connect()
client1.on('connect', function(err) {
  interval1 = setInterval(function() {
    client1.readHoldingRegisters(0, 16).then(function(resp) {
      machine[0].counterOut = (joinWord(resp.register[0], resp.register[1]) + joinWord(resp.register[2], resp.register[3]) + joinWord(resp.register[4], resp.register[5]) + joinWord(resp.register[6], resp.register[7]))*2
      machine[1].counterOut = joinWord(resp.register[8], resp.register[9]) + joinWord(resp.register[10], resp.register[11])

      for (var i = 0; i <= 1; i++) {
        machine[i].commOK = true
        machine[i].mainCounter  = machine[i].counterOut
        machine[i].mainSpeedCounter = machine[i].counterOut
        if (ons1 == 0) {
          machine[i].actualCounter = machine[i].mainCounter
          machine[i].actualState = 0
        }
      }
      ons1 = 1
    })
  }, 1000)
})
client1.on('error', function(err){
  clearInterval(interval1)
})
client1.on('close', function() {
  clearInterval(interval1)
})
// << Wise 1 Communication Logic Ends

// >> Wise 2 Communication Logic Starts
var interval2
var ons2 = 0

var client2 = modbus.client.tcp.complete({
  'host':             "192.168.10.105",
  'port':             502,
  'autoReconnect':    true,
  'timeout':          5000,
  'logEnabled':       true,
  'reconnectTimeout': 1000
})
client2.connect()
client2.on('connect', function(err) {
  interval2 = setInterval(function() {
    client2.readHoldingRegisters(0, 16).then(function(resp) {
      machine[2].counterOut = joinWord(resp.register[0], resp.register[1]) + joinWord(resp.register[2], resp.register[3]) // Encoder
      machine[3].counterOut = joinWord(resp.register[4], resp.register[5]) // FillerDisplay
      machine[4].counterOut = joinWord(resp.register[6], resp.register[7]) // Case Packer
      machine[5].counterEOL = joinWord(resp.register[6], resp.register[7]) // EOL

      for (var i = 5; i <= 7; i++) {
        machine[i].commOK = true
        machine[i].mainCounter  = machine[i].counterOut
        machine[i].mainSpeedCounter = machine[i].counterOut
        if (ons2 == 0) {
          machine[i].actualCounter = machine[i].mainCounter
          machine[i].actualState = 0
        }
      }
      ons2 = 1
    })
  }, 1000)
})
client2.on('error', function(err) {
  clearInterval(interval2)
})
client2.on('close', function() {
  clearInterval(interval2)
})
// << Wise 2 Communication Logic Ends
// << Modbus Logic Ends

// >> Function Combine 2 Words Logic Starts
var joinWord = function(num1, num2) {
  var bits = "00000000000000000000000000000000"
  var bin1 = num1.toString(2)
  var bin2 = num2.toString(2)
  var newNum = bits.split("")
  for (i = 0; i < bin1.length; i++) {
    newNum[31 - i] = bin1[(bin1.length - 1) - i]
  }
  for (i = 0; i < bin2.length; i++) {
    newNum[15 - i] = bin2[(bin2.length - 1) - i]
  }
  bits = newNum.join("")
  return parseInt(bits, 2)
}
// << Function Combine 2 Words Logic Ends
// >> Constructor de variables Logic Starts
class MachineBuilder {
  constructor() {
    this.mainCounter    = 0
    this.actualCounter  = 0
    this.counterIn      = 'not used'
    this.counterOut     = 'not used'
    this.counterEOL     = 'not used'
    this.state          = 2
    this.actualState    = 2
    this.timeStamp      = 0
    this.saveTime       = 0
    this.actualSaveTime = 0
    this.secondsStop    = 0
    this.timeStop       = 25
    this.inFlowTime     = true
    this.commOK         = false
    this.pausePrint     = 0
    this.speedSeconds   = 0
    this.multiplePrintSeconds = 0
    this.temporalSpeedCounter = 0
    this.speed          = 0
    this.speedTime      = 60
    this.results        = null
    this.ons0           = false
    this.ons1           = false
    this.ons2           = false
    this.speedTimeStamp = 0
    this.actualResults  = {
                            CPQI : 0,
                            CPQO : 0,
                            EOL  : 0
                          }
    this.logName        = ''
  }
}
// << Constructor de variables Logic Ends
