var Service = require('node-windows').Service


var svc = new Service({
  name:'PULSE fd1204 SERVICE',
  description: 'Control of the PULSE code',
  script: __dirname + '\\bra_pale_knorr_fd1204_wise.js',
  env: {
    name: "HOME",
    value: process.env["USERPROFILE"]
  }
})


svc.on('install',function(){
  svc.start()
})

svc.install()
