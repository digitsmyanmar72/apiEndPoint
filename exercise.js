//set up dependencies
const express = require('express');
const mysql = require('mysql2');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('express');

//middleware to parse json data from http request
app.use(express.json());

//create mysqlconnection poo'
const pool = mysql.createPool({
  host: 'localhost',
  password: '',
  user: 'root',
  database: 'mydatabase',

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

});

// create jwtweb token
const JWT_SECRET = '';

//middleware to authenticate jwt web token
function authenticateToken(req, res, next) {
  //extract token
  const authHeader = req.authHeaders['authorization'];
  const token = authHeader && authHeader.split('')[1];

  //check token
  if (!token) {
    return res.status(401).json({ error: 'access denied.no token provided' });

    //verify jwt secret
    JWT.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status({ error: 'invalid token' })
      };
      req.user = user;
      next();
    })
  }
};

//api/post/register
app.post('api/post/register',async(req,res)=>{
//destructure the username and password from the request body
const {username , password} = req.body;
//vadation check
if(!username || ! password){
  return res.status(401).json({err:'username and password are required'})
}

});










