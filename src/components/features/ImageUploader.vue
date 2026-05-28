<script setup lang="ts">
import { useImageUpload } from '@/composables/useImageUpload'

const props = withDefaults(defineProps<{
  images: string[]
  max?: number
  accept?: string
}>(), {
  accept: 'image/*',
})

const emit = defineEmits<{
  'update:images': [images: string[]]
}>()

const { compressImage, openFilePicker } = useImageUpload()

function isVideo(base64: string): boolean {
  return base64.startsWith('data:video/')
}

async function addImage() {
  if (props.max && props.images.length >= props.max) return
  const file = await openFilePicker(props.accept)
  if (!file) return
  const base64 = await compressImage(file, 1200, 0.85)
  emit('update:images', [...props.images, base64])
}

function removeImage(index: number) {
  const updated = [...props.images]
  updated.splice(index, 1)
  emit('update:images', updated)
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <div
      v-for="(item, idx) in images"
      :key="idx"
      class="relative w-20 h-20 rounded-lg overflow-hidden border border-warm-200"
    >
      <img v-if="!isVideo(item)" :src="item" alt="" class="w-full h-full object-cover" />
      <video v-else :src="item" class="w-full h-full object-cover" />
      <button
        class="absolute top-0.5 right-0.5 w-5 h-5 bg-warm-800/60 text-white rounded-full flex items-center justify-center text-[10px]"
        @click="removeImage(idx)"
      >
        ✕
      </button>
    </div>
    <button
      v-if="!max || images.length < max"
      class="w-20 h-20 rounded-lg border-2 border-dashed border-warm-300 flex items-center justify-center text-2xl text-warm-400 hover:border-sunshine-400 hover:text-sunshine-400 transition-colors"
      @click="addImage"
    >
      +
    </button>
  </div>
</template>
