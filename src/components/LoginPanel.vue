<script lang="ts">
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

export default {

    data() {
            return {
                loadingLogIn: false,
                isLoggedIn: false,
                loginStatus: ""
        };
    },
    components: {
        ClipLoader
    },
    props: ['isLoggedIn', 'loginStatus', 'loadingLogin'],
    methods: {
        async loginSSO() {

        this.loadingLogIn = true
        this.$emit('update-login-loading', true)

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
                console.log('OAuth loggin success: ', this.isLoggedIn)
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
                        this.$emit('update-login', true)
                        this.$emit('update-login-status', `Logged in as ${response.username}`)
                        this.$emit('update-login-loading', false)
                        this.isLoggedIn = true;
                        this.loadingLogIn = false

                        this.loginStatus = `${response.username}`
                        localStorage.setItem('sessionToken', response.sessionToken)
                        localStorage.setItem('username', response.username)
                        chrome.storage.session.set({'username': response.username})
                        chrome.storage.session.set({'sessionToken': response.sessionToken})
                        chrome.storage.session.set({'isLoggedIn': true})
                    })
                    .catch(error => {
                        this.loginStatus = "Login failed"
                        this.isLoggedIn = false;
                        this.loadingLogIn = false
                        this.$emit('update-login-loading', false)
                        this.$emit('update-login-status', `Log in failed`)
                        this.$emit('update-login', false)

                        chrome.storage.session.set({'isLoggedIn': false})
                        console.log(error)
                    });
                })
            })
            .catch(err => {
                this.loadingLogIn = false
                console.log(`SSO ended with an error: ${err}`)
                alert(`SSO ended with an error: ${err}`)
            })
        })
        }
    }
}

</script>

<template>
    <div class="login">

        <p> {{ loginStatus }}</p>
        <ClipLoader v-if="loadingLogIn" class="spinner" />
        <button v-else class="googlelogin-button" v-if="!isLoggedIn" @click="loginSSO" >
        <svg class="googlelogin-button--icon" 
        aria-hidden="true"
        width="24" 
        height="24" 
        viewBox="0 0 18 18">
        <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" 
        fill="#4285F4"
        ></path>
        <path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z" 
            fill="#34A853">
        </path>
        <path d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z" 
            fill="#FBBC05"
            ></path>
        <path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z" 
            fill="#EA4335"
            ></path>
        </svg>
        <div class="googlelogin-button--txt">Google Login</div>
    </button>
    </div>
</template>

<style scoped>

.login {
    display: flex;
    align-items: center;
    flex-direction: column;
}

.googlelogin-button {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #f2f3f5;
    font-size: 12px;
  border-radius: 20px;
  user-select: none;
  width: 200px;
  padding: 10px
}
.googlelogin-button:hover {
  background-color: #e1e4e7;
}

.spinner {
    padding: 10px;
    margin: 10px;
}

</style>