const mongoose = require('mongoose')

module.exports.connect = ()=>{
    mongoose.connect(process.env.MONGO)
        .then(()=>{
            console.log('DB Connected')
        })
        .catch((err)=>{
            console.log(err.message)
        })
}