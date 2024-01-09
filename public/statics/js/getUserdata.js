
function getCookie(name) {
    let cookie = {};
    document.cookie.split(';').forEach(function(el) {
      let split = el.split('=');
      cookie[split[0].trim()] = split.slice(1).join("=");
    })
    return cookie[name];
  }



function getUser(){
    fetch('/api/user',{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${getCookie('user-token')}`
        }
    }).then(response => response.json())
    .then(data => {
        if(data.isAdmin){
            window.location.href = '/admin'
        }
        renderData(data)
    })
    .catch(e=>window.location.href = "/login-email")
}
const renderData = (data) => {
    const div = document.getElementById('content')
    if(!div){
        return
    }
    div.innerHTML = `
                        <a href="upload-picture"><img src="/api/profileImg/${data._id}" alt="/upload/profileimg.png" class="rounded-circle" height="250px" width="250px" id="profileimg"/></a>
                        <div class="mb-3">
                            <label for="name" class="form-label">Name</label>
                            <input type="text" class="form-control" id="name" value="${data.name}">
                            <label for="email" class="form-label">Email address</label>
                            <input type="email" class="form-control" id="email" value="${data.email}" disabled>
                            <label for="email2" class="form-label">Second Email address</label>
                            <input type="email" class="form-control" id="email2" value="${data.secondaryEmail}" disabled>
                            <label for="phone" class="form-label">Phone number</label>
                            <input type="number" class="form-control" id="phone" value="${data.phone_no}" disabled>
                            <label for="phone2" class="form-label">Second Phone number</label>
                            <input type="number" class="form-control" id="phone2" value="${data.secondaryphone_no}" disabled>

                        </div>`
}

window.onload = () =>{
    getUser()
}