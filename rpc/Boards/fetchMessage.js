import { success } from 'Schema/Success';
import { error } from 'Schema/Failed';
const Promise = require('bluebird');
const uuidV4 = require('uuid/v4');

export default function fetchMessage(socket, db) {
  const boardDb = db.collection('Boards');
  socket.on('fetchMessage', data => {
    boardDb.find({ board: data.parm.room }).toArray((err, result) => {
      socket.emit(
        'fetchMessageResponse',
        new Promise((resolve, reject) => {
          result[0].messageData.length === 0
            ? resolve(success([]))
            : resolve(
                success(result[0].messageData.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1)))
              );
        })
      );
    });
  });
}
