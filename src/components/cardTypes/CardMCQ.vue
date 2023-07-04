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
        <label for="flashcardPrompt">Question</label>
        <textarea 
            id="flashcardPrompt" 
            placeholder="write a flashcard Q here"
            v-model="flashcard.mcq_prompt.value"
        />
    </div>
    <div >
        <div class="flashcard_field_mcq">
            <label for="answer1">A:</label>
            <input 
                class="tick"
                type="radio"
                name="correctAnswer"
                v-model="flashcard.mcq_options.value[0].correct"
            />
            <input 
                type=text
                v-model="flashcard.mcq_options.value[0].option"    
                placeholder="Answer A..."

            />
        </div>
        <div class="flashcard_field_mcq">
            <label for="answer2">B:</label>
            <input 
                class="tick"
                type="radio"
                name="correctAnswer"
                v-model="flashcard.mcq_options.value[1].correct"
            />
            <input 
                type=text
                v-model="flashcard.mcq_options.value[1].option"   
                placeholder="Answer B..."

            />
        </div>
        <div class="flashcard_field_mcq">
            <label for="answer3">C:</label>
            <input 
                class="tick"
                type="radio"
                name="correctAnswer"
                v-model="flashcard.mcq_options.value[2].correct"
            />
            <input 
                type=text
                v-model="flashcard.mcq_options.value[2].option"
                placeholder="Answer C..."
            />
        </div>

        <div class="flashcard_field_mcq">
            <label for="answer4">D:</label>
            <input 
                class="tick"
                type="radio"
                name="correctAnswer"
                v-model="flashcard.mcq_options.value[3].correct"
            />
            <input 
                type=text
                v-model="flashcard.mcq_options.value[3].option"   
                placeholder="Answer D..."

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

input {
    padding: 10px;
    border: none;
    background: lightblue;
    border-radius: 3px;
}

.tick {
    width: 20px;
    height: 20px;
}
.flashcard_field {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}
.flashcard_field textarea {
    height: 4rem;
}

.flashcard_field_mcq {
    display: flex;
    justify-content: space-around;
    margin: 5px;
    align-items: center;
}

label {
    line-height: 1.5rem;
}


</style>