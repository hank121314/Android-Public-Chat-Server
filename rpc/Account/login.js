import { success } from 'Schema/Success';
import { error } from 'Schema/Failed';
const Promise = require('bluebird');
const uuidV4 = require('uuid/v4');

export default function login(socket, db) {
  socket.on('login', data => {
    const usrDb = db.collection('UserInformation');
    usrDb
      .find({ username: data.parm.username, password: data.parm.password })
      .toArray((err, result) => {
        socket.emit(
          'loginResponse',
          new Promise((resolve, reject) => {
            if (result.length !== 0) {
              resolve(success(result[0]));
            } else
              reject(
                error('Username not exist', '001', 'This username is not exist!\nPlease Register!')
              );
          })
        );
      });
  });
}
