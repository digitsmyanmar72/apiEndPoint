//set up dependencies
const express = require('express');
const mysql = require('mysql2');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('express');

//middleware to parse json data from http request
app.use(express.json());

//create mysql connection pool
const pool = mysql.createPool({
    host : 'localhost',
    user:'root',
    password:'',
    database:'mydatabase',
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0,
});

//Secret Key for JWT
const JWT_SECRET='';



//middleware to authenticate JWT token from http request
function authenticateToken(req,res,next){
  //token extraction
  const authHeader = req.authHeader['authorization'];
  const token = authHeader && authHeader.split('')[1];

  //check token
  if(!token){
    return res.status(401).json({error:'access denied.no token provided'
    })
  };

  //verify jwt token
   jwt.verify (token,JWT_SECRET,(err,user)=>{
       if(error){
        return res.status(301).json({error:'invalid token'});
       };

    //attach user datat to the request
    req.user = user ;

    //proceed to the next middleware
    next();

    });
       
    

  
  

}




    