import multer from "multer"
import crypto from 'crypto'
import path from "path"

const diskStorage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"./public/images/uploads")
    },
    filename:function(req,file,cb){
        crypto.randomBytes(14,(err,bytes)=>{
            const fn  = bytes.toString('hex')+path.extname(file.originalname)
            cb(null,fn)
        })
    }
})

const upload = multer({storage:diskStorage})

export default upload