const mode = import.meta.env.VITE_MODE
const platform = import.meta.env.VITE_PLATFORM

const MODE_TYPE = {
    DEV: 'dev',
    TEST: 'test',
    PROD: 'prod',
}

const PLATFORM_TYPE = {
    DEBUG: 'debug',
    DEMO: 'demo',
    PC: 'pc',
    PAD: 'pad',
    ADMIN: 'admin',
}

const SRENV = {
    MODE: mode,
    PLATFORM: platform,
    MODE_TYPE,
    PLATFORM_TYPE,
    IS_MODE_DEV: () => SRENV.MODE === SRENV.MODE_TYPE.DEV,
    IS_MODE_TEST: () => SRENV.MODE === SRENV.MODE_TYPE.TEST,
    IS_MODE_PROD: () => SRENV.MODE === SRENV.MODE_TYPE.PROD,
    IS_PLATFORM_DEBUG: () => SRENV.PLATFORM === SRENV.PLATFORM_TYPE.DEBUG,
    IS_PLATFORM_DEMO: () => SRENV.PLATFORM === SRENV.PLATFORM_TYPE.DEMO,
    IS_PLATFORM_PC: () => SRENV.PLATFORM === SRENV.PLATFORM_TYPE.PC,
    IS_PLATFORM_PAD: () => SRENV.PLATFORM === SRENV.PLATFORM_TYPE.PAD,
    IS_PLATFORM_ADMIN: () => SRENV.PLATFORM === SRENV.PLATFORM_TYPE.ADMIN,
}

globalThis.SRENV = SRENV