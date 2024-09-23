import { createI18n } from 'vue-i18n'
import zh from './zh.json'
import en from './en.json'

export const i18nRegister = createI18n({
  locale: 'zh',
  legacy: false,
  messages: {
    zh,
    en,
  },
})

export const i18n = i18nRegister.global

// console.log("i18n.global.t('headSide.msg1')", i18n.t('headSide.msg1'))
// i18n.locale.value = 'en'
// console.log("i18n.t('headSide.msg1')", i18n.t('headSide.msg1'))
