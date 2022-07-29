var url = window.location.href
const data_path = (new URL(url)).pathname
var Blog = document.querySelector('.blog_contrain')
var Listimg = []
if(document.querySelector('.blog_img img')){
    var collect_img = Array.from(document.querySelectorAll('.blog_img img'))
    collect_img.forEach(ig =>{
        Listimg.push(ig)
    })
}
if(Listimg.length > 0){
    let shortenImg = document.querySelector('.Edit_area-button button')
    shortenImg.addEventListener('click', t =>{
        for (let i = 0; i < Listimg.length; i++) {
            collect_img[Listimg.length - 1].textContent = ''
        }
        Listimg.pop()
    })
}
var Posted_img = document.querySelector('.Edit_area-button input')
var img_showed = document.querySelector('.blog_img')
// event imh get
Posted_img.addEventListener("change", function() {
    const file = this.files[0]
    if(file)
    {
        const reader = new FileReader()
        reader.addEventListener("load", function() {
            const img_made = document.createElement("img")
            img_made.setAttribute('src', this.result)
            img_made.setAttribute('alt', 'img posted')
            img_showed.appendChild(img_made)
            Listimg.unshift(img_made)
        })
        reader.readAsDataURL(file)
    }
})
// edit get sent
var edit_sent = document.querySelector('.Edit_area-blog')
edit_sent.addEventListener('click', async data =>{
    data.preventDefault()
    let Img_info = []
    if(Listimg.length > 0){
        Listimg.forEach(a =>{
            Img_info.unshift({img: a.getAttribute('src')})
        })
    }
    if(data_path.includes('/control/blog')){
        await fetch('/control/blog/edit', {
            method: "PUT",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: Blog.getAttribute('id'),
                txt: Blog.querySelector('.Edit_area-area').value,
                ArrayIMG: Img_info
            })
        }).then( async (data) =>{
            if(data.redirected){
                window.location.href = data.url
            }
            const comment_data = await data.json()
            // console.log(comment_data)
            if(comment_data.hasOwnProperty('break')){
                window.location.href = document.location
            }
        })
    }
    if(data_path.includes('/live/profile')){
        var req = new XMLHttpRequest();
        req.open('GET', document.location, false);
        req.send(null);
        var headers = req.getResponseHeader("token");
        await fetch('/live/profile/edit', {
            method: "PUT",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: headers,
                id: Blog.getAttribute('id'),
                txt: Blog.querySelector('.Edit_area-area').value,
                picture: Img_info
            })
        }).then( async (data) =>{
            if(comment_data.hasOwnProperty('break')){
                window.location.href = document.location
            }
            if(data.redirected){
                window.location.href = data.url
            }
        })
    }
})