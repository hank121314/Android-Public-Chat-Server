import { success } from 'Schema/Success';
import { error } from 'Schema/Failed';
import { Buffer } from 'buffer';

const multer = require('multer');
const fs = require('fs');
const createFolder = folder => {
  try {
    fs.accessSync(folder);
  } catch (e) {
    fs.mkdirSync(folder);
  }
};

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const str = file.originalname.split('-');
    const folder = decodeURIComponent(str[0]);
    console.log(folder);
    const uploadFolder = './data/image/boards/' + folder + '/';
    createFolder(uploadFolder);
    cb(null, uploadFolder);
  },
  filename: function(req, file, cb) {
    cb(null, decodeURIComponent(file.originalname));
  },
});

const upload = multer({ storage });

export const uploaderPhotoSticker = app => {
  app.post('/upload/boardsPhoto', upload.single('file'), function(req, res, next) {
    res.send(req.file);
  });
};

export const downloadPhotoSticker = app => {
  app.get('/download/boardsPhoto', function(req, res) {
    const buffer = new Buffer.from(req.headers.boards);
    const header = decodeURIComponent(req.headers.boards);
    console.log('Request File', header);
    const touch = req.headers.touch;
    console.log(touch);
    var folder = './data/image/boards/' + header + '/';
    var file;
    const allFile = [];
    fs.readdir(folder, (err, files) => {
      files.forEach(i => {
        const file = encodeURIComponent(i);
        allFile.push(file);
      });
      console.log('SendFile', decodeURIComponent(allFile[allFile.length - 1]));
      touch === 'true'
        ? res.download(folder + decodeURIComponent(allFile[allFile.length - 1]))
        : res.status(200).send(decodeURIComponent(allFile[allFile.length - 1]));
      // Set disposition and send it.
    });
  });
};
