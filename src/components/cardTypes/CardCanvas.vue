<script lang="ts">

import { Flashcard } from '@/flashcards';
import type {Path} from '@/flashcards'
import { defineComponent } from 'vue'

export default defineComponent({
    data() {
        return {
            canvas: null as HTMLCanvasElement | null,
            ctx: null as CanvasRenderingContext2D | null,
            isDrawing: false,
            lastX: 0,
            lastY: 0,
            jsonInput: "",
            frozen: false,
        };
    },
    props: {
        flashcard: {
            type: Flashcard,
            required: true
        }
    },
    methods: {
        startDrawing(e: MouseEvent) {
            if (!this.frozen) {
                this.isDrawing = true;
                [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
            }
        },
        draw(e: MouseEvent) {
            if (!this.isDrawing) return;
    
            if (!this.ctx) return;
    
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(e.offsetX, e.offsetY);
            this.ctx.stroke();
    
            const path: Path = {
            startX: this.lastX,
            startY: this.lastY,
            endX: e.offsetX,
            endY: e.offsetY
            };
            this.flashcard.paths.push(path);
    
            [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
        },
        stopDrawing() {
            this.isDrawing = false;
        },
        clearCanvas() {
            if (!this.frozen) {
                if (!this.ctx) return;
                
                this.ctx.clearRect(0, 0, this.canvas?.width || 0, this.canvas?.height || 0);
                this.flashcard.paths = [];
            }
        },
        loadPaths(paths) {
             // Clear the canvas before loading paths
            paths.forEach((path) => {
                const { startX, startY, endX, endY } = path;
    
                if (!this.ctx) return;
    
                this.ctx.beginPath();
                this.ctx.moveTo(startX, startY);
                this.ctx.lineTo(endX, endY);
                this.ctx.stroke();
            });
        }
    },
    mounted() {
      this.canvas = this.$refs.canvas as HTMLCanvasElement;
      this.ctx = this.canvas.getContext("2d");
      this.loadPaths(this.flashcard.paths)
    },
})

</script>

<template>

        <div class="flashcard_field">
            <label for="flashcardPrompt">Question</label>
            <textarea 
                id="flashcardPrompt" 
                placeholder="E.g. How do you write the characters for 'Ni Hao' " 
                v-model="flashcard.canvas_prompt.value"
            />
        <!-- <textarea id="flashcardPrompt" placeholder="E.g. How do you write the characters for 'Ni Hao' " v-bind:value="currentCreateFlashcard.card_front" @input="handleCreatedCardFrontChange"/> -->
        </div>
        <div class="canvas_container">
            <canvas 
                ref="canvas" 
                @mousedown="startDrawing" 
                @mousemove="draw" 
                @mouseup="stopDrawing"
            />
        </div>
        <div>
            <button @click="clearCanvas">Clear Canvas</button>
        </div>
    
    <!-- <label for="flashcardAnswer">Answer</label> -->
        <!-- <Canvas @save-paths="handleSavePaths" :pathsJson="paths_json_to_load" /> -->
</template>

  
<style scoped>
canvas {
    border: 1px solid #ccc;
    border-radius: 3px;
}

.canvas_container {
    display: grid;
}

div {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: stretch;
    align-content: center;
    justify-content: center;
    padding: 5px;
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

input {
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