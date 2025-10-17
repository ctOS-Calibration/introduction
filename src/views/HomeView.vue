<template>
    <section class = "content">
        <h1>{{ name }}</h1>
        <h2>{{ title }}</h2>
        <p>{{ tagline }}</p>
        <button @click = "showMore = !showMore">
            {{ showMore ? 'Hide details (> Δ <)' : 'Show more (> ∇ <)' }}
        </button>
        <transition name = "slide">
            <p v-if = "showMore" class = "details">{{ longIntro }}</p>
        </transition>
    </section>
</template>

<script setup>
import { ref } from 'vue'
const name = 'ctOS Calibration'
const title = 'Data Science & Big Data Student + Artificial Intelligence'
const tagline = 'Exploring the intersection of AI and large-scale data systems'
const longIntro = 'Currently, I focus on consumer choice modelling, neural networks, and big data analysis using Python, MATLAB and R. I also explore industrial large models and multimodal knowledge graph integration.'
const showMore = ref(false)
</script>