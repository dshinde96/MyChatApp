const express=require('express');
const router=express.Router();
const {AuthenticateUserForHTTP}=require('../Middleware/Authentication');
const multer = require('multer');
const {handleDownloadFile,handleUploadFile}=require('../Controllers/FilesController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './Attachments')
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage: storage });

router.post('/upload', AuthenticateUserForHTTP,upload.single('file'), handleUploadFile);

router.post('/download',AuthenticateUserForHTTP,handleDownloadFile)

module.exports=router