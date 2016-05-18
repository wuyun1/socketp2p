/*eslint no-console:0 */
'use strict';
require('core-js/fn/object/assign');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const open = require('open');

let webpackDevServer = new WebpackDevServer(webpack(config), config.devServer);

webpackDevServer.listen(config.port, 'localhost', (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:' + config.port);
  console.log('Opening your system browser...');
  open('http://localhost:' + config.port + '/webpack-dev-server/');
});


var io = require('socket.io')(webpackDevServer.listeningApp);
var p2p = require('socket.io-p2p-server').Server;
io.use(p2p);


io.on('connection', function (socket) {
  socket.on('peer-msg', function (data) {
    console.log('Message from peer: %s', JSON.stringify(data))
    socket.broadcast.emit('peer-msg', JSON.stringify(data))
  })

  socket.on('peer-file', function (data) {
    console.log('File from peer: %s', JSON.stringify(data))
    socket.broadcast.emit('peer-file', JSON.stringify(data))
  })

  socket.on('go-private', function (data) {
    socket.broadcast.emit('go-private', JSON.stringify(data))
  })

  socket.on('peer-obj', function (data) {
    console.log('Object from peer: %s', JSON.stringify(data))
    socket.broadcast.emit('peer-file', JSON.stringify(data))
  })
})