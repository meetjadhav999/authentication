function getCookie(name) {
    let cookie = {};
    document.cookie.split(';').forEach(function(el) {
      let split = el.split('=');
      cookie[split[0].trim()] = split.slice(1).join("=");
    })
    return cookie[name];
}


const renderData = (data) => {
    const div = document.getElementById('userdiv')
    if(!div){
        return
    }
    div.innerHTML = `
                        <img src="/api/profileImg/${data._id}" alt="/upload/profileimg.png" class="rounded-circle" height="250px" width="250px" id="profileimg"/>
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

function getuserdata(){
    const url = window.location.href
    const splittedUrl = url.split('/')
    const id = splittedUrl[splittedUrl.length - 1]

    console.log(id)

    fetch('/api/admin/user/'+id,{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${getCookie('user-token')}`
        }
    }).then(response => response.json())
    .then(data => renderData(data))
    .catch(e=>window.location.href = "/login-email")
}

window.onload = () => {
    getuserdata()
}


function deleteUser() {
    const url = window.location.href
    const splittedUrl = url.split('/')
    const id = splittedUrl[splittedUrl.length - 1]

    fetch('/api/admin/user/'+id,{
        method:'DELETE',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${getCookie('user-token')}`
        }
    }).then(response => {
        if(response.status ===200){
            alert('User Deleted Successfully')
            window.location.href = '/admin'
        }
        else{
            alert('something went wrong')
        }
    })
    .catch(e=>window.location.href = "/login-email")
}

const saveName = () => {
    const url = window.location.href
    const splittedUrl = url.split('/')
    const id = splittedUrl[splittedUrl.length - 1]
    const name = document.getElementById('name').value 
    fetch('/api/admin/user/'+id,{
        method:"PATCH",
        body:JSON.stringify({
            name
        }),
        headers:{
            'Content-type':'application/json',
            'Authorization': `Bearer ${getCookie('user-token')}`
        }
    }).then(response => {
        if(response.status === 200){
            alert('name Updated successfully')
            window.location.href='/admin'
        }
        else{
            alert('Name is Required')
        }
    })
}