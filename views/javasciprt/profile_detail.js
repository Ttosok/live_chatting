if(document.querySelector(".profile_Edit")){
    var Editbtn = document.querySelector(".profile_Edit");
    var EditpopUp = document.querySelector(".Edit_popup");
    var Editclose = document.querySelector(".Edit_popup .close");
    Editbtn.addEventListener("click", () => {
        EditpopUp.style.display = "flex"
    })
}
if(document.querySelector(".profile_Create")){
    var Createbtn = document.querySelector(".profile_Create");
    var CreatepopUp = document.querySelector(".Create_popup");
    var Createclose = document.querySelector(".Create_popup .close");
    Createbtn.addEventListener("click", () => {
        CreatepopUp.style.display = "flex"
    })
}
if(document.getElementById("Social_Create")){
    var Social_btn = document.getElementById("Social_Create");
    var Social_popUp = document.querySelector(".Social_Create_popup");
    var Social_close = document.querySelector(".Social_Create_popup .close");
    Social_btn.addEventListener("click", () => {
        Social_popUp.style.display = "flex"
    })
}
if(document.getElementById("Education_ArrayCreate")){
    var Edu_Addbtn = document.getElementById("Education_ArrayCreate");
    var Edu_AddpopUp = document.querySelector(".Education_popup");
    var Edu_Addclose = document.querySelector(".Education_popup .close");
    Edu_Addbtn.addEventListener("click", () => {
        Edu_AddpopUp.style.display = "flex"
    })
}

window.addEventListener('click', (event) =>{
    if (event.target === EditpopUp.querySelector('.popup_content')) {
        EditpopUp.style.display = "none"
    }
    if (event.target === Editclose) {
        EditpopUp.style.display = "none"
    }
    if (event.target === CreatepopUp.querySelector('.popup_content')) {
        CreatepopUp.style.display = "none"
    }
    if (event.target === Createclose) {
        CreatepopUp.style.display = "none"
    }
    if (event.target === Social_popUp.querySelector('.popup_content')) {
        Social_popUp.style.display = "none"
    }
    if (event.target === Social_close) {
        Social_popUp.style.display = "none"
    }
    if (event.target === Edu_AddpopUp.querySelector('.popup_content')) {
        Edu_AddpopUp.style.display = "none"
    }
    if (event.target === close) {
        Edu_AddpopUp.style.display = "none"
    }
})
var req = new XMLHttpRequest();
req.open('GET', document.location, false);
req.send(null);
var headers = req.getResponseHeader("token");
// event of file get send
// calling form input
if(document.querySelector('.Create_popup .profile_group'))  {
    var Create_form = document.querySelector('.Create_popup .profile_group')
    // create
    Create_form.addEventListener('submit', async (data) =>{
        data.preventDefault()

        Create_form.querySelector('#status .errors-status').textContent = ''
        Create_form.querySelector('#school .errors-school').textContent = ''
        Create_form.querySelector('#school .errors-degree').textContent = ''
        Create_form.querySelector('#school .errors-fieldofstudy').textContent = ''
        Create_form.querySelector('#school .errors-date').textContent = ''
        // calling vaule
        const location = Create_form.querySelector('#location .profileDetail_body-txt').value.trim()
        const status = Create_form.querySelector('#status .profileDetail_body-txt').value.trim()
        const bio = Create_form.querySelector('#bio .profileDetail_body-txt').value.trim()
        const nick_name = Create_form.querySelector('#nick_name .profileDetail_body-txt').value.trim()
        // education
        const school = Create_form.querySelector('#school .profileDetail_body-txt').value.trim()
        const degree = Create_form.querySelector('#degree .profileDetail_body-txt').value.trim()
        const fieldofstudy = Create_form.querySelector('#fieldofstudy .profileDetail_body-txt').value.trim()
        const date_from = Create_form.querySelector('#date .profileDetail_body-txt#from ').value.trim()
        const date_to = Create_form.querySelector('#date .profileDetail_body-txt#to ').value.trim()
        const description = Create_form.querySelector('#description .profileDetail_body-txt').value.trim()
        let education ={
            school: school,
            degree: degree,
            fieldofstudy: fieldofstudy,
            from: date_from,
            to: date_to,
            description: description
        }
        // social
        const youtube = Create_form.querySelector('#youtube .profileDetail_body-txt').value.trim()
        const twitter = Create_form.querySelector('#twitter .profileDetail_body-txt').value.trim()
        const facebook = Create_form.querySelector('#facebook .profileDetail_body-txt').value.trim()
        const linkin = Create_form.querySelector('#linkin .profileDetail_body-txt').value.trim()
        let social={
            youtube: youtube,
            twitter: twitter,
            facebook: facebook,
            linkin: linkin
        }
        const send_data = await fetch('/live/profile/about', {
            method: "POST",
            headers: {
            'Content-Type': 'application/json',
            'token' : headers
            },
            body: JSON.stringify({
                location: location,
                nick_name: nick_name,
                status: status,
                bio: bio,
                education: education,
                social: social
            })
        }).then(async (data)=>{
            const data_collect = await data.json()
            if(data_collect.hasOwnProperty('errors'))
            {
                data_collect.errors.forEach(er =>{
                    if(er.param === "status")
                    Create_form.querySelector('#status .errors-status').textContent = er.msg
                  })
            }
            if(data_collect.hasOwnProperty('break'))
            {
                if(data_collect.break.school)
                Create_form.querySelector('#school .errors-school').textContent = data_collect.break.school
                if(data_collect.break.degree)
                Create_form.querySelector('#school .errors-degree').textContent = data_collect.break.degree
                if(data_collect.break.fieldofstudy)
                Create_form.querySelector('#school .errors-fieldofstudy').textContent = data_collect.break.fieldofstudy
                if(data_collect.break.from)
                Create_form.querySelector('#school .errors-date').textContent = data_collect.break.from
            }
            if(data_collect.hasOwnProperty('hi')){
                window.location.href =document.location
            }
        })
    })
}
if(document.querySelector('.Edit_popup .profile_group')) {
    var Edit_form = document.querySelector('.Edit_popup .profile_group')
    // edit
    Edit_form.addEventListener('submit', async (data) =>{
        data.preventDefault()
        // calling vaule
        const location = Edit_form.querySelector('#location .profileDetail_body-txt').value.trim()
        const status = Edit_form.querySelector('#status .profileDetail_body-txt').value.trim()
        const bio = Edit_form.querySelector('#bio .profileDetail_body-txt').value.trim()
        const nick_name = Edit_form.querySelector('#nick_name .profileDetail_body-txt').value.trim()
        // education
        let education = []
        if(Edit_form.querySelectorAll('.profileDetail_body.Education')){
            let Edit_educationArray = Array.from(Edit_form.querySelectorAll('.profileDetail_body.Education'))
            Edit_educationArray.forEach(edu => {
                let Array_Edu ={}
                Array_Edu.id = edu.getAttribute('id')
                if(Edit_form.querySelector('#school .profileDetail_body-txt'))
                Array_Edu.school = edu.querySelector('#school .profileDetail_body-txt').value.trim()
                if(Edit_form.querySelector('#degree .profileDetail_body-txt'))
                Array_Edu.degree = edu.querySelector('#degree .profileDetail_body-txt').value.trim()
                if(Edit_form.querySelector('#fieldofstudy .profileDetail_body-txt'))
                Array_Edu.fieldofstudy = edu.querySelector('#fieldofstudy .profileDetail_body-txt').value.trim()
                if(Edit_form.querySelector('#date .profileDetail_body-txt#from'))
                Array_Edu.from = edu.querySelector('#date .profileDetail_body-txt#from').value.trim()
                if(Edit_form.querySelector('#date .profileDetail_body-txt#to'))
                Array_Edu.to = edu.querySelector('#date .profileDetail_body-txt#to').value.trim()
                if(Edit_form.querySelector('#description .profileDetail_body-txt'))
                Array_Edu.description = edu.querySelector('#description .profileDetail_body-txt').value.trim()
                education.push(Array_Edu)
            })
        }
        // social
        let social={}
        if(Edit_form.querySelector('.profileDetail_body.Social')){
            if(Edit_form.querySelector('#youtube .profileDetail_body-txt'))
            social.youtube = Edit_form.querySelector('#youtube .profileDetail_body-txt').value.trim()
            if(Edit_form.querySelector('#twitter .profileDetail_body-txt'))
            social.twitter = Edit_form.querySelector('#twitter .profileDetail_body-txt').value.trim()
            if(Edit_form.querySelector('#facebook .profileDetail_body-txt'))
            social.facebook = Edit_form.querySelector('#facebook .profileDetail_body-txt').value.trim()
            if(Edit_form.querySelector('#linkin .profileDetail_body-txt'))
            social.linkin = Edit_form.querySelector('#linkin .profileDetail_body-txt').value.trim()
        }

        const send_data = await fetch('/live/profile/about', {
            method: "PUT",
            headers: {
            'Content-Type': 'application/json',
            'token' : headers
            },
            body: JSON.stringify({
                location: location,
                nick_name: nick_name,
                status: status,
                bio: bio,
                education: education,
                social: social
            })
        }).then(async ()=>{
            const data_collect = await data.json()
            if(data_collect.hasOwnProperty('errors'))
            {
                data_collect.errors.forEach(er =>{
                    if(er.param === "status")
                    Create_form.querySelector('#status .errors-status').textContent = er.msg
                  })
            }
            if(data_collect.hasOwnProperty('break'))
            {
                if(data_collect.break.school)
                Create_form.querySelector('#school .errors-school').textContent = data_collect.break.school
                if(data_collect.break.degree)
                Create_form.querySelector('#school .errors-degree').textContent = data_collect.break.degree
                if(data_collect.break.fieldofstudy)
                Create_form.querySelector('#school .errors-fieldofstudy').textContent = data_collect.break.fieldofstudy
                if(data_collect.break.from)
                Create_form.querySelector('#school .errors-date').textContent = data_collect.break.from
            }
            if(data_collect.hasOwnProperty('error'))
            {
                Edit_form.textContent = data_collect.error
            }
            if(data_collect.hasOwnProperty('hi')){
                window.location.href = document.location
            }
        })
    })
}
if(document.querySelector('.Social_Create_popup .profile_group')){
    var Social_form = document.querySelector('.Social_Create_popup .profile_group')
    // socail adding
    Social_form.addEventListener('submit', async (data) =>{
        data.preventDefault()
        // calling vaule
        let social={}
        if(Social_form.querySelector('.profileDetail_body')){
            if(Social_form.querySelector('#youtube .profileDetail_body-txt'))
            social.youtube = Social_form.querySelector('#youtube .profileDetail_body-txt').value.trim()
            if(Social_form.querySelector('#twitter .profileDetail_body-txt'))
            social.twitter = Social_form.querySelector('#twitter .profileDetail_body-txt').value.trim()
            if(Social_form.querySelector('#facebook .profileDetail_body-txt'))
            social.facebook = Social_form.querySelector('#facebook .profileDetail_body-txt').value.trim()
            if(Social_form.querySelector('#linkin .profileDetail_body-txt'))
            social.linkin = Social_form.querySelector('#linkin .profileDetail_body-txt').value.trim()
        }
        const send_data = await fetch('/live/profile/social', {
            method: "PUT",
            headers: {
            'Content-Type': 'application/json',
            'token' : headers
            },
            body: JSON.stringify({
                social: social
            })
        }).then(async (data)=>{
            window.location.href = document.location
            // const data_collect = await data.json()
            // console.log(data_collect)
        })
    })
}
if(document.querySelector('.Education_popup .profile_group')){
    var EducationAdd_form = document.querySelector('.Education_popup .profile_group')
    // Education Array add
    EducationAdd_form.addEventListener('submit', async (data) =>{
        data.preventDefault()
        // calling vaule
        const school = EducationAdd_form.querySelector('#school .profileDetail_body-txt').value.trim()
        const degree = EducationAdd_form.querySelector('#degree .profileDetail_body-txt').value.trim()
        const fieldofstudy = EducationAdd_form.querySelector('#fieldofstudy .profileDetail_body-txt').value.trim()
        const date_from = EducationAdd_form.querySelector('#date .profileDetail_body-txt#from ').value.trim()
        const date_to = EducationAdd_form.querySelector('#date .profileDetail_body-txt#to ').value.trim()
        const description = EducationAdd_form.querySelector('#description .profileDetail_body-txt').value.trim()

        Edit_form.querySelector('#school').textContent = ''
        Edit_form.querySelector('#degree').textContent = ''
        Edit_form.querySelector('#fieldofstudy').textContent = ''
        Edit_form.querySelector('#from').textContent = ''
        const send_data = await fetch('/live/profile/education', {
            method: "POST",
            headers: {
            'Content-Type': 'application/json',
            'token' : headers
            },
            body: JSON.stringify({
                school: school,
                degree: degree,
                fieldofstudy: fieldofstudy,
                from: date_from,
                to: date_to,
                description: description
            })
        }).then(async (data)=>{
            let ok = true
            const data_collect = await data.json()
            if(data_collect.hasOwnProperty('errors')){
                data_collect.errors.forEach(er =>{
                  if(er.param === "school")
                  Edit_form.querySelector('#school .errors-school').textContent = er.msg
                  if(er.param === "degree")
                  Edit_form.querySelector('#degree .errors-degree').textContent = er.msg
                  if(er.param === "fieldofstudy")  
                  Edit_form.querySelector('#fieldofstudy .errors-fieldofstudy').textContent = er.msg
                  if(er.param === "from")  
                  Edit_form.querySelector('#from .errors-date').textContent = er.msg
                })
                ok= false
            }
            if(ok === true)
            window.location.href = document.location
        })
    })
}

