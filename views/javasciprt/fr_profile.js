// list to note/ blog
var list_blte = document.querySelector('.note_blog_body ul')
// list click
var req = new XMLHttpRequest();
req.open('GET', document.location, false);
req.send(null);
var headers = req.getResponseHeader("token");

if(document.querySelector(".put_comment .comment_setting")){
    var Blog_hadcomm = Array.from(document.querySelectorAll('.note_blog_body .blog_contrain'))
    var ONE = []
    var EDitcomment_btn = Array.from(document.querySelectorAll(".put_comment .comment_setting-Edit"))
    let EDitcomment_Popup = Array.from(document.querySelectorAll(".commentEdit-popUp"))
    let EDitcomment_close = Array.from(document.querySelectorAll('.put_comment .close'))
    EDitcomment_btn.forEach( (ed,i) =>{
        ed.addEventListener("click", () => {
            EDitcomment_Popup[i].style.display = "flex"
            // sort the thing can be effect
            Editonly_comment.forEach(it =>{
                let apply = Array.from(it.querySelectorAll('.comment_info'))
                apply.forEach( end =>{
                    if(end.querySelector('.comment_setting')){
                        // end.querySelector('.comment-text').querySelector('.comment-text').textContent = comment_data.comm
                        ONE.push(end.querySelector('.comment-text'))
                    }
                })
            })
        })
        window.addEventListener('click', (event) =>{
            if (event.target === EDitcomment_Popup[i].querySelector('.popup_content')) {
                EDitcomment_Popup[i].style.display = "none"
            }
            if (event.target === EDitcomment_close[i]) {
                EDitcomment_Popup[i].style.display = "none"
            }
        })
        // sent form
        const Editcommentform = Array.from(document.querySelectorAll('.popup_content .Edit_group'))
        Editcommentform[i].addEventListener('submit', async (data) =>{
            data.preventDefault()
            await fetch('/live/comment', {
                method: "PUT",
                headers: {
                'Content-Type': 'application/json',
                'token' : headers
                },
                body: JSON.stringify({
                    comm_id: Editcommentform[i].getAttribute('id'),
                    txt: Editcommentform[i].querySelector('#text textarea').value,
                })
            }).then( async (data) =>{
                const comment_data = await data.json()
                if(comment_data.hasOwnProperty('comm')){
                    ONE[i].textContent = comment_data.comm
                }
                if(comment_data.hasOwnProperty('break')){
                    ONE[i].textContent = ''
                }
                ONE = []
            })
        })
    })
   
    let Editonly_comment = []
    Blog_hadcomm.forEach(ed =>{
        if(ed.querySelector('.comment_setting')){
            Editonly_comment.push(ed.querySelector('.put_comment'))
        }
    })
    var TWO = []
    var Delecomment_btn = Array.from(document.querySelectorAll(".put_comment .comment_setting-Delete"))
    let dele_idList = []
    Blog_hadcomm.forEach( de =>{
        if(de.querySelector('.comment_setting')){
            dele_idList.push(de.querySelector('.put_comment'))
        }
    })
    Delecomment_btn.forEach( (de,i) =>{
        de.addEventListener('click', async ()=>{
            // sort the thing can be effect
            dele_idList.forEach(le =>{
                let apply = Array.from(le.querySelectorAll('.comment_info'))
                apply.forEach( end =>{
                    if(end.querySelector('.comment_setting')){
                        TWO.push(end.querySelector('.comment-text'))
                    }
                })
            })
            const Editcommentform = Array.from(document.querySelectorAll('.popup_content .Edit_group'))
            await fetch('/live/comment', {
                method: "DELETE",
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    comm_id: Editcommentform[i].getAttribute('id'),
                })
            }).then( async (data) =>{
                const comment_data = await data.json()
                console.log(comment_data)
                if(comment_data.hasOwnProperty('hi')){
                    TWO[i].textContent = ''
                }
                if(comment_data.hasOwnProperty('break')){
                    TWO[i].textContent = ''
                }
                TWO = []
            })
                    
        })
    })
}


// connect client-server
// var socket = io('/live/profile');
// when first connect

// click event 
// //form sent event
// // blog list
/* socket.on('non-blog-list', data =>{
    const blog_contrain = document.createElement('li')
    const blog_info = document.createElement('div')
    const blog_body = document.createElement('div')
    const blogtext = document.createElement('p')
    blogtext.textContent = data.indx
    blogtext.setAttribute('class', 'blog-text')
    blog_body.setAttribute('class', 'list blog_body')
    blog_body.append(blogtext)
    
    blog_info.setAttribute('class', 'blog_info')
    blog_info.append(blog_body)
    blog_contrain.setAttribute('class', 'blog_contrain')
    blog_contrain.append(blog_body)
    list_blte.appendChild(blog_contrain)
})
socket.on('blog-list', data =>{
    const blog = data.blog
       blog.forEach( list => {
            // check info
            // let check_fr_add = false

            // create note array list
            const blog_contrain = document.createElement('li')
            const blog_info = document.createElement('div')
            // blog header
            const blog_header = document.createElement('div')
            const userinfo = document.createElement('div')
            const blog_avatar = document.createElement('div')
            const blog_avatar_img = document.createElement("img")
            const blog_avatar_name = document.createElement('p')
            const blog_usertime = document.createElement('div')
            const blog_usertime_time = document.createElement('h3')
            const blog_setting = document.createElement('div')
            const setting_ionicon = document.createElement('ion-icon')
            const blog_settingcotrain = document.createElement('ul')
            const blog_settingEdit = document.createElement('li')
            const blog_settingDelete = document.createElement('li')
            blog_settingEdit.textContent = 'Edit'
            blog_settingEdit.setAttribute("class", "blog_setting-Edit")
            blog_settingDelete.textContent = "Delete"
            blog_settingDelete.setAttribute("class", "blog_setting-Delete")
            blog_settingcotrain.setAttribute("class", "list blog_setting-cotrain")
            blog_settingcotrain.append(blog_settingEdit,blog_settingDelete)
    
            setting_ionicon.setAttribute("name", "more")
            blog_setting.setAttribute("class", "blog_setting")
            blog_setting.append(setting_ionicon,blog_settingcotrain)
    
            blog_usertime_time.textContent = new Date(list.date).toLocaleString()
            blog_usertime_time.setAttribute('class', 'flex-middle text time')
            blog_usertime.setAttribute("class", "flex-middle list user-time")
            blog_usertime.append(blog_usertime_time,blog_setting)
    
            blog_avatar_name.textContent = list.name
            blog_avatar_name.setAttribute("class", "flex-middle text name")
            if(list.avatar){
                blog_avatar_img.setAttribute("src", list.avatar)
            }else{
                blog_avatar_img.setAttribute("src", '../../views/img/back_ground.jpg')
            }
            
            blog_avatar_img.setAttribute("alt", "user avatar")
            blog_avatar.appendChild(blog_avatar_img)
            blog_avatar.setAttribute("class", "avatar")
            
            userinfo.setAttribute("class", "list user-info")
            userinfo.append(blog_avatar,blog_avatar_name)
            blog_header.setAttribute("class", "blog_header")
            blog_header.append(userinfo,blog_usertime)
            // blog body
            const blog_body = document.createElement('div')
            const blogtext = document.createElement('p')
            const blog_img = document.createElement('div')
            
            const blog_like = document.createElement('div')
            const numberlike = document.createElement('span')
            const numberlike_ionicon = document.createElement('ion-icon')
            numberlike_ionicon.setAttribute("name", "thumbs-up")
            numberlike.textContent = list.like.length
            numberlike.setAttribute("class", "number-like")
            blog_like.setAttribute("class", "list blog_like")
            blog_like.append(numberlike,numberlike_ionicon)
    
            list.picture.forEach(img =>{
                const blog_img_img = document.createElement("img")
                blog_img_img.setAttribute("src", img.img)
                blog_img_img.setAttribute("alt", "img posted")
                blog_img.setAttribute("class", "blog_img")
                blog_img.append(blog_img_img)
                
            })
            // blog_img.setAttribute("class", "blog_img")
            
    
            blogtext.textContent = list.text
            blogtext.setAttribute('class', 'blog-text')
            blog_body.setAttribute('class', 'list blog_body')
            blog_body.append(blogtext,blog_img,blog_like)
            
            blog_info.setAttribute('class', 'blog_info')
            blog_info.append(blog_header,blog_body)

            // comment
            const blog_comment = document.createElement('div')
            const put_comment = document.createElement('ul')
            list.comments.forEach(cmn =>{
                const comment_info = document.createElement('li')
                // comment head
                const commnet_header = document.createElement('div')
                const commentinfo = document.createElement('div')
                
                const comment_usertime = document.createElement('div')
                const comment_usertime_time = document.createElement('h3')
                if(cmn.user === headers){
                    const comment_setting = document.createElement('div')
                    const comment_setting_ionicon = document.createElement('ion-icon')
                    const comment_settingcotrain = document.createElement('ul')
                    const comment_settingEdit = document.createElement('li')
                    const comment_settingDelete = document.createElement('li')
                    comment_settingEdit.textContent = 'Edit'
                    comment_settingEdit.setAttribute("class", "comment_setting-Edit")
                    comment_settingDelete.textContent = 'Delete'
                    comment_settingDelete.setAttribute("class", "comment_setting-Delete")
                    comment_settingcotrain.setAttribute("class", "list comment_setting-cotrain")
                    comment_settingcotrain.append(comment_settingEdit,comment_settingDelete)
    
                    comment_setting_ionicon.setAttribute("name", "more")
                    comment_setting.setAttribute("class", "comment_setting")
                    comment_setting.append(comment_setting_ionicon,comment_settingcotrain)
                    
                    comment_usertime_time.textContent = new Date(cmn.date).toLocaleTimeString()
                    comment_usertime_time.setAttribute('class', 'flex-middle text time')
                    comment_usertime.setAttribute("class", "comment-time list comment_key")
                    comment_usertime.append(comment_usertime_time,comment_setting)
                }else{
                    comment_usertime_time.textContent = new Date(cmn.date).toLocaleTimeString()
                    comment_usertime_time.setAttribute('class', 'text time')
                    comment_usertime.setAttribute("class", "flex-middle comment-time")
                    comment_usertime.appendChild(comment_usertime_time)
                }
                
                const comment_avatar = document.createElement('div')
                const comment_avatar_img = document.createElement("img")
                const comment_avatar_name = document.createElement('p')
    
                comment_avatar_name.textContent = cmn.name
                comment_avatar_name.setAttribute("class", "flex-middle text name")

                comment_avatar_img.setAttribute("src", cmn.avatar)
                comment_avatar_img.setAttribute("alt", "other user avatar")
                comment_avatar.setAttribute("class",  "avatar")
                comment_avatar.appendChild(comment_avatar_img)
                
                commentinfo.setAttribute("class", "list flex-left comment-info")
                commentinfo.append(comment_avatar,comment_avatar_name,blog_fr_making)
                
                commnet_header.setAttribute("class", "list commnet_header")
                commnet_header.append(commentinfo,comment_usertime)
                
                // oommment body
                const comment_body = document.createElement('div')
                const commenttext = document.createElement('p')
                commenttext.textContent = cmn.text
                commenttext.setAttribute("class", "comment-text")
                comment_body.setAttribute("class", "comment_body")
                comment_body.appendChild(commenttext)
    
                comment_info.setAttribute("class", "comment_info")
                comment_info.setAttribute('id', cmn._id)
                comment_info.append(commnet_header,comment_body)
                
                put_comment.appendChild(comment_info)
            })
            put_comment.setAttribute("class", "put_comment list")
            
            blog_comment.setAttribute("class", "blog_comment")
            blog_comment.appendChild(put_comment)
            
            blog_contrain.setAttribute("class", "blog_contrain")
            blog_contrain.setAttribute('id', list._id)
            blog_contrain.append(blog_info, blog_comment)
            list_blte.appendChild(blog_contrain)
        })
}) */