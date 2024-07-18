import {RouteRecordRaw} from "vue-router";

export const System: RouteRecordRaw =
  {
  path: '/component',
  component: () => import('@/views/layout/MainLayout.vue'),
  redirect: '/component',
  meta: {icon: 'ElementPlus', title: "内容管理"},
  children: [
    {
      path: 'banner',
      component: () => import('@/views/component/banner/Index.vue'),
      meta: {title: "轮播图"},
    },
    {
      path: 'video',
      component: () => import('@/views/component/video/Index.vue'),
      meta: {title: "视频"},
    },
    {
      path: 'videodetail/:videoId',
      component: () => import('@/views/component/video/videoDetail/Index.vue'),
      meta: {title: "视频详情", hideMenu: true},
      name: 'VideoDetail'
    },
    {
      path: 'comment/:videoId',
      component: () => import('@/views/component/video/comment/Index.vue'),
      meta: {title: "评论", hideMenu: true},
      name: 'Comment',
    },
    {
      path: 'danmaku/:videoId',
      component: () => import('@/views/component/video/danmaku/Index.vue'),
      meta: {title: "弹幕", hideMenu: true},
      name: 'Danmaku',
    },
  ]
}



