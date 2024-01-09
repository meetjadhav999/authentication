const signup = () => {
	const name = document.getElementById('name').value
	const email = document.getElementById('email').value
	const email2 = document.getElementById('email2').value
	const phone = document.getElementById('phone').value
	const phone2 = document.getElementById('phone2').value
	const password = document.getElementById('password').value

	fetch('/api/admin/registerAdmin', {
		method: 'POST',
		body: JSON.stringify({
			name,
			email,
			secondaryEmail: email2,
			phone_no: phone,
			secondaryphone_no: phone2,
			password
		}),
		headers: {
			'Content-Type': 'application/json',
		}
	}).then(async response => {
		const data = await response.json()

		if(response.status === 201){
			document.cookie = "user-token=" + data.token
			alert('user created successfully')
			window.location.href = '/'
		}
		else{
			alert(data.error)
		}
	})
	
	.catch(e => alert(e))
}