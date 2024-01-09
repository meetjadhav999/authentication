const signup = () => {
	const name = document.getElementById('name').value
	const email = document.getElementById('email').value
	const email2 = document.getElementById('email2').value
	const phone = document.getElementById('phone').value
	const phone2 = document.getElementById('phone2').value
	const password = document.getElementById('password').value
	console.log('')
	fetch('/api/register', {
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
			if(data.user.isAdmin){
				window.location.href = '/admin'
			}
			else{
				window.location.href = '/upload-picture'
			}
		}
		else{
			alert(data.error)
		}
	})
	
	.catch(e => alert(e))
}

const loginusingemail = () => {
	const email = document.getElementById('email').value
	const password = document.getElementById('password').value
	console.log(email)
	fetch('/api/login',
		{
			method: 'POST',
			body: JSON.stringify({
				email:email,
				password:password
			}),
			headers: {
				'Content-Type': 'application/json',
			}
		}).then(async (response) => {
			const data = await response.json()
			if(response.status === 200){
				
				document.cookie = "user-token=" + data.token

				alert('Logged in successfully')
				if(data.user.isAdmin){
					window.location.href = '/admin'
				}
				else{
					window.location.href = '/'
				}
			}
			else{
				console.log(response)
				alert(data.error)
			}
		})
		
		.catch(e => alert(e))

}
const loginusingphone = () => {
	const phone = document.getElementById('phone').value
	const password = document.getElementById('password').value

	fetch('/api/login',
		{
			method: 'POST',
			body: JSON.stringify({
				phone_no:phone,
				password
			}),
			headers: {
				'Content-Type': 'application/json',
			}
		}).then(async (response) => {
			if(response.status === 200){
				const data = await response.json()
				document.cookie = "user-token=" + data.token
				alert('Logged in successfully')
				if(data.user.isAdmin){
					window.location.href = '/admin'
				}
				else{
					window.location.href = '/'
				}
			}
			else{
				alert('invalid phone number or password')
			}
		})
		
		.catch(e => alert(e))
}