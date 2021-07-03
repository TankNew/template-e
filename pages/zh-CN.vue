<template>
  <div class="body-container">
    <!-- 头部 -->
    <header :class="[currentPath.navbarType !== 5 ? 'sub' : '', isScroll ? 'color' : '']" @click="closeNavbar">
      <div class="container">
        <div class="header-main">
          <a class="back-link" @click="back">
            <i class="fas fa-chevron-left"></i>
            {{ $L(`Back`) }}
          </a>
          <div class="header-logo-container">
            <div class="logo">
              <img :src="companyInfo.logo" @click="go('/')" />
            </div>
            <div class="company-name">{{ companyInfo.logoText }}</div>
          </div>
          <navbar ref="navbar" :items="navbars"></navbar>
          <div class="header-tools">
            <ul>
              <li>
                <a href="javascript:void(0)">
                  <i class="fas fa-phone-alt"></i>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)" @click.stop="weixinExpand">
                  <i class="fab fa-weixin"></i>
                </a>
              </li>
              <li v-if="multiLangs">
                <a @click="changeLanguage('en')">
                  <i class="fas fa-language"></i>
                </a>
              </li>
              <li class="mobile-navbar-trigger">
                <a href="javascript:void(0)" @click.stop="triggerNavbar">
                  <i class="fas fa-bars"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="wxShow" class="wexin-dropdown">
          <div class="code">
            <img :src="companyInfo.weixinBarCode" />
            <h6>扫一扫，直接在手机上打开</h6>
            <p>推荐微信、QQ扫一扫等扫码工具</p>
          </div>
          <span class="close" @click="wxShow = false">
            <i class="fas fa-times"></i>
          </span>
        </div>
      </div>
    </header>
    <section class="main">
      <!-- banner -->
      <div :class="['banner', currentPath.navbarType !== 5 ? 'sub' : '']">
        <client-only>
          <div v-swiper:bannerSwiper="swiperOption" @ready="handleSwiperReadied">
            <div class="swiper-wrapper position-relative">
              <div v-for="(item, index) in bannerImgs" :key="index" class="swiper-slide">
                <img :src="getImgUrl(item.imgUrl)" />
                <div class="carousel-caption">
                  <div :class="currentFontPosition(item)">
                    <h2>{{ item.title }}</h2>
                    <p>{{ item.subTitle }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div slot="button-prev" class="swiper-banner-prev"></div>
            <div slot="button-next" class="swiper-banner-next"></div>
            <div class="swiper-pagination"></div>
          </div>
        </client-only>
      </div>
      <div v-if="isDevelopment" class="development">
        <ul>
          <li v-for="item in themes" :key="item.displayName">
            <a
              :style="`background-color:hsl(${item.hue},${item.saturation},${item.lightness})`"
              @click="changeTheme(item)"
            ></a>
          </li>
        </ul>
      </div>
      <div v-if="!currentPath.isHome" class="breadCrumb-container">
        <div class="container">
          <bread-crumb :items="breadCrumbItems"></bread-crumb>
        </div>
      </div>
      <nuxt-child ref="main" />
    </section>
    <footer>
      <div class="container icp">
        <dl>
          <dt>
            Copyright
            <i class="far fa-copyright"></i>
            2019-{{ year }}
            {{ companyInfo.appName }}
          </dt>
          <dd v-for="item in companyInfo.icps" :key="item.id">
            <a class="gongan white" target="_blank" href="http://beian.miit.gov.cn/publish/query/indexFirst.action">
              <span>津ICP备{{ item }}</span>
            </a>
          </dd>
          <dd v-for="item in companyInfo.gongAns" :key="item.id">
            <a
              :href="`http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${item}`"
              class="gongan white"
              target="_blank"
            >
              <img src="@/assets/imgs/gongan.png" />
              <span>津公网安备{{ item }}号</span>
            </a>
          </dd>
          <dd>
            技术支持：
            <a href="http://www.ednet.cn" class="white" target="_blank">e德互联</a>
          </dd>
        </dl>
      </div>
    </footer>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import AppConsts from '../utiltools/appconst'
import Navbar from '@/components/Navbar'
import BreadCrumb from '@/components/BreadCrumb'
export default {
  components: { Navbar, BreadCrumb },
  head() {
    return {
      title: this.currentPath.displayName + ' - ' + this.companyInfo.appName + '-' + this.companyInfo.seoKeyWords,
      meta: [
        { hid: 'keywords', name: 'keywords', content: this.companyInfo.seoKeyWords },
        { hid: 'description', name: 'description', content: this.companyInfo.description }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: this.companyInfo.icon }]
    }
  },
  data() {
    return {
      isScroll: false,
      slide: 0,
      year: new Date().getFullYear(),
      sliding: null,
      wxShow: false,
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        },
        navigation: {
          nextEl: '.swiper-banner-next',
          prevEl: '.swiper-banner-prev'
        },
        loop: true,
        autoHeight: true,
        on: {
          slideChange() {},
          tap() {}
        }
      }
    }
  },
  computed: {
    ...mapState({
      abp: state => state.abp,
      themes: state => state.themes,
      multiLangs: state => state.abp.localization.languages.length > 1,
      companyInfo: state => state.app.companyInfo,
      navbars: state => state.app.navbars.slice(0, 8),
      currentPath: state => state.app.currentPath,
      currentPathParent: state => state.app.currentPathParent,
      breadCrumbItems: state => state.app.breadCrumbItems
    }),
    bannerImgs: {
      // getter
      get() {
        return this.$store.state.app.currentPath.bannerImgs
          ? this.$store.state.app.currentPath.bannerImgs.length > 0
            ? this.$store.state.app.currentPath.bannerImgs
            : this.$store.state.app.currentPathParent
            ? this.$store.state.app.currentPathParent.bannerImgs
            : []
          : []
      },
      set: val => console.log(val)
    },
    title() {
      return this.$L(this.currentPath.displayName)
    },
    Address() {
      return this.$L('Address')
    },
    Tel() {
      return this.$L('Tel')
    },
    Email() {
      return this.$L('Email')
    }
  },
  watch: {
    $route(val) {
      this.setcurrentPath({ path: this.$route.path })
    }
  },
  async asyncData(context) {
    let language = 'zh-CN'
    context.app.$cookies.set(context.store.state.app.headerName, language, {
      path: context.store.state.abp.appPath || '/',
      maxAge: 5 * 365 * 86400000,
      secure: true,
      sameSite: 'None'
    })
    context.store.dispatch('app/setCookie', language)
    await context.store.dispatch('app/getCompanyInfo')
    await context.store.dispatch('app/getNavbars')

    return {
      name: 'Main',
      userAgent: context.userAgent,
      language,
      theme: context.$config.NUXT_ENV_THEME,
      isDevelopment: context.$config.NUXT_ENV === 'development'
    }
  },
  created() {
    this.setcurrentPath({ path: this.$route.path })
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    handleSwiperReadied(swiper) {},
    handleScroll() {
      this.isScroll = document.documentElement.scrollTop > 10
    },
    closeNavbar() {
      this.$refs.navbar.close()
    },
    triggerNavbar() {
      this.$refs.navbar.trigger()
    },
    changeTheme(val) {
      document.documentElement.style.setProperty('--primary-hue', val.hue)
      document.documentElement.style.setProperty('--primary-saturation', val.saturation)
      document.documentElement.style.setProperty('--primary-lightness', val.lightness)
    },
    back() {
      this.$router.back(-1)
    },
    changeLanguage(lang) {
      window.location.href = '/' + lang + '/home'
    },
    ...mapActions({ setcurrentPath: 'app/setcurrentPath' }),
    go(url) {
      this.$router.push({ path: url })
    },
    getImgUrl(val) {
      if (val) return AppConsts.remoteServiceBaseUrl + val
      else return null
    },
    currentFontPosition(item) {
      return `banner-font ${item.titleAlign} ${item.titleVertical}`
    },
    weixinExpand() {
      return this.wxShow ? this.weixinHide() : this.weixinShow()
    },
    weixinShow() {
      this.wxShow = true
      document.addEventListener('click', () => (this.wxShow = false), false)
    },

    weixinHide() {
      this.wxShow = false
      document.removeEventListener('click', () => (this.wxShow = false), false)
    }
  }
}
</script>
