const Promise = require('bluebird');

export const joinRoom = socket =>
  socket.on('joinChatRoom', data => {
    console.log('joinChatRoom', data.parm.room);
    socket.join(data.parm.room);
    socket.room = data.parm.room;
    socket.emit('joinChatRoomResponse', new Promise(resolve => resolve(data.parm.room)));
  });
export const leaveRoom = socket =>
  socket.on('leaveChatRoom', function() {
    console.log('leaveChatRoom', socket.room);
    if (socket.room) {
      var room = socket.room;
      socket.emit('leaveChatRoomResponse', new Promise(resolve => resolve(room)));
      socket.leave(room);
    }
  });
