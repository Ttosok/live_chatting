// Global effect

// set of click effect
// searching
var search_post = document.getElementById("searchFriend")
var search_input = search_post.querySelector("input[type='search']")
// friend list
var room_chat = document.querySelector(".friend_holder .friend_show")
var friend_list = Array.from(document.querySelectorAll(".friend_show .friend-info"))
var selected_friend = document.querySelector(".selected")
// header of friend user
var friend_name = document.querySelector(".chat-header .user-head .small-user")
var tool_info = document.getElementById("tool-info")
var detail_room = document.querySelector(".detail_info")
// in detail 
// solo
var detail_friend = document.querySelector(".detail_info .big-user")
// group
var group_setting = document.querySelector(".detail_group-setting .text")
var chat_setting = document.querySelector(".detail_chat-setting")
var group_user = document.querySelector(".detail_group-user .text")
var chat_user = document.querySelector(".detail_chat-user")
// chat area
var chat_area = document.querySelector(".chat_group .chat-show")
// sent msg
var text_sender = document.querySelector(".type_chat-input")
var input_text = document.getElementById("send_msg")
// create the define i think ?
var posted_msg =document.querySelector(".own_msg")

// event of click effect inside client
// search friend anme list
search_post.addEventListener('submit', async (data) =>{
    data.preventDefault()
    room_chat.textContent= ""
    for(let i = 0; i < friend_list.length; i++) {
       if((friend_list[i].querySelector(".friend-name .name").textContent.trim()).includes((search_input.value).trim()))
       {
            // console.log(friend_list.splice(i, 1)[0]) do not use this to check it will effect the array
            // console.log(friend_list.unshift((friend_list.splice(i, 1)))) also this
            // console.log(friend_list.unshift(friend_list[i])) also this
            friend_list.unshift((friend_list.splice(i, 1))[0])
       }
    }
    friend_list.forEach(fr =>{
        room_chat.append(fr)
    })
    search_input.value = ""
})
// detail area
/* tool_info.addEventListener("click", () =>{
    if(!detail_room.getAttribute("style"))
    {
        detail_room.style.display='block'
    }else{
        detail_room.removeAttribute('style')
    }
    
})
group_setting.addEventListener("click", async() =>{
    if(!chat_setting.getAttribute("style"))
    {
        group_setting.querySelector("ion-icon").setAttribute("name", "arrow-dropup")
        chat_setting.style.display='block'
    }else{
        group_setting.querySelector("ion-icon").setAttribute("name", "arrow-dropdown")
        chat_setting.removeAttribute('style')
    }

})
group_user.addEventListener("click", async() =>{
    if(!chat_user.getAttribute("style"))
    {
        group_user.querySelector("ion-icon").setAttribute("name", "arrow-dropup")
        chat_user.style.display='block'
    }else{
        group_user.querySelector("ion-icon").setAttribute("name", "arrow-dropdown")
        chat_user.removeAttribute('style')
    }
}) */

// live chat event
var socket = io('/chat');
// connect client-server
// when first connect
var req = new XMLHttpRequest();
req.open('GET', document.location, false);
req.send(null);
var headers = req.getResponseHeader("token");
if(selected_friend)
{
    socket.emit("first_load", {
        id_fr: selected_friend.getAttribute('id'),
        id: headers
    })
}


// friend list area
friend_list.forEach((cs, index) =>{
    // trigger click event
    cs.addEventListener("click", () =>{
        chat_area.textContent = ""
        if(!cs.getAttribute('class').includes("selected")){
            cs.setAttribute('class', "list friend-info icon selected")
            friend_list.forEach( (ucs, call) =>{
                if(cs !== ucs){
                    ucs.setAttribute('class', "list friend-info icon")
                }
            })
            selected_friend = cs
            // sending the name of friend
            // console.log(socket.id)
            // .getAttribute('id') 
            setTimeout(() => {
                socket.emit("friend_chat", {
                    id_fr: cs.getAttribute('id'),
                    c: true,
                    io: socket.id,
                    id: headers
                })
            }, 300)
        }
    })
})
// user sending msg
text_sender.addEventListener('submit', async (data) =>{
    data.preventDefault()
    // console.log(selected_friend)
    // console.log(headers)
    socket.emit("post_msg", {
        txt: document.getElementById("send_msg").value,
        io: socket.id,
        id: headers,
        id_fr: selected_friend.getAttribute('id')
    })
    input_text.value = ""
})

// connect server-client
// loading chat when first connected
socket.on("loaded-first", async(data) =>{
    // console.log(data)
    // room chat (add later in different version)
    if(data.hasOwnProperty("user")){
        friend_list.forEach( (fr_avatar,idx) =>{
            if(fr_avatar.getAttribute('id') === data.user.friends[idx].user)
            {
                if(data.user.friends[idx].avatar)
                fr_avatar.querySelector('.avatar img').setAttribute('src', data.user.friends[idx].avatar)
            }
        })
    }
    // chat room
    if(data.hasOwnProperty("friend")){
        // chat header
        // if(data.friend.avatar)
        friend_name.querySelector('.avatar img').setAttribute("src", data.friend.avatar)
        friend_name.querySelector('.text.name').textContent = data.friend.name
        // detail chat
        /* detail_friend.querySelector('.avatar img').setAttribute("src", data.friend.avatar)
        detail_friend.querySelector('.text-h').textContent = data.friend.name */
            // creat msg
            if(data.hasOwnProperty("err")){
                const nochat = document.createElement("li")
                nochat.setAttribute("class", "text flex-middle")
                nochat.textContent = data.err
                chat_area.appendChild(nochat)
            }else{
                // chat database show
                const chat = data.chat.chat
                // console.log(JSON.stringify(data.chat))
                for(let i = chat.length - 1; i >= 0; i--) {
                    let time_data = new Date(chat[i].date).toLocaleDateString()
                    let time_now = new Date(Date.now()).toLocaleDateString()
                    if(time_data < time_now)
                    {
                        const Time = document.createElement("li")
                        Time.setAttribute("class", "text flex-middle")
                        Time.textContent = new Date(chat[i].date).toLocaleDateString()
                        chat_area.appendChild(Time)
                    }
                    if(chat[i].user === data.friend._id){
                        // friend -text- user
                        const box_left = document.createElement("div")
                        const list_left = document.createElement("ul")
                        const left_avatar = document.createElement("li")
                        const avatar_img = document.createElement("img")
                        const left_time = document.createElement("li")
                        const left_txt = document.createElement("li")
                        box_left.setAttribute("class", "get_msg flex-left")
                        list_left.setAttribute("class", "list get_msg-info")
                        left_avatar.setAttribute("class", "avatar")
                        avatar_img.setAttribute("src", data.friend.avatar)
                        avatar_img.setAttribute("alt", "user")
                        left_time.setAttribute("class", "get_msg-time")
                        left_time.textContent = new Date(chat[i].date).toLocaleTimeString()
                        left_txt.setAttribute("class", "get_msg-loaded")
                        left_txt.textContent = chat[i].text
                        left_avatar.appendChild(avatar_img)
                        list_left.append(left_avatar,left_txt,left_time)
                        box_left.appendChild(list_left)
                        chat_area.appendChild(box_left)
                    }else{
                        // user -post- group
                        const box_right = document.createElement("div")
                        const list_right = document.createElement("ul")
                        const right_time = document.createElement("li")
                        const right_txt = document.createElement("li")
                        box_right.setAttribute("class", "own_msg flex-right")
                        list_right.setAttribute("class", "list post_msg-info")
                        right_time.setAttribute("class", "post_msg-time")
                        right_time.textContent = new Date(chat[i].date).toLocaleTimeString()
                        right_txt.setAttribute("class", "post_msg-loaded")
                        right_txt.textContent = chat[i].text
                        list_right.append(right_time,right_txt)
                        box_right.appendChild(list_right)
                        chat_area.appendChild(box_right)
                    }
                    chat_area.scrollTop = chat_area.scrollHeight
                }
                // showing who in the room (adding in later on)
                /* const typer = data.chat.typer
                typer.forEach( (id) =>{
                    // if(id.user === da)
                    const typer_list = document.createElement("li")
                    const typer_avatar = document.createElement("div")
                    const avatar_img = document.createElement("img")
                    const typer_name = document.createElement("p")
                    typer_list.setAttribute("class", "list friend-name")
                    typer_avatar.setAttribute("class", "avatar")
                    avatar_img.setAttribute("src", data.avatar)
                    avatar_img.setAttribute("alt", "user")
                    typer_name.textContent = data.name
                    typer_avatar.appendChild(avatar_img)
                    typer_list.append(typer_avatar,typer_name)
                    chat_user.appendChild(typer_list)
                }) */
            }
    }
    if(data.hasOwnProperty("error")){
        // chat header
        friend_name.querySelector('.avatar img').setAttribute("src", "../../views/img/windows-close.png")
        friend_name.querySelector(".text.name").textContent = data.error.msg
        // detail chat
        detail_friend.querySelector('.avatar img').setAttribute("src", "../../views/img/windows-close.png")
        detail_friend.querySelector('.text-h').textContent = data.error.msg
    }
})
// revising the friend info
socket.on("current_chat", async(data) =>{
    // console.log(data)
    if(data.hasOwnProperty("user")){
        friend_list.forEach( (fr_avatar,idx) =>{
            if(fr_avatar.getAttribute('id') === data.user.friends[idx].user)
            {
                if(data.user.friends[idx].avatar)
                fr_avatar.querySelector('.avatar img').setAttribute('src', data.user.friends[idx].avatar)
            }
        })
    }
    if(data.hasOwnProperty("friend")){
        // chat header
        friend_name.querySelector('.avatar img').setAttribute("src", data.friend.avatar)
        friend_name.querySelector('.text.name').textContent = data.friend.name
            // creat msg
            if(data.hasOwnProperty("err"))
            {
                const nochat = document.createElement("li")
                nochat.setAttribute("class", "text flex-middle")
                nochat.textContent = data.err
                chat_area.appendChild(nochat)
            }else{
                // chat database show
                let chat = data.chat.chat
                // console.log(JSON.stringify(data.chat))
                for(let i = chat.length - 1; i >= 0; i--) {
                    // control time site
                    let time_data = new Date(chat[i].date).toLocaleDateString()
                    let time_now = new Date(Date.now()).toLocaleDateString()
                    // console.log(new Date(Date.now()).toLocaleString()) //"1995-12-17T03:24:00"
                    if((time_data < time_now) )
                    {
                        const Time = document.createElement("li")
                        Time.setAttribute("class", "text flex-middle")
                        Time.textContent = new Date(chat[i].date).toLocaleDateString()
                        chat_area.appendChild(Time)
                    }
                    if(chat[i].user === data.friend._id){
                        // friend -text- user
                        const box_left = document.createElement("div")
                        const list_left = document.createElement("ul")
                        const left_avatar = document.createElement("li")
                        const avatar_img = document.createElement("img")
                        const left_time = document.createElement("li")
                        const left_txt = document.createElement("li")
                        box_left.setAttribute("class", "get_msg flex-left")
                        list_left.setAttribute("class", "list get_msg-info")
                        left_avatar.setAttribute("class", "avatar")
                        avatar_img.setAttribute("src", data.friend.avatar)
                        avatar_img.setAttribute("alt", "user")
                        left_time.setAttribute("class", "get_msg-time")
                        left_time.textContent = new Date(chat[i].date).toLocaleTimeString()
                        left_txt.setAttribute("class", "get_msg-loaded")
                        left_txt.textContent = chat[i].text
                        left_avatar.appendChild(avatar_img)
                        list_left.append(left_avatar,left_txt,left_time)
                        box_left.appendChild(list_left)
                        chat_area.appendChild(box_left)
                    }else{
                        // user -post- group
                        const box_right = document.createElement("div")
                        const list_right = document.createElement("ul")
                        const right_time = document.createElement("li")
                        const right_txt = document.createElement("li")
                        box_right.setAttribute("class", "own_msg flex-right")
                        list_right.setAttribute("class", "list post_msg-info")
                        right_time.setAttribute("class", "post_msg-time")
                        right_time.textContent = new Date(chat[i].date).toLocaleTimeString()
                        right_txt.setAttribute("class", "post_msg-loaded")
                        right_txt.textContent = chat[i].text
                        list_right.append(right_time,right_txt)
                        box_right.appendChild(list_right)
                        chat_area.appendChild(box_right)
                    }
                    chat_area.scrollTop = chat_area.scrollHeight
                }
            }
    }
    if(data.hasOwnProperty("error")){
        // chat header
        friend_name.querySelector('.avatar img').setAttribute("src", "../../views/img/windows-close.png")
        friend_name.querySelector(".text.name").textContent = data.error.msg
        // detail chat
        detail_friend.querySelector('.avatar img').setAttribute("src", "../../views/img/windows-close.png")
        detail_friend.querySelector('.text-h').textContent = data.error.msg
    }
})
// chat msg refesh
socket.on("refesh-msg", (data) =>{
    // console.log("-------msg")
    // console.log(JSON.stringify(data))
    // console.log(data)
    if(data.id === headers){
        const box_right = document.createElement("div")
        const list_right = document.createElement("ul")
        const right_time = document.createElement("li")
        const right_txt = document.createElement("li")
        box_right.setAttribute("class", "own_msg flex-right")
        list_right.setAttribute("class", "list post_msg-info")
        right_time.setAttribute("class", "post_msg-time")
        right_time.textContent = data.time
        right_txt.setAttribute("class", "post_msg-loaded")
        right_txt.textContent = data.chat
        list_right.append(right_time,right_txt)
        box_right.appendChild(list_right)
        chat_area.appendChild(box_right)
    }else{
        const box_left = document.createElement("div")
        const list_left = document.createElement("ul")
        const left_avatar = document.createElement("li")
        const avatar_img = document.createElement("img")
        const left_time = document.createElement("li")
        const left_txt = document.createElement("li")
        box_left.setAttribute("class", "get_msg flex-left")
        list_left.setAttribute("class", "list get_msg-info")
        left_avatar.setAttribute("class", "avatar")
        avatar_img.setAttribute("src", data.avatar)
        avatar_img.setAttribute("alt", "user")
        left_time.setAttribute("class", "get_msg-time")
        left_time.textContent = data.time
        left_txt.setAttribute("class", "get_msg-loaded")
        left_txt.textContent = data.chat
        left_avatar.appendChild(avatar_img)
        list_left.append(left_avatar,left_txt,left_time)
        box_left.appendChild(list_left)
        chat_area.appendChild(box_left)
    }
    chat_area.scrollTop = chat_area.scrollHeight
})

//  testing veriosn
// var req = new XMLHttpRequest();
// req.open('GET', document.location, false);
// req.send(null);
// // console.log(req)
// var headers = req.getResponseHeader("token");
// console.log(headers)
// console.log("------------------------------")
// var headers = req.getAllResponseHeaders().toLowerCase();