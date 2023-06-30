import { user } from '~/lib/user';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsLayout.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/auth',
  },
  {
    path: '/p/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/p/notifications',
      },
      {
        path: 'attendance',
        component: () => import('@/views/AttendancePage.vue'),
      },
      {
        path: 'notifications',
        component: () => import('@/views/NotificationsPage.vue'),
      },
      {
        path: 'users',
        component: () => import('@/views/UsersPage.vue'),
      },
      {
        path: 'users/:id',
        component: () => import('@/views/UserDetailsPage.vue'),
      },
      {
        path: 'settings',
        component: () => import('@/views/SettingsPage.vue'),
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('@/views/auth/LoginPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((from, to) => {
  console.log('TO,', to);
  console.log('FROM,', from);
  console.log('user', user.value);
  if (from.path === '/auth') return true;
  if (user.value === null) return '/auth';
  return true;
});

export default router;
