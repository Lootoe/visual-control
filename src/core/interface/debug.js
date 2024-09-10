import { debug } from '@/debug'

export default () => {
  return new Promise((resolve) => {
    debug()
    resolve()
  })
}
