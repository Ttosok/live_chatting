var Seaching = document.querySelector('.searching_engi')

if(document.querySelector(".user_list_body .edit")){
    var UesrEditbtn = Array.from(document.querySelectorAll(".user_list_body .edit"))
    var UserEditpopUp = Array.from(document.querySelectorAll(".user_info-popUp"))
    var Userclose = Array.from(document.querySelectorAll(".user_info-popUp .close"))
    UesrEditbtn.forEach( (ed,i) =>{
        ed.addEventListener("click", () => {
            UserEditpopUp[i].style.display = "flex"
        })
        window.addEventListener('click', (event) =>{
            if (event.target === UserEditpopUp[i].querySelector('.popup_content')) {
                UserEditpopUp[i].style.display = "none"
            }
            if (event.target === Userclose[i]) {
                UserEditpopUp[i].style.display = "none"
            }
        })
        // change img
        var Posted_img = UserEditpopUp[i].querySelector('.User_group .img_select')
        var img_showed = UserEditpopUp[i].querySelector('.User_group .user_img-edit')
        // event imh get
        if(Posted_img){
            Posted_img.addEventListener("change", function() {
                const file = this.files[0]
                if(file)
                {
                    const reader = new FileReader()
                    reader.addEventListener("load", function() {
                        img_showed.setAttribute('src', this.result)
                    })
                    reader.readAsDataURL(file)
                }
            })
        }
        // send form
        const UserEditform = Array.from(document.querySelectorAll('.popup_content .User_group'))
        UserEditform[i].addEventListener('submit', async (data) =>{
            data.preventDefault()
            UserEditform[i].querySelector('.email_error').textContent = ''
            UserEditform[i].querySelector('.Oldpass_error').textContent = ''
            UserEditform[i].querySelector('.Newpass_error').textContent = ''

            await fetch('/control/user_setting', {
                method: "PUT",
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: UserEditform[i].getAttribute('id'),
                    email: UserEditform[i].querySelector('#email input').value,
                    OldPass: UserEditform[i].querySelector('#Oldpassword input').value,
                    NewPass: UserEditform[i].querySelector('#Newpassword input').value,
                    avatar: UserEditform[i].querySelector('.user_img-edit').getAttribute('src')
                })
            }).then( async (data) =>{
                const user_data = await data.json()
                if(user_data.hasOwnProperty('errors')){
                    user_data.errors.forEach(er =>{
                        if(er.param === "email")
                        UserEditform[i].querySelector('.email_error').textContent = er.msg
                        if(er.param === "OldPass")
                        UserEditform[i].querySelector('.Oldpass_error').textContent = er.msg
                        if(er.param === "NewPass")  
                        UserEditform[i].querySelector('.Newpass_error').textContent = er.msg
                    })
                }
                if(user_data.hasOwnProperty("error")){
                    UserEditform[i].querySelector('.Oldpass_error').textContent = user_data.error
                }
                if(user_data.hasOwnProperty("break")){
                    infoUser_changed[i].textContent = ''
                }
                if(user_data.hasOwnProperty("info_id")){
                    // console.log(infoUser_changed[i].querySelector('.email_user').textContent)
                    infoUser_changed[i].querySelector('.email_user').textContent = user_data.info_id.email
                    infoUser_changed[i].querySelector('.avatar img').setAttribute('src', user_data.info_id.avatar)
                }
            }).catch(err => {console.log(err)})
        })
    })
    // body info
    let Contain_userList = document.querySelector('.user_list_body')
    let infoUser_changed = Array.from(document.querySelectorAll('.user_list_body .user_info'))
    if(Seaching.querySelector('input')){
        Seaching.addEventListener('keyup', async (data) =>{
            if(data.keyCode === 13) {
                data.preventDefault()
                
                for(let u = 0; u < infoUser_changed.length; u++) {
                    if((infoUser_changed[u].querySelector(".user_name").textContent.trim()).includes((Seaching.querySelector('input').value).trim()))
                    {
                        // console.log(infoUser_changed[u].querySelector(".user_name").textContent.trim())
                        infoUser_changed.unshift((infoUser_changed.splice(u, 1))[0])
                    }
                }
                infoUser_changed.forEach(us =>{
                    Contain_userList.appendChild(us)
                    // console.log(us)
                })
                UesrEditbtn = Array.from(document.querySelectorAll(".user_list_body .edit"))
                UserEditpopUp = Array.from(document.querySelectorAll(".user_info-popUp"))
                Userclose = Array.from(document.querySelectorAll(".user_info-popUp .close"))
                Seaching.querySelector('input').value = ''
            }
        })
    }
}
if(document.querySelector(".user_list_body .delete")){
    var DeleteUser_list = Array.from(document.querySelectorAll(".user_list_body .delete"))
    let begoneEdit = Array.from(document.querySelectorAll(".user_info-popUp"))
    let infoUser_changed = Array.from(document.querySelectorAll('.user_list_body .user_info'))
    DeleteUser_list.forEach( (de,i) =>{
        de.addEventListener('click', async () =>{
            console.log(de)
            console.log(infoUser_changed[i])
            console.log(begoneEdit[i])
            const UserEditform = Array.from(document.querySelectorAll('.popup_content .User_group'))
            console.log(UserEditform[i].getAttribute('id'))
            
            await fetch('/control/user_setting', {
                method: "DELETE",
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: UserEditform[i].getAttribute('id')
                })
            }).then( async (data) =>{
                const user_data = await data.json()
                console.log(user_data)
                if(user_data.hasOwnProperty("break")){
                    infoUser_changed[i].textContent = ''
                }
                if(user_data.hasOwnProperty("gone_user")){
                    window.location.href = document.location
                }
            }).catch(err => {console.log(err)})
        })
    })
}
// this for the comment
if(document.querySelector(".put_comment .comment_setting-Edit")){
    var EDitcomment_btn = Array.from(document.querySelectorAll(".put_comment .comment_setting-Edit"))
    let EDitcomment_Popup = Array.from(document.querySelectorAll(".commentEdit-popUp"))
    let EDitcomment_close = Array.from(document.querySelectorAll('.put_comment .close'))
    EDitcomment_btn.forEach( (ed,i) =>{
        ed.addEventListener("click", () => {
            EDitcomment_Popup[i].style.display = "flex"
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
            // console.log(Editcommentform[i].querySelector('#text textarea').value)

            await fetch('/control/comment', {
                method: "PUT",
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: Editcommentform[i].getAttribute('id'),
                    txt: Editcommentform[i].querySelector('#text textarea').value,
                })
            }).then( async (data) =>{
                const comment_data = await data.json()
                if(comment_data.hasOwnProperty('comm')){
                    txtComment_changed[i].querySelector('.comment-text').textContent = comment_data.comm
                }
                if(comment_data.hasOwnProperty('break')){
                    txtComment_changed[i].textContent = ''
                }
            })
        })
    })
    let txtComment_changed = Array.from(document.querySelectorAll('.put_comment .comment_body'))
}
if(document.querySelector(".put_comment .comment_setting-Delete")){
    var Delecomment_btn = Array.from(document.querySelectorAll(".put_comment .comment_setting-Delete"))
    let dele_idList = Array.from(document.querySelectorAll('.put_comment .comment_info'))
    Delecomment_btn.forEach((de,i) =>{
        de.addEventListener('click', async()=>{
            await fetch('/control/comment', {
                method: "DELETE",
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: dele_idList[i].getAttribute('id'),
                })
            }).then( async (data) =>{
                const comment_data = await data.json()
                if(comment_data.hasOwnProperty('hi')){
                    dele_idList[i].textContent = ''
                }
                if(comment_data.hasOwnProperty('break')){
                    dele_idList[i].textContent = ''
                }
            })
        })
    })
}
if(document.querySelector(".blog_contrain .blog_setting-Delete")){
    var Deleblog_btn = Array.from(document.querySelectorAll(".blog_contrain .blog_setting-Delete"))
    let dele_idList = Array.from(document.querySelectorAll('.blog_contrain .blog_contain'))
    Delecomment_btn.forEach((de,i) =>{
        de.addEventListener('click', async()=>{
            await fetch('/control/blog/delete', {
                method: "DELETE",
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: dele_idList[i].getAttribute('id'),
                })
            }).then( async (data) =>{
                const comment_data = await data.json()
                if(comment_data.hasOwnProperty('hi')){
                    dele_idList[i].textContent = ''
                }
                if(comment_data.hasOwnProperty('break')){
                    dele_idList[i].textContent = ''
                }
            })
        })
    })
}