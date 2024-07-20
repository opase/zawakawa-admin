import {RouteRecordRaw} from "vue-router";

export const User: RouteRecordRaw = 
  {
    path: '/',
    component: () => import('@/views/layout/MainLayout.vue'),
    redirect: '/user',
    meta: {icon: 'Guide', title: "用户", alwaysShow: true},
    children: [
      {
        path: 'user',
        component: () => import('@/views/common/Upload.vue'),
        meta: {icon: 'Guide', title: "首页", hideMenu: true}
      }
    ]
}



