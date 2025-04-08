// set up dependencies
const express = require('express');
const mysql = require('mysql2');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('express');

// to parse incoming json data from http request 

app.request(express.json());

// create mysql connection pool
const pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '',
    database:'mydatabase',
    waitForConnections:true,
    connectionLimit : 10,
    queueLimit : 0 ,
})

// secret key for jwt token
const JWT_SECRET ='';

//middleware to authenticate token
function authenticateToken (req,res,next)
{







    
}