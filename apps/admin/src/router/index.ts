import { user } from '../lib/user';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsLayout.vue';
import { getWPToken } from '../wpauth';

const logger = useLogger();

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
        component: () => import('../views/AttendancePage.vue'),
      },
      {
        path: 'attendance/:id',
        component: () => import('../views/AttendanceDetailsPage.vue'),
      },
      {
        path: 'notifications',
        component: () => import('../views/NotificationsPage.vue'),
      },
      {
        path: 'users',
        component: () => import('../views/UsersPage.vue'),
      },
      {
        path: 'users/:id/:name',
        component: () => import('../views/UserDetailsPage.vue'),
      },
      {
        path: 'schedule',
        component: () => import('../views/SchedulePage.vue'),
      },
      {
        path: 'settings',
        component: () => import('../views/SettingsPage.vue'),
      },
    ],
  },
  {
    path: '/dev/update-users',
    component: () => import('../views/dev/UpdateUsersPage.vue'),
  },
  {
    path: '/dev/icon-list',
    component: () => import('../views/dev/IconListPage.vue'),
  },
  {
    path: '/dev/email-id',
    component: () => import('../views/dev/EmailIDPage.vue'),
  },
  {
    path: '/dev/logs',
    component: () => import('../views/dev/LogsPage.vue'),
  },
  {
    path: '/dev/notifications-import',
    component: () => import('../views/dev/NotificationsImport.vue'),
  },
  {
    name: 'scan',
    path: '/scan/:session/:event?',
    component: () => import('../views/ScanInterface.vue'),
  },
  {
    path: '/auth',
    component: () => import('../views/auth/LoginPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((from, to) => {
  logger.trace('router:beforeEach', 'from', from.fullPath, 'to', to.fullPath);
  const loggedIn = !(getWPToken() === null);
  if (from.fullPath.startsWith('/auth') && loggedIn) {
    return '/';
  } else if (!from.fullPath.startsWith('/auth') && !loggedIn) {
    return '/auth?next=' + from.fullPath;
  }
  return true;
});

export default router;
