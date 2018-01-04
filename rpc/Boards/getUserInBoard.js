import { success } from 'Schema/Success';
import { error } from 'Schema/Failed';
const Promise = require('bluebird');
const uuidV4 = require('uuid/v4');

export default function getUserInBoard(socket, db) {
  const boardDb = db.collection('Boards');
  socket.on('getUserInBoard', data => {
    boardDb.find({ board: data.parm.room }).toArray((err, result) => {
      socket.emit(
        'getUserInBoardResponse',
        new Promise((resolve, reject) => {
          result[0].messageData.length === 0 && resolve(success([]));
          const sender = [];
          var user = '';
          var m = -1;
          result[0].messageData.forEach((x, i, arr) => {
            m++;
            if (arr.length - 1 === m) {
              if (user !== arr[m].send) {
                user = arr[m].send;
                sender.push(user);
              }
              resolve(success(sender));
            } else {
              if (user !== arr[m].send) {
                user = arr[m].send;
                sender.push(user);
              } else {
                return;
              }
            }
          });
        })
      );
    });
  });
}
