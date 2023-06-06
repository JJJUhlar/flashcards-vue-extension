<script lang="ts">
    export default {
        data() {
            return {
                loginData: {
                username: '',
                password: '',
            },
            };
        },

        methods: {
            login() {
                fetch('https://flashcards-server.herokuapp.com/api/login', {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json',
                    },
                    body: JSON.stringify(
                        this.loginData
                     )}
                )                
                .then((response) => { return response.json() })
                .then((response: any) => {
                    alert('Logged in!')
                    localStorage.setItem('sessionToken', response.sessionToken)
                    localStorage.setItem('username', response.username)
                    chrome.storage.session.set({'sessionToken': response.sessionToken})

                })
                .catch(error => {
                    alert('Failed to log in!')
                    console.log(error)
                });
            },
        }
    }

</script>

<template>
    <div>
        <form @submit.prevent="login">
            <input type="text" v-model="loginData.username" placeholder="Username" required>
            <input type="password" v-model="loginData.password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<style scoped>

</style>