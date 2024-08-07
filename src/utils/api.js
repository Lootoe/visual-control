import { get } from '@/utils/request'

export const getImageInfo = (params) => {
  return get('patient/pc/imageInfo', params)
}

export const getDemoList = () => {
  return get('patient/demo/list')
}

export const getDemoInfo = (demoId) => {
  return get(`patient/demo/imageInfo/${demoId}`)
}
