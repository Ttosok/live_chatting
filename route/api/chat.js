const express = require("express")
const router = express.Router()
const checkauth = require("../middleware/auth");
// database
const User = require("./../model/user")
const Room = require("./../model/room")
const Profile = require("./../model/profile")
// @route  get user/chat
// @dec	    gointo chat
// @access public

router.get("/:name", async (req,res) =>{
    // adding cookie soon
    const user = await User.findOne({name: req.params.name})
    if(!user){
        return res.status(404).render('html/__blackout', {error: "there were no user on this website"})
    }
    const progile = await Profile.find({})
    const profile = await Profile.findOne({user: user._id})
    const room = await Room.find({typer:{$elemMatch: {user: user._id}}})
    /* // console.log("------------------------ id")
    // room.forEach( sh =>{
    //     let control_date = null
    //     let control_month = null
    //     console.log(sh.room)
    //     sh.chat.forEach(text_user => {
    //         // console.log(text_user.date.getDate())
    //         // console.log("text_user.date.getDate()")
    //         // console.log(new Date().getDate())
    //         // let date = text_user.date.getDate() - new Date().getDate()
    //         // let month = text_user.date.getMoth() - new Date().getMonth() 
    //         // if((control_date !== null) && (control_month !== null))
    //         // {
    //         //     if((date > control_date) && ()) control_date = date
    //         //     if(month > control_month) control_month = month
    //         // }
    //     })
    //     sh.typer.forEach(name_user =>{
    //         console.log(name_user.user)
    //     })
    //     // console.log(new Date(sh.date).toLocaleString())
    //     // console.log("------------------------ date")
    // }) */

    res.setHeader('token', user._id)

    res.render("html/chat.ejs", {data: user, chat: room ,profile: profile, fr_nickname: progile})
    // res.send("ok")
})

// @route  post user/
// @dec	    adding friend user
// @access priavte

/* // router.post("/friend/:user/:name", async (req,res) =>{
//     // console.log(req.params.user)
//     // console.log(req.params.name)

//     const user = await User.findOne({name: req.params.user})
//     if(!user)
//     {
//         return res.json("there weren't an user")
//     }
//     const friend = await User.findOne({name: req.params.name})
//     if(!friend)
//     {
//         return res.json("there weren't an user")
//     }
//     /* let user_friends= user.friends
//     user_friends.forEach(async (data,index) => {
//         if()
//     });
    
//     let friend_info ={
//         user: friend._id,
//         name: friend.name,
//         avatar: friend.avatar
//     }
//     user.friends.unshift(friend_info)
//     // let user_info ={
//     //     user: user._id,
//     //     name: user.name,
//     //     avatar: user.avatar
//     // }
//     // friend.friends.unshift(user_info)

//     await user.save()
//     // await friend.save()

//     res.json({info : user, friend: friend})
// }) */

// funcrion effect
function find_friend(fr) {
    return new Promise( async(res, rej) => {
        try {
            // console.log(fr)
            const user = await User.findById(fr.id)
            if(!user) rej({msg: "didn't find this USEr"})
            // console.log("getting friend info user")
            const friend = await User.findById(fr.id_fr)
            if(!friend) {
                rej({msg: "didn't find this friend"})
                /* const room = await Room.findOne({name: fr.name})
                if(!room) rej({msg: "there were't chat with this group yet"})
                res({chat: room, user: user}) */
            }
            let old_avatar = false
            user.friends.forEach( (ck_avatar) =>{
                if(friend.avatar){
                    if((ck_avatar.avatar !== friend.avatar) && (JSON.parse(JSON.stringify(ck_avatar.user)) === JSON.parse(JSON.stringify(friend._id)))){
                        ck_avatar.avatar = friend.avatar
                        old_avatar = true
                    }
                }
            })
            if(old_avatar === true) await user.save()
            // console.log(friend._id)
            // console.log("getting room info room id")
            let ID = JSON.parse(JSON.stringify(user._id))
            let fr_ID =JSON.parse(JSON.stringify(friend._id))
            const room = await Room.find({$or: [{room: fr_ID + "-" + ID}, {room: ID + "-" + fr_ID}]}, {_id: 0})
            if(room.length < 1) {res({user: user, friend: friend, err: "you haven't chat with them yet"})}

            room.forEach(chat =>{
                // console.log(chat.room + "<room | id user>" +chat.typer)
                res({friend: friend, chat: chat, user: user}) 
            })
        } catch (er) {
            rej(er) 
        }
    })
}
// tab of calling obj
var oldRoom = []
//  live chat event
module.exports =  function (io){
    io.of("/chat").on("connection", async (socket) =>{
        console.log('Chat connet')
        console.log(socket.id)
        // client-to-server
        // friend user
        // first time load the chat room
        socket.once("first_load", async(data) =>{
            // console.log(data)
            await find_friend(data).then( async (msg) =>{
                let chat = msg.chat
                socket.join(chat.room)
                let take = {
                    io: socket.id,
                    room:  chat.room
                }
                oldRoom.push(take)
                // console.log(oldRoom)
                // console.log("first loaded")
                if(msg.hasOwnProperty("chat") && msg.hasOwnProperty("friend"))
                {
                    socket.emit("loaded-first", {
                        friend: msg.friend,
                        chat: msg.chat,
                        user: msg.user
                    })
                }/* else if(msg.hasOwnProperty("chat")){
                    socket.emit("loaded-first", {
                        chat: msg.chat,
                        user: msg.user
                    })
                } */else if(msg.hasOwnProperty("err")){
                    socket.emit("loaded-first", {
                        friend: msg.friend,
                        user: msg.user,
                        err: msg.err
                    })
                }
            }).catch(er =>{
                console.error(er.message)
                console.log(er)
                socket.emit("loaded-first", {
                    error: er
                })
            })
        })
        // when user click to other chat room
        socket.on("friend_chat", async(data) =>{
            // console.log(data)
            await find_friend(data).then( async (msg) =>{
                let chat = msg.chat
                // console.log(msg.chat.room)
                if(data.c){
                    // console.log('Leave xocket')
                    oldRoom.forEach( (check_room,idx) =>{
                        if(check_room.io === data.io)
                        {
                            socket.leave(check_room.room)
                            oldRoom.splice(idx, 1)
                        }
                    })
                }
                if(!msg.hasOwnProperty("err")){
                    let take = {
                        io: socket.id,
                        room: chat.room
                    }
                    oldRoom.push(take)
                    socket.join(chat.room)
                }
                
                // console.log(oldRoom)
                // console.log("click loaded !")
                
                // sending friend info
                if(msg.hasOwnProperty("chat") && msg.hasOwnProperty("friend"))
                {
                    socket.emit("current_chat", {
                        friend: msg.friend,
                        chat: msg.chat,
                        user: msg.user
                    })
                }/* else if(msg.hasOwnProperty("chat")){
                    socket.emit("loaded-first", {
                        chat: msg.chat,
                        user: msg.user
                    })
                } */else if(msg.hasOwnProperty("err")){
                    socket.emit("current_chat", {
                        friend: msg.friend,
                        user: msg.user,
                        err: msg.err
                    })
                }
            }).catch(er =>{
                console.error(er.message)
                console.log(er)
                socket.emit("current_chat", {
                    error: er
                })
            })
        })
        // sending msg from user
        socket.on("post_msg", async (text) => {
            // console.log(text)
            await find_friend(text).then( async (msg) =>{
                let chat = msg.chat
                // console.log(chat.room)
                if(!msg.hasOwnProperty("chat")){
                    const data_room ={
                        typer:[
                            {
                                user: msg.friend._id
                            },
                            {
                                user: msg.user._id
                            }
                        ],
                        room: msg.user._id + "-" + msg.friend._id,
                        chat:{
                            user: msg.user._id,
                            text: text.txt
                        }
                    }
                    await new Room(data_room).save()
                }else{
                    const room = await Room.findOne({room: chat.room})
                    // console.log('check ?!')
                    let info = {
                        user: msg.user._id,
                        text: text.txt
                    }
                    room.chat.unshift(info)
                    await room.save()
                }
                // console.log("sending to room away")
                io.of('/chat').to(chat.room).emit("refesh-msg", {
                    chat: text.txt,
                    id: msg.user._id,
                    time: new Date(Date.now()).toLocaleTimeString(),
                    avatar: msg.user.avatar
                })
            }).catch(er =>{
                console.error(er.message)
                console.log(er)
            })
        })
        // disconnect
        socket.on("disconnect", () => {
            oldRoom.forEach( (check_room,idx) =>{
                if(check_room.io === socket.id)
                {
                    socket.leave(check_room.room)
                    oldRoom.splice(idx, 1)
                }
            })
        })
    })
    // react to router normaly
    return router
}