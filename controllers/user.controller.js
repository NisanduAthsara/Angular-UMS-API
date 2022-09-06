const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async(req,res)=>{
    try {
        if(!req.body){
            return res.json({
                success:false,
                message:'Unable to register!'
            })
        }
        const {username,email,password} = req.body
        const excistingUser = await User.findOne({email})
        if(excistingUser){
            return res.json({
                success:false,
                message:'Email already in use!'
            })
        }
        const newUser = new User({
            username,
            email,
            password
        })
        const nUser = await newUser.save()
        if(!nUser){
            return res.json({
                success:false,
                message:'Unable to register user!'
            })
        }

        const jwtToken = jwt.sign(
            {
                id:nUser._id
            },
            process.env.TOKEN,
            {
                expiresIn:'24h'
            }
        )
        return res.json({
            success:true,
            message:'Successfully registered user!',
            token:jwtToken
        })
    } catch (error) {
        console.log(error)
        return res.json({
            success:false,
            message:'An unknown error occured!'
        })
    }
}

exports.login = async(req,res)=>{
    try {
        if(!req.body){
            return res.json({
                success:false,
                message:'Unable to login!'
            })
        }
        const {email,password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.json({
                success:false,
                message:'Invalid Email!'
            })
        }
        bcrypt.compare(password,user.password,(err,result)=>{
            if(!result){
                return res.json({
                    success:false,
                    message:'Invalid Password!'
                }) 
            }
            if(err){
                return res.json({
                    success:false,
                    message:'An unknown error occured!'
                })
            }
            const token = jwt.sign({id:user._id},process.env.TOKEN,{expiresIn:'24h'})
            return res.json({
                success:true,
                message:'Successfully logged in!',
                token
            })
        })
    } catch (error) {
        console.log(error)
        return res.json({
            success:false,
            message:'An unknown error occured!'
        })
    }
}

exports.updateUser = async (req,res)=>{
    try {
        if(!req.body){
            return res.json({
                success:false,
                message:'Unable to update!'
            })
        }
        const {email,password,username,id} = req.body
        const updatedUser = await User.findByIdAndUpdate(id,{email,password,username})
        if(!updatedUser){
            return res.json({
                success:false,
                message:'Unable to update!'
            })
        }
        return res.json({
            success:true,
            message:'Successfully updated the user!'
        })
    } catch (error) {
        if(error.code === 11000){
            return res.json({
                success:false,
                message:'Email already in use!'
            })
        }
        console.log(error)
        return res.json({
            success:false,
            message:'An unknown error occured!'
        })
    }
}

exports.deleteUser = async(req,res)=>{
    try {
        const {id} = req.params
        const delUser = await User.findByIdAndDelete(id)
        if(!delUser){
            return res.json({
                success:false,
                message:'Unable to delete the user!'
            })
        }
        return res.json({
            success:true,
            message:'Successfully deleted the user!'
        })
    } catch (error) {
        console.log(error)
        return res.json({
            success:false,
            message:'An unknown error occured!'
        })
    }
}

exports.middleware = async(req,res,next)=>{
    try {
        if(!req.body.token){
            return res.json({
                success:false,
                message:'Invalid Token!'
            })
        }
        const {token} = req.body
        const id = jwt.decode(token,process.env.TOKEN).id
        if(!id){
            return res.json({
                success:false,
                message:'Invalid Token!'
            })
        }
        const userId = await User.findById(id)
        if(!userId){
            return res.json({
                success:false,
                message:'Invalid Token!'
            })
        }
        next()
    } catch (error) {
        console.log(error)
        return res.json({
            success:false,
            message:'An unknown error occured!'
        })
    }
}

exports.middleware2 = async(req,res,next)=>{
    try {
        if(!req.params.token){
            return res.json({
                success:false,
                message:'Invalid Token!'
            })
        }
        const {token} = req.params
        const id = jwt.decode(token,process.env.TOKEN).id
        if(!id){
            return res.json({
                success:false,
                message:'Invalid Token!'
            })
        }
        const userId = await User.findById(id)
        if(!userId){
            return res.json({
                success:false,
                message:'Invalid Token!'
            })
        }
        next()
    } catch (error) {
        console.log(error)
        return res.json({
            success:false,
            message:'An unknown error occured!'
        })
    }
}

exports.getUsers = async(req,res)=>{
    try {
        const users = await User.find()
        return res.json({
            success:true,
            message:'Successfully fetch users!',
            users
        })
    } catch (error) {
        console.log(error)
        return res.json({
            success:false,
            message:'An unknown error occured!'
        })
    }
}