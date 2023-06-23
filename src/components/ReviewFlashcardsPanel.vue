<script lang="ts">

interface Flashcard {
    id: number,
    card_front: string,
    card_back: string,
    origin: string
}

export default {
    data() {
        return {
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
    methods: {
        nextCard() {
            this.answerHidden = true;
        },
        revealAnswer() {
            if (this.answerHidden === false) {
                this.answerHidden = true;
            } else {
                this.answerHidden = false;
            }
        },
        easyCard() {
            if (this.reviewFlashcards.length === 0) {
                this.reviewFinished = true;
                this.reviewFlashcards = [];
            } else if (this.reviewFlashcards.length === 1) {
                fetch('https://flashcards-server.herokuapp.com/api/update_card', {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('sessionToken')}`
                    },
                    body: JSON.stringify({
                        "card_to_update_id": this.reviewFlashcards[0].id
                    })
                }).catch((err: Error)=>{
                    console.log(err)
                })

                this.reviewFinished = true;
                this.reviewFlashcards = [];

            } else {
            
                fetch('https://flashcards-server.herokuapp.com/api/update_card', {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('sessionToken')}`
                    },
                    body: JSON.stringify({
                        "card_to_update_id": this.reviewFlashcards[0].id
                    })
                }).catch((err: Error)=>{
                    console.log(err)
                })

                this.reviewFlashcards.splice(0, 1);
            }
            this.nextCard()
        },
        dunnoCard() {
            this.reviewFlashcards.push(this.reviewFlashcards[0]);

            chrome.tabs.create({
                url: this.reviewFlashcards[0].origin,
                active: false
            })
                        
            fetch('https://flashcards-server.herokuapp.com/api/reset_card', {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('sessionToken')}`
                },
                body: JSON.stringify({
                    "card_to_reset_id": this.reviewFlashcards[0].id
                })
            })
            .catch((err: Error)=>{
                console.log(err)
            })

            this.reviewFlashcards.splice(0, 1);
            this.nextCard()
        },
        deleteCard() {
            this.reviewFlashcards.splice(0, 1);
            
            fetch('https://flashcards-server.herokuapp.com/api/delete_card', {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('sessionToken')}`
                },
                body: JSON.stringify({
                    "card_to_delete_id": this.reviewFlashcards[0].id
                })
            })
            .catch((err: Error)=>{
                console.log(err)
            })

            alert('Card deleted')
            this.nextCard()
        }
    },
    created() {
        let username = localStorage.getItem('username') || ''
        let token = localStorage.getItem('sessionToken') || ''

        if (token && username) {
            this.loading = true;
            fetch('https://flashcards-server.herokuapp.com/api/due_cards?' + new URLSearchParams({
                "username": username
            }), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('sessionToken')}`
                }
            })
            .then(response => response.json())
            .then(data => {
                this.loading = false;
                if (data) {
                    data.forEach((card: any) => {
                        this.reviewFlashcards.push(card)
                    });
                }
            })
            .catch((err: Error)=>{
                this.loading = false;
                chrome.storage.session.set({'isLoggedIn': false})
                console.log(err)
            })
        } else {
            this.loading = false;
            console.log('Not logged in')
            chrome.storage.session.set({'isLoggedIn': false})
        }
    }
}
</script>

<template>
    <h3 v-if="loading">Loading...</h3>
    <h3> {{ reviewFlashcards.length }} cards left</h3>
    <h1 v-if="reviewFinished">Review Finished!</h1>
    <div v-else>
        <fieldset v-if="reviewFlashcards.length > 0">
            <div>
                <label>Question</label>
                <p>{{ reviewFlashcards[0].card_front }}</p>
            </div>
            <label>Answer</label>
            <p :hidden="answerHidden">{{ reviewFlashcards[0].card_back }}</p>
            <button class="reveal-btn" @click="revealAnswer" v-if="answerHidden">reveal answer</button>
            <div :hidden="answerHidden">
                <button @click="easyCard">Easy</button>
                <button @click="dunnoCard">Dunno</button>
                <button @click="deleteCard">Delete</button>
            </div>
        </fieldset>
        <h3 v-else>Nothing to review</h3>
    </div>
</template>

<style scoped>
label {
    display: block;
    line-height: 1rem;
    font-size: 0.8rem;
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