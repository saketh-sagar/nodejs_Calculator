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
// let Mongo_Uri = 'mongodb+srv://msakethsagar:mmAaPoMibn3c5x3q@cluster0.l6w2w.mongodb.net/?retryWrites=true&w=majority&ssl=true&appName=Cluster0'
var empty='';
app.use(express.urlencoded({extended:true}));

app.set('view engine','ejs');
app.use(express.static('public'));

app.use(bodyparser.json());
dotenv.config();
mongoose.connect(process.env.Mongo_Uri).then(()=>{
    console.log("succesfully connected to Mongo DB" );
}).catch((err)=>{
    console.error(err)
})

const store = new Mongodbstore({
    uri:process.env.Mongo_Uri,
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
    if(user){
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
    }else{
        res.redirect('login')
        console.log('No user')
    }
})

// app.put('/forgotpassword',async(req,res)=>{
//     const {Email,Password1,Password2}=req.body;
//     empty=Email;
//     console.log(Email)
//     const user =await data.findOne({Email});
//    if(user){
//     const hashedPassword = await bcryptjs.hash(Password1,12);
//     user.password = hashedPassword;
//     await user.save();
//     res.redirect('/login')
//     console.log('No user')
//    }else{
//     res.redirect('/forgotpassword')
//     console.log("no user")
//    }
    
// })


// app.put('/forgotpassword', async (req, res) => {
//     const { Email, Password1, Password2 } = req.body;

//     // Ensure all required fields are provided
//     if (!Email || !Password1 || !Password2) {
//         console.log('no email')
//         return res.status(400).send('Please provide all required fields.');
        
//     }

//     // Check if passwords match
//     if (Password1 !== Password2) {
//         console.log('passwords didnt match')
//         return res.status(400).send('Passwords do not match.');
//     }

//     try {
//         // Find the user by email in the database
//         const user = await data.findOne({ Email });

//         // If user exists, hash the new password and update the password field
//         if (user) {
//             // Hash the new password
//             const hashedPassword = await bcryptjs.hash(Password1, 12);

//             // Update the password field in the user object
//             user.password = hashedPassword;

//             // Save the updated user object back to the database
//             await user.save();

//             // Send a success response or redirect to the login page
//             res.redirect('/login');  // You could also send a success message if you prefer
//         } else {
//             // If no user found, respond with a 404 error
//             console.log('no user')
//             res.status(404).send('User not found.');
//         }
//     } catch (error) {
//         // Handle errors (e.g., database connection or hashing issue)
//         console.error(error);
//         res.status(500).send('Internal server error.');
//     }
// });


// app.post('/reset',async(req,res)=>{
//     const {password1,password2}=req.body;
//     const user =await data.findOne({empty});
//     console.log(empty)
//    if(user){
//     const hashedPassword = await bcryptjs.hash(password1,12);
//     user.password = hashedPassword;
//     await user.save();
//     res.redirect('/login')
//    }else {
//     res.redirect('/reset')
//     console.log('NO user')
//    }
    
// })

app.listen(port,()=>{
console.log(`Server started and running at ${port}`)
})