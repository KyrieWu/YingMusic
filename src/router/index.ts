import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './route'


let arr = ["/", "/library"]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (arr.includes(to.path) && savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        if (to.query.from) {
            if (to.query.from !== '/library') {
                to.query.from = from.path
            }
        } else {
            to.query.from = from.path
        }
        next()
    } else {
        next()
    }
})

export default router
