// configuration file for local-web-server CLI, used in yarn serve
module.exports = {

  directory: 'public',

  spa: 'index.html',

  compress: true,

  open: true,

  rewrite: [{
    from: '/api/*',
    to: 'http://stage.contributary.community/api/$1'
  }]

};