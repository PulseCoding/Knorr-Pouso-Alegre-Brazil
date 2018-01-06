var fs = require('fs');
var modbus = require('jsmodbus');
var PubNub = require('pubnub');

var timeStop=25;
var secPubNub=0;
var Fillerct = 0, Fillerresults = null, FillerctIn = null,  FillerctOut = null, Filleractual = 0, Fillertime = 0,  Fillersec = 0,
    FillerflagStopped = false, Fillerstate = 0, Fillerspeed = 0, FillerspeedTemp = 0, FillerflagPrint = 0, FillersecStop = 0,
    FillerONS = 0, FillerflagRunning = false;

var Cartonerct = 0, Cartonerresults = null, CartonerctIn = null,  CartonerctOut = null, CartonerctRj=null, Cartoneractual = 0, Cartonertime = 0,
    Cartonersec = 0, CartonerflagStopped = false, Cartonerstate = 0, Cartonerspeed = 0, CartonerspeedTemp = 0, CartonerflagPrint = 0,
    CartonersecStop = 0, CartonerONS = 0, CartonerflagRunning = false;

var Encoderct = 0, Encoderresults = null, EncoderctIn = null,  EncoderctOut = null,  Encoderactual = 0,  Encodertime = 0,
    Encodersec = 0,  EncoderflagStopped = false,  Encoderstate = 0,  Encoderspeed = 0,  EncoderspeedTemp = 0,  EncoderflagPrint = 0,
    EncodersecStop = 0,  EncoderONS = 0,  EncoderflagRunning = false;

var CasePackerct = 0, CasePackerresults = null, CasePackerctIn = null,  CasePackerctOut = null,  CasePackeractual = 0,  CasePackertime = 0,
    CasePackersec = 0,  CasePackerflagStopped = false,  CasePackerstate = 0,  CasePackerspeed = 0,  CasePackerspeedTemp = 0,  CasePackerflagPrint = 0,
    CasePackersecStop = 0,  CasePackerONS = 0,  CasePackerflagRunning = false;

var eol=0,secEOL=0;



var cA1, cA2;

var files = fs.readdirSync("C:/Pulse/FD12-02_LOGS/"); //Leer documentos
var text2send=[];//Vector a enviar
var publishConfig;
var i=0;

var PubNub = require('pubnub');

var pubnub = new PubNub({
  publishKey : "pub-c-ac9f95b7-c3eb-4914-9222-16fbcaad4c59",
  subscribeKey : "sub-c-206bed96-8c16-11e7-9760-3a607be72b06",
  uuid: "BRA_POU_FD1202"
});

var client1 = modbus.client.tcp.complete({
  'host': "192.168.10.92",
  'port': 502,
  'autoReconnect': true,
  'timeout': 60000,
  'logEnabled': true,
  'reconnectTimeout' : 30000
});
var client2 = modbus.client.tcp.complete({
  'host': "192.168.10.93",
  'port': 502,
  'autoReconnect': true,
  'timeout': 60000,
  'logEnabled': true,
  'reconnectTimeout' : 30000
});


function idle(){
  i=0;
  text2send=[];
  for (var k=0;k<files.length;k++){//Verificar los archivos
    var stats = fs.statSync("C:/Pulse/FD12-02_LOGS/"+files[k]);
    var mtime = new Date(stats.mtime).getTime();
    if (mtime< (Date.now() - (10*60*1000))&&files[k].indexOf("serialbox")==-1){
      text2send[i]=files[k];
      i++;
    }
  }
}
   function senderData(){
      pubnub.publish(publishConfig, function(status, response) {});
    }

    function joinWord(num1, num2) {
      var bits = "00000000000000000000000000000000";
      var bin1 = num1.toString(2),
        bin2 = num2.toString(2),
        newNum = bits.split("");

      for (i = 0; i < bin1.length; i++) {
        newNum[31 - i] = bin1[(bin1.length - 1) - i];
      }
      for (i = 0; i < bin2.length; i++) {
        newNum[15 - i] = bin2[(bin2.length - 1) - i];
      }
      bits = newNum.join("");
      return parseInt(bits, 2);
    }
    try{

          client1.connect();
          client2.connect();

          client1.on('connect', function(err) {

            cA1=setInterval(function(){
            client1.readHoldingRegisters(0, 16).then(function(resp) {
                FillerctOut=( joinWord(resp.register[0], resp.register[1]) + joinWord(resp.register[2], resp.register[3]) + joinWord(resp.register[4], resp.register[5]) + joinWord(resp.register[6], resp.register[7]))*2;
                CartonerctIn=( joinWord(resp.register[0], resp.register[1]) + joinWord(resp.register[2], resp.register[3]) + joinWord(resp.register[4], resp.register[5]) + joinWord(resp.register[6], resp.register[7]))*2;
                CartonerctOut=joinWord(resp.register[8], resp.register[9]) + joinWord(resp.register[10], resp.register[11]);
            });
            //------------------------------------------Filler----------------------------------------------
              Fillerct = FillerctOut; //Igualar a la salida de la máquina
              if (FillerONS == 0 && Fillerct) {
                FillerspeedTemp = Fillerct;
               // CntInFillerAnt = CntInFiller;
               // CntOutFillerAnt = CntOutFiller;
                FillerONS = 1;
              }
              if(Fillerct > Filleractual){
                if(FillerflagStopped){
                  Fillerspeed = Fillerct -FillerspeedTemp;
                  FillerspeedTemp = Fillerct;
                  Fillersec=0;
                }
                FillersecStop = 0;
                Fillersec++;
                Fillertime = Date.now();
                Fillerstate = 1;
                FillerflagStopped = false;
                FillerflagRunning = true;
              } else if( Fillerct == Filleractual ){
                if(FillersecStop == 0){
                  Fillertime = Date.now();
                }
                FillersecStop++;
                if(FillersecStop>=25){
                  Fillerspeed = 0;
                  Fillerstate = 2;
                  FillerspeedTemp = Fillerct;
                  FillerflagStopped = true;
                  FillerflagRunning = false;
                }
                if(FillersecStop%120==0 ||FillersecStop ==25 ){
                  FillerflagPrint=1;

                  if(FillersecStop%120==0){
                    Fillertime = Date.now();
                  }
                }
              }
              Filleractual = Fillerct;
              if(Fillersec==60){
                Fillersec = 0;
                if(FillerflagRunning && Fillerct){
                  FillerflagPrint=1;
                  FillersecStop = 0;
                  Fillerspeed = Fillerct -FillerspeedTemp;
                  FillerspeedTemp = Fillerct;
                }
              }
              Fillerresults = {
                ST: Fillerstate,
               // CPQI: FillerctIn,
                CPQO: Fillerct,
                SP: Fillerspeed
              };
              if (FillerflagPrint == 1) {
                for (var key in Fillerresults) {
                  if(!isNaN(Fillerresults[key])&&Fillerresults[key]!=null)
                  fs.appendFileSync('C:/Pulse/FD12-02_LOGS/bra_pou_Filler_FD12-02.log', 'tt=' + Fillertime + ',var=' + key + ',val=' + Fillerresults[key] + '\n');
                }
                FillerflagPrint = 0;
              }

          //------------------------------------------Filler----------------------------------------------


            //------------------------------------------Cartoner----------------------------------------------
              Cartonerct = CartonerctOut; //Igualar a la salida de la máquina
              if (CartonerONS == 0 && Cartonerct) {
                CartonerspeedTemp = Cartonerct;
              //  CntInCartonerAnt = CntInCartoner;
               // CntOutCartonerAnt = CntOutCartoner;
                CartonerONS = 1;
              }
              if(Cartonerct > Cartoneractual){
                if(CartonerflagStopped){
                  Cartonerspeed = Cartonerct -CartonerspeedTemp;
                  CartonerspeedTemp = Cartonerct;
                  Cartonersec=0;
                }
                CartonersecStop = 0;
                Cartonersec++;
                Cartonertime = Date.now();
                Cartonerstate = 1;
                CartonerflagStopped = false;
                CartonerflagRunning = true;
              } else if( Cartonerct == Cartoneractual ){
                if(CartonersecStop == 0){
                  Cartonertime = Date.now();
                }
                CartonersecStop++;
                if(CartonersecStop>=25){
                  Cartonerspeed = 0;
                  Cartonerstate = 2;
                  CartonerspeedTemp = Cartonerct;
                  CartonerflagStopped = true;
                  CartonerflagRunning = false;
                }
                if(CartonersecStop%120==0 ||CartonersecStop ==25 ){
                  CartonerflagPrint=1;

                  if(CartonersecStop%120==0){
                    Cartonertime = Date.now();
                  }
                }
              }
              Cartoneractual = Cartonerct;
              if(Cartonersec==60){
                Cartonersec = 0;
                if(CartonerflagRunning && Cartonerct){
                  CartonerflagPrint=1;
                  CartonersecStop = 0;
                  Cartonerspeed = Cartonerct -CartonerspeedTemp;
                  CartonerspeedTemp = Cartonerct;
                }
              }
              //console.log(Cartonersec+'   '+CartonersecStop)
              Cartonerresults = {
                ST: Cartonerstate,
                CPQI: CartonerctIn,//Igualar a la entrada del wise
                CPQO: Cartonerct,
              //  CPQR: CartonerctRj,
                SP: Cartonerspeed
              };
              if (CartonerflagPrint == 1) {
                for (var key in Cartonerresults) {
                  if(!isNaN(Cartonerresults[key])&&Cartonerresults[key]!=null)
                  fs.appendFileSync('C:/Pulse/FD12-02_LOGS/bra_pou_Cartoner_FD12-02.log', 'tt=' + Cartonertime + ',var=' + key + ',val=' + Cartonerresults[key] + '\n');
                }
                CartonerflagPrint = 0;
              }

          //------------------------------------------Cartoner----------------------------------------------
          },1000);
          });
          client1.on('error', function(err) {
            clearInterval(cA1);
          });
          client1.on('close', function() {
            clearInterval(cA1);
          });
          client2.on('connect', function(err) {

            cA2=setInterval(function(){
              client2.readHoldingRegisters(0, 16).then(function(resp) {
                EncoderctOut=joinWord(resp.register[0], resp.register[1]) + joinWord(resp.register[2], resp.register[3]);
                FillerDisplayctOut= joinWord(resp.register[4], resp.register[5]);
                CasePackerctIn= joinWord(resp.register[4], resp.register[5]);
                CasePackerctOut = joinWord(resp.register[6], resp.register[7]);
                eol = joinWord(resp.register[6], resp.register[7]);
              });
            //////--Encoder--------------------------------------------------------------------------------------------------------------------
               Encoderct = EncoderctOut; //Igualar a la salida de la máquina
              if (EncoderONS == 0 && Encoderct) {
                EncoderspeedTemp = Encoderct;
               // CntInEncoderAnt = CntInEncoder;
               // CntOutEncoderAnt = CntOutEncoder;
                EncoderONS = 1;
              }
              if(Encoderct > Encoderactual){
                if(EncoderflagStopped){
                  Encoderspeed = Encoderct -EncoderspeedTemp;
                  EncoderspeedTemp = Encoderct;
                  Encodersec=0;
                }
                EncodersecStop = 0;
                Encodersec++;
                Encodertime = Date.now();
                Encoderstate = 1;
                EncoderflagStopped = false;
                EncoderflagRunning = true;
              } else if( Encoderct == Encoderactual ){
                if(EncodersecStop == 0){
                  Encodertime = Date.now();
                }
                EncodersecStop++;
                if(EncodersecStop>=30){
                  Encoderspeed = 0;
                  Encoderstate = 2;
                  EncoderspeedTemp = Encoderct;
                  EncoderflagStopped = true;
                  EncoderflagRunning = false;
                }
                if(EncodersecStop%120==0 ||EncodersecStop ==30 ){
                  EncoderflagPrint=1;

                  if(EncodersecStop%120==0){
                    Encodertime = Date.now();
                  }
                }
              }
              Encoderactual = Encoderct;
              if(Encodersec==60){
                Encodersec = 0;
                if(EncoderflagRunning && Encoderct){
                  EncoderflagPrint=1;
                  EncodersecStop = 0;
                  Encoderspeed = Encoderct -EncoderspeedTemp;
                  EncoderspeedTemp = Encoderct;
                }
              }
              Encoderresults = {
                ST: Encoderstate,
              //  CPQI: EncoderctIn,//Igualar a la entrada del wise
                CPQO: Encoderct,
                SP: Encoderspeed
              };
              if (EncoderflagPrint == 1) {
                for (var key in Encoderresults) {
                  fs.appendFileSync('C:/Pulse/FD12-02_LOGS/bra_pou_Encoder_FD12-02.log', 'tt=' + Encodertime + ',var=' + key + ',val=' + Encoderresults[key] + '\n');
                }
                EncoderflagPrint = 0;
              }
            //////--Encoder--------------------------------------------------------------------------------------------------------------------
            //////--CasePacker--------------------------------------------------------------------------------------------------------------------
               CasePackerct = CasePackerctOut; //Igualar a la salida de la máquina
              if (CasePackerONS == 0 && CasePackerct) {
                CasePackerspeedTemp = CasePackerct;
               // CntInCasePackerAnt = CntInCasePacker;
               // CntOutCasePackerAnt = CntOutCasePacker;
                CasePackerONS = 1;
              }
              if(CasePackerct > CasePackeractual){
                if(CasePackerflagStopped){
                  CasePackerspeed = CasePackerct -CasePackerspeedTemp;
                  CasePackerspeedTemp = CasePackerct;
                  CasePackersec=0;
                }
                CasePackersecStop = 0;
                CasePackersec++;
                CasePackertime = Date.now();
                CasePackerstate = 1;
                CasePackerflagStopped = false;
                CasePackerflagRunning = true;
              } else if( CasePackerct == CasePackeractual ){
                if(CasePackersecStop == 0){
                  CasePackertime = Date.now();
                }
                CasePackersecStop++;
                if(CasePackersecStop>=100){
                  CasePackerspeed = 0;
                  CasePackerstate = 2;
                  CasePackerspeedTemp = CasePackerct;
                  CasePackerflagStopped = true;
                  CasePackerflagRunning = false;
                }
                if(CasePackersecStop%120==0 ||CasePackersecStop ==100 ){
                  CasePackerflagPrint=1;

                  if(CasePackersecStop%120==0){
                    CasePackertime = Date.now();
                  }
                }
              }
              CasePackeractual = CasePackerct;
              if(CasePackersec==2){
                CasePackersec = 0;
                if(CasePackerflagRunning && CasePackerct){
                  CasePackerflagPrint=1;
                  CasePackersecStop = 0;
                  CasePackerspeed = CasePackerct -CasePackerspeedTemp;
                  CasePackerspeedTemp = CasePackerct;
                }
              }
              CasePackerresults = {
                ST: CasePackerstate,
                CPQI: CasePackerctIn,//Igualar a la entrada del wise
                CPQO: CasePackerct,
                SP: CasePackerspeed
              };
              if (CasePackerflagPrint == 1) {
                for (var key in CasePackerresults) {
                  if(!isNaN(CasePackerresults[key])&&CasePackerresults[key]!=null)
                  fs.appendFileSync('C:/Pulse/FD12-02_LOGS/bra_pou_CasePacker_FD12-02.log', 'tt=' + CasePackertime + ',var=' + key + ',val=' + CasePackerresults[key] + '\n');
                }
                CasePackerflagPrint = 0;
              }
            //////--CasePacker--------------------------------------------------------------------------------------------------------------------

               //////--EOL--------------------------------------------------------------------------------------------------------------------
            if(secEOL>=60){
              fs.appendFileSync("C:/Pulse/FD12-02_LOGS/bra_pou_EOL_FD12-02.log","tt="+Date.now()+",var=EOL"+",val="+eol+"\n");

              secEOL=0;
            }else{
              secEOL++;
            }
            //////--EOL--------------------------------------------------------------------------------------------------------------------

            },1000);
          });
          client2.on('error', function(err) {
            clearInterval(cA2);
          });
          client2.on('close', function() {
            clearInterval(cA2);
          });
var noty=setInterval(function(){
   if(secPubNub>=60*5){
      idle();
      secPubNub=0;
      publishConfig = {
        channel : "POU_Monitor",
        message : {
              line: "FD1202",
              tt: Date.now(),
              machines: text2send
              }
      };
      senderData();
    }else{
      secPubNub++;
    }
   } , 1000);
}catch(err){
   fs.appendFileSync("error.log", err + '\n');
   clearInterval(noty);
}
