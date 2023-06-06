<script lang="ts">
import CreateFlashcardsPanel from './CreateFlashcardsPanel.vue';
import ReviewFlashcardsPanel from './ReviewFlashcardsPanel.vue';
import LoginPanel from './LoginPanel.vue';

export default {
    data() {
        return {
            showReviewPanel: true,
            showCreatePanel: false,
            showLoginPanel: false
        }
    },
    methods: {
        changeToCreatePanel() {
            this.showCreatePanel = true;
            this.showReviewPanel = false;
            this.showLoginPanel = false;
        },
        changeToReviewPanel() {
            this.showReviewPanel = true;
            this.showLoginPanel = false;
            this.showCreatePanel = false;
        },
        changeToLoginPanel() { 
            this.showLoginPanel = true;
            this.showReviewPanel = false;
            this.showCreatePanel = false;
        }
    },
    components: {
        CreateFlashcardsPanel,
        ReviewFlashcardsPanel,
        LoginPanel
    }
}

</script>

<template>
    <div>
        <button @click="changeToReviewPanel">Review Panel</button>
        <button @click="changeToCreatePanel">Create Panel</button>
        <button @click="changeToLoginPanel">Login Panel</button>
    </div>
    <div v-if="showCreatePanel">
        <h1>Create Cards</h1>
        <CreateFlashcardsPanel />
    </div>
    <div v-if="showReviewPanel">
        <h1>Review Cards</h1>
        <ReviewFlashcardsPanel />
    </div>
    <div v-if="showLoginPanel">
        <h1>Login</h1>
        <LoginPanel />
    </div>


</template>

<style>

</style>