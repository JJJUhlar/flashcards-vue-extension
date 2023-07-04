<script lang="ts">
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import { Flashcard, Deck } from '@/flashcards'
import ReviewCard from './ReviewCard.vue'

export default {
    data() {
        return {
            review_deck: new Deck(),
            reviewFlashcards: [] as Flashcard[],
            currentReviewFlashcard: {
                card_front: "Q",
                card_back: "A"
            },
            answerHidden: true,
            reviewFinished: false,
            loading: false,
        }
    },
    components: {
        ClipLoader,
        ReviewCard
    },
    methods: {
        handleReviewEasy() {
            this.review_deck.reviewEasy()
        },
        handleReviewFail() {
            this.review_deck.reviewFail()
        },
        handleReviewDelete() {
            this.review_deck.removeCard()
        }
    },
    created() {
        this.loading = true;
        this.review_deck.fetchDueCards()        

        console.log("review deck: ", this.review_deck)
        this.loading = false;

        let username = localStorage.getItem('username') || ''
        let token = localStorage.getItem('sessionToken') || ''
    }
}
</script>

<template>
    <ClipLoader v-if="loading" class="spinner" />
    <h3> {{ review_deck.numberOfCards }} cards left</h3>
    <h1 v-if="reviewFinished">Review Finished!</h1>
    <div v-else>
        
        <ReviewCard 
            v-if="review_deck.numberOfCards > 0"
            :flashcard="review_deck.currentCard"
            @review-easy="handleReviewEasy"
            @review-fail="handleReviewFail"
            @review-delete="handleReviewDelete"
        />            
        
        <h3 v-else>Nothing to review</h3>
    </div>
</template>

<style scoped>
label {
    display: block;
    line-height: 1rem;
    font-size: 0.8rem;
}

.card {
    padding: 10px;
    border: none;
    background: lightblue;
    border-radius: 3px;
}

fieldset {
    display: block
}

.reveal-btn {
    display: block;
}

p {
    margin-bottom: 5px;
    font-size: 1rem;
}

.spinner {
    padding: 10px;
    margin: 10px;
}
</style>