import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

const basePlugins = [
  vue(),
  AutoImport({
    imports: ['vue', 'vue-router', 'pinia'],
    eslintrc: {
      enabled: true,
      filepath: './.eslintrc-auto-import.json',
      globalsPropValue: true,
    },
    resolvers: ElementPlusResolver(),
  }),
  Components({
    resolvers: ElementPlusResolver(),
  }),
  wasm(),
  topLevelAwait(),
]

export const getPlugins = () => {
  const plugins = basePlugins
  return plugins
}
