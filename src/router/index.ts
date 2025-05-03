import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AdminLayout from '@/components/layout/AdminLayout.vue' // Import the layout

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/', // Parent route using the layout
      component: AdminLayout,
      // meta: { requiresAuth: true }, // Add auth requirement if needed for all nested routes
      children: [
        // --- NESTED ROUTES START ---
        {
          path: '', // Default child route (Dashboard)
          name: 'Ecommerce',
          component: () => import('../views/Ecommerce.vue'),
          meta: {
            title: 'Dashboard',
            requiresAuth: false, // Keep specific auth requirements if needed
          },
        },
        {
          path: '/calendar',
          name: 'Calendar',
          component: () => import('../views/Others/Calendar.vue'),
          meta: {
            title: 'Calendar',
            requiresAuth: false,
          },
        },
        {
          path: '/profile',
          name: 'Profile',
          component: () => import('../views/Others/UserProfile.vue'),
          meta: {
            title: 'Profile',
            requiresAuth: false,
          },
        },
        {
          path: '/form-elements',
          name: 'Form Elements',
          component: () => import('../views/Forms/FormElements.vue'),
          meta: {
            title: 'Form Elements',
            requiresAuth: false,
          },
        },
        {
          path: '/basic-tables',
          name: 'Basic Tables',
          component: () => import('../views/Tables/BasicTables.vue'),
          meta: {
            title: 'Basic Tables',
            requiresAuth: false,
          },
        },
        {
          path: '/line-chart',
          name: 'Line Chart',
          component: () => import('../views/Chart/LineChart/LineChart.vue'),
          meta: { requiresAuth: false },
        },
        {
          path: '/bar-chart',
          name: 'Bar Chart',
          component: () => import('../views/Chart/BarChart/BarChart.vue'),
          meta: { requiresAuth: false },
        },
        {
          path: '/alerts',
          name: 'Alerts',
          component: () => import('../views/UiElements/Alerts.vue'),
          meta: {
            title: 'Alerts',
            requiresAuth: false,
          },
        },
        {
          path: '/avatars',
          name: 'Avatars',
          component: () => import('../views/UiElements/Avatars.vue'),
          meta: {
            title: 'Avatars',
            requiresAuth: false,
          },
        },
        {
          path: '/badge',
          name: 'Badge',
          component: () => import('../views/UiElements/Badges.vue'),
          meta: {
            title: 'Badge',
            requiresAuth: false,
          },
        },
        {
          path: '/buttons',
          name: 'Buttons',
          component: () => import('../views/UiElements/Buttons.vue'),
          meta: {
            title: 'Buttons',
            requiresAuth: false,
          },
        },
        {
          path: '/images',
          name: 'Images',
          component: () => import('../views/UiElements/Images.vue'),
          meta: {
            title: 'Images',
            requiresAuth: false,
          },
        },
        {
          path: '/videos',
          name: 'Videos',
          component: () => import('../views/UiElements/Videos.vue'),
          meta: {
            title: 'Videos',
            requiresAuth: false,
          },
        },
        {
          path: '/blank',
          name: 'Blank',
          component: () => import('../views/Pages/BlankPage.vue'),
          meta: {
            title: 'Blank',
            requiresAuth: false,
          },
        },
        {
          path: '/payments',
          name: 'Payments',
          component: () => import('../views/PlaceholderPage.vue'),
          meta: { title: 'Payments', requiresAuth: false },
        },
        {
          path: '/riders',
          name: 'Riders',
          component: () => import('../views/PlaceholderPage.vue'),
          meta: { title: 'Riders', requiresAuth: false },
        },
        {
          path: '/purchase',
          name: 'Purchase',
          component: () => import('../views/PlaceholderPage.vue'),
          meta: { title: 'Purchase', requiresAuth: false },
        },
        {
          path: '/admin/registration-approval',
          name: 'RegistrationApproval',
          component: () => import('../views/PlaceholderPage.vue'),
          meta: { title: 'Registration Approval', requiresAuth: false },
        },
        {
          path: '/super-admin/stats-reports',
          name: 'StatsReports',
          component: () => import('../views/SuperAdmin/StatsReports.vue'),
          meta: { title: 'Stats & Reports', requiresAuth: false },
        },
        {
          path: '/super-admin/dashboard',
          name: 'SuperAdminDashboard',
          component: () => import('../views/SuperAdmin/Dashboard.vue'),
          meta: { title: 'Super Admin Dashboard', requiresAuth: false },
        },
        {
          path: '/super-admin/admins',
          name: 'AdminManagement',
          component: () => import('../views/SuperAdmin/AdminManagement.vue'),
          meta: { title: 'Admin Management', requiresAuth: false },
        },
        {
          path: '/super-admin/branches',
          name: 'BranchOverview',
          component: () => import('../views/SuperAdmin/BranchOverview.vue'),
          meta: { title: 'Branch Overview', requiresAuth: false },
        },
        {
          path: '/super-admin/analytics',
          name: 'SystemAnalytics',
          component: () => import('../views/SuperAdmin/SystemAnalytics.vue'),
          meta: { title: 'System Analytics', requiresAuth: false },
        },
        {
          path: '/super-admin/transactions',
          name: 'GlobalTransactions',
          component: () => import('../views/SuperAdmin/GlobalTransactions.vue'),
          meta: { title: 'Global Transactions', requiresAuth: false },
        },
        {
          path: '/super-admin/products',
          name: 'ProductManagement',
          component: () => import('../views/SuperAdmin/ProductManagement.vue'),
          meta: { title: 'Product Management', requiresAuth: false },
        },
        // --- NESTED ROUTES END ---
      ]
    },
    // --- TOP LEVEL ROUTES (No Layout) ---
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
      },
    },
    {
      path: '/password-reset',
      name: 'PasswordReset',
      component: () => import('../views/Auth/PasswordReset.vue'),
      meta: {
        title: 'Reset Password',
      },
    },
    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },
    { path: '/:pathMatch(.*)*', redirect: '/error-404' } // Catch-all should be last
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const publicPages = ['/signin', '/signup', '/password-reset']

  document.title = to.meta.title ? `GasoPay | ${to.meta.title}` : 'GasoPay'

  if (requiresAuth && !authStore.isAuthenticated) {
    console.log('Redirecting to login, requiresAuth=true, isAuthenticated=false')
    next('/signin')
  } else if (!requiresAuth && authStore.isAuthenticated && publicPages.includes(to.path)) {
    console.log('Redirecting to dashboard, requiresAuth=false, isAuthenticated=true, path is public auth page')
    next('/')
  } else {
    console.log('Allowing navigation')
    next()
  }
})

export default router
