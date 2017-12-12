var fs = require('fs');
var Client = require('node-rest-client').Client;
var authorization = {user:"user",password:"00000000"};
var client1 = new Client(authorization);
var client2 = new Client(authorization);
var client3 = new Client(authorization);
var timeStop=25;
var secPubNub=60*4+55;

var Filler1ct = 0, Filler1results = null, Filler1ctIn = null,  Filler1ctOut = null, Filler1actual = 0, Filler1time = 0,  Filler1sec = 0,
    Filler1flagStopped = false, Filler1state = 0, Filler1speed = 0, Filler1speedTemp = 0, Filler1flagPrint = 0, Filler1secStop = 0,
    Filler1ONS = 0, Filler1flagRunning = false;

var Filler2ct = 0, Filler2results = null, Filler2ctIn = null,  Filler2ctOut = null, Filler2actual = 0, Filler2time = 0,  Filler2sec = 0,
    Filler2flagStopped = false, Filler2state = 0, Filler2speed = 0, Filler2speedTemp = 0, Filler2flagPrint = 0, Filler2secStop = 0,
    Filler2ONS = 0, Filler2flagRunning = false;

var Filler3ct = 0, Filler3results = null, Filler3ctIn = null,  Filler3ctOut = null, Filler3actual = 0, Filler3time = 0,  Filler3sec = 0,
    Filler3flagStopped = false, Filler3state = 0, Filler3speed = 0, Filler3speedTemp = 0, Filler3flagPrint = 0, Filler3secStop = 0,
    Filler3ONS = 0, Filler3flagRunning = false;

var Filler4ct = 0, Filler4results = null, Filler4ctIn = null,  Filler4ctOut = null, Filler4actual = 0, Filler4time = 0,  Filler4sec = 0,
    Filler4flagStopped = false, Filler4state = 0, Filler4speed = 0, Filler4speedTemp = 0, Filler4flagPrint = 0, Filler4secStop = 0,
    Filler4ONS = 0, Filler4flagRunning = false;

var Cartoner1ct = 0, Cartoner1results = null, Cartoner1ctIn = null,  Cartoner1ctOut = null, Cartoner1ctRj=null, Cartoner1actual = 0, Cartoner1time = 0,
    Cartoner1sec = 0, Cartoner1flagStopped = false, Cartoner1state = 0, Cartoner1speed = 0, Cartoner1speedTemp = 0, Cartoner1flagPrint = 0,
    Cartoner1secStop = 0, Cartoner1ONS = 0, Cartoner1flagRunning = false;

var Cartoner2ct = 0, Cartoner2results = null, Cartoner2ctIn = null,  Cartoner2ctOut = null, Cartoner2ctRj=null, Cartoner2actual = 0, Cartoner2time = 0,
    Cartoner2sec = 0, Cartoner2flagStopped = false, Cartoner2state = 0, Cartoner2speed = 0, Cartoner2speedTemp = 0, Cartoner2flagPrint = 0,
    Cartoner2secStop = 0, Cartoner2ONS = 0, Cartoner2flagRunning = false;

var Cartoner3ct = 0, Cartoner3results = null, Cartoner3ctIn = null,  Cartoner3ctOut = null, Cartoner3ctRj=null, Cartoner3actual = 0, Cartoner3time = 0,
    Cartoner3sec = 0, Cartoner3flagStopped = false, Cartoner3state = 0, Cartoner3speed = 0, Cartoner3speedTemp = 0, Cartoner3flagPrint = 0,
    Cartoner3secStop = 0, Cartoner3ONS = 0, Cartoner3flagRunning = false;

var Cartoner4ct = 0, Cartoner4results = null, Cartoner4ctIn = null,  Cartoner4ctOut = null, Cartoner4ctRj=null, Cartoner4actual = 0, Cartoner4time = 0,
    Cartoner4sec = 0, Cartoner4flagStopped = false, Cartoner4state = 0, Cartoner4speed = 0, Cartoner4speedTemp = 0, Cartoner4flagPrint = 0,
    Cartoner4secStop = 0, Cartoner4ONS = 0, Cartoner4flagRunning = false;

var DisplayFillerct = 0, DisplayFillerresults = null, DisplayFillerctIn = null, DisplayFillerctOut = null, DisplayFilleractual = 0,
    DisplayFillertime = 0, DisplayFillersec = 0, DisplayFillerflagStopped = false, DisplayFillerstate = 0, DisplayFillerspeed = 0,
    DisplayFillerspeedTemp = 0,  DisplayFillerflagPrint = 0, DisplayFillersecStop = 0, DisplayFillerONS = 0,  DisplayFillerflagRunning = false;

var CasePackerct = 0, CasePackerresults = null, CasePackerctIn = null,  CasePackerctOut = null,  CasePackeractual = 0,  CasePackertime = 0,
    CasePackersec = 0,  CasePackerflagStopped = false,  CasePackerstate = 0,  CasePackerspeed = 0,  CasePackerspeedTemp = 0,  CasePackerflagPrint = 0,
    CasePackersecStop = 0,  CasePackerONS = 0,  CasePackerflagRunning = false;

var eol=null,secEOL=0;

var files = fs.readdirSync("C:/Pulse/BLOCO3B_LOGS"); //Leer documentos
var actualdate = Date.now(); //Fecha actual
var text2send=[];//Vector a enviar
var flagInfo2Send=0;
var i=0;

var PubNub = require('pubnub');

pubnub = new PubNub({
  publishKey : "pub-c-ac9f95b7-c3eb-4914-9222-16fbcaad4c59",
  subscribeKey : "sub-c-206bed96-8c16-11e7-9760-3a607be72b06",
  uuid: "BRA_POU_BLOCO3"
});


function senderData(){
  pubnub.publish(publishConfig, function(status, response) {
});}




function getData1(){
  var rqt1 = client1.get("http://192.168.10.98/Di_value/slot_0",function(data,resp){
    Filler1ctIn    = data.DIVal[0].Val;
    Filler1ctOut   = data.DIVal[1].Val + data.DIVal[2].Val;
    Cartoner1ctOut = data.DIVal[3].Val;
    Filler2ctIn    = data.DIVal[4].Val;
    Filler2ctOut   = data.DIVal[5].Val+data.DIVal[6].Val;
    Cartoner2ctOut = data.DIVal[7].Val;
  });
  rqt1.on('error', function (err) {
    fs.appendFileSync("error.log","ID1 Client1: "+err + '\n');
  });
}
function getData2(){
  var rqt2 = client2.get("http://192.168.10.99/Di_value/slot_0",function(data,resp){
      Filler3ctIn    = data.DIVal[0].Val;
      Filler3ctOut   = data.DIVal[1].Val + data.DIVal[2].Val;
      Cartoner3ctOut = data.DIVal[3].Val;
      Filler4ctIn = data.DIVal[4].Val;
      Filler4ctOut = data.DIVal[5].Val+data.DIVal[6].Val;
      Cartoner4ctOut = data.DIVal[7].Val;
  });
  rqt2.on('error', function (err) {
    fs.appendFileSync("error.log","ID1 Client2: "+err + '\n');
  });
}
function getData3(){
  var rqt3 = client3.get("http://192.168.10.100/Di_value/slot_0",function(data,resp){
      DisplayFillerctIn=data.DIVal[0].Val+data.DIVal[1].Val+data.DIVal[2].Val+data.DIVal[3].Val;
      DisplayFillerctOut = data.DIVal[4].Val;
      CasePackerctOut = data.DIVal[5].Val;
      eol = data.DIVal[5].Val;
  });
  rqt3.on('error', function (err) {
    fs.appendFileSync("error.log","ID1 Client3: "+err + '\n');
  });
}
function idle(){
  i=0;
  text2send=[];
  for ( k=0;k<files.length;k++){//Verificar los archivos
    var stats = fs.statSync("C:/Pulse/BLOCO3B_LOGS/"+files[k]);
    var mtime = new Date(stats.mtime).getTime();
    if (mtime< (Date.now() - (10*60*1000))&&files[k].indexOf("serialbox")==-1){
      flagInfo2Send=1;
      text2send[i]=files[k];
      i++;
    }
  }
}
/////MAIN/////------------------------------------------------------------------------------------
try{
  setInterval(function(){
    getData1();
    getData2();
    getData3();

    //PubNub --------------------------------------------------------------------------------------------------------------------
            if(secPubNub>=60*5){
              secPubNub=0;
              idle();
              publishConfig = {
                channel : "POU_Monitor",
                message : {
                      line: "BLOCO3",
                      tt: Date.now(),
                      machines:text2send

                    }
              };
              senderData();
            }
            secPubNub++;
    //PubNub --------------------------------------------------------------------------------------------------------------------
     //------------------------------------------Filler1----------------------------------------------
      Filler1ct = Filler1ctOut; //Igualar a la salida de la máquina
      if (Filler1ONS == 0 && Filler1ct) {
        Filler1speedTemp = Filler1ct;
       // CntInFiller1Ant = CntInFiller1;
       // CntOutFiller1Ant = CntOutFiller1;
        Filler1ONS = 1;
      }
      if(Filler1ct > Filler1actual){
        if(Filler1flagStopped){
          Filler1speed = Filler1ct -Filler1speedTemp;
          Filler1speedTemp = Filler1ct;
          Filler1sec=0;
        }
        Filler1secStop = 0;
        Filler1sec++;
        Filler1time = Date.now();
        Filler1state = 1;
        Filler1flagStopped = false;
        Filler1flagRunning = true;
      } else if( Filler1ct == Filler1actual ){
        if(Filler1secStop == 0){
          Filler1time = Date.now();
        }
        Filler1secStop++;
        if(Filler1secStop>=25){
          Filler1speed = 0;
          Filler1state = 2;
          Filler1speedTemp = Filler1ct;
          Filler1flagStopped = true;
          Filler1flagRunning = false;
        }
        if(Filler1secStop%120==0 ||Filler1secStop ==25 ){
          Filler1flagPrint=1;

          if(Filler1secStop%120==0){
            Filler1time = Date.now();
          }
        }
      }
      Filler1actual = Filler1ct;
      if(Filler1sec==60){
        Filler1sec = 0;
        if(Filler1flagRunning && Filler1ct){
          Filler1flagPrint=1;
          Filler1secStop = 0;
          Filler1speed = Filler1ct -Filler1speedTemp;
          Filler1speedTemp = Filler1ct;
        }
      }
      if(Filler1state==2 && Filler1ctIn==0){
      	Filler1state=3;
      }
      Filler1results = {
        ST: Filler1state,
        //CPQI: Filler1ctIn,
        CPQO: Filler1ct,
        SP: Filler1speed
      };
      if (Filler1flagPrint == 1 && Filler1ct) {
        for (var key in Filler1results) {
          if(!isNaN(Filler1results[key])&&Filler1results[key]!=null)
          fs.appendFileSync('C:/Pulse/BLOCO3B_LOGS/bra_pou_Filler1_BLOCO3B.log', 'tt=' + Filler1time + ',var=' + key + ',val=' + Filler1results[key] + '\n');
        }
        Filler1flagPrint = 0;
      }

  //------------------------------------------Filler1----------------------------------------------
    //------------------------------------------Filler2----------------------------------------------
      Filler2ct = Filler2ctOut; //Igualar a la salida de la máquina
      if (Filler2ONS == 0 && Filler2ct) {
        Filler2speedTemp = Filler2ct;
       // CntInFiller2Ant = CntInFiller2;
       // CntOutFiller2Ant = CntOutFiller2;
        Filler2ONS = 1;
      }
      if(Filler2ct > Filler2actual){
        if(Filler2flagStopped){
          Filler2speed = Filler2ct -Filler2speedTemp;
          Filler2speedTemp = Filler2ct;
          Filler2sec=0;
        }
        Filler2secStop = 0;
        Filler2sec++;
        Filler2time = Date.now();
        Filler2state = 1;
        Filler2flagStopped = false;
        Filler2flagRunning = true;
      } else if( Filler2ct == Filler2actual ){
        if(Filler2secStop == 0){
          Filler2time = Date.now();
        }
        Filler2secStop++;
        if(Filler2secStop>=25){
          Filler2speed = 0;
          Filler2state = 2;
          Filler2speedTemp = Filler2ct;
          Filler2flagStopped = true;
          Filler2flagRunning = false;
        }
        if(Filler2secStop%120==0 ||Filler2secStop ==25 ){
          Filler2flagPrint=1;

          if(Filler2secStop%120==0){
            Filler2time = Date.now();
          }
        }
      }
      Filler2actual = Filler2ct;
      if(Filler2sec==60){
        Filler2sec = 0;
        if(Filler2flagRunning && Filler2ct){
          Filler2flagPrint=1;
          Filler2secStop = 0;
          Filler2speed = Filler2ct -Filler2speedTemp;
          Filler2speedTemp = Filler2ct;
        }
      }
      if(Filler2state==2 && Filler2ctIn==0){
      	Filler2state=3;
      }
      Filler2results = {
        ST: Filler2state,
        //CPQI: Filler2ctIn,
        CPQO: Filler2ct,
        SP: Filler2speed
      };
      if (Filler2flagPrint == 1 && Filler2ct) {
        for (var key in Filler2results) {
          if(!isNaN(Filler2results[key])&&Filler2results[key]!=null)
          fs.appendFileSync('C:/Pulse/BLOCO3B_LOGS/bra_pou_Filler2_BLOCO3B.log', 'tt=' + Filler2time + ',var=' + key + ',val=' + Filler2results[key] + '\n');
        }
        Filler2flagPrint = 0;
      }

  //------------------------------------------Filler2----------------------------------------------
    //------------------------------------------Filler3----------------------------------------------
      Filler3ct = Filler3ctOut; //Igualar a la salida de la máquina
      if (Filler3ONS == 0 && Filler3ct) {
        Filler3speedTemp = Filler3ct;
       // CntInFiller3Ant = CntInFiller3;
       // CntOutFiller3Ant = CntOutFiller3;
        Filler3ONS = 1;
      }
      if(Filler3ct > Filler3actual){
        if(Filler3flagStopped){
          Filler3speed = Filler3ct -Filler3speedTemp;
          Filler3speedTemp = Filler3ct;
          Filler3sec=0;
        }
        Filler3secStop = 0;
        Filler3sec++;
        Filler3time = Date.now();
        Filler3state = 1;
        Filler3flagStopped = false;
        Filler3flagRunning = true;
      } else if( Filler3ct == Filler3actual ){
        if(Filler3secStop == 0){
          Filler3time = Date.now();
        }
        Filler3secStop++;
        if(Filler3secStop>=25){
          Filler3speed = 0;
          Filler3state = 2;
          Filler3speedTemp = Filler3ct;
          Filler3flagStopped = true;
          Filler3flagRunning = false;
        }
        if(Filler3secStop%120==0 ||Filler3secStop ==25 ){
          Filler3flagPrint=1;

          if(Filler3secStop%120==0){
            Filler3time = Date.now();
          }
        }
      }
      Filler3actual = Filler3ct;
      if(Filler3sec==60){
        Filler3sec = 0;
        if(Filler3flagRunning && Filler3ct){
          Filler3flagPrint=1;
          Filler3secStop = 0;
          Filler3speed = Filler3ct -Filler3speedTemp;
          Filler3speedTemp = Filler3ct;
        }
      }
      if(Filler3state==2 && Filler3ctIn==0){
      		Filler3state=3;
      }
      Filler3results = {
        ST: Filler3state,
        //CPQI: Filler3ctIn,
        CPQO: Filler3ct,
        SP: Filler3speed
      };
      if (Filler3flagPrint == 1 && Filler3ct) {
        for (var key in Filler3results) {
          if(!isNaN(Filler3results[key])&&Filler3results[key]!=null)
          fs.appendFileSync('C:/Pulse/BLOCO3B_LOGS/bra_pou_Filler3_BLOCO3B.log', 'tt=' + Filler3time + ',var=' + key + ',val=' + Filler3results[key] + '\n');
        }
        Filler3flagPrint = 0;
      }

  //------------------------------------------Filler3----------------------------------------------
    //------------------------------------------Filler4----------------------------------------------
      Filler4ct = Filler4ctOut; //Igualar a la salida de la máquina
      if (Filler4ONS == 0 && Filler4ct) {
        Filler4speedTemp = Filler4ct;
       // CntInFiller4Ant = CntInFiller4;
       // CntOutFiller4Ant = CntOutFiller4;
        Filler4ONS = 1;
      }
      if(Filler4ct > Filler4actual){
        if(Filler4flagStopped){
          Filler4speed = Filler4ct -Filler4speedTemp;
          Filler4speedTemp = Filler4ct;
          Filler4sec=0;
        }
        Filler4secStop = 0;
        Filler4sec++;
        Filler4time = Date.now();
        Filler4state = 1;
        Filler4flagStopped = false;
        Filler4flagRunning = true;
      } else if( Filler4ct == Filler4actual ){
        if(Filler4secStop == 0){
          Filler4time = Date.now();
        }
        Filler4secStop++;
        if(Filler4secStop>=25){
          Filler4speed = 0;
          Filler4state = 2;
          Filler4speedTemp = Filler4ct;
          Filler4flagStopped = true;
          Filler4flagRunning = false;
        }
        if(Filler4secStop%120==0 ||Filler4secStop ==25 ){
          Filler4flagPrint=1;

          if(Filler4secStop%120==0){
            Filler4time = Date.now();
          }
        }
      }
      Filler4actual = Filler4ct;
      if(Filler4sec==60){
        Filler4sec = 0;
        if(Filler4flagRunning && Filler4ct){
          Filler4flagPrint=1;
          Filler4secStop = 0;
          Filler4speed = Filler4ct -Filler4speedTemp;
          Filler4speedTemp = Filler4ct;
        }
      }
      if(Filler4state==2 && Filler4ctIn==0){
      	Filler4state=3;
      }
      Filler4results = {
        ST: Filler4state,
        //CPQI: Filler4ctIn,
        CPQO: Filler4ct,
        SP: Filler4speed
      };
      if (Filler4flagPrint == 1) {
        for (var key in Filler4results) {
          if(!isNaN(Filler4results[key])&&Filler4results[key]!=null)
          fs.appendFileSync('C:/Pulse/BLOCO3B_LOGS/bra_pou_Filler4_BLOCO3B.log', 'tt=' + Filler4time + ',var=' + key + ',val=' + Filler4results[key] + '\n');
        }
        Filler4flagPrint = 0;
      }

  //------------------------------------------Filler4----------------------------------------------
 //------------------------------------------Cartoner1----------------------------------------------
      Cartoner1ct = Cartoner1ctOut; //Igualar a la salida de la máquina
      if (Cartoner1ONS == 0 && Cartoner1ct) {
        Cartoner1speedTemp = Cartoner1ct;
      //  CntInCartoner1Ant = CntInCartoner1;
       // CntOutCartoner1Ant = CntOutCartoner1;
        Cartoner1ONS = 1;
      }
      if(Cartoner1ct > Cartoner1actual){
        if(Cartoner1flagStopped){
          Cartoner1speed = Cartoner1ct -Cartoner1speedTemp;
          Cartoner1speedTemp = Cartoner1ct;
          Cartoner1sec=0;
        }
        Cartoner1secStop = 0;
        Cartoner1sec++;
        Cartoner1time = Date.now();
        Cartoner1state = 1;
        Cartoner1flagStopped = false;
        Cartoner1flagRunning = true;
      } else if( Cartoner1ct == Cartoner1actual ){
        if(Cartoner1secStop == 0){
          Cartoner1time = Date.now();
        }
        Cartoner1secStop++;
        if(Cartoner1secStop>=25){
          Cartoner1speed = 0;
          Cartoner1state = 2;
          Cartoner1speedTemp = Cartoner1ct;
          Cartoner1flagStopped = true;
          Cartoner1flagRunning = false;
        }
        if(Cartoner1secStop%120==0 ||Cartoner1secStop ==25 ){
          Cartoner1flagPrint=1;

          if(Cartoner1secStop%120==0){
            Cartoner1time = Date.now();
          }
        }
      }
      Cartoner1actual = Cartoner1ct;
      if(Cartoner1sec==60){
        Cartoner1sec = 0;
        if(Cartoner1flagRunning && Cartoner1ct){
          Cartoner1flagPrint=1;
          Cartoner1secStop = 0;
          Cartoner1speed = Cartoner1ct -Cartoner1speedTemp;
          Cartoner1speedTemp = Cartoner1ct;
        }
      }
            //console.log('Cartoner= '+Cartoner1sec+'   '+Cartoner1secStop)
      Cartoner1results = {
        ST: Cartoner1state,
        //CPQI: Cartoner1ctIn
        CPQO: Cartoner1ct,
        //CPQR: Cartoner1ctRj,
        SP: Cartoner1speed
      };
      if (Cartoner1flagPrint == 1 && Cartoner1ct) {
        for (var key in Cartoner1results) {
          if(!isNaN(Cartoner1results[key])&&Cartoner1results[key]!=null)
          fs.appendFileSync('C:/Pulse/BLOCO3B_LOGS/bra_pou_Cartoner1_BLOCO3B.log', 'tt=' + Cartoner1time + ',var=' + key + ',val=' + Cartoner1results[key] + '\n');
        }
        Cartoner1flagPrint = 0;
      }

  //------------------------------------------Cartoner1----------------------------------------------
      //------------------------------------------Cartoner2----------------------------------------------
      Cartoner2ct = Cartoner2ctOut; //Igualar a la salida de la máquina
      if (Cartoner2ONS == 0 && Cartoner2ct) {
        Cartoner2speedTemp = Cartoner2ct;
      //  CntInCartoner2Ant = CntInCartoner2;
       // CntOutCartoner2Ant = CntOutCartoner2;
        Cartoner2ONS = 1;
      }
      if(Cartoner2ct > Cartoner2actual){
        if(Cartoner2flagStopped){
          Cartoner2speed = Cartoner2ct -Cartoner2speedTemp;
          Cartoner2speedTemp = Cartoner2ct;
          Cartoner2sec=0;
        }
        Cartoner2secStop = 0;
        Cartoner2sec++;
        Cartoner2time = Date.now();
        Cartoner2state = 1;
        Cartoner2flagStopped = false;
        Cartoner2flagRunning = true;
      } else if( Cartoner2ct == Cartoner2actual ){
        if(Cartoner2secStop == 0){
          Cartoner2time = Date.now();
        }
        Cartoner2secStop++;
        if(Cartoner2secStop>=25){
          Cartoner2speed = 0;
          Cartoner2state = 2;
          Cartoner2speedTemp = Cartoner2ct;
          Cartoner2flagStopped = true;
          Cartoner2flagRunning = false;
        }
        if(Cartoner2secStop%120==0 ||Cartoner2secStop ==25 ){
          Cartoner2flagPrint=1;

          if(Cartoner2secStop%120==0){
            Cartoner2time = Date.now();
          }
        }
      }
      Cartoner2actual = Cartoner2ct;
      if(Cartoner2sec==60){
        Cartoner2sec = 0;
        if(Cartoner2flagRunning && Cartoner2ct){
          Cartoner2flagPrint=1;
          Cartoner2secStop = 0;
          Cartoner2speed = Cartoner2ct -Cartoner2speedTemp;
          Cartoner2speedTemp = Cartoner2ct;
        }
      }
            //console.log('Cartoner= '+Cartoner2sec+'   '+Cartoner2secStop)
      Cartoner2results = {
        ST: Cartoner2state,
        //CPQI: Cartoner2ctIn
        CPQO: Cartoner2ct,
        //CPQR: Cartoner2ctRj,
        SP: Cartoner2speed
      };
      if (Cartoner2flagPrint == 1 && Cartoner2ct) {
        for (var key in Cartoner2results) {
          if(!isNaN(Cartoner2results[key])&&Cartoner2results[key]!=null)
          fs.appendFileSync('C:/Pulse/BLOCO3B_LOGS/bra_pou_Cartoner2_BLOCO3B.log', 'tt=' + Cartoner2time + ',var=' + key + ',val=' + Cartoner2results[key] + '\n');
        }
        Cartoner2flagPrint = 0;
      }

  //------------------------------------------Cartoner2----------------------------------------------
      //------------------------------------------Cartoner3----------------------------------------------
      Cartoner3ct = Cartoner3ctOut; //Igualar a la salida de la máquina
      if (Cartoner3ONS == 0 && Cartoner3ct) {
        Cartoner3speedTemp = Cartoner3ct;
      //  CntInCartoner3Ant = CntInCartoner3;
       // CntOutCartoner3Ant = CntOutCartoner3;
        Cartoner3ONS = 1;
      }
      if(Cartoner3ct > Cartoner3actual){
        if(Cartoner3flagStopped){
          Cartoner3speed = Cartoner3ct -Cartoner3speedTemp;
          Cartoner3speedTemp = Cartoner3ct;
          Cartoner3sec=0;
        }
        Cartoner3secStop = 0;
        Cartoner3sec++;
        Cartoner3time = Date.now();
        Cartoner3state = 1;
        Cartoner3flagStopped = false;
        Cartoner3flagRunning = true;
      } else if( Cartoner3ct == Cartoner3actual ){
        if(Cartoner3secStop == 0){
          Cartoner3time = Date.now();
        }
        Cartoner3secStop++;
        if(Cartoner3secStop>=25){
          Cartoner3speed = 0;
          Cartoner3state = 2;
          Cartoner3speedTemp = Cartoner3ct;
          Cartoner3flagStopped = true;
          Cartoner3flagRunning = false;
        }
        if(Cartoner3secStop%120==0 ||Cartoner3secStop ==25 ){
          Cartoner3flagPrint=1;

          if(Cartoner3secStop%120==0){
            Cartoner3time = Date.now();
          }
        }
      }
      Cartoner3actual = Cartoner3ct;
      if(Cartoner3sec==60){
        Cartoner3sec = 0;
        if(Cartoner3flagRunning && Cartoner3ct){
          Cartoner3flagPrint=1;
          Cartoner3secStop = 0;
          Cartoner3speed = Cartoner3ct -Cartoner3speedTemp;
          Cartoner3speedTemp = Cartoner3ct;
        }
      }

      Cartoner3results = {
        ST: Cartoner3state,
        //CPQI: Cartoner3ctIn
        CPQO: Cartoner3ct,
        //CPQR: Cartoner3ctRj,
        SP: Cartoner3speed
      };
      if (Cartoner3flagPrint == 1 && Cartoner3ct) {
        for (var key in Cartoner3results) {
          if(!isNaN(Cartoner3results[key])&&Cartoner3results[key]!=null)
          fs.appendFileSync('C:/Pulse/BLOCO3B_LOGS/bra_pou_Cartoner3_BLOCO3B.log', 'tt=' + Cartoner3time + ',var=' + key + ',val=' + Cartoner3results[key] + '\n');
        }
        Cartoner3flagPrint = 0;
      }

  //------------------------------------------Cartoner3----------------------------------------------
      //------------------------------------------Cartoner4----------------------------------------------
      Cartoner4ct = Cartoner4ctOut; //Igualar a la salida de la máquina
      if (Cartoner4ONS == 0 && Cartoner4ct) {
        Cartoner4speedTemp = Cartoner4ct;
      //  CntInCartoner4Ant = CntInCartoner4;
       // CntOutCartoner4Ant = CntOutCartoner4;
        Cartoner4ONS = 1;
      }
      if(Cartoner4ct > Cartoner4actual){
        if(Cartoner4flagStopped){
          Cartoner4speed = Cartoner4ct -Cartoner4speedTemp;
          Cartoner4speedTemp = Cartoner4ct;
          Cartoner4sec=0;
        }
        Cartoner4secStop = 0;
        Cartoner4sec++;
        Cartoner4time = Date.now();
        Cartoner4state = 1;
        Cartoner4flagStopped = false;
        Cartoner4flagRunning = true;
      } else if( Cartoner4ct == Cartoner4actual ){
        if(Cartoner4secStop == 0){
          Cartoner4time = Date.now();
        }
        Cartoner4secStop++;
        if(Cartoner4secStop>=25){
          Cartoner4speed = 0;
          Cartoner4state = 2;
          Cartoner4speedTemp = Cartoner4ct;
          Cartoner4flagStopped = true;
          Cartoner4flagRunning = false;
        }
        if(Cartoner4secStop%120==0 ||Cartoner4secStop ==25 ){
          Cartoner4flagPrint=1;

          if(Cartoner4secStop%120==0){
            Cartoner4time = Date.now();
          }
        }
      }
      Cartoner4actual = Cartoner4ct;
      if(Cartoner4sec==60){
        Cartoner4sec = 0;
        if(Cartoner4flagRunning && Cartoner4ct){
          Cartoner4flagPrint=1;
          Cartoner4secStop = 0;
          Cartoner4speed = Cartoner4ct -Cartoner4speedTemp;
          Cartoner4speedTemp = Cartoner4ct;
        }
      }
      Cartoner4results = {
        ST: Cartoner4state,
        //CPQI: Cartoner4ctIn
        CPQO: Cartoner4ct,
        //CPQR: Cartoner4ctRj,
        SP: Cartoner4speed
      };
      if (Cartoner4flagPrint == 1 && Cartoner4ct) {
        for (var key in Cartoner4results) {
        	if(!isNaN(Cartoner4results[key])&&Cartoner4results[key]!=null)
          fs.appendFileSync('C:/Pulse/BLOCO3B_LOGS/bra_pou_Cartoner4_BLOCO3B.log', 'tt=' + Cartoner4time + ',var=' + key + ',val=' + Cartoner4results[key] + '\n');
        }
        Cartoner4flagPrint = 0;
      }

  //------------------------------------------Cartoner4----------------------------------------------

  //------------------------------------------DisplayFiller----------------------------------------------
      DisplayFillerct = DisplayFillerctOut; //Igualar a la salida de la máquina
      if (DisplayFillerONS == 0 && DisplayFillerct) {
        DisplayFillerspeedTemp = DisplayFillerct;
        //CntInDisplayFillerAnt = CntInDisplayFiller;
       // CntOutDisplayFillerAnt = CntOutDisplayFiller;
        DisplayFillerONS = 1;
      }
      if(DisplayFillerct > DisplayFilleractual){
        if(DisplayFillerflagStopped){
          DisplayFillerspeed = DisplayFillerct -DisplayFillerspeedTemp;
          DisplayFillerspeedTemp = DisplayFillerct;
          DisplayFillersec=0;
        }
        DisplayFillersecStop = 0;
        DisplayFillersec++;
        DisplayFillertime = Date.now();
        DisplayFillerstate = 1;
        DisplayFillerflagStopped = false;
        DisplayFillerflagRunning = true;
      } else if( DisplayFillerct == DisplayFilleractual ){
        if(DisplayFillersecStop == 0){
          DisplayFillertime = Date.now();
        }
        DisplayFillersecStop++;
        if(DisplayFillersecStop>=50){
          DisplayFillerspeed = 0;
          DisplayFillerstate = 2;
          DisplayFillerspeedTemp = DisplayFillerct;
          DisplayFillerflagStopped = true;
          DisplayFillerflagRunning = false;
        }
        if(DisplayFillersecStop%120==0 ||DisplayFillersecStop ==50 ){
          DisplayFillerflagPrint=1;

          if(DisplayFillersecStop%120==0){
            DisplayFillertime = Date.now();
          }
        }
      }
      DisplayFilleractual = DisplayFillerct;
      if(DisplayFillersec==60){
        DisplayFillersec = 0;
        if(DisplayFillerflagRunning && DisplayFillerct){
          DisplayFillerflagPrint=1;
          DisplayFillersecStop = 0;
          DisplayFillerspeed = DisplayFillerct -DisplayFillerspeedTemp;
          DisplayFillerspeedTemp = DisplayFillerct;
        }
      }
      //console.log('DisplayFiller= '+DisplayFillersec+'   '+DisplayFillersecStop)
      DisplayFillerresults = {
        ST: DisplayFillerstate,
       /// CPQI: DisplayFillerctIn,//Igualar a la entrada del wise
        CPQO: DisplayFillerct,
        SP: DisplayFillerspeed
      };
      if (DisplayFillerflagPrint == 1 && DisplayFillerct) {
        for (var key in DisplayFillerresults) {
        	if(!isNaN(DisplayFillerresults[key])&&DisplayFillerresults[key]!=null)
          fs.appendFileSync('C:/Pulse/BLOCO3B_LOGS/bra_pou_DisplayFiller_BLOCO3B.log', 'tt=' + DisplayFillertime + ',var=' + key + ',val=' + DisplayFillerresults[key] + '\n');
        }
        DisplayFillerflagPrint = 0;
      }

  //------------------------------------------DisplayFiller----------------------------------------------
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
        if(CasePackersecStop>=70){
          CasePackerspeed = 0;
          CasePackerstate = 2;
          CasePackerspeedTemp = CasePackerct;
          CasePackerflagStopped = true;
          CasePackerflagRunning = false;
        }
        if(CasePackersecStop%120==0 ||CasePackersecStop ==60 ){
          CasePackerflagPrint=1;

          if(CasePackersecStop%120==0){
            CasePackertime = Date.now();
          }
        }
      }
      CasePackeractual = CasePackerct;
      if(CasePackersec==3){
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
        //CPQI: CasePackerctIn,
        CPQO: CasePackerct,
        SP: CasePackerspeed
      };
          //  console.log('CasePacker= '+CasePackersec+'   '+CasePackersecStop)
      if (CasePackerflagPrint == 1 && CasePackerct) {
        for (var key in CasePackerresults) {
          if(!isNaN(CasePackerresults[key])&&CasePackerresults[key]!=null)
          fs.appendFileSync('C:/Pulse/BLOCO3B_LOGS/bra_pou_CasePacker_BLOCO3B.log', 'tt=' + CasePackertime + ',var=' + key + ',val=' + CasePackerresults[key] + '\n');
        }
        CasePackerflagPrint = 0;
      }
    //////--CasePacker--------------------------------------------------------------------------------------------------------------------

      //////--EOL--------------------------------------------------------------------------------------------------------------------
    if(secEOL>=60 && eol){
      fs.appendFileSync("C:/Pulse/BLOCO3B_LOGS/bra_pou_EOL_BLOCO3B.log","tt="+Date.now()+",var=EOL"+",val="+eol+"\n");
      secEOL=0;
    }else{
      secEOL++;
    }
    //////--EOL--------------------------------------------------------------------------------------------------------------------
  },1000);
}catch(error){
  fs.appendFileSync("error.log","General Error: "+error + '\n');
}
/////MAIN - END/////------------------------------------------------------------------------------------
