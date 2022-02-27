const express = require("express");
const router = express.Router();

const home=require('../controller/HomeController');
const chatbox=require('../controller/ChatboxController');
const login=require('../controller/LoginController');

//Login / Register
router.get('/',login.index);
router.post('/login',login.login);
router.get('/logout',login.logout);
router.get('/registernpage',login.registernpage);
router.post('/postregister',login.postregister);


//Chatbox
router.get('/chatbox',chatbox.index);
router.post('/postcomment',chatbox.postcomment);
router.post('/getcomment',chatbox.getcomment);
router.post('/getuserlistbylastcomment',chatbox.getuserlistbylastcomment);



router.get('/home',home.index);
module.exports=router;