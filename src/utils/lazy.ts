import { App } from 'vue'

let ObsetverList: any[] = []

var imgShow = () => {
    ObsetverList.forEach(({ el, value }, index) => {
        let rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight) {
            el.src = value
            ObsetverList.splice(index, 1)
        }
    })
}

var scrollFun = () => {
    imgShow()
    document.addEventListener('scroll', () => {
        imgShow()
    })
}

export default {
    install(app: App) {
        app.directive('lazy', {
            mounted(el, { value }) {
                ObsetverList.push({
                    el, value
                })
                scrollFun()
            }
        })
    }
}