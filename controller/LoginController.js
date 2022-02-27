
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const secretkey='vishuroyal';
exports.index=(req,res)=>{
  res.render("main/login", {
    pageTitle: "Login",
    path: "../main/login.ejs",
  });
   
}

exports.registernpage=(req,res)=>{
  res.render("main/register", {
    pageTitle: "Login",
    path: "../main/register.ejs",
  });
}

exports.login=(req,res)=>{
  User.findAll({where:{email:req.body.email,password:req.body.password}}).then((result)=>{
 result=result[0];
 res.cookie('userData', result); 
    const token = jwt.sign({ id: result.id,email:result.email }, secretkey, {
        expiresIn: "1h",
      });
      User.update(
        {
          token:token
        },
        {
          where:{id:result.id}
        }).then((finalresult)=>{
       
        res.redirect('/chatbox'); 
      }).catch(err=>console.log(err));
  }).catch(err=>console.log(err));
  
}

exports.postregister=(req,res)=>{
 
  User.create(req.body).then((result)=>{ 
res.redirect('/');
  }).catch(err=>console.log(err));
}

exports.logout=(req,res)=>{
  res.clearCookie('userData');
res.redirect('/');
  
}