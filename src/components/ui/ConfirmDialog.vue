<script setup lang="ts">
defineProps<{
  show: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-[60] flex items-center justify-center px-8"
      style="animation: love-fade-in 0.2s ease-out"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-warm-900/30 backdrop-blur-sm" @click="emit('cancel')" />

      <!-- Dialog -->
      <div
        class="relative bg-white rounded-2xl shadow-diary-lg p-6 w-full max-w-[300px] text-center"
        style="animation: love-dialog-pop 0.3s cubic-bezier(0.34, 1.3, 0.64, 1)"
      >
        <p v-if="title" class="font-display text-lg text-warm-800 mb-2">{{ title }}</p>
        <p class="text-sm text-warm-500 leading-relaxed">{{ message }}</p>

        <div class="mt-6 flex gap-3">
          <button
            class="flex-1 py-2.5 rounded-full border border-warm-200 text-sm text-warm-500 font-medium hover:bg-warm-50 transition-colors"
            @click="emit('cancel')"
          >
            {{ cancelText || '取消' }}
          </button>
          <button
            class="flex-1 py-2.5 rounded-full bg-sunshine-400 text-warm-800 text-sm font-semibold hover:bg-sunshine-500 transition-colors"
            @click="emit('confirm')"
          >
            {{ confirmText || '确认' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style>
@keyframes love-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes love-dialog-pop {
  from { opacity: 0; transform: scale(0.9) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
