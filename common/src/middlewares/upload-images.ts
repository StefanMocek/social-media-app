import multer from 'multer';

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'upload/')
  },
  filename(req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now())    
  },
});

const upload = multer({storage}).array('image');

export {upload as uploadImages}