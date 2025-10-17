<template>
  <div class="music-player">
    <img :src="currentSong.cover" alt="cover" class="cover" />

    <div class="info">
      <h4>{{ currentSong.title }}</h4>
      <p>{{ currentSong.artist }}</p>

      <div class="progress" @mousedown="onSeekStart" @mouseup="onSeekEnd">
        <div class="bar" :style="{ width: progress + '%' }"></div>
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          v-model="progress"
          class="slider"
          @input="onSeekMove"
        />
      </div>

      <div class="controls">
        <button @click="prevSong">⏮︎</button>
        <button @click="togglePlay">{{ isPlaying ? '⏸︎' : '▶︎' }}</button>
        <button @click="nextSong">⏭︎</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const playlist = [
  {
    title: 'Constant Moderato',
    artist: 'Mistukiyo',
    cover: '/img/shiroko.png',
    src: '/music/Constant Moderato.ogg',
  },
  {
    title: 'Daily Routine',
    artist: 'Nor',
    cover: '/img/hoshino.png',
    src: '/music/Daily Routine 247.ogg',
  },
  {
    title: 'Luminous Memory',
    artist: 'Nor',
    cover: '/img/azusa.png',
    src: '/music/Luminous Memory.ogg',
  },
  {
    title: 'Shooting Star',
    artist: 'KARUT',
    cover: '/img/arona.png',
    src: '/music/Shooting Stars.ogg',
  },
  {
    title: "You're My Princess",
    artist: 'EmoCosine',
    cover: '/img/mika.png',
    src: "/music/You're My Princess.ogg",
  },
]

const currentIndex = ref(0)
const currentSong = computed(() => playlist[currentIndex.value])

const audio = ref(new Audio(currentSong.value.src))
const isPlaying = ref(false)
const progress = ref(0)
let progressTimer = null
let isSeeking = false // 防止拖动时触发更新冲突

// 播放歌曲
function playSong() {
  audio.value.play()
  isPlaying.value = true
  progressTimer = setInterval(() => {
    if (!isSeeking && audio.value.duration)
      progress.value = (audio.value.currentTime / audio.value.duration) * 100
  }, 500)
}

// 音量淡出暂停
function pauseSong(duration = 1000) {
  return new Promise((resolve) => {
    const steps = 20
    const stepTime = duration / steps
    let currentStep = 0
    const initialVolume = audio.value.volume

    const fade = setInterval(() => {
      currentStep++
      const newVolume = Math.max(0, initialVolume * (1 - currentStep / steps))
      audio.value.volume = newVolume

      if (currentStep >= steps) {
        clearInterval(fade)
        audio.value.pause()
        audio.value.volume = initialVolume
        resolve()
      }
    }, stepTime)
  })
}

// 播放 / 暂停切换
async function togglePlay() {
  if (!audio.value) return
  if (isPlaying.value) {
    await pauseSong(1000)
    isPlaying.value = false
  } else {
    playSong()
  }
}

// 等待间隔（用于切换曲目间隙）
function gapSong() {
  return new Promise((resolve) => setTimeout(resolve, 800))
}

async function nextSong() {
  currentIndex.value = (currentIndex.value + 1) % playlist.length
  await changeTrack()
}

async function prevSong() {
  currentIndex.value = (currentIndex.value - 1 + playlist.length) % playlist.length
  await changeTrack()
}

async function changeTrack() {
  await pauseSong()
  await gapSong()
  audio.value.src = currentSong.value.src
  audio.value.load()
  playSong()
}

// ✅ 拖动控制函数
function onSeekStart() {
  isSeeking = true
}
function onSeekMove() {
  if (audio.value.duration) {
    const newTime = (progress.value / 100) * audio.value.duration
    audio.value.currentTime = newTime
  }
}
function onSeekEnd() {
  isSeeking = false
}

onMounted(() => {
  audio.value.addEventListener('ended', async () => {
    await nextSong()
  })
})

onUnmounted(() => {
  audio.value.pause()
  clearInterval(progressTimer)
})
</script>

<style scoped>
.music-player {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 240px;
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  padding: 12px;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}
.music-player:hover {
  transform: translateY(-4px);
}

.cover {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  margin-right: 10px;
  object-fit: cover;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.info {
  flex: 1;
  text-align: left;
}

.info h4 {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.info p {
  margin: 2px 0 6px;
  font-size: 12px;
  color: #666;
}

/* ✅ 进度条样式 */
.progress {
  position: relative;
  height: 6px;
  background-color: rgba(200, 200, 200, 0.4);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 6px;
}

.bar {
  height: 100%;
  background-color: rgba(69, 233, 181, 0.6);
  border-radius: 2px;
  transition: width 0.2s;
}

/* ✅ 拖动滑块：透明层 */
.slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0; /* 完全透明 */
  cursor: pointer;
}

.controls {
  display: flex;
  justify-content: space-between;
}
.controls button {
  border: none;
  background: transparent;
  font-size: 16px;
  cursor: pointer;
  color: #3b82f6;
  transition: transform 0.2s;
}
.controls button:hover {
  transform: scale(1.1);
}
</style>