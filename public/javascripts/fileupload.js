const multer= require('multer')

// handle storage using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/photos/products')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '-' + Date.now())
    }
});
 const upload = multer({ storage: storage });

 const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/photos/categoryimage')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '-' + Date.now())
    }
});



 const upload2 = multer({ storage: storage2 });
//  const upload3 = multer({ storage: storage3 });

const storage3 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/photos/banner')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '-' + Date.now())
    }
});
 const upload3 = multer({ storage: storage3 });

 const storage4 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/photos/review')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '-' + Date.now())
    }
});
 const upload4 = multer({ storage: storage4 });

 module.exports= {
    upload,
    upload2,
    upload3,
    upload4
};