import dotenv from 'dotenv'
import minimist from 'minimist'

const { _, mode } = minimist(process.argv.slice(2))

//从自定义启动参数中，提取出platform
const platform = _.filter(o => o.includes('platform'))[0]?.split('=')[1] || 'debug'

/* 根据打包配置设置环境变量，先设置的优先级最高 */
/* 优先级： .env.local > .env.platform.mode > .env.platform > .env */
// 打包命令必须与配置文件名一致
// 打包文件名决定环境
// 打包文件里面的内容存储当前环境的变量
dotenv.config({ path: process.cwd() + '/env/' + '.env.local' })
dotenv.config({ path: process.cwd() + '/env/' + '.env.' + platform + '.' + mode })
dotenv.config({ path: process.cwd() + '/env/' + '.env.' + platform })
dotenv.config({ path: process.cwd() + '/env/' + '.env' })

console.log(`================== MODE:${mode} =================`)
console.log(`================== PLATFORM:${platform} =================`)

export { platform, mode }
