<template>
  <div id="app">
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/about">About</router-link></li>
        <li><router-link to="/contact">Contact</router-link></li>
      </ul>
    </nav>

    <router-view></router-view>

    <footer>
      <p>© 2025 ctOS Calibration. All rights reserved. (bushi)</p>
    </footer>
    
    <MusicPlayer />
  </div>
</template>

<script setup>
import MusicPlayer from './components/MusicPlayer.vue'
</script>
