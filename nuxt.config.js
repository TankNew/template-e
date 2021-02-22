import appconst from './utiltools/appconst'
let ajaxConfig = {
  // baseURL: appconst.remoteServiceBaseUrl,
  proxy: true,
  credentials: true
}
if (process.env.NODE_ENV === 'production')
  ajaxConfig = {
    baseURL: appconst.remoteServiceBaseUrl,
    // proxy: true,
    credentials: true
  }

const defaultTenantId = 18
const defaultTheme = 'indianred'

// let css = ['swiper/dist/css/swiper.css', '~/static/css/all.min.css']
let css = ['~/static/css/all.min.css']
if (process.env.NODE_ENV === 'development') css.push(`assets/css/theme.${defaultTheme}.less`)

export default {
  publicRuntimeConfig: {
    NUXT_ENV: process.env.NUXT_ENV || process.env.NODE_ENV,
    NUXT_ENV_THEME: process.env.NUXT_ENV_THEME || defaultTheme,
    NUXT_ENV_TENANT_ID: process.env.NUXT_ENV_TENANT_ID || defaultTenantId,
    API_SECRET: '1234'
  },
  privateRuntimeConfig: {},
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    // title: 'Ednet共享建站 - 更节省、更安全' + process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      }
    ]
  },
  // 删除nuxt自动生成的标签，可能影响seo
  hooks: {
    'render:route': (url, result) => {
      result.html = result.html.replace(/ data-n-head=".*?"/gi, '').replace(/ data-hid=".*?"/gi, '')
    }
  },
  router: {
    middleware: ['user-agent'],
    mode: 'history'
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: 'rgba(0,0,0,.75)', throttle: 0 },
  // loading: '~/components/loading.vue',
  /*
   ** Global CSS
   */
  css,
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    { src: '~/plugins/axios.js' },
    { src: '~/plugins/main.js' },
    { src: '~/plugins/combined-inject.js' },
    { src: '~/plugins/server.js' },
    { src: '~/plugins/client.js', mode: 'client' }
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    'cookie-universal-nuxt'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: ajaxConfig,
  proxy: {
    '/api/': { target: 'https://cms.ednet.cn' },
    '/AbpUserConfiguration/': { target: 'https://cms.ednet.cn' }
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'cheap-module-source-map'
      }
    }
  }
}
