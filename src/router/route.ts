import { RouteRecordRaw } from 'vue-router'
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
        component: () => import(/*webpackChunkName: "Home"*/'../views/Home.vue'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/allPlayList',
        name: 'allPlayList',
        component: () => import(/*webpackChunkName:"AllPlayList"*/'@/views/AllPlayList.vue'),
        meta: {
            keepAlive: true,
            musicHall: true
        },
    },
    {
        path: '/allAltumList',
        name: 'allAltumList',
        component: () => import(/*webpackChunkName:"AllAltumList"*/'@/views/AllAltumList.vue'),
        meta: {
            keepAlive: true,
            musicHall: true
        },
    },
    {
        path: '/allArtists',
        name: 'allArtists',
        component: () => import(/*webpackChunkName:"AllArtists"*/'@/views/AllArtists.vue'),
        meta: {
            keepAlive: true,
            musicHall: true
        },
    },
    {
        path: '/allFMList',
        name: 'allFMList',
        component: () => import(/*webpackChunkName:"AllFMList"*/'@/views/AllFMList.vue'),
        meta: {
            keepAlive: true,
            musicHall: true
        },
    },
    {
        path: '/allMVList',
        name: 'allMVList',
        component: () => import(/*webpackChunkName:"AllMVList"*/'@/views/AllMVList.vue'),
        meta: {
            keepAlive: true,
            musicHall: true
        },
    },
    {
        path: '/allTopList',
        name: 'allTopList',
        component: () => import(/*webpackChunkName:"AllTopList"*/'@/views/AllTopList.vue'),
        meta: {
            keepAlive: true,
            musicHall: true
        },
    },
    {
        path: '/library',
        name: 'library',
        component: () => import(/*webpackChunkNmae:"library"*/'../views/Library.vue'),
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
        component: () => import(/*webpackChunkNmae:"login"*/'../views/Login.vue')
    }
    ,
    {
        path: '/songlistDetail',
        name: 'songlistDetail',
        component: () => import(/*webpackChunkName:"songlistInfo"*/'@/views/PlayListDetail.vue')
    },
    {
        path: '/songDetail',
        name: 'songDetail',
        component: () => import(/*webpackChunkName:"songDetail"*/'@/views/SongDetail.vue')
    },
    {
        path: '/artistDetail',
        name: 'artistDetail',
        component: () => import(/*webpackChunkName:"artistDetail"*/'@/views/ArtistDetail.vue'),
        children: [
            {
                path: 'artistMVs',
                name: 'artistMVs',
                component: () => import(/*webpackChunkName:"artistMVs"*/'@/views/ArtistMVs.vue')
            },
            {
                path: 'artistAlbums',
                name: 'artistAlbums',
                component: () => import(/*webpackChunkName:"artistAlbums"*/'@/views/ArtistAlbums.vue')
            },
            {
                path: 'artistSongs',
                name: 'artistSongs',
                component: () => import(/*webpackChunkName:"artistSongs"*/'@/views/ArtistSongs.vue')
            }
        ]
    },
    {
        path: '/mvDetail',
        name: 'mvDetail',
        component: () => import(/*webpackChunkName:"mvDetail"*/'@/views/MVDetail.vue')
    },
    {
        path: '/altumDetail',
        name: 'altumDetail',
        component: () => import(/*webpackChunkName:"altumDetail"*/'@/views/AltumDetail.vue')
    },
    {
        path: '/search',
        name: 'search',
        component: () => import(/*webpackChunkName:"searchDetail"*/'@/views/Search.vue')
    },
    {
        path: '/dailysongsDetail',
        name: 'dailysongsDetail',
        component: () => import(/*webpackChunkName:"dailysongsDetail"*/'@/views/DailyComSongs.vue')
    }
]