<script setup lang="ts">

	import PanelsContainer from './components/PanelsContainer.vue';
	import { ref } from 'vue'

	import { initializeApp } from 'firebase/app'
	import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth'


	
	const isLoggedIn = ref(false)

	const loadingLogIn = ref(false)
	const loginStatus = ref("Not logged in")

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

		loadingLogIn.value = true

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
						isLoggedIn.value = true;
						loadingLogIn.value = false
						loginStatus.value = `${response.username}`
						localStorage.setItem('sessionToken', response.sessionToken)
						localStorage.setItem('username', response.username)
						chrome.storage.session.set({'sessionToken': response.sessionToken})
						chrome.storage.session.set({'isLoggedIn': true})
					})
					.catch(error => {
						loginStatus.value = "Login failed"
						isLoggedIn.value = false;
						loadingLogIn.value = false
						chrome.storage.session.set({'isLoggedIn': false})
						console.log(error)
					});
				})
			})
			.catch(err => {
				loadingLogIn.value = false
				console.log(`SSO ended with an error: ${err}`)
				alert(`SSO ended with an error: ${err}`)
			})
		})
	}
	
</script>


<template>
	<main>
		<img alt="flashcards logo" class="logo" src="./images/icon-64.png" width="32" height="32" />
		<p class="login-status">{{ loginStatus }}</p>
		<div v-if="isLoggedIn">
			<PanelsContainer />
		</div>
		<div v-else>
			<h4 v-if="loadingLogIn">Loading...</h4>
			<button v-else  @click="loginSSO">Login</button>
		</div>
	</main>
</template>


<style >
html {
	width: 400px;
}

</style>
