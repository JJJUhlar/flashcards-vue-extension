
<script lang="ts">

interface Flashcard {
    card_front: string,
    card_back: string,
    origin: string,
    input: string
    card_type: string
}

export default {

    data() {
        return {
            createdFlashcards: [] as Flashcard[],
            currentCreateFlashcard: {
                input: "",
                origin: "",
                card_front: "",
                card_back: "",
                card_type: "default"
            },
            currentCardIndex: 0,
            numberOfCards: 1,
            loading: false,
        }
    },
    methods: {
        async createFlashcard() {
            this.currentCreateFlashcard = {
                input: "",
                origin: "",
                card_front: "",
                card_back: "",
                card_type: "default"
            };

            const created_cards = await this.getCards();

            created_cards.push(this.currentCreateFlashcard)
            
            await chrome.storage.session.set({ "created_cards": created_cards })
            this.currentCardIndex = created_cards.length - 1
            this.updateCardCount()
            
        },
        async saveFlashcards() {

            const created_cards = await this.getCards();
            this.currentCreateFlashcard = created_cards[this.currentCardIndex];
            
            for (let i = 0; i < created_cards.length; i++) {
                if (created_cards[i].card_front === "" || created_cards[i].card_back === "") {
                    alert('Please fill out all flashcards before saving')
                    return
                }
            }

            fetch('https://flashcards-server.herokuapp.com/api/save_cards', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('sessionToken')}`
                },
                body: JSON.stringify({
                    "created_cards": created_cards,
                    "username": localStorage.getItem('username')
                })
            })
            .then((res)=> {return res.json()})
            .then((data)=>{
                if (data.msg === "saved cards!") {
                    alert('Flashcards saved')
                } else {
                    alert(`${data.msg}`)
                }
            })
            .catch((err: Error)=>{
                console.log(err)
            })

            await chrome.storage.session.set({ "created_cards": [{input: "",
                origin: "",
                card_front: "",
                card_back: "",
                card_type: "default"
            }] })            
            this.currentCardIndex = 0;
            this.currentCreateFlashcard = {
                input: "",
                origin: "",
                card_front: "",
                card_back: "",
                card_type: "default"
            };
            this.numberOfCards = 1;

        },
        async nextCard() {
            
            const created_cards = await this.getCards();
            this.currentCreateFlashcard = created_cards[this.currentCardIndex];
            
            if (this.currentCardIndex + 1 < created_cards.length) {
                this.currentCardIndex++;
                 this.updateCurrentCard();
            }                        

        },
        async previousCard() {
            const created_cards = await this.getCards();
            this.currentCreateFlashcard = created_cards[this.currentCardIndex];
            
            if (this.currentCardIndex > 0) {
                this.currentCardIndex--;
                this.updateCurrentCard();
            }

        },
        async updateCurrentCard() {
            const created_cards = await this.getCards();
            this.currentCreateFlashcard = created_cards[this.currentCardIndex];
        },
        async deleteCard() {
            const created_cards = await this.getCards();
            if (created_cards.length > 1) {
                created_cards.splice(this.currentCardIndex, 1)
                this.currentCardIndex = 0;
                try {
                    await chrome.storage.session.set({ "created_cards": created_cards })
                } catch (err) {
                    console.log(err)
                }
            } else if (created_cards.length === 1) {
                await chrome.storage.session.set({ "created_cards": [{"input": "",
                                        "origin": "",
                                        "card_front": "",
                                        "card_back": "",
                                        "card_type": "default"
                                    }] })
                this.currentCardIndex = 0;
            }
            this.updateCurrentCard();
        },
        async getGeneratedCards() {
            try {
                this.getCards()
            } catch (err) {
                console.log(err)
            }
        },
        async handleCreatedCardFrontChange(e: Event) {
            const target = (<HTMLInputElement>e.target)
            this.currentCreateFlashcard.card_front = target.value
            const cards = await this.getCards()
            cards[this.currentCardIndex].card_front = this.currentCreateFlashcard.card_front
            chrome.storage.session.set({ "created_cards": cards})
        },
        async handleCreatedCardBackChange(e: Event) {
            const target = (<HTMLInputElement>e.target)
            this.currentCreateFlashcard.card_back = target.value
            const cards = await this.getCards()
            cards[this.currentCardIndex].card_back = this.currentCreateFlashcard.card_back
            chrome.storage.session.set({ "created_cards": cards})
        },
        async getCards(): Promise<Flashcard[]> {
            return new Promise((resolve) => {
                chrome.storage.session.get('created_cards', (result) => {
                    if (!Array.isArray(result.created_cards) || result.created_cards === undefined) {
                        chrome.storage.session.set({ "created_cards": [{
                            "input": "",
                            "origin": "",
                            "card_front": "",
                            "card_back": "",
                            "card_type": "default"

                        }] }, () => {resolve([{
                            "input": "",
                            "origin": "",
                            "card_front": "",
                            "card_back": "",
                            "card_type": "default"

                        }] as Flashcard[]);
                        })
                    } else {
                        resolve(result.created_cards as Flashcard[])
                        this.updateCardCount()
                    }
                })
            })
        },
        async updateCardCount() {
            const created_cards: Flashcard[] = await this.getCards()
            this.numberOfCards = created_cards.length
        }
    },
    mounted () {       
        this.updateCurrentCard();
        this.getGeneratedCards();
    },
}
</script>

<template>
    <h3 v-if="loading">Loading...</h3>
    <h3 >{{ currentCardIndex + 1 }} / {{ numberOfCards }}</h3>
        <fieldset>
            
                <div>
                    <label for="flashcardPrompt">Question</label>
                    <textarea id="flashcardPrompt" placeholder="write a flashcard Q here" v-bind:value="currentCreateFlashcard.card_front" @input="handleCreatedCardFrontChange"/>
                </div>
                <div>
                    <label for="flashcardAnswer">Answer</label>
                    <textarea id="flashcardAnswer" placeholder="answers go here" v-bind:value="currentCreateFlashcard.card_back" @input="handleCreatedCardBackChange"/>
                </div>
                <div>
                    <button @click="previousCard" >Previous</button>
                    <button @click="nextCard" >Next</button>
                </div>
            <button @click="getGeneratedCards">Generate Cards</button>
            <button @click="saveFlashcards">Save Cards</button>
            <button @click="deleteCard">Delete Card</button>
            <button @click="createFlashcard">Add Card</button>
        </fieldset>
</template>

<style>

</style>