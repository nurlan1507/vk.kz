const multerUpload = require('../configs/multer/multer')

class postController{
    async getPosts(req,res,next){

    }
    async getPost(req,res,next){

    }
    async createPost(req,res,next){

    }

    async uploadMedia(req,res,next){
        const file = req.file
        if(!file){
            console.log('no file')
            return res.status(401).json({msg:"no file uploaded"})
        }

    }
}


module.exports = new postController()