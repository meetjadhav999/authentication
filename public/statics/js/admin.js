function getCookie(name) {
    let cookie = {};
    document.cookie.split(';').forEach(function(el) {
      let split = el.split('=');
      cookie[split[0].trim()] = split.slice(1).join("=");
    })
    return cookie[name];
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

const renderAllUserData = (data) => {
    const div = document.getElementById('allusers')
    if(!div){
        return
    }
    let html = `<h2>All Users</h2>`
    data.forEach((user)=>{
        html = html + `<a href="/user/${user._id}" class="text-decoration-none text-black"><div class="container m-3 border border-1 w-100 d-flex p-4">
                            <div><img src="http://127.0.0.1:3000/api/profileImg/${user._id}" alt="/upload/profileimg.png" class="rounded-circle" height="100px" width="100px" id="profileimg"/></div>
                            <div class="ms-4">
                                <p >${user.name}</p>
                                <p>${user.email}</p>
                            </div>
                        </div>
                        </a>`
    })
    div.innerHTML = html
}

function getSelfData(){
    fetch('/api/user',{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${getCookie('user-token')}`
        }
    }).then(response => response.json())
    .then(data => renderData(data))
    .catch(e=>window.location.href = "/login-email")
}

function getAllUserData(){
    fetch('/api/admin/All-users',{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${getCookie('user-token')}`
        }
    }).then(response => response.json())
    .then(data => renderAllUserData(data))
    .catch(e=>window.location.href = "/login-email")
}




window.onload = () =>{
    getAllUserData()
    getSelfData()
}

