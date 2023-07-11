const express=require('express')
const router=express.Router()

const protect =require('../middleware/authMiddleware')

const {registerUser,authUser,allUsers}=require('../controllers/userControllers')

router.route('/user/register').post(registerUser).get(protect,allUsers)

router.route('/user/login').post(authUser)

module.exports=router;