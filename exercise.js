//set up dependencies
const express = require('express');
const mysql = require('mysql2');
const JWt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('express');

//middleware to parse incoming json data from http request
app.use(express.json());

//create mysqlconnection pool
const pool= mysql.createPool({
  host:'localhost',
  user:'root',
  password:'',
  database:'mydatabase',
  waitForConnections:true,
  connectionLimit:10,
  queueLimit:0
});

//create JWT_Secret key
const JWT_Secret = '';

//middleware to authenticateToken
function authenticateToken(req,res,next){
  //extract token
  const authHeader = req.authHeaders['authorization'];
  const token = authHeader && authHeader.split('')[1];

  //check token
  if(!token){
    return res.status(400).json({error:'access denied.no token provided'})
  };

  //jwt verify
  jwt.verify(token,JWT_Secret,(err,user)=>{
    if(err){
      return res.status(400).json({error:'invalid token'})
    }
  })

  req.user = user;
  next();

};


//api/post/register - user registeration
app.post('/api/register',async(req,res)=>{
  //destructure the username and password
  const {username,password} = req.body;
  if(!username||!password){
    return res.status(400).json({error:'the username and password are required'})
  };

  //hashedPassowrd
  const hashedPassowrd = await bcrypt.hash(password,10);

//mysqlconnection pool to insert a new user into user table
pool.query('INSERT INTO user(username,password) VALUES (?,?)',[username,hashedPassword],(err,results)=>{
    if(err){
      console.error(err);
      return res.status(500).json({error:'database error'})
    };
    return res.status(200).json({message:'user register sucessfully'})
});
});

//api/post/login - login and get token
app.post('/api/login',(req,res)=>{
  const {username,password} = req.body;
  if(!username||!password){
    return res.status(400).json({error:'the username and password are required'})
  };
  //database query
  pool.query('SELECT * FROM users WHERE username = ?',[username],async(err,results)=>{
    //error handling
    if(err){
      console.error(err);
      return res.staus(500).josn({error:'database error'})
    };
    //user existence check
    if(results,length === 0){
      return res.status(400).json({error:'user not found'})
    };

    //passoord verification
    const user = results[0];
    const validPassword = await bcrypt.compare(password,user.password);
     if(!validPassword){
      return res.status(401).json({error:'invalid password'})
     }

    
  });
})