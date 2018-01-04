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
    const uploadFolder = './data/image/Users/' + str[0] + '/';
    createFolder(uploadFolder);
    cb(null, uploadFolder); // 保存的路径，备注：需要自己创建
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

export const uploaderPhotoStickerUser = app => {
  app.post('/upload/user', upload.single('file'), function(req, res, next) {
    res.send(req.file);
  });
};

export const downloadPhotoStickerUser = app => {
  app.get('/download/user', function(req, res) {
    const touch = req.headers.touch;
    var folder = './data/image/Users/' + req.headers.boards + '/';
    var file;
    const allFile = [];
    fs.readdir(folder, (err, files) => {
      files.forEach(i => {
        allFile.push(i);
      });
      touch === 'true'
        ? res.download(folder + allFile[allFile.length - 1])
        : res.status(200).send(allFile[allFile.length - 1]);
      // Set disposition and send it.
    });
  });
};
