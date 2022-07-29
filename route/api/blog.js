const express = require("express")
const router = express.Router()
const { check , validationResult} = require('express-validator')
const Topic = require("../../route/middleware/topic")
// const checkauth = require("../middleware/auth")
// database
const User = require("./../model/user")
const Blogs = require("./../model/blog")
const Profile = require("./../model/profile")

// @route  get live/blog/:name
// @dec	   public blog
// @access public

router.get("/blog/:name", async (req,res) =>{
    if (req.cookies.token){
        console.log(req.cookies.token)
    }

    try {
        // const user = await User.findById(req.user, {_id: 0})
        const user = await User.findOne({name: req.params.name})
        if(!user ){
            return res.status(404).render('html/__blackout', {error: "there were no user on this website"})
        }
        const bloger = await Blogs.find({}).sort({date: -1})

        const profile = await Profile.findOne({user: user._id})

        res.setHeader('token', user._id)

        res.render("html/index.ejs", {data: user, blog: bloger, profile: profile})
    } catch (err) {
        console.error(err.message);
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
})

// @route  posting live/posting
// @dec	   posting blog into bloger
// @access private

router.post("/posting",
[
    check('txt', "require texting").notEmpty()
]
, async (req,res) =>{
    // console.log("getting posting effect V")
    // console.log(req.header('token'))

    const id = req.header('token')
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    }
    const user = await User.findById(id)
    // const user = await User.findOne({name: req.params.name})
    if(!user) return res.status(404).render('html/__blackout', {error: "there were no user on this website"})
    // making posting info
    const {
        txt,
        img
    } = req.body
    // make an holding to check
    const post_data ={}
    post_data.user = id
    if(img) {
        post_data.picture = img
    }
    post_data.name = user.name
    post_data.avatar = user.avatar
    post_data.text = txt
    try {
        const newPost =  new Blogs(post_data)
        await newPost.save()
        res.json(newPost)
    } catch (err) {
        console.error(error.message);
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
    // addd-on 
    // console.log(post_data.name)
    // console.log(post_data.text)
    // res.json(post_data)
})

// @route  put live/comment
// @dec	   private profile
// @access private

router.put("/comment", async (req,res) =>{
    const id = req.header('token')
    const {
        comm_id,
        txt
    } = req.body
    try {
        let user = await User.findById(id)
        if(!user){
            return res.status(404).render('html/__blackout', {error: "there were no user on this website"})
        }
        const changeComm = await Blogs.findOne({comments:{$elemMatch: {_id: comm_id}}})
        if(!changeComm) return res.status(400).json({break : "This comment already been deleted"})

        let exsits = false
        changeComm.comments.forEach( async comm => {
            if((comm._id).toString() === comm_id){
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

// @route  delete live/comment
// @dec	   private profile
// @access private

router.delete("/comment",async (req,res) =>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    }
    const id = req.header('token')
    const {
        comm_id
    } = req.body
    const user = await User.findById(id)
    if(!user) return res.status(404).render('html/__blackout', {error: "there were no admin on this website"})
    try {
        let changeComm = await Blogs.findOneAndRemove({comments:{$elemMatch: {_id: comm_id}}})
        if(!changeComm) return res.status(400).json({break : "This comment already been deleted"})
        res.json({hi:'ok'})
    } catch (err) {
        console.error(err.message);
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
})

// @route  put live/adding/friend
// @dec	   private profile
// @access private

router.put("/adding/friend", async (req,res) =>{
    const id = req.header('token')
    const {
        fr_id
    } = req.body
    try {
        let user = await User.findById(id)
        if(!user ){
            return res.status(404).render('html/__blackout', {error: "there were no user on this website"})
        }
        let friend = await User.findById(fr_id)
        if(!friend ){
            return res.status(404).render('html/__blackout', {error: "there were no user on this website"})
        }
        user.hold_friend.forEach( async hf =>{
            if(JSON.parse(JSON.stringify(hf.user)) === JSON.parse(JSON.stringify(friend._id))){
                let dbcheck = false
                user.friends.forEach(fs =>{
                    if(fs.user.toString() === friend._id.toString()){
                        dbcheck = true
                    }
                })
                if(dbcheck === false){
                    await User.findOneAndUpdate(
                        {_id: user._id}
                    ,   {$push: {friends: {user: friend._id, name: hf.name, avatar: hf.avatar}}}
                    ,   {new: true}
                    )
                    await User.findOneAndUpdate(
                        {_id: friend._id}
                    ,   {$push: {friends: {user: user._id, name: user.name, avatar: user.avatar}}}
                    ,   {new: true}
                    )
                    await User.findOneAndUpdate(
                        {_id: user._id}
                    ,   {$pull: {hold_friend: {user: friend._id}}}
                    ,   {new: true}
                    )
                }
            }
        })
        res.json({gold: "friend"})
    } catch (err) {
        console.error(err.message);
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
})

// @route  get live/profile/:name
// @dec	   public profile basic of user
// @access public

router.get("/profile/:name", async (req,res) =>{
    try {
        const user = await User.findOne({name: req.params.name})
        if(!user ){
            return res.status(404).render('html/__blackout', {error: "there were no user on this website"})
        }
        const profile = await Profile.findOne({user: user._id})
        
        res.setHeader('token', user._id)

        res.render("html/profile_note.ejs", {data: user, profile: profile})
    } catch (err) {
        console.error(err.message);
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
})

// @route  get live/profile/:blog_id/edit
// @dec	   private profile
// @access private

router.get("/profile/:name/:blog_id/edit", async (req,res) =>{
    try {
        const user = await User.findOne({name: req.params.name})
        if(!user ){
            return res.status(404).render('html/__blackout', {error: "there were no user on this website"})
        }
        res.setHeader('token', user._id)
        let changeBlog = await Blogs.findById(req.params.blog_id)
        res.render("html/__Edit_blog.ejs", {blog: changeBlog})
    } catch (err) {
        console.error(err.message);
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
})

// @route  put live/profile/:name/blog/edit
// @dec	   private admin changing user login info
// @access private

router.put("/profile/blog/edit", async (req,res) =>{
    const {
        user_id,
        id,
        txt,
        ArrayIMG
    }= req.body
    try {
        const user = await User.findById(user_id)
        if(!user ){
            return res.status(404).render('html/__blackout', {error: "there were no user on this website"})
        }
        let changeBlog = await Blogs.findById(id)
        if(!changeBlog){
            return res.status(400).json({break: 'bad'})
        }
        changeBlog.text = txt
        changeBlog.picture = ArrayIMG
        await changeBlog.save()

        res.redirect(`/live/profile/${user.name}`)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
})

// @route  delete live/:name/blog
// @dec	   private profile
// @access private

router.delete("/blog/delete",async (req,res) =>{
    const id = req.header('token')
    const {
        blog_id
    } = req.body
    const user = await User.findById(id)
    if(!user) return res.status(404).render('html/__blackout', {error: "there were no admin on this website"})
    try {
        let changeBlog = await Blogs.findByIdAndRemove(blog_id)
        if(!changeBlog) return res.status(400).json({break : "This comment already been deleted"})
        res.json({hi:'ok'})
    } catch (err) {
        console.error(err.message);
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
})

// @route  get live/profile/:name/about
// @dec	   public about profile detail of user
// @access public

router.get("/profile/:name/about", async (req,res) =>{
    try {
        const user = await User.findOne({name: req.params.name})
        if(!user ){
            return res.status(404).render('html/__blackout', {error: "there were no user on this website"})
        }
        const profile = await Profile.findOne({user: user._id})
        
        res.setHeader('token', user._id)

        res.render("html/profile_detail.ejs", {data: user, profile: profile})
    } catch (err) {
        console.error(err.message);
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
})
// @route  post live/profile/about
// @dec	   private profile
// @access private
// check('school', "school is reuquired").exists().if((value, { req }) => value !== ""),

router.post("/profile/about", [
    check('status', 'status is needed').notEmpty()
], async (req,res) =>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    }
    const id = req.header('token')
    const user = await User.findById(id)
    if(!user) return res.status(404).render('html/__blackout', {error: "there were no user on this website"})
    const{
            location,
            status,
            nick_name,
            bio,
            education,
            social
        } = req.body
    if((education.school !== "") || (education.degree !== "") || (education.fieldofstudy !== "") || (education.from !== "")) 
    {
        let edu_err = {}
        let needed = false
        if(education.school === "")
        {
            edu_err.school = 'school required'
            needed = true
        }
        if(education.degree === "")
        {
            edu_err.degree = 'degree required'
            needed = true
        }
        if(education.fieldofstudy === "")
        {
            edu_err.fieldofstudy = 'fieldofstudy required'
            needed = true
        }
        if((education.from === "") || !(Date.parse(education.from)))
        {
            edu_err.from = 'from required'
            needed = true
        }
        if(needed === true){
            return res.status(400).json({break :edu_err})
        }   
    }
    const today = new Date(Date.now()).toLocaleDateString()
    // make to gold profile
    const profile_data = {}
    profile_data.user = id
    if(location !== "") profile_data.location = location
    if(nick_name !== "") profile_data.nick_name = nick_name
    profile_data.status = status
    if(bio !== "")  profile_data.bio = bio

    profile_data.education = {}
    profile_data.education.school = education.school
    profile_data.education.degree = education.degree
    profile_data.education.fieldofstudy = education.fieldofstudy
    profile_data.education.from = education.from
    if(education.to !== "" && education.to === today){
        profile_data.education.current = true
    }else if(education.to === ""){
        profile_data.education.current = true
    }else{
        profile_data.education.to = education.to
    }
    if(education.description !== "") profile_data.education.description = education.description

    profile_data.social = {}
    if(social.youtube !== "") profile_data.social.youtube = social.youtube 
    if(social.twitter !== "") profile_data.social.twitter = social.twitter 
    if(social.facebook !== "") profile_data.social.facebook = social.facebook 
    if(social.linkin !== "") profile_data.social.linkin = social.linkin
    try {
        let profile = await Profile.findOne({user: id});
        if(profile){
            profile = await Profile.findOneAndUpdate(
                    {user: id}
                ,   {$set: profile_data}
                ,   {new: true}
                );
           return res.json({hi: 'ok'});
        }
        //create new profile
        profile = new Profile(profile_data);
        await profile.save();
        res.json({hi: 'ok'})
    } catch (err) {
        console.error(err.message);
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
})

// @route  put live/profile/about
// @dec	   private profile
// @access private

router.put("/profile/about", [
    check('status', 'status is needed').notEmpty()
], async (req,res) =>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    }
    const id = req.header('token')
    const user = await User.findById(id)
    if(!user) return res.status(404).render('html/__blackout', {error: "there were no user on this website"})
    const{
            location,
            status,
            nick_name,
            bio,
            education,
            social
        } = req.body
    
    const today = new Date(Date.now()).toLocaleDateString()
    // make to gold profile
    const profile_data = {}
    profile_data.user = id
    if(location !== "") profile_data.location = location
    if(nick_name !== "") profile_data.nick_name = nick_name
    profile_data.status = status
    if(bio !== "")  profile_data.bio = bio

    profile_data.social = {}
    if(social.youtube !== "") profile_data.social.youtube = social.youtube 
    if(social.twitter !== "") profile_data.social.twitter = social.twitter 
    if(social.facebook !== "") profile_data.social.facebook = social.facebook 
    if(social.linkin !== "") profile_data.social.linkin = social.linkin
    try {
        const Edu_array = []
        education.forEach(edu =>{
            let edu_err = {}
            if((edu.school !== "") || (edu.degree !== "") || (edu.fieldofstudy !== "") || (edu.from !== "")) 
            {
                let needed = false
                if(edu.school === "")
                {
                    edu_err.school = 'school required'
                    needed = true
                }
                if(edu.degree === "")
                {
                    edu_err.degree = 'degree required'
                    needed = true
                }
                if(edu.fieldofstudy === "")
                {
                    edu_err.fieldofstudy = 'fieldofstudy required'
                    needed = true
                }
                if((edu.from === "") || !(Date.parse(edu.from)))
                {
                    edu_err.from = 'from required'
                    needed = true
                }
                if(needed === true){
                    return res.status(400).json({ break : edu_err})
                }   
            }
            let sort_edu = {}
            sort_edu.id = edu.id
            sort_edu.school = edu.school
            sort_edu.degree = edu.degree
            sort_edu.fieldofstudy = edu.fieldofstudy
            sort_edu.from = edu.from
            if(edu.to !== "" && edu.to === today){
                sort_edu.current = true
            }else if(edu.to === ""){
                sort_edu.current = true
            }else{
                sort_edu.to = edu.to
            }
            if(edu.description !== "") sort_edu.description = edu.description
            Edu_array.push(sort_edu)
        })
        let profile = await Profile.findOne({user: id});
        if(!profile){
            return res.status(400).json({error: "there are none of this profile in the system"})
        }
        // update profile without education
        profile = await Profile.findOneAndUpdate(
            {user: id}
        ,   {$set:  profile_data}
        ,   {new: true}
        );
        // update the education
        profile.education.forEach(async (edu) =>{
            for(let i = 0; i < Edu_array.length; i++) {
                if(JSON.parse(JSON.stringify(edu._id)) === Edu_array[i].id){
                    edu.school = Edu_array[i].school
                    edu.degree = Edu_array[i].degree
                    edu.fieldofstudy = Edu_array[i].fieldofstudy
                    edu.from = Edu_array[i].from
                    if(Edu_array[i].to !== "" && Edu_array[i].to === today){
                        edu.current = true
                    }else if(Edu_array[i].to === ""){
                        edu.current = true
                    }else{
                        edu.to = Edu_array[i].to
                    }
                    if(Edu_array[i].description !== "") edu.description = Edu_array[i].description
                    await profile.save()
                    return res.json({hi: 'ok'})
                }
            }
        })
        res.json({ profile: profile})
    } catch (err) {
        console.error(err.message);
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
})

// @route  put live/profile/social
// @dec	   private profile
// @access private

router.put("/profile/social", async (req,res) =>{
    const id = req.header('token')
    try {
        let profile = await Profile.findOne({user: id})
        profile.social = req.body.social
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
})

// @route  post live/profile/education
// @dec	   private profile
// @access private

router.post("/profile/education", [
    check('school', "school is reuquired").exists().notEmpty(),
    check('degree', "degree is reuquired").exists().notEmpty(),
    check('fieldofstudy', "fieldofstudy is reuquired").exists().notEmpty(),
    check('from', "add an started date").isDate().notEmpty()
], async (req,res) =>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    }
    const id = req.header('token')
    const today = new Date(Date.now()).toLocaleDateString()
    const{
        school,
        degree,
        fieldofstudy,
        from,
        to,
        description
    }= req.body
    const edu_add ={}
    edu_add.school = school
    edu_add.degree = degree
    edu_add.fieldofstudy = fieldofstudy
    edu_add.from = from
    if(to !== "" && to === today){
        edu_add.current = true
    }else if(to === ""){
        edu_add.current = true
    }else{
        edu_add.to = to
    }
    if(description !== "") edu_add.description = description
    try {
        let profile = await Profile.findOneAndUpdate(
                {user: id}
            ,   {$push: {education: edu_add}}
            ,   {new: true}
            )
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
})

// @route  post live/profile/note
// @dec	   user making note for their own
// @access private

router.post("/profile/note", async (req,res) =>{
    const id = req.header('token')
    const user = await User.findById(id)
    const note = req.body
    try {
        await Profile.findOneAndUpdate(
            {user: id}
        ,   {$push: {note: {text: note.text}}}
        ,   {new: true}
        )
        res.redirect(`/live/profile/${user.name}`)
    } catch (err) {
        console.error(err.message);
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
})

// @route  put live/profile/setting/user
// @dec	   private user changing their own login info
// @access private
/* ,[
    body('oldPassword').if((value, { req }) => req.body.newPassword)
  // OR
  .if(body('newPassword').exists())
  // ...then the old password must be too...
  .notEmpty()
  // ...and they must not be equal.
  .custom((value, { req }) => value !== req.body.newPassword)
] */

router.put("/profile/setting/user",[
    check('email', 'this is an email').isEmail().notEmpty(),
    check('OldPass', "needed to filled with Password").notEmpty(),
    check('NewPass', "needed to filled with Password").notEmpty(),
]
,async (req,res) =>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    }
    const id = req.header('token')
    const {
        email,
        OldPass,
        NewPass,
        avatar
    } = req.body
    let user = await User.findById(id)
    if(!user) return res.status(404).render('html/__blackout', {error: "there were no user on this website"})
    try {
        if((user.password !== Topic(OldPass).toString()) || (user.password === Topic(NewPass).toString())){
            return res.status(400).json({break: "Something wrong with password"})
        }else{
            user.email = email
            user.password = Topic(NewPass).toString()
            if(avatar != "") user.avatar = avatar
            await user.save()
            return res.json({hi : 'ok'})
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
})

// @route  delete live/profile/social
// @dec	   private profile social
// @access private

router.delete("/profile/note", async (req,res) =>{
    const id = req.header('token')
    const user = await User.findById(id)

    const note = req.body
    try {
        await Profile.findOneAndUpdate(
            { user: id}
            ,   {$pull: {note: {_id: note.id}}}
            ,   {new: true}
            );
        res.json(dele_note)
    } catch (err) {
        console.error(err.message);
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
})

// @route  get live/profile/:name/:fr_name
// @dec	   private profile
// @access private

router.get("/profile/:name/:fr_name", async (req,res) =>{
    try {
        const user = await User.findOne({name: req.params.name})
        if(!user ){
            return res.status(404).render('html/__blackout', {error: "there were no user on this website"})
        }
        const friend = await User.findOne({name: req.params.fr_name})
        if(!friend ){
            return res.status(404).render('html/__blackout', {error: "there were no user on this website"})
        }
        const user_profile = await Profile.findOne({user: user._id})
        const fr_profile = await Profile.findOne({user: friend._id})
        const fr_blog = await Blogs.find({user: friend._id}).sort({date: -1})
        res.setHeader('token', friend._id)

        res.render("html/fr_profile_note.ejs", {data: user, friend: friend ,profile: user_profile , fr_profile: fr_profile, fr_blog: fr_blog})
    } catch (err) {
        console.error(err.message);
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
})

// @route  get live/profile/:name/:fr_name/about
// @dec	   private profile
// @access private

router.get("/profile/:name/:fr_name/about", async (req,res) =>{
    try {
        const user = await User.findOne({name: req.params.name})
        if(!user ){
            return res.status(404).render('html/__blackout', {error: "there were no user on this website"})
        }
        const friend = await User.findOne({name: req.params.fr_name})
        if(!friend ){
            return res.status(404).render('html/__blackout', {error: "there were no user on this website"})
        }
        const user_profile = await Profile.findOne({user: user._id})
        const fr_profile = await Profile.findOne({user: friend._id})

        res.setHeader('token', friend._id)

        res.render("html/fr_profile_detail.ejs", {data: user, friend: friend ,profile: user_profile , fr_profile: fr_profile})
    } catch (err) {
        console.error(err.message);
        res.status(500).render('html/__blackout', {error: "Server error"})
    }
})

// funcrion effect
function find_bloger(bg) {
    return new Promise( async(res, rej) => {
        try {
            // console.log(bg)
            const user = await User.findById(bg.id)
            if(!user) rej({msg: "didn't find this USEr"})
            // console.log(user.name)
            // console.log("getting bloger id")
            const bloger = await Blogs.findById(bg.poster_id)
            if(!bloger) rej({msg: "didn't find this Blog"})
            // console.log(bloger.text)

            res({user: user, bloger: bloger})
        } catch (er) {
            rej(er) 
        }
    })
}
function check_blog(blog_id){
    return new Promise(async (res,rej) =>{
        try {
            const blog = await Blogs.find({user: blog_id.id}).sort({date: -1})
            if(blog.length < 1) {
                rej()
            }
            const user = await User.findById(blog_id.id)
            // console.log(user.name)
            res({
                blog: blog,
                user: user
            })
        } catch (er) {
            rej(er)
        }
    })
}
// tab of calling obj
let fr_socket = null
// live blog event
module.exports = function (io){
    io.of('/live/blog').on("connection", async (socket) =>{
        console.log('Blog connected')
        console.log(socket.id)

        // cleint-server
        // user pressed make friend
        /* come and fix this quick */
        socket.on('blog-make_friend',async (data) =>{
            const user = await User.findById(data.id)
            if(!user) {
                socket.emit('blog-friend_added', {
                    error: "there are no user"
                })
            }
            const friend = await User.findById(data.fr_id)
            if(!friend) {
                socket.emit('blog-friend_added', {
                    error: "there are no user"
                })
            }
            if(user && friend){
                let friends = false
                let already = false
                friend.friends.forEach(async fs=>{
                    if(fs.user.toString() === friend._id.toString()){
                        friends = true
                    }
                })
                friend.hold_friend.forEach(async hf =>{
                    if(JSON.parse(JSON.stringify(hf.user)) === JSON.parse(JSON.stringify(user._id))){
                        already = true
                    }
                })
                if(already === false && friends === false){
                    await User.findByIdAndUpdate(friend._id
                        ,   {$push: {hold_friend:{ user: user._id, name: user.name, avatar: user.avatar}}}
                        ,   {new: true}
                        )
        
                    socket.emit('blog-friend_added',{
                        id: friend._id
                    })
                }
                else{
                    socket.emit('friend_NO',{
                        id: friend.name
                    })
                }
            }
        })
        // user posted comment
        socket.on("comment-posting",async (data) =>{
            console.log(data)
            // call out the comment of the blog
            await find_bloger(data).then(async (blog) =>{
                commnet ={
                    user:  blog.user._id,
                    text:  data.txt,
                    name: blog.user.name,
                    avatar: blog.user.avatar
                }
                blog.bloger.comments.push(commnet)
                await blog.bloger.save()
                // send back to blog client
                io.of('/live/blog').emit('comment-connect', {
                    user: blog.user,
                    bloger: blog.bloger
                })
            }).catch(er =>{
                console.log(er)
                console.error(er)
            })
        })
        // user pressed liked
        socket.on('comment-like',async (data) =>{
            // console.log(data)
            await find_bloger(data).then(async (blog) =>{
                if(blog.bloger.like.length <= 0)
                {
                    console.log('first time create like')
                    liked = {
                        user:  blog.user._id,
                    }
                    blog.bloger.like.push(liked)
                    await blog.bloger.save()
                    // send back to blog client
                    io.of('/live/blog').emit('comment_liked-attack', {
                        like: blog.bloger
                    })
                }else{
                    let check_li = false
                    blog.bloger.like.forEach(async li => {
                        console.log(li)
                        if(JSON.parse(JSON.stringify(li.user)) === JSON.parse(JSON.stringify(blog.user._id)))
                        {
                            console.log("pull off like from same user")
                            const liked = await Blogs.findOneAndUpdate(
                            { _id: blog.bloger._id}
                            ,   {$pull: {like: {user: li.user}}}
                            ,   {new: true}
                            )
                            // send back to blog client
                            io.of('/live/blog').emit('comment_liked-attack', {
                                like: liked
                            })
                            check_li = true
                        }
                    })
                    if(check_li === false){
                        console.log('in middle checking on like')
                        const liked = await Blogs.findOneAndUpdate(
                        { _id: blog.bloger._id}
                        ,   {$push: {like: {user: blog.user._id}}}
                        ,   {new: true}
                        )
                        // send back to blog client
                        io.of('/live/blog').emit('comment_liked-attack', {
                            like: liked
                        })
                    }
                }
            }).catch(er =>{
                console.log(er)
                console.error(er)
            })
        })
    })
    io.of('/live/profile').on("connection", async (socket) =>{
        console.log('Profile connected')
        console.log(socket.id)
        // client-server
        // user ask for note or blog in event click
        // note click
        socket.on('note_click',async (data) =>{
            console.log(data)
            await new Promise( async(res,rej) =>{
                try {
                    const profile = await Profile.findOne({user: data.id})
                    if(!profile || profile.note.length < 1) {
                        rej()
                    }
                    res(profile.note)
                } catch (err) {
                    rej(err)
                }
            }).then( data =>{
                socket.emit('note-list', {
                    note: data
                })
            }).catch(err =>{
                socket.emit('non-note-list', {
                    indx: "user haven't make note yet"
                })
                console.log(err)
                console.error(err)
            })
        })
        // note edit
        socket.on('note-edit',async (data) =>{
            try {
                let edit_note = await Profile.findOne(
                    {user: data.id}
                )
                edit_note.note.forEach(nt =>{
                    if(JSON.parse(JSON.stringify(nt._id)) === data.note_id)
                    {
                        nt.text = data.txt
                    }
                })
                await edit_note.save()
                socket.emit('refesh-note', {
                    note: data.txt,
                    id: data.note_id
                })
            } catch (error) {
                console.log(error)
                console.error(error)
            }
        })
        // blog click
        socket.on('blog_click',async (data) =>{
            // console.log(data)
            await check_blog(data).then(async (blog_get) =>{
                socket.emit('blog-list', {
                    blog: blog_get.blog,
                    user: blog_get.user
                })
            }).catch(er => {
                socket.emit('non-blog-list', {
                    indx: "user haven't make blog yet"
                })
                console.log(er)
                console.error(er)
            })
        })
    })
    return router
}