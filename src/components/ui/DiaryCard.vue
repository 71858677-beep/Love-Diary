<script setup lang="ts">
defineProps<{
  completed?: boolean
  clickable?: boolean
}>()
</script>

<template>
  <div
    class="bg-white border border-warm-100 rounded-xl p-5 shadow-diary-sm transition-all duration-250"
    :class="[
      completed ? 'bg-sunshine-100 border-sunshine-300' : '',
      clickable ? 'cursor-pointer active:scale-[0.98] hover:shadow-diary-md hover:-translate-y-0.5' : '',
    ]"
  >
    <slot />
  </div>
</template>
