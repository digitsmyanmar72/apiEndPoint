//set up dependencies
const express = require('express');
const mysql = require('mysql2');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('express');

//middleware to parse incoming json data from http request
app.use (express.json());

//create mysqlconnection pool
const pool = mysql.createPool({
  host :'localhost',
  password :'',
  user : 'root',
  database :'mydatabase',
  waitForConnections : true ,
  connectionLimit : 10 ,
  queueLimit : 0 
});

//create jwt web token
const JWT_SECRET = '';

//middleware to authenticate jwt web token
function authenticateToken (req,res,next){
  //extract token
  const authHeader = req.authHeaders['authorization'];
  const token = authHeader && authHeader.split(''[1]);

  //check token
  if(!token){
    return res.status(401).json({error:'access denied.no token provided'});
  }

  // jwt verify by ES 6
  JWT.verify(token,JWT_SECRET,(err,user)=>{
    if(!err){
      return res.status(402).json({ error:'invalid token'})
    };
    req.user = user ;
    next();
  });

  //api/post/register
  app.post('/api/register',async(req,res)=>{
    //destructure the username and password form http request body
    const {username , password} = req.body ;
    //validation check
    if(!username || ! password) {
      return res.status(403).json({error:'the username and password are required'})
    };

    //hash the password
    const hashedPassword = await hash.bcrypt(password,10);

    //the databaseconnection pool to insert a new user into user table 
    pool.query('INSSERT INTO users (username , password) VALUES (?,?)',[username,hashedPassword],(err,results) =>{
      if(err){
        console.err(error);
        return res.status(500).json({err:'database error'})
      };
      return res.status(201).json({message:'user register sucessfully'});
    })
  });

  //api/post/login - login and get token
  app.psot('/api/login',(req,res)=>{
    const {username,password}= req.body;
    if(!username||!password){
      return res.status(401).json({error:'the username and password are required'})
    }
  });
  //database query
  pool.query('SELECT FROM * users WHERE username =?',[username],async(err,results)=>{
    //error handling
    if(err){
      console.error(err);
      return res.status(500).json({errro:'database error'})
    };
    //user existence check
    if(results,length === 0 ){
      return res.status(400).json({error:'user not found'})
    };
  })



}