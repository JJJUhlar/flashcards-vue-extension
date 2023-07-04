<script setup lang="ts">

	import { ref } from 'vue'
	import CreateFlashcardsPanel from './components/CreateFlashcardsPanel.vue';
	import ReviewFlashcardsPanel from './components/ReviewFlashcardsPanel.vue';
	import LoginPanel from './components/LoginPanel.vue';

	const showReviewPanel = ref(false);
	const showCreatePanel = ref(false);
	const showLoginPanel = ref(true)

	const changeToCreatePanel = () => {
			if (isLoggedIn.value === true) {
				showCreatePanel.value = true;
				showReviewPanel.value = false;
				showLoginPanel.value = false;
			}
        }
	const changeToReviewPanel = () => {
		if (isLoggedIn.value === true) {
            	showReviewPanel.value = true;
            	showCreatePanel.value = false;
            	showLoginPanel.value = false;
			}
        }

	const changeToLoginPanel = () => {
		showReviewPanel.value = false;
        showCreatePanel.value = false;
        showLoginPanel.value = true;
	}

	const isLoggedIn = ref(false)
	const loadingLogIn = ref(false)
	const loginStatus = ref("")

	chrome.storage.session.get('isLoggedIn')
		.then((res)=>{
			console.log("test: ", res.isLoggedIn, res)
			if (Boolean(res.isLoggedIn) === true) {
				isLoggedIn.value = true;
				chrome.storage.session.get('username')
				.then((res)=>{
					console.log(res)
					if (res.username !== undefined) {
						loginStatus.value = `logged in as ${res.username}`
					}
				})
				.catch((err)=>{
					console.log(err)
				})
			} else {
				loginStatus.value = "Not logged in"
			}
		})
		.catch((err)=>{
			console.log(err)
		})
	

	const updateLoginValue = (loginValue) => {
		isLoggedIn.value = loginValue
	}

	const updateLoginStatus = (status) => {
		loginStatus.value = status
	}

	const updateLoginLoading = (loading) => {
		loadingLogIn.value = loading
	}
	
</script>


<template>
	<main>
		<div class="nav">
			<img alt="flashcards logo" class="logo" src="./images/icon-64.png" width="32" height="32" />

			<button class="navBtn" :class="{active: showReviewPanel}" @click="changeToReviewPanel">Review </button>
			<button class="navBtn" :class="{active: showCreatePanel}" @click="changeToCreatePanel">Create </button>
			<button class="navBtn" :class="{active: showLoginPanel}" @click="changeToLoginPanel" >Login</button>
		</div>
		<div  class="panel">
			<LoginPanel v-if="showLoginPanel" 
				:isLoggedIn="isLoggedIn" 
				@update-login="updateLoginValue" 
				:loginStatus="loginStatus" 
				@update-login-status="updateLoginStatus"  
				:loadingLogIn="loadingLogIn" 
				@update-login-loading="updateLoginLoading"/>
			<CreateFlashcardsPanel v-if="showCreatePanel"/>    
    		<ReviewFlashcardsPanel v-if="showReviewPanel" />
		</div>
	</main>
</template>


<style >
html {
	width: 400px;
	background-color: beige;

}
.nav {
	display: flex;
	flex-direction: row;
	align-items: center;
	background-color: azure;
	justify-content: flex-start;
	border-bottom: #ff5e5e 1px solid;
}

.logo {
	margin: 5px;
}

.navBtn {
	display: flex;
	align-self: flex-end;
	border-radius: 5px 5px 0px 0px;
	margin-left: 2px;
	margin-right: 2px;
	margin-bottom: 0px;
}

button {
	background-color: #ff8c8c;
	padding: 5px 15px;
	border-radius: 5px;
	margin: 2px;
	font-family: Inter;
	font-size: 0.9rem;
	border-style: none;
	border-width: none;
}

.active {
	background-color: #ff5e5e;
}

button:hover {
	background-color: #ff5e5e;
}

.panel {
	padding: 5px;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

</style>
