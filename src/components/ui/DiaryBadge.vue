<script setup lang="ts">
defineProps<{
  variant?: 'sunshine' | 'rose' | 'muted'
}>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-tight"
    :class="{
      'bg-sunshine-200 text-warm-700': variant === 'sunshine' || !variant,
      'bg-rose-100 text-rose-400': variant === 'rose',
      'bg-warm-100 text-warm-500': variant === 'muted',
    }"
  >
    <slot />
  </span>
</template>
