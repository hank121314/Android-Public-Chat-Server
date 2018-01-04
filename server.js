import * as rpc from './rpc';
import { uploaderPhotoSticker, downloadPhotoSticker } from './js/imageServer';
import { uploaderPhotoStickerUser, downloadPhotoStickerUser } from './js/imageUser';

import { joinRoom, leaveRoom } from './rpc/Boards/boards';
var express = require('express');
var app = express();
var fs = require('fs');
var open = require('open');
var serverPort = 7879;
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mongo = require('mongodb').MongoClient;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(serverPort, () => {
  app.get('port');
  console.log('Server listen ' + serverPort + ' is running');
});

uploaderPhotoSticker(app);
downloadPhotoSticker(app);
uploaderPhotoStickerUser(app);
downloadPhotoStickerUser(app);
io.on('connection', socket => {
  mongo.connect('mongodb://localhost:27017/PublicChat', (err, db) => {
    console.log('connect!');
    socket.on('connector', () => io.emit('userConnection'));
    rpc.register(socket, db);
    rpc.login(socket, db);
    rpc.getBoards(socket, db);
    rpc.addBoards(socket, db);
    rpc.fetchMessage(socket, db);
    rpc.sendMessage(io, socket, db);
    rpc.getUserInfo(socket, db);
    rpc.getUserInBoard(socket, db);
    joinRoom(socket);
    leaveRoom(socket);
  });
});
