import { App, createApp } from 'vue'
import MessageItem from './MessageItem.vue'

function Message(options: any) {
    const messageApp = createApp(MessageItem, options)

    showMessage(messageApp)
}

function showMessage(app: App) {
    const oFragment = document.createDocumentFragment()
    const vm = app.mount(oFragment)
    document.body.appendChild(oFragment)

    let n: number = 3
    let timer = setInterval(() => {
        n--
        if (n == 0) {
            clearInterval(timer)
            hideMessage(app)
        }
    }, 1000)
}

function hideMessage(app: App) {
    app.unmount()
}

export default Message