const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

User.pre('save',function(next){
    bcrypt.hash(this.password,10)
        .then((newPassword)=>{
            this.password = newPassword
            next()
        })
        .catch((err)=>{
            console.log(err)
            next()
        })
})

module.exports = mongoose.model('angular_test_api',User)