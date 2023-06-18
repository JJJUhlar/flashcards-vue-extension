<script setup lang="ts">

	import PanelsContainer from './components/PanelsContainer.vue';
	import { ref } from 'vue'

	import { initializeApp } from 'firebase/app'
	import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth'



	const isLoggedIn = ref(false)

	chrome.storage.session.get('isLoggedIn')
		.then((res)=>{
			console.log("test: ", res.isLoggedIn, res)
			if (Boolean(res.isLoggedIn) === true) {
				isLoggedIn.value = true;
			}
		})
		.catch((err)=>{
			console.log(err)
		})

	async function loginSSO() {

		chrome.identity.getAuthToken({interactive: true}, token => {
			if (chrome.runtime.lastError || ! token) {
				console.log(`SSO ended with an error: ${JSON.stringify(chrome.runtime.lastError)}`)
				return
			}
			
			console.log("OAuth token: ", token)
			
			const firebase = initializeApp({
				apiKey: "AIzaSyDD0GsFg98A4SZzIfunPcUSGbpyK6dLurc",
				authDomain: "flashcards-388210.firebaseapp.com",
				projectId: "flashcards-388210",
				storageBucket: "flashcards-388210.appspot.com",
				messagingSenderId: "972831559816",
				appId: "1:972831559816:web:ecf424c2223605e2584f3d",
				measurementId: "G-825T0KYHQJ"
			})

			const auth = getAuth(firebase)

			signInWithCredential(auth, GoogleAuthProvider.credential(null, token))
			.then(res => {
				console.log('OAuth loggin success: ', isLoggedIn)
				chrome.storage.session.set({'isLoggedIn': true})

				chrome.identity.getProfileUserInfo(profile => {
					const user = {"user": profile.email}
					console.log("profile: ", profile)
				
				// Get Session Token
					fetch('https://flashcards-server.herokuapp.com/api/login', {
						method: 'POST',
						headers: {
							"Content-Type": 'application/json',
						},
						body: JSON.stringify(
							user
						)}
					)
					.then(response=> response.json())
					.then((response) => {
						alert('Logged in!')
						isLoggedIn.value = true;
						localStorage.setItem('sessionToken', response.sessionToken)
						localStorage.setItem('username', response.username)
						chrome.storage.session.set({'sessionToken': response.sessionToken})
						chrome.storage.session.set({'isLoggedIn': true})
					})
					.catch(error => {
						alert('Failed to log in!')
						isLoggedIn.value = false;
						chrome.storage.session.set({'isLoggedIn': false})
						console.log(error)
					});
				})
			})
			.catch(err => {
				console.log(`SSO ended with an error: ${err}`)
				alert(`SSO ended with an error: ${err}`)
			})
		})
	}
	
</script>


<template>
	<header>
		<img alt="flashcards logo" class="logo" src="./images/icon-64.png" width="64" height="64" />
	</header>
	<main>
		<div v-if="isLoggedIn">
			<PanelsContainer />
		</div>
		<div v-else>
			<button @click="loginSSO">Login</button>
		</div>
	</main>
</template>


<style >
html {
	width: 400px;
}

</style>
