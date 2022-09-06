const router = require('express').Router()
const {register,login,updateUser,deleteUser,middleware,getUsers,middleware2} = require('../controllers/user.controller')

router.post('/register',register)
router.post('/login',login)
router.put('/update',middleware,updateUser)
router.delete('/delete/:id/:token',middleware2,deleteUser)
router.post('/get/all',middleware,getUsers)

module.exports = router