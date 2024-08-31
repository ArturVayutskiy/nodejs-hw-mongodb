import multer from 'multer';

multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null);
  },
});
