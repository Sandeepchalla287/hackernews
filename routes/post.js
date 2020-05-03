 const express = require("express");
 const router = express.Router();
 const mongoose = require("mongoose");
 const requireLogin = require("../middleware/requiredLogin");
 const Post = mongoose.model("Post");

 router.post('/createpost',requireLogin,(req,res) => {
     const {title,body} = req.body
     if(!title || !body) {
        return res.status(422).json({error:"please add all the fields"});
     }
     const post = new Post({
         title,
         body,
         postedBy: req.user
     })
     post.save().then(result => {
         res.json({pst:result})
     })
     .catch(err =>{
         console.log(err)
     })
 });
 module.exports = router;