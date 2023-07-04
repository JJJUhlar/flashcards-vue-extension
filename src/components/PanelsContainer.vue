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
        <button :class="{active: showReviewPanel}" @click="changeToReviewPanel">Review Flashcards</button>
        <button :class="{active: showCreatePanel}" @click="changeToCreatePanel">Create Flashcards</button>
    </div>
    <CreateFlashcardsPanel v-if="showCreatePanel"/>    
    <ReviewFlashcardsPanel v-if="showReviewPanel" />

</template>

<style scoped>
.active {
background-color: #ff5e5e;
}
button {
background-color: #ff8c8c;
}

</style>