import { success } from 'Schema/Success';
import { error } from 'Schema/Failed';
const Promise = require('bluebird');

export default function register(socket, db) {
  socket.on('register', data => {
    const usrDb = db.collection('UserInformation');
    usrDb.find({ username: data.parm.username }).toArray((err, result) => {
      socket.emit(
        'registerResponse',
        new Promise((resolve, reject) => {
          if (result.length === 0) {
            const value = data.parm;
            value.Administrator = false;
            usrDb.insert(value);
            resolve(success(value));
          } else {
            return reject(error('Username duplicate', '001', 'This username is exist'));
          }
        })
      );
    });
  });
}
