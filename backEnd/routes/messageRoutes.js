const express= require('express')
const router= express.Router()


const { allMessages, sendMessage } = require('../controllers/messageControllers')
const protect = require('../middleware/authMiddleware')




router.route('/').post(protect,sendMessage)
router.route('/:chatId').get(protect,allMessages)


module.exports=router;
