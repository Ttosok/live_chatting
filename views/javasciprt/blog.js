// Global effect
var posting_unit = document.querySelector(".postey_container")
var post_area = document.querySelector('.Posted_area')
var scoll_web = document.querySelector('.index_fixed')
// storing
var array_img = []

// set of input event
var posted_msg = document.querySelector(".Posted_area #Posted_text")
var comment_area = Array.from(document.querySelectorAll('.comment_area'))
var commnet_msg = Array.from(document.querySelectorAll('.comment_area #commnet_text'))
// user blog of commnet
var blog_holder = Array.from(document.querySelectorAll('.blog_border'))
// set of img change event
var user_Posted_img = document.querySelector('.Posted_img-show')
var Posted_img = document.getElementById('img_select')
// set of posting enter event
// bloger for user
var posting = document.querySelector('.postey-border')
// comment for user
var comment_posting = Array.from(document.querySelectorAll('.blog_comment'))
var putting_comment = Array.from(document.querySelectorAll('.put_area .put_comment'))
// click called
var like_click = Array.from(document.querySelectorAll('.blog_area .blog_like'))
var fr_click = Array.from(document.querySelectorAll('.user_poster .portal_blog .adding_fr'))
// website scroll event
window.addEventListener('scroll', function(){
    if(window.pageYOffset > 80){
        scoll_web.style.position ="fixed"
    }else{
        scoll_web.style.position ="relative";
    }
})
// event of input effect inside posted-user
posted_msg.addEventListener("input", () =>{
    posted_msg.style.height = "auto"
    posted_msg.style.height = posted_msg.scrollHeight + "px"
})
commnet_msg.forEach( (toolop,idx) =>{
    toolop.addEventListener('input', () =>{
        toolop.style.height = "auto"
        toolop.style.height = toolop.scrollHeight + "px"
        comment_area[idx].style.display= 'block'
        if(toolop.value === "" ){
            comment_area[idx].style.display= 'none'
        }
    })
})
// event of file got put in
Posted_img.addEventListener("change", function() {
    const file = this.files[0]
    if(file)
    {
        const reader = new FileReader()
        reader.addEventListener("load", function() {
                // console.log(reader)
                // console.log("seeing file reader ^")
                // console.log(this.result)
                const img_shower = document.createElement("img")
                img_shower.setAttribute("src", this.result)
                img_shower.setAttribute("alt", "user post img")
                user_Posted_img.append(img_shower)
                posting_unit.style.height = post_area.scrollHeight + "px"
                array_img.push({img: this.result})
        })
        reader.readAsDataURL(file)
    }
})
// url control
var req = new XMLHttpRequest();
req.open('GET', document.location, false);
req.send(null);
var headers = req.getResponseHeader("token");
// socket connect
var socket = io('/live/blog');
// envent on click
like_click.forEach( (ck,idx) =>{
    ck.addEventListener('click', () =>{
        socket.emit('comment-like', {
            like: true,
            id: headers,
            poster_id:  blog_holder[idx].querySelector(".blog_area").getAttribute('id')
        })
    })
})
blog_holder.forEach(bl =>{
    if((bl.querySelector(".user_poster .portal_blog .adding_fr"))){
        fr_click.forEach((ck,idx) =>{
            ck.addEventListener('click', () =>{
                socket.emit('blog-make_friend', {
                    id: headers,
                    fr_id: bl.querySelector(".user_poster .text.name").getAttribute('id')
                })
            })
        })
    }
})
// client-server
posting.addEventListener('submit',async (data) =>{
    data.preventDefault()
    
    const send_data = await fetch('/live/posting' , {
        method: "POST",
        headers: {
        'Content-Type': 'application/json',
        'token' : headers
        },
        body: JSON.stringify({
            txt: posted_msg.value,
            img: array_img
        })
    }).then(()=>{
        window.location.href =document.location
    })
})
// 
comment_posting.forEach( (ck,idx) =>{
    ck.querySelector('.click_commnet .commented-send').addEventListener("click", () =>{
        comment_area[idx].addEventListener('submit', (data) =>{
            data.preventDefault()
            // sending comment of the blog
            if(commnet_msg[idx].value !== "")
            {
                socket.emit("comment-posting" , {
                    txt: commnet_msg[idx].value,
                    io: socket.id,
                    id: headers,
                    poster_id: blog_holder[idx].querySelector(".blog_area").getAttribute('id')
                })
            }
            commnet_msg[idx].value = ""
        })
    })
    
})

// server-client
socket.on('comment-connect', (data) =>{
    // console.log(data)
    // created an commnet side for all user
        data.bloger.comments.forEach( cmn =>{
            let check_room = false
            putting_comment.forEach( (id) =>{
                if(id.querySelector('.commnet_area').getAttribute('id') === cmn._id){
                    check_room = true
                }
            }) 
            if(check_room === false){
                // making comment in the web
                const put_comment = document.createElement("li")
                const user_comment = document.createElement("div")
                const user_cotain = document.createElement("div")
                const comment_name = document.createElement('p')
                const user_avatar = document.createElement("div")
                const avatar_img = document.createElement("img")
                const user_date = document.createElement("div")
                const date_h3 = document.createElement("h3")
                const comment_area = document.createElement("div")
                const comment_text = document.createElement('p')
                put_comment.setAttribute("class", "put_comment")
                user_comment.setAttribute("class", "list user_comment")
                user_cotain.setAttribute("class", "list small-user flex-left")
                comment_name.setAttribute("class", "text name")
                comment_name.textContent = cmn.name
                user_avatar.setAttribute("class", "avatar")
                if(cmn.avatar) avatar_img.setAttribute("src", cmn.avatar)
                avatar_img.setAttribute("alt", "user_poster")
                user_date.setAttribute("class", "flex-right")
                date_h3.setAttribute("class", "text time")
                date_h3.textContent = new Date(cmn.date).toLocaleString()
                comment_area.setAttribute("class", "commnet_area")
                comment_area.setAttribute("id", cmn._id)
                comment_text.setAttribute("class", "comment-text")
                comment_text.textContent = cmn.text
                user_avatar.appendChild(avatar_img)
                user_cotain.append(user_avatar,comment_name)
                user_date.appendChild(date_h3)
                user_comment.append(user_cotain,user_date)
                comment_area.appendChild(comment_text)
                put_comment.append(user_comment,comment_area)
                blog_holder.forEach(color =>{
                    if(color.querySelector(".blog_area").getAttribute('id') === data.bloger._id){
                        color.querySelector('.blog_comment .put_area').appendChild(put_comment)
                    }
                })
            }
        })
})
// 
socket.on('comment_liked-attack', (data) =>{
    const liked = data.like
    if((liked.like).length >=1){
        blog_holder.forEach( (roll,idx) =>{
            if(roll.querySelector(".blog_area").getAttribute('id') === liked._id){
                if(roll.querySelector('.blog_area .number-like'))
                {
                    roll.querySelector('.blog_area .number-like').textContent = liked.like.length
                }else{
                    const like_num = document.createElement('span')
                    like_num.setAttribute('class', 'number-like')
                    like_num.textContent = liked.like.length
                    roll.querySelector('.blog_area .blog_like').appendChild(like_num)
                    roll.querySelector('.blog_area .icon').setAttribute('class', 'icon')
                }
                liked.like.forEach(li =>{
                    if(roll.querySelector('.blog_area .icon') && li.user === headers){
                        roll.querySelector('.blog_area .icon').setAttribute('class', 'icon liked')
                    }else if(roll.querySelector('.blog_area .liked')){
                        roll.querySelector('.blog_area .liked').setAttribute('class', 'icon')
                    }
                })
            }
        })
    }else{
        blog_holder.forEach( (unroll) =>{
            if(unroll.querySelector(".blog_area").getAttribute('id') === liked._id)
            {
                if(unroll.querySelector('.blog_area .liked')){
                    unroll.querySelector('.blog_area .liked').setAttribute('class', 'icon')
                }
                unroll.querySelector('.blog_area').removeChild(unroll.querySelector('.blog_area .number-like'))
            }
        })
    }
})
socket.on('blog-friend_added', (data) =>{
    if(data.hasOwnProperty("error")){
            document.alert(data.error)
    }else{
        blog_holder.forEach(bl =>{
            if(data.id === bl.querySelector(".user_poster .text.name").getAttribute('id'))
            bl.querySelector(".user_poster .portal_blog").removeChild(bl.querySelector(".user_poster .portal_blog .adding_fr"))
        })
    }
})
socket.on('friend_NO', (data) =>{
    alert(`this user (${data.id}) have already been your friend `)
})