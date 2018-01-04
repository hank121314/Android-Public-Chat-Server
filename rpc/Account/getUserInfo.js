import { success } from 'Schema/Success';
import { error } from 'Schema/Failed';
const Promise = require('bluebird');
const uuidV4 = require('uuid/v4');

export default function login(socket, db) {
  socket.on('getUserInfo', data => {
    const usrDb = db.collection('UserInformation');
    const exp = RegExp(/"/g);
    const username = data.parm.username.replace(exp, '');
    usrDb.find({ username: username }).toArray((err, result) => {
      console.log();
      socket.emit(
        'getUserInfoResponse',
        new Promise((resolve, reject) => {
          if (result.length !== 0) {
            const data = result[0];
            delete data.password;
            resolve(success(data));
          } else
            reject(
              error('Username not exist', '001', 'This username is not exist!\nPlease Register!')
            );
        })
      );
    });
  });
}
