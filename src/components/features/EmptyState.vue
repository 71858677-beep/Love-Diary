<script setup lang="ts">
defineProps<{
  emoji?: string
  title: string
  description?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-center px-4">
    <div class="w-20 h-20 rounded-full bg-sunshine-100 flex items-center justify-center text-3xl animate-breathe">
      {{ emoji || '📝' }}
    </div>
    <p class="mt-4 font-body text-warm-500 font-medium">{{ title }}</p>
    <p v-if="description" class="mt-1 text-sm text-warm-400">
      {{ description }}
    </p>
    <slot />
  </div>
</template>
