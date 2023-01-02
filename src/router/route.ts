import { RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue';
import store from "@/store";
import { getToken } from '@/utils/token'

export const routes: Array<RouteRecordRaw> = [
    {
        path: "/:pathMatch(.*)*",
        redirect: "/",
    },
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/allPlayList',
        name: 'allPlayList',
        component: () => import('@/views/AllPlayList.vue'),
        meta: {
            keepAlive: true,
            musicHall: true
        },
    },
    {
        path: '/allAltumList',
        name: 'allAltumList',
        component: () => import('@/views/AllAltumList.vue'),
        meta: {
            keepAlive: true,
            musicHall: true
        },
    },
    {
        path: '/allArtists',
        name: 'allArtists',
        component: () => import('@/views/AllArtists.vue'),
        meta: {
            keepAlive: true,
            musicHall: true
        },
    },
    {
        path: '/allFMList',
        name: 'allFMList',
        component: () => import('@/views/AllFMList.vue'),
        meta: {
            keepAlive: true,
            musicHall: true
        },
    },
    {
        path: '/allMVList',
        name: 'allMVList',
        component: () => import('@/views/AllMVList.vue'),
        meta: {
            keepAlive: true,
            musicHall: true
        },
    },
    {
        path: '/allTopList',
        name: 'allTopList',
        component: () => import('@/views/AllTopList.vue'),
        meta: {
            keepAlive: true,
            musicHall: true
        },
    },
    {
        path: '/library',
        name: 'library',
        component: () => import('../views/Library.vue'),
        beforeEnter: (to, from, next) => {
            if (store.state.isLogin || store.state.token || getToken()) {
                next()
            } else {
                next({
                    path: '/login',
                    query: { from: to.path }
                })
            }
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue')
    }
    ,
    {
        path: '/songlistDetail',
        name: 'songlistDetail',
        component: () => import('@/views/PlayListDetail.vue')
    },
    {
        path: '/songDetail',
        name: 'songDetail',
        component: () => import('@/views/SongDetail.vue')
    },
    {
        path: '/artistDetail',
        name: 'artistDetail',
        component: () => import('@/views/ArtistDetail.vue'),
        children: [
            {
                path: 'artistMVs',
                name: 'artistMVs',
                component: () => import('@/views/ArtistMVs.vue')
            },
            {
                path: 'artistAlbums',
                name: 'artistAlbums',
                component: () => import('@/views/ArtistAlbums.vue')
            },
            {
                path: 'artistSongs',
                name: 'artistSongs',
                component: () => import('@/views/ArtistSongs.vue')
            }
        ]
    },
    {
        path: '/mvDetail',
        name: 'mvDetail',
        component: () => import('@/views/MVDetail.vue')
    },
    {
        path: '/altumDetail',
        name: 'altumDetail',
        component: () => import('@/views/AltumDetail.vue')
    },
    {
        path: '/search',
        name: 'search',
        component: () => import('@/views/Search.vue')
    },
    {
        path: '/dailysongsDetail',
        name: 'dailysongsDetail',
        component: () => import('@/views/DailyComSongs.vue')
    },
    {
        path: '/setting',
        name: 'setting',
        component: () => import('@/views/Setting.vue')
    }
]