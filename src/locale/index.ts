import { createI18n } from 'vue-i18n'
import store from '@/store'

import en from './lang/en'
import zhCN from './lang/zh-CN'

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: store.state.setting.lang || 'zh-CN',
    messages: {
        'en': en,
        'zh-CN': zhCN,
    },
    silentTranslationWarn: true,
})
export default i18n