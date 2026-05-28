<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import {
  LayoutDashboard,
  Images,
  Sprout,
  MapPin,
  Heart,
  CalendarHeart,
} from 'lucide-vue-next'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

interface NavItem {
  path: string
  icon: typeof LayoutDashboard
  label: string
}

const navItems: NavItem[] = [
  { path: '/dashboard', icon: LayoutDashboard, label: '主页' },
  { path: '/fragments', icon: Images, label: '碎片' },
  { path: '/grow', icon: Sprout, label: '成长' },
  { path: '/footprints', icon: MapPin, label: '足迹' },
  { path: '/bucketlist', icon: Heart, label: '心愿' },
  { path: '/care', icon: CalendarHeart, label: '呵护' },
]

function isActive(path: string): boolean {
  return route.path === path
}

function navigate(path: string) {
  router.push(path)
}
</script>

<template>
  <nav
    class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/90 backdrop-blur-lg border-t border-warm-200 z-50 safe-area-bottom"
  >
    <div class="flex justify-around items-center px-1 py-1">
      <button
        v-for="item in navItems"
        :key="item.path"
        class="flex flex-col items-center gap-0.5 py-1 px-2 min-w-[56px] min-h-[44px] justify-center transition-all duration-150 rounded-lg"
        :class="
          isActive(item.path)
            ? 'text-sunshine-400'
            : 'text-warm-400 hover:text-warm-600'
        "
        @click="navigate(item.path)"
        :aria-label="item.label"
      >
        <component
          :is="item.icon"
          :size="22"
          :stroke-width="isActive(item.path) ? 2.5 : 2"
        />
        <span
          class="text-[10px] font-medium leading-none"
        >
          {{ item.label }}
        </span>
        <!-- Active Indicator -->
        <span
          v-if="isActive(item.path)"
          class="absolute top-0 w-4 h-0.5 bg-sunshine-400 rounded-full"
        />
      </button>
    </div>
  </nav>
</template>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
button {
  position: relative;
}
</style>
