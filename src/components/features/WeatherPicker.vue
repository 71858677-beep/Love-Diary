<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const WEATHER_OPTIONS = [
  { value: 'sunny', emoji: '☀️', label: '晴' },
  { value: 'cloudy', emoji: '🌤️', label: '多云' },
  { value: 'overcast', emoji: '⛅', label: '阴' },
  { value: 'rainy', emoji: '🌧️', label: '雨' },
  { value: 'stormy', emoji: '⛈️', label: '暴雨' },
  { value: 'snowy', emoji: '❄️', label: '雪' },
  { value: 'rainbow', emoji: '🌈', label: '彩虹' },
]

function select(value: string) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="w in WEATHER_OPTIONS"
      :key="w.value"
      class="w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg transition-all duration-150 active:scale-90"
      :class="modelValue === w.value
        ? 'border-sunshine-400 bg-sunshine-100 shadow-sm'
        : 'border-warm-200 bg-white hover:border-warm-300'"
      :aria-label="w.label"
      @click="select(w.value)"
    >
      {{ w.emoji }}
    </button>
  </div>
</template>
