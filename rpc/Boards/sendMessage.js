import { success } from 'Schema/Success';
import { error } from 'Schema/Failed';
const Promise = require('bluebird');
const uuidV4 = require('uuid/v4');

export default function sendMessage(io, socket, db) {
  const boardDb = db.collection('Boards');
  socket.on('sendMessage', data => {
    boardDb.find({ board: data.parm.room }).toArray((err, result) => {
      io.sockets.in(data.parm.room).emit(
        'sendMessageResponse',
        new Promise((resolve, reject) => {
          if (data.parm.message !== undefined) {
            let message = [];
            const exp = RegExp(/"/g);
            const value = {
              room: data.parm.room,
              send: data.parm.send.replace(exp, ''),
              user: data.parm.user.replace(exp, ''),
              timestamp: data.parm.timestamp,
              sent: true,
              message: data.parm.message,
            };
            if (result[0].messageData.length !== 0) {
              message = result[0].messageData.concat(value);
            } else {
              message = [value];
            }
            boardDb.updateOne(result[0], { $set: { messageData: message } }, (err, updated) => {});
            resolve(success(value));
          } else resolve(success(data.parm));
        })
      );
    });
  });
}
