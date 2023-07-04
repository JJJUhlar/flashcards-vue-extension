<script lang="ts">

import { Flashcard } from '@/flashcards';
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        flashcard: {
            type: Flashcard,
            required: true
        },
        review: {
            type: Boolean,
            required: false
        }
    },
    methods: {
        handleCreatedCardFrontChange(e: Event) {
            const target = (<HTMLInputElement>e.target)
            this.flashcard.prompt.value = target.value
        },
        handleCreatedCardBackChange(e: Event) {
            const target = (<HTMLInputElement>e.target)
            this.flashcard.answer.value = target.value
        }
    }
})

</script>

<template>
    <div>
        <div class="flashcard_field">
            <label for="flashcardPrompt">Question</label>
            <textarea 
                id="flashcardPrompt" 
                placeholder="write a flashcard Q here"
                v-bind:value="flashcard.prompt.value"  
                @input="handleCreatedCardFrontChange"
            />
        </div>
        <div class="flashcard_field">
            <label for="flashcardAnswer">Answer</label>
            <textarea 
                id="flashcardAnswer" 
                placeholder="answers go here" 
                v-bind:value="flashcard.answer.value"  
                @input="handleCreatedCardBackChange"
            />
        </div>
    </div>

</template>

<style scoped>

fieldset {
    border: none;
}

select {
    padding: 5px;
    border: none;
    background: lightblue;
    border-radius: 3px
}

textarea {
    padding: 10px;
    border: none;
    background: lightblue;
    border-radius: 3px;
}
.flashcard_field {
    display: flex;
    flex-direction: column;
}
.flashcard_field textarea {
    height: 4rem;
}



label {
    line-height: 1.5rem;
}

</style>