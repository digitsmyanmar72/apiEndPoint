//set up dependencies
const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('express');
//middleware to parse josn datab from http request
app.use(express.json());
//create mysql connection pool
const pool = mysql.createPool({
  host:'localhost',
  user:'root',
  password:'',
  database:'mydatabase',
  waitForConnections:true,
  connectionLimit:10,
  queueLimit:0
});
//create jwt_secret 
const jwt_secret = '';
//middleware to authenticateToken
function authenticateToken(req,res,next){
  //extract token
  const authHeader = req.Headers['authorization'];
  const token = authHeader && authHeader.split('')[1];
  //check token
  if(!token){
    return res.status(400).json({error:'access denied.no token provided'})
  };
  //jwt.verify
  jwt.verify(token,jwt_secret,(err,user)=>{
    if(err){
      return res.status(400).json({error:'invalid token'})
    }
  });
  req.user=user;
  next()
};
//post/api/rgister - a new user registration
app.post('/api/rgister',async(req,res)=>{
  //destructure the username and password
  const {username,password} = req.body;
  if(!usernaem||!password){
    return res.status(400).json({error:'the username and password are required'})
  };
  //hashedPassword
  const hashedPassword = await bcrypt.hash(password,10);
  //mysql connectionpool to insert a new user into user table
  pool.query('INSERT INTO users(username,hashedPassword)VALUES(?,?)',[username,password],(err,results)=>{
    //error handling
    if(err){
      console.error(err);
      return res.status(500).json({error:'dataabase error'})
    };
    return res.status(200).json({message:'user registered sucessfully'})
  })
});
//post/api/login - login and get token
app.post('/api/login',authenticateToken,(req,res)=>{
  //destructure the username and password
  const {username,password} = req.body;
  if(!usernaem||!password){
    return res.status(400).json({error:'the username and password are required'})
  };
  //database query
  pool.query('SELECT * FROM users WHERE username=?',[username],async(err,results)=>{
    //errorhandling
    if(err){
      console.error(err);
      return res.status(500).json({error:'database error'})
    };
    //uer existence check
    if(results,length===0){
      return res.status(400).json({error:'user not found'})
    };
    //password verification
    const user = results[0];
    const validPassword = await bcrypt.compare(password,user.password);
    //password validation
    if(!validPassword){;
      return res.status(200).json({error:'invalid password'})
    };
    //generate token
    const token = jwt.sign({user:user.usernaem},jwt_secret,{expiresIn:'1h'});
    return res.status(200).json({token})
  })
});
//get/api/people - retrieve all people
app.get('/api/people',authenticateToken,(req,res)=>{
  //database query
  pool.query('SELECT * FROM people',(err,results)=>{
    if(err){
      console.error(err);
      return res.status(500).json({error:'database error'})
    };
   return res.status(200).json({results})
  })
});
//get/api/people/:id - retrieve specific people
app.get('/api/people/:id',authenticateToken,(req,res)=>{
  const id = req.params.id;
  pool.query('SELECT * FROM people WHERE id=?',[id],(err,results)=>{
    if(err){
      console.error(err);
      return res.status(500).json({error:'database error'})
    };
    //user existence check
    if(results,length===0){
      return res.status(400).json({error:'user not found'})
    };
    return res.status(200).json(results[0])
  })
});
//post/api/people - create a new person
app.post('/api/people',authenticateToken,(req,res)=>{
 const {name,age} = req.body;
if(!name||!age){
  return res.status(400).json({error:'name and age are required'})
};
pool.query('INSERT INTO people(name,age) VALUES(?,?)',[name,age],(err,results)=>{
  if(err){
    console.error(err);
    return res.status(500).json({error:'database error'})
  };
  return res.status(400).json({id:results.insertId,name,age})
})

})