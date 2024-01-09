
function getCookie(name) {
    let cookie = {};
    document.cookie.split(';').forEach(function(el) {
      let split = el.split('=');
      cookie[split[0].trim()] = split.slice(1).join("=");
    })
    return cookie[name];
  }



const deleteUser = () =>{
	fetch('/api/user',{
        method:'DELETE',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${getCookie('user-token')}`
        }
    }).then(response => {
		if(response.status === 200){
			window.location.href = '/register'
		}
	})
    
}


const navigateToHome = () =>{
    window.location.href = "/"
}

const saveImg = () =>{
    const img = document.getElementById('profileimg').files[0]

    const formdata = new FormData()
    formdata.append('profileimg',img)

    fetch('/api/user-profile',{
        method:'POST',
        body:formdata,
        headers:{
            
            'Authorization': `Bearer ${getCookie('user-token')}`
        }
    }).then(response => {
		if(response.status === 200){
			window.location.href = '/'
		}
        else{
            alert('image not provided')
        }
	})
}


const saveName = () => {
    const name = document.getElementById('name').value 
    fetch('/api/update-name',{
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
            window.location.href='/'
        }
        else{
            alert('Name is Required')
        }
    })
}
const savePassword = () => {
    const password = document.getElementById('password').value 
    fetch('/api/update-password',{
        method:"PATCH",
        body:JSON.stringify({
            password
        }),
        headers:{
            'Content-type':'application/json',
            'Authorization': `Bearer ${getCookie('user-token')}`
        }
    }).then(response => {
        if(response.status === 200){
            alert('Password Updated successfully')
            window.location.href='/'
        }
        else{
            alert('Password is Required')
        }
    })
}

const logout = () =>{
    fetch('/api/logout',{
        method:"DELETE",
        headers:{
            'Content-type':'application/json',
            'Authorization': `Bearer ${getCookie('user-token')}`
        }
    }).then(response => {
        if(response.status === 200){
            window.location.href='/login-email'
        }
        else{
            alert('Something went wrong')
        }
    })
}