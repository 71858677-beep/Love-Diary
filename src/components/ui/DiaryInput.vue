<script setup lang="ts">
import { ref } from 'vue'

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

function onInput(e: Event) {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="relative">
    <textarea
      v-if="type === 'textarea'"
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxlength"
      rows="4"
      class="w-full bg-sunshine-50 border rounded-xl px-4 py-3 font-body text-base text-warm-800 placeholder:text-warm-400 outline-none transition-all duration-150 resize-none"
      :class="focused
        ? 'border-sunshine-400 shadow-[0_0_0_3px_rgb(255_217_61_/_0.15)] bg-white'
        : 'border-warm-200'"
      @focus="focused = true"
      @blur="focused = false"
      @input="onInput"
    />
    <textarea
      v-else
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxlength"
      rows="1"
      class="w-full bg-sunshine-50 border rounded-xl px-4 py-3 font-body text-base text-warm-800 placeholder:text-warm-400 outline-none transition-all duration-150 resize-none field-sizing-content"
      :class="focused
        ? 'border-sunshine-400 shadow-[0_0_0_3px_rgb(255_217_61_/_0.15)] bg-white'
        : 'border-warm-200'"
      @focus="focused = true"
      @blur="focused = false"
      @input="onInput"
    />
    <span
      v-if="maxlength"
      class="absolute bottom-2 right-3 text-[10px] text-warm-400"
    >
      {{ modelValue.length }}/{{ maxlength }}
    </span>
  </div>
</template>
