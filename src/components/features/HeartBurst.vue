<script setup lang="ts">
import { ref, onMounted } from 'vue'

const hearts = ref<{ id: number; x: number; delay: number; emoji: string }[]>([])
let nextId = 0

const HEART_EMOJIS = ['💕', '💖', '💗', '💝', '✨', '🩷']

function spawnHearts(x: number, count: number = 4) {
  for (let i = 0; i < count; i++) {
    const id = nextId++
    hearts.value.push({
      id,
      x: x + (Math.random() - 0.5) * 40,
      delay: Math.random() * 150,
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
    })
    setTimeout(() => {
      hearts.value = hearts.value.filter((h) => h.id !== id)
    }, 900 + Math.random() * 200)
  }
}

defineExpose({ spawn: spawnHearts })
</script>

<template>
  <Teleport to="body">
    <div class="pointer-events-none fixed inset-0 z-[999] overflow-hidden">
      <span
        v-for="h in hearts"
        :key="h.id"
        class="absolute text-lg animate-heart-float"
        :style="{
          left: `${h.x}px`,
          top: '60%',
          animationDelay: `${h.delay}ms`,
        }"
      >
        {{ h.emoji }}
      </span>
    </div>
  </Teleport>
</template>
