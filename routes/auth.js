const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../keys");
const requireLogin = require("../middleware/requiredLogin");
const ejs = require("ejs");

router.get('/protected',requireLogin,(req,res) => {
    res.send("hello user");
});

router.get('/', (req,res) => {
    res.render("home");
});

router.get('/signup', (req,res) => {
    res.render("register");
});

router.get('/signin', (req,res) => {
    res.render("login");
});

router.post('/signup', (req,res) => {
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(422).json({error:"please enter all fields"})
    };
    User.findOne({email:email})
    .then((savedUser) =>{
        if(savedUser){
            return res.status(422).json({error:"user already exist"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword
            });
    
            user.save()
            .then(user=>{
                res.render("home");
            })
            .catch(err=>{
                console.log(err);
            })
        })       
    })
    .catch(err=>{
        console.log(err);
    })
})


router.post('/signin',(req,res)=>{
    const email = document.getElementsByName("email");
    const password = document.getElementsByName("password");
    if(!email || !password){
        return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                //res.json({message:"successfully signed in"})
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                res.json({token})
            }
            else{
                return res.status(422).json({error:"Invalid email or password"})
            }
        })
        .catch(err=>{
            console.log(err);
        })
    })
})
module.exports = router;