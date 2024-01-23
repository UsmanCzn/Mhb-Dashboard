
var FtpDeploy = require('ftp-deploy')
var ftpDeploy = new FtpDeploy()

var config = {
         
  user: 'avoportal\\$avoportal', // NOTE that this was username in 1.x
  password: 'kdSKLKchToRlq3DS1H5fd4ejiSSGWEfP31AXkGM3ejezvT6o5l0JRzsTSWji',
  
   // optional, prompted if none given
  // ftps://waws-prod-bm1-001dr.ftp.azurewebsites.windows.net/site/wwwroot
  host: 'waws-prod-bm1-001dr.ftp.azurewebsites.windows.net',
  port: 21,
  localRoot: __dirname + '/dist',
  remoteRoot: '/site/wwwroot/',
  include: ['', '/'], // this would upload everything except dot files
  // include: ['.php', 'dist/'],
  exclude: ['dist/*/.map'], // e.g. exclude sourcemaps - * exclude: [] if nothing to exclude *
  deleteRemote: true, // delete ALL existing files at destination before uploading, if true
  forcePasv: true // Passive mode is forced (EPSV command is not sent)
}

ftpDeploy.on('uploading', function (data) {
  console.log('Deploying:' + data.filename) // partial path with filename being uploaded
})

// use with promises
ftpDeploy.deploy(config)
  .then(res => console.log('finished:', res))
  .catch(err => console.log(err))