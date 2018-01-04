import { success } from 'Schema/Success';
import { error } from 'Schema/Failed';
const Promise = require('bluebird');
const uuidV4 = require('uuid/v4');

export default function addBoards(socket, db) {
  socket.on('addBoards', data => {
    const boardDb = db.collection('Boards');
    boardDb.find({ board: data.parm.board }).toArray((err, result) => {
      socket.emit(
        'addBoardsResponse',
        new Promise((resolve, reject) => {
          if (result.length === 0) {
            const value = {
              board: data.parm.board,
              created: data.parm.created,
              messageData: [],
              userCount: 0,
            };
            boardDb.insert(value);
            resolve(success(value));
          } else reject(error('Boards is exist', '050', 'This boards is already created'));
        })
      );
    });
  });
}
