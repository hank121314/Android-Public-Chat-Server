import { success } from 'Schema/Success';
import { error } from 'Schema/Failed';

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
    const uploadFolder = './data/image/boards/' + str[0] + '/';
    createFolder(uploadFolder);
    cb(null, uploadFolder); // 保存的路径，备注：需要自己创建
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
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
    console.log('Send user', req.headers.boards);
    const touch = req.headers.touch;
    console.log(touch);
    var folder = './data/image/boards/' + req.headers.boards + '/';
    var file;
    const allFile = [];
    fs.readdir(folder, (err, files) => {
      files.forEach(i => {
        allFile.push(i);
      });
      console.log('SendFile', allFile[allFile.length - 1]);
      touch === 'true'
        ? res.download(folder + allFile[allFile.length - 1])
        : res.status(200).send(allFile[allFile.length - 1]);
      // Set disposition and send it.
    });
  });
};
