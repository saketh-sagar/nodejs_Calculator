const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const dotenv = require('dotenv');
const ejs =require('ejs');
const session = require('express-session');
const Mongodbstore = require('connect-mongodb-session')(session);
const bcryptjs = require('bcryptjs');
const { MongoExpiredSessionError } = require('mongodb');
const port = process.env.port || 5000;
const app = express();
const data = require('./models/Data')
let Mongo_Uri = 'mongodb+srv://msakethsagar:mmAaPoMibn3c5x3q@cluster0.l6w2w.mongodb.net/?retryWrites=true&w=majority&ssl=true&appName=Cluster0'

app.use(express.urlencoded({extended:true}));

app.set('view engine','ejs');
app.use(express.static('public'));

app.use(bodyparser.json());
dotenv.config();
mongoose.connect(Mongo_Uri).then(()=>{
    console.log("succesfully connected to Mongo DB" );
}).catch((err)=>{
    console.error(err)
})

const store = new Mongodbstore({
    uri:process.env.Mongo_uri,
    collection :'MYSESSION'
})

app.use(session({
    secret:'This is a secret',
    resave:false,
    saveUninitialized:true,
    store:store
}))

app.get('',(req,res)=>{
    res.render('register');
})
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/dashboard',(req,res)=>{
    res.render('dashboard')
})

app.post('/register',async(req,res)=>{
    const {Username,Email,Password}=req.body;

    let user = await data.findOne({Email});
   
    const hashedPassword = await bcryptjs.hash(Password,12);
    user = new data({
        Username,
        Email,
        Password:hashedPassword
    })
    await user.save();
    res.redirect('/login')
})

app.post('/user-login',async(req,res)=>{
    const {Email,Password}=req.body;

    const user =await data.findOne({Email});
    const ckeckpassword =null
    if(Password != null){
    checkpassword = await bcryptjs.compare(Password,user.Password)
    }else{
        res.redirect('login')
    }

    if(!checkpassword){
        return res.redirect('/login')
    }
    res.redirect('/dashboard')
})




app.listen(port,()=>{
console.log(`Server started and running at ${port}`)
})