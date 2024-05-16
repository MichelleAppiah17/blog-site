const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const app = express();
const jwt = require('jsonwebtoken');

const salt = bcrypt.genSaltSync(10);
const secret = 'assf45yr5u76ff'

app.use(cors({credentials: true, origin: 'https://localhost:3000'}));
app.use(express.json());

mongoose.connect(
  "mongodb+srv://blog:zqg77lHmZ72UH02n@cluster0.r77gzmc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);
app.post('/register', async(req, res) => {
  const {username, password} = req.body;
  try{
    const userDoc = await User.create({
      username, 
      password:bcrypt.hashSync(password,salt),
    });
     res.json(userDoc);
  }catch(e){
    res.status(400).json(e);
  }
});

app.post('/login',async(req, res) => {
  const {username, password} = req.body;
  const userDoc = await User.findOne({username});
  const passOk = bcrypt.compare(password, userDoc.password);
  if (passOk) {
    jwt.sign({username, id:userDoc. id}, secret, {}, (err,token) => {
      if(err) throw err;
      res.cookie('token', token).json('ok');
    });
  }else {
    res.status(400).json('wrong credentials');
  }
})

app.listen(4000);
