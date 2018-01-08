import { success } from 'Schema/Success';
import { error } from 'Schema/Failed';
const Promise = require('bluebird');
const uuidV4 = require('uuid/v4');

export default function getBoards(socket, db) {
  socket.on('getBoards', data => {
    const boardDb = db.collection('Boards');
    boardDb.find().toArray((err, result) => {
      socket.emit(
        'getBoardsResponse',
        new Promise(resolve => {
          const boards = result;
          boards.map(x => delete x.messageData);
          resolve(success(result));
        })
      );
    });
  });
}
