
<script lang="ts">
import { Deck, Flashcard } from '../flashcards'
import Card from './Card.vue'

export default {
    components: {
        Card
    },
    data() {
        return {
            deck: new Deck(),
            loading: false,
            selectedOption: "default"
        }
    },
    created() {
    
        getCreatedCards()
        .then((cards)=>{
            if (cards) cards.forEach((c)=>{
                this.deck.addCard(c)
            })
        })
        .catch((err)=>{
            console.error(err)
        })

        async function getCreatedCards(): Promise<Flashcard[]> {
            return new Promise((resolve, reject)=>{
                try {
                    chrome.storage.session.get('created_cards')
                    .then((res)=>{
                        const cards: Flashcard[] = []
                        if (res.created_cards) {
                            res.created_cards.forEach((card)=>{
                                console.log("created card: ",card)

                                const c = new Flashcard(card.input, card.origin, card.card_front, card.card_back)
                                cards.push(c)  
                            })
                        }
                        chrome.storage.session.set({"created_cards": []})
                        resolve(cards)
                    })
                    .catch(err=>{
                        console.error(err)
                    })
                } catch(err) {
                    console.error(err)
                }
            })
        }

        async function getStoredDeck():Promise<Deck> {
            return new Promise((resolve,reject)=>{
                try {
                    chrome.storage.session.get('created_deck')
                        .then((res)=>{
                            if (res.created_deck) {
                                console.log('getting saved deck: ', res.created_deck)
                                resolve(JSON.parse(res.created_deck))
                            } else {
                                console.log('Setting empty deck in storage')
                                const deck = new Deck()
                                chrome.storage.session.set({"created_deck": JSON.stringify(deck)})
                            }
                        })
                } catch (err) {
                    console.error(err)
                    throw err
                }
            })
        }

    },
    unmounted() {
        
        async function saveStoredDeck(deck: Deck): Promise<void> {
            return new Promise((resolve,reject)=>{
                try {
                    console.log('about to save deck: ', deck)
                    chrome.storage.session.set({"created_deck": JSON.stringify(deck)}, ()=> {
                        console.log('saved deck, ', deck)
                    })
                } catch (err) {
                    console.error(err)
                    throw err
                }
            })
        }
    }
}
</script>


<template>
    <div class="change_card_btns">
        <button class="changeCard" @click="deck.previousCard" >Previous Card</button>
        <h3 >{{ deck.currentCardIndex + 1 }} / {{ deck.cardCount }}</h3>
        <button class="changeCard" @click="deck.nextCard" >Next Card</button>
    </div>
    <Card :flashcard="deck.currentCard" />
    <div class="buttons">
        <button @click="deck.saveCreatedCard">Save Card</button>
        <button @click="deck.deleteCard">Delete Card</button>
        <button @click="deck.addNewCard">Add Empty Card</button>
    </div>
</template>

<style scoped>

.buttons {
    margin-top: 15px;
    display: flex;
    justify-content: center;
}

.change_card_btns {
    display: flex;
    justify-content: center;
}
.changeCard {
    font-size: 0.8rem;
    padding: 5px;
    border: solid 1px lightblue;
    background-color: azure;
    margin-left: 10px;
    margin-right: 10px;
}

.changeCard:hover {
    background-color: lightblue;
}

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

.flashcard_field_mcq {
    display: flex;
    justify-content: space-around;
    margin: 5px;
    align-items: center;
}

label {
    line-height: 1.5rem;
}

.spinner {
    margin: 10px;
    padding: 10px;
}

.mcq_option {
    padding: 5px
}


</style>