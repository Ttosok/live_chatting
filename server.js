const express = require("express")
const app = express()
const http = require('http')
const server = http.createServer(app)
const socket = require("socket.io")
const io = socket(server)
// database
const mongoose = require('mongoose')
const User = require("./route/model/user")
const Topic = require("./route/middleware/topic")
const { check , validationResult} = require('express-validator')
const mongodbURL = process.env.mongodbURL
const oneDay = 1000 * 60 * 60 * 24;

/* useCreateIndex: true */
try {
    mongoose.connect(mongodbURL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log('data ready')
} catch (er) {
    console.error(er)
    console.log("DATA Eror <-----")
}
var cookieParser = require('cookie-parser')
app.use(cookieParser())

app.set('view engine', 'ejs');
app.use(express.static(__dirname))
app.use(express.json({ limit : "2mb"}))
// app.use(express.urlencoded({ extended: true }))
// ROUTE inform
// app.set("socket.io", io) this maybe not it
app.use("/live", require("./route/api/blog")(io))
app.use("/chat", require("./route/api/chat")(io))
app.use("/control", require("./route/api/admin"))

// @route  get /
// @dec	   showing html login
// @access public

app.get("/", (req,res) =>{
    // req.session.destroy();
    res.clearCookie('token')
    res.clearCookie('power')
    res.render("html/login.ejs")
})

// @route  post /
// @dec	   login user
// @access public

app.post("/",[
    check('email', 'this is not an email').isEmail(),
    check('pass', "requited password").exists()
],
async (req,res) =>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    }
    const { email, pass} = req.body
    // console.log(req.headers.cookie)
    // res.clearCookie('token', {path: '/live'})
    
    try{
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({email: "you did something wrong please check again"})
        }
        if(user.password != Topic(pass).toString()){
            return res.status(400).json({email: "you did something wrong please check again"})
        }

        // console.log((new Date(Date.now() + 90000000)).toLocaleString())
        // res.cookie('token', `${user._id}`, {
        //     expires: new Date(Date.now() + 90000000),
        //     path: '/',
        //     encode: String
        // })
        if(user.name === "Admin"){
            res.cookie('power', user._id, {maxAge: oneDay})
            return res.redirect(`/control`)
        }
        res.cookie('token', user._id, {maxAge: oneDay})
        res.redirect(`/live/blog/${user.name}`)
    }catch(err){
        console.error(err.message)
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
})

// @route  get /signin
// @dec	   showing html login
// @access public

app.get("/signup", (req,res) =>{
    // res.clearCookie('token')
    res.render("html/signin.ejs",{signin : new User()})
})

// @route  post /signin
// @dec	   create an user account
// @access public

app.post("/signup", [
    check('name', 'name is needed').notEmpty(),
    check('email', 'adding for email intel').isEmail(),
    check('pass',
     'enter password to created login also min is 6 and max is 16')
     .isLength({
        min: 6,
        max: 16
    }),
    check('repass',
     'enter password to checked login also min is 6 and max is 16')
     .isLength({
        min: 6,
        max: 16
    })
],
async (req,res) =>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    }
    const {name, email, avatar ,pass, repass} = req.body
    try{
        //  see if there are user or not
        let user = await User.findOne({email :email})
        
        if(user){
            return res.status(400).json({email: "user already been made"})
        }
        user = await User.findOne({name: name})

        if(user){
            return res.status(400).json({name: "This name have been used"})
        }
        if(pass !== repass){
            return res.status(400).json({pass: "password didn't match"})
            // it won't work return  res.render("html/signin.ejs",{data: req.body, errors: [{msg: "password didn't match"}]})
        }
        const password = pass
        // making new user to save
        if(avatar !== null){
            user = new User({
                name,
                email,
                avatar,
                password
            })
        }else{
            user = new User({
                name,
                email,
                password
            })
        }
        
        
        user.password = Topic(pass).toString()
        // save info and send to database
        await user.save()
        res.redirect('/')
        
    }catch(err){
        console.error(err.message)
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
})

const PORT = process.env.PORT || 7000

server.listen(PORT, () => {console.log(`socket start at ${PORT}`)})