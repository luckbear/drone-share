import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },
  {
    path: "/",
    redirect: "/dashboard"
  },
  {
    path: "/dashboard",
    component: () => import("@/views/dashboard/index"),
    redirect: "/dashboard/company",
    meta: { title: "共享信息", icon: "主页" },
    children: [
      {
        path: "company",
        name: "Company",
        component: () => import("@/views/company/index"),
        meta: { title: "公司(项目)", icon: "gongsi" }
      },
      {
        path: "droneTypes",
        name: "DroneTypes",
        component: () => import("@/views/drone/index"),
        meta: { title: "无人机", icon: "无人机" }
      },
      {
        path: "driver",
        name: "Driver",
        component: () => import("@/views/driver/index"),
        meta: { title: "飞手", icon: "yaokongqidianliang" }
      },
      {
        path: "airspace",
        name: "Airspace",
        component: () => import("@/views/airspace/index"),
        meta: { title: "空域", icon: "kongyu" }
      },
      {
        path: "aerialData",
        name: "AerialData",
        component: () => import("@/views/aerialData/index"),
        meta: { title: "数据", icon: "shuju" }
      }
    ]
  },
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'example' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },

  {
    path: "/form",
    component: () => import("@/views/form/index"),
    meta: { title: "信息发布", icon: "form", isLogin: true }

    // children: [
    //   {
    //     path: "index",
    //     name: "Form",
    //     component: () => import("@/views/form/index"),
    //     meta: { title: "信息发布", icon: "form", isLogin: true }
    //   }
    // ]
  },
  {
    path: "/user",
    redirect: "/user/userInfo",
    component: () => import("@/views/user/index"),
    meta: { title: "个人中心", icon: "user", isLogin: true },
    children: [
      {
        path: "userInfo",
        name: "UserInfo",
        component: () => import("@/views/user/UserInfo.vue"),
        meta: { title: "基本信息", icon: "table", isLogin: true }
      },
      {
        path: "infoManger",
        name: "InfoManger",
        component: () => import("@/views/user/InfoManger.vue"),
        meta: { title: "资产管理", icon: "tree", isLogin: true }
      }
    ]
  },
  {
    path: "/foundation",
    component: () => import("@/views/foundation/index"),
    meta: { title: "基地建设", icon: "foundation", }
  },
  {
    path: "/infomation",
    component: () => import("@/views/info/index"),
    meta: { title: "行业信息", icon: "info", }
  },
  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // {
  //   path: "external-link",
  //   component: Layout,
  //   children: [
  //     {
  //       path: "https://panjiachen.github.io/vue-element-admin-site/#/",
  //       meta: { title: "External Link", icon: "link" }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
