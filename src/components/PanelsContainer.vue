<script lang="ts">
import CreateFlashcardsPanel from './CreateFlashcardsPanel.vue';
import ReviewFlashcardsPanel from './ReviewFlashcardsPanel.vue';

export default {
    data() {
        return {
            showReviewPanel: true,
            showCreatePanel: false
        }
    },
    methods: {
        changeToCreatePanel() {
            this.showCreatePanel = true;
            this.showReviewPanel = false;
        },
        changeToReviewPanel() {
            this.showReviewPanel = true;
            this.showCreatePanel = false;
        }
    },
    components: {
        CreateFlashcardsPanel,
        ReviewFlashcardsPanel
    }
}

</script>

<template>
    <div>
        <button @click="changeToReviewPanel">Review Flashcards</button>
        <button @click="changeToCreatePanel">Create Flashcards</button>
    </div>
    <div v-if="showCreatePanel">
        <h1>Create Cards</h1>
        <CreateFlashcardsPanel />
    </div>
    <div v-if="showReviewPanel">
        <h1>Review Cards</h1>
        <ReviewFlashcardsPanel />
    </div>

</template>

<style>

</style>