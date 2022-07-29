var req = new XMLHttpRequest();
req.open('GET', document.location, false);
req.send(null);
var headers = req.getResponseHeader("token");
// header
var user_info = document.querySelector('.header_list .icon .user-info')
user_info.addEventListener('click', () =>{
    if(document.querySelector('.header_list .user_setting').style.display === "block") document.querySelector('.header_list .user_setting').style.display = 'none'
    else{ document.querySelector('.header_list .user_setting').style.display = 'block' }
})
if(document.querySelector('.fr_ask')){
    var btn_fr = document.querySelector('.holding_friend')
    var hold_frPopup = document.querySelector('.asking')
    var hold_fr_array = Array.from(document.querySelectorAll('.hold_fr_info'))
    btn_fr.addEventListener('click', () =>{
        if(hold_frPopup.style.display === "block") hold_frPopup.style.display = "none"
        else{hold_frPopup.style.display = "block"}
        
    })
    hold_fr_array.forEach( async (fr_a,idx) =>{
        fr_a.querySelector('.Appect').addEventListener('click', () =>{
            const id = fr_a.getAttribute('id')
            fetch('/live/adding/friend', {
                method: "PUT",
                redirect: "follow",
                headers: {
                'Content-Type': 'application/json',
                'token' : headers
                },
                body: JSON.stringify({
                    fr_id : id
                })
            }).then( ()=>{
                window.location.href = document.location
            })
        })
    })
}