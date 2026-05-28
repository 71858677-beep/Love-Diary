<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  loading?: boolean
}>()
</script>

<template>
  <button
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold min-h-[44px] transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="{
      'bg-sunshine-400 text-warm-800 shadow-diary-sm hover:bg-sunshine-500 hover:shadow-diary-md':
        variant === 'primary' || !variant,
      'bg-white text-warm-600 border border-warm-200 hover:bg-warm-50':
        variant === 'secondary',
      'bg-transparent text-warm-500 hover:bg-warm-50':
        variant === 'ghost',
    }"
  >
    <span v-if="loading" class="animate-spin text-lg">⏳</span>
    <slot />
  </button>
</template>
