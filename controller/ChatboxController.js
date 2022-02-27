const dbConnect = require('../db/mongodb')
const Comment = require('../models/comment')
const { Op } = require("sequelize");
const User = require("../models/user");
exports.index=(req,res)=>{
    User.findAll().then((result)=>{
        res.render("comman/header", {
            data:result,
            pageTitle: "chatbox",
            path: "../main/chatbox.ejs",
            
          });
      }).catch(err=>console.log(err));
 
   
}

exports.postcomment=(req, res) => {
    var file_name='';
    if('file_name' in req.body){
         file_name=req.body.file_name;
    } 
    const comment = new Comment({
        username: req.body.username,
        comment: req.body.comment,
        file_name:file_name,
        senderid: req.body.id,
        recievid: req.body.recievid,
    })
    comment.save().then(response => {
        res.send(response)
    }).catch(err=>console.log(err))

}

exports.getcomment=(req, res) => {
            Comment.find({
                senderid:{$in:[req.body.senderid,req.body.recievid]},
                recievid:{$in:[req.body.senderid,req.body.recievid]},
               
            }  ).then(function(comments) {
                res.json({
                    "comments":comments,
                })
            }).catch(err=>console.log(err));
        
}



exports.getuserlistbylastcomment=(req, res) => {
    User.findAll().then((result)=>{
            Comment.find({
                "$or":[{senderid:req.body.senderid},{recievid:req.body.senderid}]
            }  ).then(function(comments) {
                res.json({
                    "comments":comments,
                    "userData":result
                })
            }).catch(err=>console.log(err))     
   
  
}).catch(err=>console.log(err));
}