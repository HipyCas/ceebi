import { Preferences } from '@capacitor/preferences';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Tabs from '../views/TabsLayout.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/slides',
    component: () => import('../views/SlidesPage.vue'),
  },
  {
    path: '/',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: '/notifications',
      },
      {
        path: 'code',
        component: () => import('../views/QRCodePage.vue'),
      },
      {
        path: 'schedule',
        component: () => import('../views/SchedulePage.vue'),
      },
      {
        path: 'news',
        component: () => import('../views/NewsPage.vue'),
      },
      {
        path: 'notifications',
        component: () => import('../views/NotificationsPage.vue'),
        beforeEnter: async () => {
          console.info(
            'mmmmm',
            await Preferences.get({ key: 'ceebiClient.slidesDone' })
          );
          if (
            (await Preferences.get({ key: 'ceebiClient.slidesDone' })).value ===
            null
          )
            return '/slides';
        },
      },
      {
        path: 'about',
        component: () => import('../views/AboutPage.vue'),
      },
      {
        path: 'settings',
        component: () => import('../views/SettingsPage.vue'),
      },
    ],
  },
  {
    path: '/auth/login',
    component: () => import('../views/auth/LoginPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// router.beforeEach((to, from, next) => {
//   console.info('TO', `/auth/recovery?${to.hash.replace('#', '')}`, to.hash);
//   if (from.hash.includes('type=recovery'))
//     return `/auth/recovery?${to.hash.replace('#', '')}`;
// });

export default router;
