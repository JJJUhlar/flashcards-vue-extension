<script lang="ts">
import { Flashcard } from '@/flashcards';
import CardAcrostic from './cardTypes/CardAcrostic.vue'
import CardRhyme from './cardTypes/CardRhyme.vue'
import CardFrontBack from './cardTypes/CardFrontBack.vue'
import CardCanvas from './cardTypes/CardCanvas.vue'
import CardMCQ from './cardTypes/CardMCQ.vue'

export default {
    data() {
        return {
            answerHidden: true
        }
    },
    props: {
        flashcard: {
            type: Flashcard,
            required: true
        }
    },
    components: {
        CardAcrostic,
        CardCanvas,
        CardFrontBack,
        CardMCQ,
        CardRhyme
    },
    methods: {
        revealAnswer() {
            if (this.answerHidden === false) {
                this.answerHidden = true;
            } else {
                this.answerHidden = false;
            }
        }
    }
}
</script>


<template>

    <label>Question</label>
    <p class="card">{{ flashcard.prompt.value }}</p>

    <label>Answer</label>
    <p :hidden="answerHidden" class="card">{{ flashcard.answer.value }}</p>
    <button class="reveal-btn" @click="revealAnswer" v-if="answerHidden">reveal answer</button>
    
    <div v-show="!answerHidden" class="review-btns">
        <button @click="$emit('review-easy')">Easy</button>
        <button @click="$emit('review-fail')">Dunno</button>
        <button @click="$emit('review-delete')">Delete</button>
    </div>

</template>

<style scoped>

.review-btns {
    display: flex;
    justify-content: center;
}

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


</style>