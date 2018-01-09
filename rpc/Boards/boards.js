const Promise = require('bluebird');

export const joinRoom = (io, socket, db) =>
  socket.on('joinChatRoom', data => {
    const boardDb = db.collection('Boards');
    socket.join(data.parm.room);
    socket.room = data.parm.room;
    boardDb.find({ board: data.parm.room }).toArray((err, result) => {
      io.sockets.in(data.parm.room).clients((error, clients) => {
        if (error) throw error;
        console.log(clients.length);
        var userCount = clients.length;
        boardDb.updateOne(result[0], { $set: { userCount } }, (err, updated) => {});
        console.log('joinChatRoom', data.parm.room);
        socket.emit('joinChatRoomResponse', new Promise(resolve => resolve(data.parm.room)));
      });
    });
  });
export const leaveRoom = (io, socket, db) =>
  socket.on('leaveChatRoom', data => {
    console.log('leaveChatRoom', socket.room);
    if (socket.room) {
      var room = socket.room;
      const boardDb = db.collection('Boards');
      socket.leave(room);
      boardDb.find({ board: data.parm.room }).toArray((err, result) => {
        io.sockets.in(data.parm.room).clients((error, clients) => {
          if (error) throw error;
          var userCount = clients.length;
          boardDb.updateOne(result[0], { $set: { userCount } }, (err, updated) => {});
          socket.emit('leaveChatRoomResponse', new Promise(resolve => resolve(room)));
        });
      });
    }
  });
