const express = require('express')
const Router = express.Router
const router = new Router();
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const authMiddleWare = require('../midlewares/auth-controller');
const setHeaders = require('../midlewares/setHeaders')
const multerUpload = require('../configs/multer/multer')


router.post('/register', userController.registration)
router.post('/login',userController.login)
router.post('/logout',userController.logout)
router.get('/refreshToken',userController.refresh)
router.post('/findExisting', userController.searchForExisting)
router.post('/confirmAccount', userController.accountConfirmation)
router.get('/getUsers',authMiddleWare,userController.getUsers)
router.get('/authControl',authMiddleWare)
router.get('/getCookies',authMiddleWare,userController.getCookies)
router.get('/getUserAvatarInfo',authMiddleWare, userController.getUserAvatarInfo)


router.post('/getUserData', userController.getUserInfo)



//Posts
router.get('/getPosts', postController.getPosts)
router.post('/createPost',authMiddleWare, postController.createPost)
router.post('/uploadImg', authMiddleWare ,multerUpload.single('file'), postController.uploadMedia)




module.exports = router;