<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useIdentityStore } from '@/stores/identity'
import { useDashboardStore } from '@/stores/dashboard'
import { useFragmentsStore } from '@/stores/fragments'
import { useGrowStore } from '@/stores/grow'
import { useFootprintsStore } from '@/stores/footprints'
import { useBucketListStore } from '@/stores/bucketlist'
import { useLettersStore } from '@/stores/letters'
import { useCareStore } from '@/stores/care'
import BottomNav from './BottomNav.vue'

const route = useRoute()
const identity = useIdentityStore()

// Preload all stores on mount
onMounted(() => {
  useDashboardStore().init()
  useFragmentsStore().init()
  useGrowStore().init()
  useFootprintsStore().init()
  useBucketListStore().init()
  useLettersStore().init()
  useCareStore().init()
})

function switchTo(id: '小鸡毛' | '小白') {
  identity.setIdentity(id)
}
</script>

<template>
  <div class="app-container relative flex flex-col bg-sunshine-50">
    <!-- Identity Switcher -->
    <div class="flex items-center justify-center gap-3 px-4 py-2 bg-white/80 backdrop-blur border-b border-warm-100">
      <span class="text-xs text-warm-400">当前身份：</span>
      <button
        class="px-3 py-1 rounded-full text-xs font-medium transition-all"
        :class="identity.current === '小鸡毛'
          ? 'bg-sunshine-400 text-warm-800 shadow-sm'
          : 'bg-warm-100 text-warm-400 hover:bg-warm-200'"
        @click="switchTo('小鸡毛')"
      >
        🧑‍💻 小鸡毛
      </button>
      <button
        class="px-3 py-1 rounded-full text-xs font-medium transition-all"
        :class="identity.current === '小白'
          ? 'bg-sunshine-400 text-warm-800 shadow-sm'
          : 'bg-warm-100 text-warm-400 hover:bg-warm-200'"
        @click="switchTo('小白')"
      >
        💕 小白
      </button>
    </div>

    <!-- Page Content -->
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

    <!-- Bottom Navigation -->
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
