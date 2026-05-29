<script setup lang="ts">
import { onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { useFragmentsStore } from '@/stores/fragments'
import { useGrowStore } from '@/stores/grow'
import { useFootprintsStore } from '@/stores/footprints'
import { useBucketListStore } from '@/stores/bucketlist'
import { useLettersStore } from '@/stores/letters'
import { useCareStore } from '@/stores/care'
import BottomNav from './BottomNav.vue'

// Preload all stores in parallel on mount
onMounted(() => {
  Promise.all([
    useDashboardStore().init(),
    useFragmentsStore().init(),
    useGrowStore().init(),
    useFootprintsStore().init(),
    useBucketListStore().init(),
    useLettersStore().init(),
    useCareStore().init(),
  ])
})
</script>

<template>
  <div class="app-container relative flex flex-col bg-sunshine-50">
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
