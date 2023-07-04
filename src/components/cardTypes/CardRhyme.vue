<script lang="ts">

import { Flashcard } from '@/flashcards';
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        flashcard: {
            type: Flashcard,
            required: true
        }
    }
})

</script>

<template>

    <div class="flashcard_field">
        <label for="flashcardPrompt">Prompt</label>
        <textarea 
            id="flashcardPrompt" 
            placeholder="Write a flashcard Q here" 
            v-model="flashcard.rhyme_prompt.value"
        />
    </div>
    <div class="flashcard_field">
        <label for="flashcardAnswer">Rhyme</label>
        <textarea 
            id="flashcardAnswer" 
            placeholder="Rhyme goes here" 
            v-model="flashcard.rhyme.value"
        />
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