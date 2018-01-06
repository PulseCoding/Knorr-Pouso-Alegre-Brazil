var Service = require('node-windows').Service


var svc = new Service({
  name:'PULSE bloco3b SERVICE',
  description: 'Control of the PULSE code',
  script: __dirname + '\\bra_pale_knorr_bloco3b_wise.js',
  env: {
    name: "HOME",
    value: process.env["USERPROFILE"]
  }
})

svc.on('uninstall',function(){
  console.log('Uninstall complete.')
  console.log('The service exists: ',svc.exists)
})

svc.uninstall()
