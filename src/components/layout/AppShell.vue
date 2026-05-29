<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { useFragmentsStore } from '@/stores/fragments'
import { useGrowStore } from '@/stores/grow'
import { useFootprintsStore } from '@/stores/footprints'
import { useBucketListStore } from '@/stores/bucketlist'
import { useLettersStore } from '@/stores/letters'
import { useCareStore } from '@/stores/care'
import BottomNav from './BottomNav.vue'

const appReady = ref(false)

// Load all stores in parallel, then show app
onMounted(async () => {
  await Promise.all([
    useDashboardStore().init(),
    useFragmentsStore().init(),
    useGrowStore().init(),
    useFootprintsStore().init(),
    useBucketListStore().init(),
    useLettersStore().init(),
    useCareStore().init(),
  ])
  appReady.value = true
})
</script>

<template>
  <div class="app-container relative flex flex-col bg-sunshine-50">
    <!-- Loading Screen -->
    <div
      v-if="!appReady"
      class="flex-1 flex flex-col items-center justify-center min-h-screen"
    >
      <h1 class="font-display text-3xl font-bold text-warm-800 tracking-wide">恋爱日记</h1>
      <p class="text-xs text-warm-400 mt-2 font-hand text-lg mb-6">记录属于我们的每一天</p>
      <div class="flex gap-1.5">
        <span class="w-2 h-2 rounded-full bg-sunshine-400 animate-bounce" style="animation-delay: 0s" />
        <span class="w-2 h-2 rounded-full bg-sunshine-400 animate-bounce" style="animation-delay: 0.15s" />
        <span class="w-2 h-2 rounded-full bg-sunshine-400 animate-bounce" style="animation-delay: 0.3s" />
      </div>
    </div>

    <!-- Main App -->
    <template v-else>
      <main class="flex-1 overflow-y-auto pb-24">
        <router-view v-slot="{ Component, route: r }">
          <Transition
            :name="'page-slide'"
            mode="out-in"
          >
            <component :is="Component" :key="r.path" />
          </Transition>
        </router-view>
      </main>
      <BottomNav />
    </template>
  </div>
</template>

<style scoped>
.page-slide-enter-active {
  animation: card-enter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-slide-leave-active {
  animation: fade-out 0.15s ease-in;
}

@keyframes fade-out {
  to {
    opacity: 0;
    transform: translateY(-8px);
  }
}
</style>
