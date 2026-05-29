<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  maxlength?: number
  type?: 'text' | 'textarea'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const focused = ref(false)
const textareaEl = ref<HTMLTextAreaElement | null>(null)

function resize() {
  nextTick(() => {
    const el = textareaEl.value
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  })
}

function onInput(e: Event) {
  const target = e.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  resize()
}

watch(() => props.modelValue, () => resize())
</script>

<template>
  <div class="relative">
    <textarea
      ref="textareaEl"
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :rows="type === 'textarea' ? 4 : 1"
      class="w-full bg-sunshine-50 border rounded-xl px-4 py-3 font-body text-base text-warm-800 placeholder:text-warm-400 outline-none transition-colors duration-150 resize-none overflow-hidden"
      :class="focused
        ? 'border-sunshine-400 shadow-[0_0_0_3px_rgb(255_217_61_/_0.15)] bg-white'
        : 'border-warm-200'"
      @focus="focused = true"
      @blur="focused = false"
      @input="onInput"
    />
  </div>
</template>
