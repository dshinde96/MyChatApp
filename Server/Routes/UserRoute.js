const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const User=require('../Models/User');
const {generatToken}=require('../Services/authServices');

router.post('/signup',async(req,res)=>{
    const {name,email,password}=req.body;
    let user=await User.findOne({email});
    if(user){
        return res.status(401).json({msg:"User already registered. Please try to login to your account"});
    }

    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async(err,secPass)=>{
            user=await User.create({
                name,
                email,
                password:secPass
            });
            const authToken=generatToken({_id:user._id,name:user.name,email:user.email});
            return res.json({authToken,name:user.name,email:user.email,msg:"User Successfully Registered"});
        })
    })
});

router.post('/login',async(req,res)=>{
    const {email,password}=req.body;

    let user=await User.findOne({email});
    if(!user){
        return res.status(404).json({msg:"User not found"});
    }

    bcrypt.compare(password,user.password,(error,result)=>{
        if(error){
            throw new Error(error);
        }
        if(result){
            const authToken=generatToken({_id:user._id,name:user.name,email:user.email});
            return res.json({authToken,name:user.name,email:user.email,msg:"User Successfully Loggedin"});
        }
        else{
            return res.status(401).json({msg:"Invalid credentials"});
        }
    })
});


module.exports=router;