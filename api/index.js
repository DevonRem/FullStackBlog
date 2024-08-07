const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
const dotenv = require("dotenv");
dotenv.config();

const salt = bcrypt.genSaltSync(10);
const salt2 = 'asw27y8228';

const corsConfig = {
    credentials:true, 
    origin:['https://full-stack-blog-frontend.vercel.app'],
    methods: ["GET", "POST", "PUT"],
};

app.options("", cors(corsConfig));
app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));


mongoose.connect(process.env.MONGODB_URI);

app.get("/", (req, res) => {
    res.json("Database is now running, link to frontend: https://full-stack-blog-frontend.vercel.app/");
});


app.post('/register', async (req, res) => {  
    const {username, password} = req.body;
    try{
        const userDoc = await User.create({username, password:bcrypt.hashSync(password, salt),});
        res.json(userDoc);
    } catch(e) {
        res.status(400).json(e);
    }
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    const passAuth = bcrypt.compareSync(password, userDoc.password);
    if (passAuth) {
        jwt.sign({username,id:userDoc._id}, salt2, {}, (err,token)=> {
            if(err) throw err;
            res.cookie('token', token).json({
                id:userDoc._id,
                username,
            });
        });
    }
    else{
        res.status(400).json('Wrong login');
    }
});

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, salt2, {}, (err,info) => {
        if (err) throw err;
        res.json(info);
    });
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
})

app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length -1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, salt2, {}, async (err,info) => {
        if (err) throw err;

        const {title, summary, content} = req.body;
        const postDoc = await Post.create({
            title, summary, content, cover:newPath, author: info.id,
        });

        res.json(postDoc);
    });

});


app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if(req.file) {
        const {originalname,path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length -1];
        newPath = path+'.'+ext;
        fs.renameSync(path, newPath);
    }

    const {token} = req.cookies;
    jwt.verify(token, salt2, {}, async (err,info) => {
        if (err) throw err;
        const {id, title, summary, content} = req.body;
        const postDoc = await Post.findById(id)
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if(!isAuthor) {
            return res.status(400).json('Wrong author');
        }

        await postDoc.updateOne({title, summary, content, cover: newPath ? newPath : postDoc.cover, });

        res.json(postDoc);
    });

});

app.get('/post', async (req, res) => {
    res.json(await Post.find()
    .populate('author', ['username'])
    .sort({createdAt: -1})
    .limit(20)
    );
})

app.get('/post/:id', async(req,res)=>{
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
})

app.listen(4000);