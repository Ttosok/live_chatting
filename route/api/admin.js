const express = require("express")
const router = express.Router()
const { check , validationResult} = require('express-validator')
const Topic = require("../../route/middleware/topic")
// database
const User = require("./../model/user")
const Blogs = require("./../model/blog")
const Profile = require("./../model/profile")
const { exists } = require("./../model/user")

// @route  get control/
// @dec	   public user list
// @access public

router.get("/", async (req,res) =>{
    try {
        if(!req.cookies.power)
        {
            return res.status(400).render('html/__blackout', {error: "The server do not see you"})
        }
        const admin = await User.findById(req.cookies.power)
        if(!admin ){
            return res.status(404).render('html/__blackout', {error: "there were no user on this website"})
        }
        const list_user = await User.find({})
        res.render("html/admin_index.ejs", {usList: list_user})
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
})

// @route  put control/user_setting
// @dec	   private admin changing user login info
// @access private

router.put("/user_setting",[
    check('email', 'this is not an email').isEmail().notEmpty(),
    check('OldPass', "needed to filled with Password").notEmpty(),
    check('NewPass', "needed to filled with Password").notEmpty(),
]
,async (req,res) =>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    }
    if(!req.cookies.power)
    {
        return res.status(400).render('html/__blackout', {error: "The server do not see you"})
    }

    const {
        id,
        email,
        OldPass,
        NewPass,
        avatar
    } = req.body

    const admin = await User.findById(req.cookies.power)
    if(!admin) return res.status(404).render('html/__blackout', {error: "there were no admin on this website"})

    let changUser = await User.findById(id)
    if(!changUser) return res.status(400).json({break : "This user already been deleted"})
    try {
        if((changUser.password !== Topic(OldPass).toString()) || (changUser.password === Topic(NewPass).toString())){
            return res.status(400).json({error: "Something wrong with password"})
        }else{
            changUser.email = email
            changUser.password = Topic(NewPass).toString()
            if(avatar != "") changUser.avatar = avatar
            await changUser.save()
            return res.json({info_id : changUser})
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
})

// @route  delete control/user_setting
// @dec	   private admin changing user login info
// @access private

router.delete("/user_setting",async (req,res) =>{
    if(!req.cookies.power)
    {
        return res.status(400).render('html/__blackout', {error: "The server do not see you"})
    }
    const admin = await User.findById(req.cookies.power)
    if(!admin) return res.status(404).render('html/__blackout', {error: "there were no admin on this website"})

    try {
        let deleUser = await User.findByIdAndDelete(req.body.id)
        if(!deleUser) return res.status(400).json({break : "This user already been deleted"})
        await Profile.findOneAndRemove({user: req.body.id})
        res.json({gone_user})
    } catch (err) {
        console.error(err.message);
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
})

// @route  get control/blog
// @dec	   private admin changing user login info
// @access private

router.get("/blog", async (req,res) =>{
    try {
        if(!req.cookies.power)
        {
            return res.status(400).render('html/__blackout', {error: "The server do not see you"})
        }
        const admin = await User.findById(req.cookies.power)
        if(!admin ){
            return res.status(404).render('html/__blackout', {error: "there were no user on this website"})
        }
        const list_blog = await Blogs.find({})
        res.render("html/admin_blog.ejs", {bgList: list_blog})
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
})

// @route  get control/blog/:blog-id/edit
// @dec	   private admin changing user login info
// @access private

router.get("/blog/:blog_id/edit", async (req,res) =>{
    try {
        if(!req.cookies.power)
        {
            return res.status(400).render('html/__blackout', {error: "The server do not see you"})
        }
        const admin = await User.findById(req.cookies.power)
        if(!admin ){
            return res.status(404).render('html/__blackout', {error: "there were no user on this website"})
        }
        if(req.params.blog_id){
            const changeBlog = await Blogs.findById(req.params.blog_id)
            
            return res.render("html/__Edit_blog.ejs", {blog: changeBlog})
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
})

// @route  put control/blog/edit
// @dec	   private admin changing user login info
// @access private

router.put("/blog/edit", async (req,res) =>{
    const {
        id,
        txt,
        ArrayIMG
    }= req.body
    try {
        if(!req.cookies.power)
        {
            return res.status(400).render('html/__blackout', {error: "The server do not see you"})
        }
        const admin = await User.findById(req.cookies.power)
        if(!admin ){
            return res.status(404).render('html/__blackout', {error: "there were no user on this website"})
        }
        let changeBlog = await Blogs.findById(id)
        if(!changeBlog){
            return res.status(400).json({break: 'bad'})
        }
        changeBlog.text = txt
        changeBlog.picture = ArrayIMG
        await changeBlog.save()

        res.redirect("/live/profile")
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
})

// @route  delete control/blog/delete"
// @dec	   private admin changing user login info
// @access private

router.delete("/blog/delete",async (req,res) =>{
    if(!req.cookies.power)
    {
        return res.status(400).render('html/__blackout', {error: "The server do not see you"})
    }

    const {
        id
    } = req.body
    console.log(req.body)
    const admin = await User.findById(req.cookies.power)
    if(!admin) return res.status(404).render('html/__blackout', {error: "there were no admin on this website"})
    try {
        let changeBlog = await Blogs.findByIdAndRemove(id)
        if(!changeBlog) return res.status(400).json({break : "This comment already been deleted"})
        res.json({hi:'ok'})
    } catch (err) {
        console.error(err.message);
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
})

// @route  put control/comment
// @dec	   private admin changing user login info
// @access private

router.put("/comment",[
    check('txt', 'you can nott let it emmty').notEmpty()
]
,async (req,res) =>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    }
    if(!req.cookies.power)
    {
        return res.status(400).render('html/__blackout', {error: "The server do not see you"})
    }

    const {
        id,
        txt
    } = req.body

    const admin = await User.findById(req.cookies.power)
    if(!admin) return res.status(404).render('html/__blackout', {error: "there were no admin on this website"})

    try {
        // let changeComm = await Blogs.find({comments:{$elemMatch: {_id: id}}})
        let changeComm = await Blogs.findOne({comments:{$elemMatch: {_id: id}}})
        if(!changeComm) return res.status(400).json({break : "This comment already been deleted"})
        
        let exsits = false
        changeComm.comments.forEach( async comm => {
            if((comm._id).toString() === id){
                exsits = true
                comm.text = txt
                await changeComm.save()
                return res.json({comm: comm.text})
            }
        })
        if(exsits === false){
            return res.status(400).json({break : "This comment already been deleted"})
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
})

// @route  delete control/comment
// @dec	   private admin changing user login info
// @access private

router.delete("/comment",async (req,res) =>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    }
    if(!req.cookies.power)
    {
        return res.status(400).render('html/__blackout', {error: "The server do not see you"})
    }

    const {
        id
    } = req.body
    console.log(req.body)
    const admin = await User.findById(req.cookies.power)
    if(!admin) return res.status(404).render('html/__blackout', {error: "there were no admin on this website"})

    try {
        let changeComm = await Blogs.findOneAndUpdate(
            {$pull:{comments:{$elemMatch: {_id: id}}}}
            ,   {new: true}
        )
        if(!changeComm) return res.status(400).json({break : "This comment already been deleted"})
        res.json({hi:'ok'})
    } catch (err) {
        console.error(err.message);
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
})

module.exports = router