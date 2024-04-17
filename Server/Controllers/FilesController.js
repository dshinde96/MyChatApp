const fs = require('fs');

const handleUploadFile=(req, res) => {
    try {
        return res.json({ file:{filename:req.file.originalname,path:req.file.path,}, msg: "File Uploaded Successfully" });
    } catch (error) {
        return res.status(501).json({ msg: "Internal Server Error" });
    }

}

const handleDownloadFile=(req,res)=>{
    const {filePath,filename} = req.body;
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'application/octet-stream');
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
}

module.exports={handleDownloadFile,handleUploadFile}