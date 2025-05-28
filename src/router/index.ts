import { Role, useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

import AdminLayout from '@/components/layout/AdminLayout.vue' // Import the layout

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
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
            requiresAuth: true, // Keep specific auth requirements if needed
          },
        },
        {
          path: '/calendar',
          name: 'Calendar',
          component: () => import('../views/Others/Calendar.vue'),
          meta: {
            title: 'Calendar',
            requiresAuth: true,
          },
        },
        {
          path: '/profile',
          name: 'Profile',
          component: () => import('../views/Others/UserProfile.vue'),
          meta: {
            title: 'Profile',
            requiresAuth: true,
          },
        },
        {
          path: '/form-elements',
          name: 'Form Elements',
          component: () => import('../views/Forms/FormElements.vue'),
          meta: {
            title: 'Form Elements',
            requiresAuth: true,
          },
        },
        {
          path: '/basic-tables',
          name: 'Basic Tables',
          component: () => import('../views/Tables/BasicTables.vue'),
          meta: {
            title: 'Basic Tables',
            requiresAuth: true,
          },
        },
        {
          path: '/line-chart',
          name: 'Line Chart',
          component: () => import('../views/Chart/LineChart/LineChart.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/bar-chart',
          name: 'Bar Chart',
          component: () => import('../views/Chart/BarChart/BarChart.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/alerts',
          name: 'Alerts',
          component: () => import('../views/UiElements/Alerts.vue'),
          meta: {
            title: 'Alerts',
            requiresAuth: true,
          },
        },
        {
          path: '/avatars',
          name: 'Avatars',
          component: () => import('../views/UiElements/Avatars.vue'),
          meta: {
            title: 'Avatars',
            requiresAuth: true,
          },
        },
        {
          path: '/badge',
          name: 'Badge',
          component: () => import('../views/UiElements/Badges.vue'),
          meta: {
            title: 'Badge',
            requiresAuth: true,
          },
        },
        {
          path: '/buttons',
          name: 'Buttons',
          component: () => import('../views/UiElements/Buttons.vue'),
          meta: {
            title: 'Buttons',
            requiresAuth: true,
          },
        },
        {
          path: '/images',
          name: 'Images',
          component: () => import('../views/UiElements/Images.vue'),
          meta: {
            title: 'Images',
            requiresAuth: true,
          },
        },
        {
          path: '/videos',
          name: 'Videos',
          component: () => import('../views/UiElements/Videos.vue'),
          meta: {
            title: 'Videos',
            requiresAuth: true,
          },
        },
        {
          path: '/blank',
          name: 'Blank',
          component: () => import('../views/Pages/BlankPage.vue'),
          meta: {
            title: 'Blank',
            requiresAuth: true,
          },
        },
        {
          path: '/riders',
          name: 'Riders',
          component: () => import('../views/PlaceholderPage.vue'),
          meta: { title: 'Riders', requiresAuth: true },
        },
        {
          path: '/purchase',
          name: 'Purchase',
          component: () => import('../views/PlaceholderPage.vue'),
          meta: { title: 'Purchase', requiresAuth: true },
        },
        {
          path: '/admin/products',
          name: 'ProductManagement',
          component: () => import('../views/SuperAdmin/ProductManagement.vue'),
          meta: { title: 'Product Management', requiresAuth: true }, // TODO: Add correct auth later
        },
        {
          path: '/admin/orders',
          name: 'OrderHistory',
          component: () => import('../views/Admin/OrderHistory.vue'),
          meta: {
            title: 'Order History',
            requiresAuth: true,
            allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN]
          }
        },
        {
          path: '/admin/registration-approval',
          name: 'RegistrationApproval',
          component: () => import('../views/Admin/PendingRegistrations.vue'),
          meta: {
            title: 'Registration Approval',
            requiresAuth: true,
            allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN]
          },
        },
        {
          path: '/admin/riders',
          name: 'RiderList',
          component: () => import('../views/Admin/RiderList.vue'),
          meta: {
            title: 'All Riders',
            requiresAuth: true,
            allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN]
          }
        },
        {
          path: '/rider/profile',
          name: 'RiderProfile',
          component: () => import('../views/Rider/Profile.vue'),
          meta: { title: 'Rider Profile', requiresAuth: true, allowedRoles: ['rider','super_admin'] } // TEMP: Unguarded for debugging
        },
        {
          path: '/admin/transactions',
          name: 'GlobalTransactions',
          component: () => import('../views/SuperAdmin/GlobalTransactions.vue'),
          meta: { title: 'Global Transactions', requiresAuth: false }, // TODO: Add correct auth later
        },
        {
          path: '/admin/admins',
          name: 'SuperAdminAdmins',
          component: () => import('../views/SuperAdmin/AdminManagement.vue'),
          meta: { title: 'Admin Management', requiresAuth: true }, // TODO: Add correct auth later
        },
        {
          path: '/super-admin/branches',
          name: 'SuperAdminBranches',
          component: () => import('../views/SuperAdmin/BranchOverview.vue'),
          meta: { title: 'Branch Overview', requiresAuth: true }, // TODO: Add correct auth later
        },
        {
          path: '/admin/analytics',
          name: 'SuperAdminAnalytics',
          component: () => import('../views/SuperAdmin/SystemAnalytics.vue'),
          meta: { title: 'System Analytics', requiresAuth: true }, // TODO: Add correct auth later
        },
        {
          path: '/admin/stats-reports',
          name: 'SuperAdminStatsReports',
          component: () => import('../views/SuperAdmin/StatsReports.vue'),
          meta: { title: 'Stats & Reports', requiresAuth: true }, // TODO: Add correct auth later
        },
        // BranchAdmin routes
        {
          path: '/branch-admin',
          name: 'BranchAdminDashboard',
          component: () => import('../views/BranchAdmin/Dashboard.vue'),
          meta: {
            title: 'Branch Dashboard',
            requiresAuth: true,
          },
        },
        {
          path: '/branch-admin/qr-scanner',
          name: 'BranchAdminQRScanner',
          component: () => import('../views/BranchAdmin/QRScanner.vue'),
          meta: {
            title: 'QR Scanner',
            requiresAuth: true,
          },
        },
        {
          path: '/admin/rider-profile/:id',
          name: 'RiderProfileView',
          component: () => import('../views/BranchAdmin/RiderProfileView.vue'),
          meta: {
            title: 'Rider Profile',
            requiresAuth: true,
          },
        },
        {
          path: '/home',
          name: 'LandingPage',
          component: () => import('../views/LandingPage.vue'),
        },
        {
          path: '/branch-admin/orders',
          name: 'BranchAdminOrderHistory',
          component: () => import('../views/BranchAdmin/OrderHistory.vue'),
          meta: {
            title: 'Order History',
            requiresAuth: true,
          },
        },
        {
          path: '/branch-admin/pending-approvals',
          name: 'BranchAdminPendingApprovals',
          component: () => import('../views/BranchAdmin/PendingApprovals.vue'),
          meta: {
            title: 'Pending Approvals',
            requiresAuth: true,
            allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN]
          },
        },
        {
          path: '/branch-admin/create-rider',
          name: 'BranchAdminCreateRider',
          component: () => import('../views/BranchAdmin/CreateRider.vue'),
          meta: {
            title: 'Create Rider',
            requiresAuth: true,
            allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN] // Or just Role.ADMIN
          },
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
      path: '/rider/signup',
      name: 'RiderSignup',
      component: () => import('../views/Auth/RiderSignup.vue'),
      meta: { title: 'Rider Signup' }
    },
    {
      path: '/home',
      name: 'LandingPage',
      component: () => import('../views/LandingPage.vue'),
    },
    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },
    { path: '/:pathMatch(.*)*', redirect: '/error-404' }
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const allowedRoles = to.meta.allowedRoles as Role[] | undefined
  const publicPages = ['/signin', '/signup', '/password-reset', '/rider/signup']

  if (!authStore.isInitialized) {
    await authStore.loadAuthFromStorage()
  }

  document.title = to.meta.title ? `GasoPay | ${to.meta.title}` : 'GasoPay'

  const currentRole = authStore.userRoleTyped

  if (requiresAuth) {
    // Log the actual token value just before the check
    console.log(`[Guard] Checking auth. Token value:`, authStore.token);
    console.log(`[Guard] Checking auth. User value:`, authStore.currentUser);

    // Check the raw token and currentUser refs directly
    if (!authStore.token || !authStore.currentUser) {
      console.log(`[Guard] Redirecting to login, requiresAuth=true, token exists=${!!authStore.token}, user exists=${!!authStore.currentUser}`);
      next('/signin');
    } else if (allowedRoles && (!currentRole || !allowedRoles.includes(currentRole as Role))) {
      console.log(`Redirecting to dashboard, user role '${currentRole}' not in allowedRoles:`, allowedRoles);
      next('/');
    } else {
      next()
    }
  } else if (authStore.isAuthenticated && publicPages.includes(to.path)) {
    console.log('Redirecting to dashboard, isAuthenticated=true, path is public auth page');
    // Use a more explicit check for rider or super_admin role
    const isRiderOrSuperAdmin = currentRole === Role.RIDER || currentRole === Role.SUPER_ADMIN;
    next(isRiderOrSuperAdmin ? '/rider/profile' : '/');
  } else {
    console.log('Allowing navigation to public route.')
    next()
  }
})

export default router
