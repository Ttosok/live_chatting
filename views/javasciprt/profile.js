// list to note/ blog
var list_blte = document.querySelector('.note_blog_body ul')
// click call
var click_note = document.querySelector(".note_blog_header ul .note-only")
var click_blog = document.querySelector(".note_blog_header ul .blog-only")
// list click
var note_blog_list = document.querySelector('.note_blog_body ul')


// connect client-server
var socket = io('/live/profile');
// when first connect
var req = new XMLHttpRequest();
req.open('GET', document.location, false);
req.send(null);
var headers = req.getResponseHeader("token");
// click event 
click_note.addEventListener('click', (e,idx) =>{
    // console.log(note_blog_list)
    socket.emit('note_click', {
        id: headers
    })
    list_blte.textContent = ''
})
click_blog.addEventListener('click', (e,idx) =>{
    socket.emit('blog_click', {
        id: headers
    })
    list_blte.textContent = ''
})

//form sent event
if(document.querySelector('.note_setting-Edit .Note_group')){
    var btnnote_edit = Array.from(document.querySelectorAll('.note_setting-Edit'))
    var NoteEditpopUp =  Array.from(document.querySelectorAll(".note_setting-Edit .Note_popup"))
    var NoteEditclose =  Array.from(document.querySelectorAll(".note_setting-Edit .Note_popup .close"))
    var btnnote_delete = Array.from(document.querySelectorAll('.note_setting-Delete'))
    btnnote_edit.forEach( (Ednote,idx) =>{
        Ednote.addEventListener("click", () => {
            NoteEditpopUp[idx].style.display = "flex"
        })
        // gobal click effect
        window.addEventListener('click', event => {
            if (event.target === NoteEditpopUp[idx].querySelector('.popup_content')) {
                NoteEditpopUp[idx].style.display = "none"
            }
            if (event.target === NoteEditclose[idx]) {
                NoteEditpopUp[idx].style.display = "none"
            }
        })
        btnnote_delete[idx].addEventListener('click', async () =>{
            const dele_id = Note_id[idx].getAttribute('id')
            await fetch('/live/profile/note', {
                method: "DELETE",
                headers: {
                'Content-Type': 'application/json',
                'token' : headers
                },
                body: JSON.stringify({
                    id : dele_id
                })
            }).then( ()=>{
                window.location.href = document.location
            })
        })
    })
    var Note_id = Array.from(document.querySelectorAll('.note_contrain'))
    const NoteEdit_form =  Array.from(document.querySelectorAll('.note_setting-Edit .Note_popup .Note_group'))
    NoteEdit_form.forEach((edit_form,idx) =>{
        edit_form.addEventListener('submit', async (data) =>{
            data.preventDefault()
            
            const note_txt = edit_form.querySelector('.Note_text').value.trim()
            const edit_id = Note_id[idx].getAttribute('id')
            socket.emit('note-edit',{
                id: headers,
                note_id: edit_id,
                txt: note_txt
            })
            NoteEditpopUp[idx].style.display = "none"
            /* const send_data = await fetch('/live/profile/note', {
                method: "PUT",
                redirect: "follow",
                headers: {
                'Content-Type': 'application/json',
                'token' : headers
                },
                body: JSON.stringify({
                    text : note_text
                })
            }).then( ()=>{
                window.location.href = document.location
            }) */
        })
    })
    
}
// connect server-client
// note list
socket.on('non-note-list', data =>{
    const note_contrain = document.createElement('li')
    const note_body = document.createElement('div')
    const text = document.createElement('p')
    text.textContent = data.indx
    text.setAttribute('class', 'note-text')
    note_body.setAttribute('class', 'note_body')
    note_body.appendChild(text)
    note_contrain.setAttribute('class', 'note_contrain')
    note_contrain.append(note_body)
    list_blte.appendChild(note_contrain)
})
socket.on('note-list', data =>{
    data.note.forEach( list => {
        // create note array list
        const note_contrain = document.createElement('li')
        const note_header = document.createElement('div')
        const note_header_info = document.createElement('div')
        const date = document.createElement('p')
        const note_body = document.createElement('div')
        const note_area = document.createElement('div')
        const text = document.createElement('p')
        date.textContent = new Date(list.date).toLocaleTimeString()
        date.setAttribute('class', 'time')
        note_header_info.setAttribute("class", "flex-middle")
        note_header_info.appendChild(date)
        note_header.setAttribute("class", "note_header list")
        note_header.appendChild(note_header_info)
        text.textContent = list.text
        text.setAttribute('class', 'note-text')
        note_area.setAttribute('class', 'note_area')
        note_area.appendChild(text)
        note_body.setAttribute('class', 'note_body')
        note_body.appendChild(note_area)
        note_contrain.setAttribute('class', 'note_contrain')
        note_contrain.setAttribute('id', list._id)
        note_contrain.append(note_header, note_body)
        list_blte.appendChild(note_contrain)
    });
})
socket.on('refesh-note', data =>{
    Note_id.forEach(nt =>{
        if(nt.getAttribute('id') === data.id)
        nt.querySelector('.note-text').textContent = data.note
    })
})
// blog list
socket.on('non-blog-list', data =>{
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
    // console.log(data)
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
            const blog_settingEdit_link = document.createElement('a')
            const blog_settingDelete = document.createElement('li')
            blog_settingEdit_link.textContent = 'Edit'
            blog_settingEdit_link.setAttribute('href', `/live/profile/${list.name}/${list._id}/edit`)
            blog_settingEdit.appendChild(blog_settingEdit_link)
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
                // if(cmn.user === headers){
                //     const comment_setting = document.createElement('div')
                //     const comment_setting_ionicon = document.createElement('ion-icon')
                //     const comment_settingcotrain = document.createElement('ul')
                //     const comment_settingEdit = document.createElement('li')
                //     const comment_settingDelete = document.createElement('li')
                //     comment_settingEdit.textContent = 'Edit'
                //     comment_settingEdit.setAttribute("class", "comment_setting-Edit")
                //     comment_settingDelete.textContent = 'Delete'
                //     comment_settingDelete.setAttribute("class", "comment_setting-Delete")
                //     comment_settingcotrain.setAttribute("class", "list comment_setting-cotrain")
                //     comment_settingcotrain.append(comment_settingEdit,comment_settingDelete)
    
                //     comment_setting_ionicon.setAttribute("name", "more")
                //     comment_setting.setAttribute("class", "comment_setting")
                //     comment_setting.append(comment_setting_ionicon,comment_settingcotrain)
                    
                //     comment_usertime_time.textContent = new Date(cmn.date).toLocaleTimeString()
                //     comment_usertime_time.setAttribute('class', 'flex-middle text time')
                //     comment_usertime.setAttribute("class", "comment-time list comment_key")
                //     comment_usertime.append(comment_usertime_time,comment_setting)
                // }else{
                    comment_usertime_time.textContent = new Date(cmn.date).toLocaleTimeString()
                    comment_usertime_time.setAttribute('class', 'text time')
                    comment_usertime.setAttribute("class", "flex-middle comment-time")
                    comment_usertime.appendChild(comment_usertime_time)
                // }
                
                const comment_avatar = document.createElement('div')
                const comment_avatar_img = document.createElement("img")
                const comment_avatar_name = document.createElement('p')
    
                const blog_fr_making = document.createElement('ul')
                for (let i = 0; i < data.user.friends.length; i++) {
                    if(data.user.friends[i].user === cmn.user){
                        const fr_info = document.createElement('li')
                        const fr_info_a = document.createElement('a')
                        fr_info_a.setAttribute('href', `/live/profile/${data.user.name}/${cmn.name}`)
                        fr_info_a.textContent = "user info"
                        fr_info_a.style.color = "#E4E6EB"
                        fr_info.appendChild(fr_info_a)
                        fr_info.setAttribute("class", "fr_info")
                        blog_fr_making.setAttribute("class", "blog_fr_making")
                        blog_fr_making.append(fr_info)
                        break;
                    }else{
                        const fr_info = document.createElement('li')
                        const fr_info_a = document.createElement('a')
                        fr_info_a.setAttribute('href', `/live/profile/${data.user.name}/${cmn.name}`)
                        fr_info_a.textContent = "alien info"
                        fr_info_a.style.color = "#E4E6EB"
                        fr_info.appendChild(fr_info_a)
                        fr_info.setAttribute("class", "fr_info")
                        blog_fr_making.setAttribute("class", "blog_fr_making")
                        blog_fr_making.append(fr_info)
                        break;
                    }
                }
                
                comment_avatar_name.textContent = cmn.name
                comment_avatar_name.setAttribute("class", "flex-middle text name")
                if(cmn.avatar){
                    comment_avatar_img.setAttribute("src", `${cmn.avatar} `)
                }else{
                    comment_avatar_img.setAttribute("src", ` `)
                }
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

    if(document.querySelector(".note_blog_body .blog_header .blog_setting")){
        var Delecomment_btn = Array.from(document.querySelectorAll(".blog_contrain .blog_setting-Delete"))
        let Blog_contain = Array.from(document.querySelectorAll('.blog_contrain'))
        // Blog_hadcomm.forEach( de =>{
        //     if(de.querySelector('.comment_setting')){
        //         dele_idList.push(de.querySelector('.put_comment'))
        //     }
        // })
        Delecomment_btn.forEach( (de,i) =>{
            de.addEventListener('click', async ()=>{
                // sort the thing can be effect
                await fetch('/live/blog/delete', {
                    method: "DELETE",
                    headers: {
                    'Content-Type': 'application/json',
                    'token': headers
                    },
                    body: JSON.stringify({
                        blog_id: Blog_contain[i].getAttribute('id'),
                    })
                }).then( async (data) =>{
                    const comment_data = await data.json()
                    if(comment_data.hasOwnProperty('hi')){
                        Blog_contain[i].textContent = ''
                    }
                    if(comment_data.hasOwnProperty('break')){
                        Blog_contain[i].textContent = ''
                    }
                })
            })
        })
    }
})