import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/Love-Diary/'),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/pages/DashboardPage.vue'),
      meta: { title: '看板', icon: 'LayoutDashboard' },
    },
    {
      path: '/fragments',
      name: 'fragments',
      component: () => import('@/pages/FragmentsPage.vue'),
      meta: { title: '碎片', icon: 'Images' },
    },
    {
      path: '/grow',
      name: 'grow',
      component: () => import('@/pages/GrowPage.vue'),
      meta: { title: '成长', icon: 'Sprout' },
    },
    {
      path: '/footprints',
      name: 'footprints',
      component: () => import('@/pages/FootprintsPage.vue'),
      meta: { title: '足迹', icon: 'MapPin' },
    },
    {
      path: '/bucketlist',
      name: 'bucketlist',
      component: () => import('@/pages/BucketListPage.vue'),
      meta: { title: '心愿', icon: 'Heart' },
    },
    {
      path: '/care',
      name: 'care',
      component: () => import('@/pages/CarePage.vue'),
      meta: { title: '呵护', icon: 'CalendarHeart' },
    },
  ],
})

export default router
