// create note
// note pop up
if(document.querySelector('.note-short .Note_popup .Note_group')){
    var btnnote_maker = document.querySelector('.note-short')
    var NotepopUp = document.querySelector(".note-short .Note_popup");
    var Noteclose = document.querySelector(".note-short .Note_popup .close");
    btnnote_maker.addEventListener("click", () => {
        NotepopUp.style.display = "flex"
    })
}
// user pop up
var btnuser_edit = document.querySelector('.user-short')
var UserpopUp = document.querySelector(".User_popup");
var Userclose = document.querySelector(".User_popup .close");
btnuser_edit.addEventListener("click", () => {
    UserpopUp.style.display = "flex"
})

// img
var Posted_img = document.querySelector('.User_popup #img_select')
var img_showed = document.querySelector('.User_popup .user_img-edit')
var hinhAnh = null
// event imh get
if(Posted_img){
    Posted_img.addEventListener("change", function() {
        const file = this.files[0]
        if(file)
        {
            const reader = new FileReader()
            reader.addEventListener("load", function() {
                img_showed.setAttribute('src', this.result)
                hinhAnh = this.result
            })
            reader.readAsDataURL(file)
        }
    })
}
window.onclick = function(event) {
    if(document.querySelector('.note-short .Note_popup .Note_group')){
        if (event.target === NotepopUp.querySelector('.popup_content')) {
            NotepopUp.style.display = "none"
        }
        if (event.target === Noteclose) {
            NotepopUp.style.display = "none"
        }
    }
    if(document.querySelector('.user-short .User_popup')){
        if (event.target === UserpopUp.querySelector('.popup_content')) {
            UserpopUp.style.display = "none"
        }
        if (event.target === Userclose) {
            UserpopUp.style.display = "none"
        }
    }
}
// var url = window.location.href
// const data_path = (new URL(url)).pathname

if(document.querySelector('.note-short .Note_popup .Note_group')){
    const Note_form = NotepopUp.querySelector('.Note_group')
    Note_form.addEventListener('submit', async (data) =>{
        data.preventDefault()

        const note_text = NotepopUp.querySelector('#MakeNote_text').value.trim()
        const send_data = await fetch('/live/profile/note', {
            method: "POST",
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
        })
    })
}
const User_Edit = UserpopUp.querySelector('.User_group')
User_Edit.addEventListener('submit', async (data) =>{
    data.preventDefault()
    UserpopUp.querySelector('#email .errors-email').textContent = ""
    UserpopUp.querySelector('#Oldpassword .errors-Oldpass').textContent = ''
    UserpopUp.querySelector('#Newpassword .errors-Newpass').textContent = ''

    const edit_email = UserpopUp.querySelector('#email .User_area-txt').value.trim()
    const OldPass = UserpopUp.querySelector('#Oldpassword .User_area-txt').value.trim()
    const NewPass = UserpopUp.querySelector('#Newpassword .User_area-txt').value.trim()

    const send_data = await fetch('/live/profile/setting/user', {
        method: "PUT",
        headers: {
        'Content-Type': 'application/json',
        'token' : headers
        },
        body: JSON.stringify({
            email: edit_email,
            OldPass: OldPass,
            NewPass: NewPass,
            avatar: hinhAnh
        })
    }).then( async ()=>{
        // making error show up
        const data_collect = await data.json()
        if(data_collect.hasOwnProperty('errors')){
            data_collect.forEach(er =>{
                if(er.param === "email")
                UserpopUp.querySelector('#email .errors-email').textContent = er.msg
                if(er.param === "OldPass")
                UserpopUp.querySelector('#Oldpassword .errors-Oldpass').textContent = er.msg
                if(er.param === "NewPass")  
                UserpopUp.querySelector('#Newpassword .errors-Newpass').textContent = er.msg
            })
        }
        if(data_collect.hasOwnProperty('break')){
            UserpopUp.querySelector('#Oldpassword .errors-Oldpass').textContent = data_collect.break
        }
        if(data_collect.hasOwnProperty('hi'))
        window.location.href = document.location
    })

})