var email_input = document.getElementById('email')
var pass_input = document.getElementById('Pass')
var name_input = document.getElementById('name')
var repass_input = document.getElementById('rePass')
var error_email = document.getElementById("siginEmail")
var error_pass = document.getElementById("siginPass")
var error_name = document.getElementById("siginName")
var error_repass = document.getElementById("siginRepass")

// button for evnt click
var login = document.querySelector('.login')
var signup = document.querySelector('.signup')
// form for submit
var form = document.querySelector('.form form')
// event using img
var Posted_img = document.querySelector('.img-input #img_select')
var img_showed = document.querySelector('.img-input .per_show-img')
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

// login event
login.addEventListener('click', () =>{
    form.addEventListener('submit', async(data) =>{
        data.preventDefault()
        // console.log("login")

        const email = email_input.value
        const pass = pass_input.value
        error_email.textContent = ""
        error_pass.textContent = ""
        const send_data = await fetch('/' , {
            method: "POST",
            redirect: "follow",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                pass: pass
            })
        })
        if(send_data.redirected){
            window.location.href = send_data.url
        }
        // data convert
        const data_collect = await send_data.json()
        // console.log(data_collect)
        // input error
        if(data_collect.hasOwnProperty('errors')){
            data_collect.errors.forEach( async (call) => {
                switch(call.param){
                    case "email": {
                        error_email.textContent = call.msg
                        break
                    }
                    case "pass":{
                        error_pass.textContent = call.msg
                        break
                    }
                }
            });
        }
        // data error
        if(data_collect.hasOwnProperty('email')){
            error_email.innerHTML = data_collect.email
        }
    })
})
// sginup event
signup.addEventListener('click', () =>{
    form.addEventListener('submit', async(data) =>{
        data.preventDefault()
        error_email.textContent =""
        error_name.textContent =""
        error_pass.textContent =""
        error_repass.textContent =""

        if(img_showed.getAttribute('src') !== ""){
            hinhAnh = img_showed.getAttribute('src')
        }
        const name = name_input.value
        const email = email_input.value
        const pass = pass_input.value
        const repass = repass_input.value
        const send_data = await fetch('/signup' , {
            method: "POST",
            redirect: "follow",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                avatar: hinhAnh,
                pass: pass,
                repass: repass
            })
        })
        if(send_data.redirected){
            window.location.href = send_data.url
        }
        // data convert
        const data_collect = await send_data.json()
        // console.log(data_collect)
        // console.log("data sending ----------------------------------")
        // console.log(send_data.redirected)
        // console.log("body  ----------------------------------")
        // console.log(send_data.url)
        // console.log("off limted  ----------------------------------")
        // input error
        if(data_collect.hasOwnProperty('errors')){
            data_collect.errors.forEach( async (call) => {
                switch(call.param){
                    case "email": {
                        error_email.innerHTML = call.msg
                        break
                    }
                    case "name":{
                        error_name.innerHTML = call.msg
                        break
                    }
                    case "pass":{
                        error_pass.innerHTML = call.msg
                        break
                    }
                    case "repass":{
                        error_repass.innerHTML = call.msg
                        break
                    }
                }
                // console.log(call)
            });
        }
        // database error
        if(data_collect.hasOwnProperty('email')){
            error_email.textContent = data_collect.email
        }
        if(data_collect.hasOwnProperty('name')){
            error_name.textContent = data_collect.name
        }
        if(data_collect.hasOwnProperty("pass")){
            error_repass.textContent = data_collect.pass
            error_pass.textContent = data_collect.pass
        }
    })
})


// console.log('testing hello')