<script lang="ts">
import { defineComponent } from 'vue';
import { Flashcard } from '@/flashcards';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import CardAcrostic  from './cardTypes/CardAcrostic.vue'
import CardRhyme from './cardTypes/CardRhyme.vue'
import CardMCQ from './cardTypes/CardMCQ.vue'
import CardFrontBack from './cardTypes/CardFrontBack.vue'
import CardCanvas from './cardTypes/CardCanvas.vue'

export default defineComponent({
    data() {
        return {
            selectedOption: "front-back",
        }
    },
    props: {
        flashcard: {
            type: Flashcard,
            required: true
        }
    },
    components: {
        ClipLoader,
        CardAcrostic,
        CardRhyme,
        CardMCQ,
        CardFrontBack,
        CardCanvas
    },
    methods: {
        handleCardTypeChange() {
            
            if (this.selectedOption === 'mcq') {
                this.flashcard.changeType('mcq')
            } else if (this.selectedOption === 'acrostic') {
                this.flashcard.changeType('acrostic')
            } else if (this.selectedOption === 'canvas') {
                this.flashcard.changeType('canvas')
            } else if (this.selectedOption === 'rhyme') {
                this.flashcard.changeType('rhyme')
            } else {
                this.flashcard.changeType('front-back')
            }
        }
        
    },
    mounted() {
        console.log("flashcard!: ", this.flashcard)
    }
})
</script>

<template>
     <fieldset>
        <div class="flashcard_field">
            <label for="flashcardType">Card Type</label>
            <select id="flashcardType" v-model="selectedOption" @change="handleCardTypeChange">
                <option value="front-back">Front/Back</option>
                <option value="mcq">Multiple Choice</option>
                <option value="acrostic">Acrostic</option>
                <option value="rhyme">Rhyme</option>
                <option value="canvas">Canvas</option>
            </select>
        </div>
        <ClipLoader v-if="flashcard.loading" />
        <CardFrontBack  v-else-if="flashcard.card_type.value === 'default' || flashcard.card_type.value === 'front-back'"  :flashcard="flashcard" />    
        <CardMCQ v-else-if="flashcard.card_type.value === 'mcq'"  :flashcard="flashcard" />
        <CardAcrostic v-else-if="flashcard.card_type.value === 'acrostic'"  :flashcard="flashcard" />
        <CardRhyme v-else-if="flashcard.card_type.value === 'rhyme'"  :flashcard="flashcard" />
        <CardCanvas v-else-if="flashcard.card_type.value === 'canvas'" :flashcard="flashcard" />
    
    </fieldset>

</template>

<style scoped>

fieldset {
    border: none;
    display: flex;
    flex-direction: column;
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