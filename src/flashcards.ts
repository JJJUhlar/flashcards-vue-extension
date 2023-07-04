import { reactive } from 'vue';

export interface Path {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export interface McqOption {
    option: string,
    correct: boolean
}

export class Flashcard {
    input: string
    card_front:string
    card_back: string
    origin: string
    prompt: {value: string}
    answer: {value: string}
    card_type: {value: "default" | "front-back" | "mcq" | "acrostic" | "rhyme" | "canvas"}
    mcq_options: {value: McqOption[]};
    mcq_prompt: {value: string}
    rhyme: {value: string};
    rhyme_prompt: {value: string}
    acrostic: {value: string};
    acrostic_prompt: {value: string}
    canvas_prompt: {value: string}
    pathsJson = "[]"
    paths = [] as Path[]
    loading: boolean
    id: number | null
    serverAddr: string

    constructor(
            input: string = "", 
            origin: string = "",
            card_front: string = "",
            card_back: string = "",
            card_type: "default" | "front-back" | "mcq" | "acrostic" | "rhyme" | "canvas" = "front-back",
            id: null|number = null
        ) {
        this.serverAddr = "https://flashcards-server.herokuapp.com/"
        this.id = id
        this.input = input;
        this.card_front = card_front;
        this.card_back = card_back;
        this.prompt = reactive({value: card_front});
        this.answer = reactive({value: card_back});
        this.origin = origin;
        this.card_type = reactive({value: card_type});
        this.rhyme = reactive({value: ""})
        this.rhyme_prompt = reactive({value: ""})
        this.loading = false;
        this.acrostic_prompt = reactive({value: ""})
        this.acrostic = reactive({value: ""})
        this.mcq_options = reactive({value: [
            {option: "", correct: false},
            {option: "", correct: false},
            {option: "", correct: true},
            {option: "", correct: false}
        ] as McqOption[]})
        this.mcq_prompt = reactive({value: ""})
        this.canvas_prompt = reactive({value: ""})
        this.createFrontBack()
        
    }
    
    changeType(card_type: "front-back" | "mcq" | "acrostic" | "rhyme" | "canvas") {
        this.card_type.value = card_type
        if (this.input !== '') {
            if (this.card_type.value === "mcq") this.createMCQ()
            if (this.card_type.value === "acrostic") this.createAcrostic()
            if (this.card_type.value === "rhyme") this.createRhyme()
        }
    }
    async createFrontBack(): Promise<void> {
        if (this.input !== "" && this.prompt.value === "" && this.answer.value === "") {
            try {
                const token = await this.getSessionToken()
                

                const response = await fetch(`${this.serverAddr}api/single_flashcard`, {
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        "text": this.input,
                        "card_type": 'default',
                        "origin": this.origin
                    })
                })
                if (!response.ok) throw new Error('Failed to create new cards')

                const data = await response.json()
                console.log(data)
            } catch (err) {
                console.error("error making card", err)
            }
        }
    }
    async createAcrostic(): Promise<void> {
        if (this.input !== "") {
            try {
                const token = await this.getSessionToken()

                const response = await fetch(`${this.serverAddr}api/single_flashcard`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        "text": this.input,
                        "card_type": 'mcq',
                        "origin": this.origin
                    })
                })
                if (!response.ok) throw new Error('Failed to create mcq cards') 
                
                const data = await response.json()
                let card_string = ""
                card_string += data.keyword.acrostic + "\n\n"
                for (let line in data.acrostic) {
                    card_string += `${line.toUpperCase()}: ` + Object.values(data.acrostic[line]).toString() + "\n" 
                }
                this.acrostic.value = card_string
                this.card_back = this.acrostic.value
            } catch (err) {            
                console.error(err)
            }
        }
    }
    async createRhyme(): Promise<void> {
        if (this.input !== "") {
            try {
                const token = await this.getSessionToken()

                const response = await fetch(`${this.serverAddr}api/single_flashcard`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        "text": this.input,
                        "card_type": 'rhyme',
                        "origin": this.origin
                    })
                })
                if (!response.ok) throw new Error('Failed to create mcq cards') 
                
                const data = await response.json()
                this.rhyme = data.rhyme
                this.card_back = this.rhyme.value

            } catch (err) {
                console.error(err)
            }
        }
    }
    async createMCQ(): Promise<void> {
        if (this.input !== "") {
            try {
                const token = await this.getSessionToken()

                const response = await fetch(`${this.serverAddr}api/single_flashcard`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        "text": this.input,
                        "card_type": 'mcq',
                        "origin": this.origin
                    })
                })
                if (!response.ok) throw new Error('Failed to create mcq cards') 
                
                const data = await response.json()

                this.mcq_options = data.flashcards.back
                this.mcq_prompt = data.flashcards.front
                this.card_front = data.flashcards.front
                this.card_back = JSON.stringify(data.flashcards.back)

                this.rhyme = data.rhyme

            } catch (err) {
                console.error(err)
            }
        }
    }
    saveCanvas(paths) {
        this.pathsJson = JSON.stringify(paths)
    }
    loadCanvas() {
        return JSON.parse(this.pathsJson)
    }
    setLoading(val: boolean) {
        this.loading = val
        if (val === true) {
            chrome.action.setBadgeText({text: "loading"})
        } else {
            chrome.action.setBadgeText({"text": ""})
        }
    }
    async getSessionToken(): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.session.get('sessionToken')
                    .then(({sessionToken})=> resolve(sessionToken))
                    .catch(err=> err)
            } catch (err) {
                console.error(err)
            }
        })
    }
    async saveCard(): Promise<void> {
        
        try {
            const token = await this.getSessionToken()

            const created_cards = [{
                "input": this.input,
                "origin": this.origin,
                "card_front": this.prompt,
                "card_back": this.answer,
                "card_type": this.card_type
            }]

            fetch('https://flashcards-server.herokuapp.com/api/save_cards', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    "created_cards": created_cards,
                    "username": localStorage.getItem('username')
                })
            })
            .then((res)=>{
                console.log('saved card')
                console.log(res)
            })
            .catch((err: Error)=>{
                console.error(err)
            })
            
        } catch (err) {
            console.error(err)
        }    

    }
    async updateEasy(): Promise<void> {
        try {
            const token = await this.getSessionToken()
    
            const response = await fetch(`${this.serverAddr}api/update_card`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    "card_to_update_id": this.id
                })
            })

            console.log(response)

            if (!response.ok) throw new Error(`Could not update card ease for id: ${this.id}`)
        } catch (err) {
            console.error(err)
        }        
    }
    async updateReset(): Promise<void> {
        try {
            const token = await this.getSessionToken()
            
            const response = await fetch('https://flashcards-server.herokuapp.com/api/reset_card', {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    "card_to_reset_id": this.id
                })
            })
            if (!response.ok) throw new Error(`Could not reset card ease for id: ${this.id}`)
            console.log(response)
        } catch (err) {
            console.error(err)
        }
    }
    async updateRemove(): Promise<void> {
        try {
            const token = await this.getSessionToken()

            const response = await fetch(`${this.serverAddr}api/delete_card`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    "card_to_delete_id": this.id
                })
            })

            if (!response.ok) throw new Error(`Could not remove card for id: ${this.id}`)
            
        } catch (err) {
            console.error(err)
        }
    }
    openReview(): void {
        chrome.tabs.create({
            url: this.origin,
            active: false
        })
    }
}


export class Deck {
    flashcards: Flashcard[]
    currentCardIndex: number;
    serverAddr: string

    constructor(flashcards?: Flashcard[], mergeDeck?: Deck) {
        this.serverAddr = "https://flashcards-server.herokuapp.com/"
        if (flashcards) {
            this.flashcards = flashcards  
        } else {
            this.flashcards = [] as Flashcard[]
        }

        this.currentCardIndex = 0

        if (mergeDeck) {
            this.concatDeck(mergeDeck)
        }

    }
    concatDeck(deck: Deck){
        this.flashcards = this.flashcards.concat(deck.flashcards)
    }
    addNewCard() {
        const card = new Flashcard()
        this.flashcards.push(card)
        this.currentCardIndex = this.flashcards.length -1
        // this.currentCard = ref(this.flashcards[this.flashcards.length])
    }
    addCard(card: Flashcard): void {
        this.flashcards.push(card)
    }

    get cardCount() {
        return this.flashcards.length
    }

    get getFlashcards(): Array<Flashcard> {
        if (this.flashcards.length === 0) return [] as Flashcard[]
        return this.flashcards
    }

    get currentIndex() {
        return this.currentCardIndex
    }

    get numberOfCards() {
        return this.flashcards.length
    }

    removeCard(): void {

        this.currentCard.updateRemove();
        this.deleteCard()
    }
    deleteCard(): void {

        console.log("deleting card", this.flashcards, this.numberOfCards, this.currentCardIndex)
        if (this.numberOfCards > 1) {
            this.flashcards.splice(this.currentCardIndex, 1)
            if (this.currentCardIndex === this.flashcards.length) {
                this.previousCard()
            }
        } else if (this.numberOfCards === 1) {
            this.flashcards.splice(this.currentCardIndex, 1)
            this.addNewCard()
        }
    }
    get currentCard(): Flashcard {
        
        if (this.numberOfCards === 0 ) {
            this.addNewCard()
        }

        return this.flashcards[this.currentCardIndex]
    }
    nextCard(): Flashcard {
        if (this.currentCardIndex < this.flashcards.length - 1 ) {
            this.currentCardIndex++
        }
        return this.currentCard
    }
    previousCard(): Flashcard {
        if (this.currentCardIndex > 0) {
            this.currentCardIndex--
        }
        return this.currentCard
    }
    reviewCard(): void {
        
        this.flashcards[this.currentCardIndex].openReview()
    }
    reviewFail(): void {
        this.reviewCard()
        this.currentCard.updateReset()
        this.flashcards.push(this.flashcards[this.currentCardIndex])
        this.flashcards.splice(this.currentCardIndex,1)
    }
    reviewEasy(): void {
        this.currentCard.updateEasy()
        this.deleteCard()
    }
    async getSessionToken(): Promise<string> {
        try {
            return new Promise((resolve, reject) => {                
                chrome.storage.session.get('sessionToken')
                    .then(({sessionToken})=> resolve(sessionToken))
                    .catch(err=> err)
            })
        } catch (err) {
            console.error(err)
            throw err
        }

    }
    getUsername(): string {
        return localStorage.getItem('username') || ''
    }
    async fetchDueCards(): Promise<void> {
        const token = await this.getSessionToken()

        try {
            const response = await fetch(`${this.serverAddr}api/due_cards?`+ new URLSearchParams({
                "username": this.getUsername()
            }), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            if (!response.ok) throw new Error(`Couldn't get ${this.getUsername()}'s due cards from ${this.serverAddr}`)

            const data = await response.json()
            console.log('fetched data: ', data)

            if (data) data.forEach(card => {
                const c = new Flashcard(card.input, card.origin, card.card_front, card.card_back, card.card_type, card.id)
                this.addCard(c)
            })
            console.log('fetched due cards: ', this.flashcards)
        } catch (err) {
            console.error(err)
        }
    }
    emptyDeck() {
        this.flashcards = []
    }
    async saveCreatedCard(): Promise<void> {
        
        this.currentCard.saveCard()
        this.deleteCard()

        

    }
}