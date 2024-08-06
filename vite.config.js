import { resolve } from 'path'
import { defineConfig } from 'vite'
import { getPlugins } from './config/plugins'
import { getBuildOptions } from './config/build.js'
import './config/cmd'

export default defineConfig(() => {
  return defineConfig({
    base: './',
    plugins: getPlugins(),
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          math: 'strict',
          javascriptEnabled: true,
        },
      },
    },
    server: {
      // 是否开启 https
      https: false,
      // 端口号
      port: 3000,
      // 监听所有地址
      host: '0.0.0.0',
      // 服务启动时是否自动打开浏览器
      open: true,
      // 允许跨域
      cors: true,
      // 自定义代理规则
      proxy: {},
    },
    build: getBuildOptions()
  })
})
