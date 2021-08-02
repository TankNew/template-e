<template>
  <section class="home">
    <section v-if="group1" class="news-block">
      <div class="news-list">
        <div class="large-title">
          <h3>{{ group1.title }}</h3>
          <h6>{{ group1.catalogGroup.info }}</h6>
        </div>
        <section class="looper">
          <client-only>
            <div v-swiper:group1Swipper="swiperOption1">
              <div class="swiper-wrapper position-relative">
                <div
                  v-for="item in group1.items"
                  :key="item.id"
                  :data-index="item.id"
                  :data-group="group1.type"
                  class="swiper-slide"
                >
                  <img :src="item.cover" />
                  <div class="slide-info">
                    <a>{{ item.title }}</a>
                  </div>
                </div>
              </div>
            </div>
          </client-only>
        </section>
      </div>
    </section>
    <section v-if="group2" class="picnews-block">
      <div class="large-title">
        <h3>{{ group2.title }}</h3>
        <h6>{{ group2.catalogGroup.info }}</h6>
      </div>
      <section class="container">
        <ul>
          <li v-for="item in group2.items" :key="item.id" :data-index="item.id" :data-group="group2.type">
            <div class="cover">
              <img :src="item.cover" @click="goNewsDetail(item.id, group2.type)" />
            </div>
            <div class="info">
              <h3 @click="goNewsDetail(item.id, group2.type)">{{ item.title }}</h3>
              <p>{{ filter(item.content, 200) }}</p>
            </div>
          </li>
        </ul>
      </section>
    </section>
    <section class="container">
      <section v-if="group3" class="product-block">
        <div class="large-title">
          <h3>{{ group3.title }}</h3>
          <h6>{{ group3.catalogGroup.info }}</h6>
        </div>
        <ul>
          <li v-for="item in group3.items" :key="item.id" @click="goNewsDetail(item.id, group3.type)">
            <div class="product-cover">
              <span>
                <img :src="item.cover" />
              </span>
            </div>
            <div class="product-info">
              <h4>{{ item.title }}</h4>
              <p>{{ filter(item.content, 200) }}</p>
            </div>
          </li>
        </ul>
      </section>
    </section>
    <section v-if="ad1" class="ad-block" :style="{ backgroundImage: 'url(' + ad1.img + ')' }">
      <div class="ad-content">
        <h3 class="title">
          <span class="name">{{ ad1.title }}</span>
        </h3>
        <div class="links" v-html="ad1.text"></div>
      </div>
    </section>
    <section class="container">
      <section v-if="announces && announces.length > 0" class="announce-block">
        <div class="announces-list">
          <div class="large-title">
            <h3>{{ $L(`Announce`) }}</h3>
          </div>
          <ul>
            <li v-for="item in announces" :key="item.id">
              <a @click="target(item.id)">
                {{ item.title }}<span>{{ item.creationTme }}</span>
              </a>
            </li>
          </ul>
        </div>
      </section>
    </section>
  </section>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import tools from '../../utiltools/tools'
import AppConsts from '../../utiltools/appconst'
export default {
  data() {
    return {
      wordIndex: 0,
      observer: null,
      isProductLoading: false,
      announceSwiperOption: {
        autoplay: true,
        loop: true
      }
    }
  },
  computed: {
    swiperOption1() {
      let that = this
      let option = {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        autoplay: { delay: 4000 },
        loop: true,
        breakpointsInverse: true,
        preventClicks: false,
        breakpoints: {
          300: {
            coverflowEffect: {
              rotate: 30,
              stretch: -10,
              depth: 200,
              modifier: 1,
              slideShadows: true
            },
            slidesPerView: 2
          },
          768: {
            coverflowEffect: {
              rotate: 30,
              stretch: -100,
              depth: 200,
              modifier: 1,
              slideShadows: true
            },
            slidesPerView: 3
          }
        },
        on: {
          click() {
            const realIndex = this.clickedSlide.dataset.index
            const group = parseInt(this.clickedSlide.dataset.group)
            that.goNewsDetail(realIndex, group)
          }
        }
      }
      return option
    },
    swiperOption() {
      let that = this
      let option = {
        autoplay: { delay: 4000 },
        loop: true,
        breakpointsInverse: true,
        preventClicks: false,
        breakpoints: {
          300: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 30
          },
          768: {
            slidesPerView: 4,
            slidesPerGroup: 3,
            spaceBetween: 30
          }
        },
        on: {
          click() {
            const realIndex = this.clickedSlide.dataset.index
            const group = parseInt(this.clickedSlide.dataset.group)
            that.goNewsDetail(realIndex, group)
          }
        }
      }
      return option
    },
    ...mapState({
      currentPath: state => state.app.currentPath,
      culture: state => state.app.culture,
      partners: state => state.app.partners,
      homePage: state => state.app.homePage
    })
  },
  async asyncData({ isDev, route, store, env, query, req, res, redirect, error }) {
    let params, group1, group2, group3, ad1, ad2, announces
    const groups = store.state.app.homePage.groups.filter(x => x.catalogGroup)
    const blocks = store.state.app.homePage.blocks

    ad1 = blocks.length > 0 ? blocks[0] : null
    ad2 = blocks.length > 1 ? blocks[1] : null
    group1 = groups.length > 0 ? groups[0] : null
    group2 = groups.length > 1 ? groups[1] : null
    group3 = groups.length > 2 ? groups[2] : null
    if (group1 && group1.items) group1.items = group1.items.slice(0, 6)
    if (group2 && group2.items) group2.items = group2.items.slice(0, 3)
    if (group3 && group3.items) group3.items = group3.items.slice(0, 6)

    params = {
      params: {
        SkipCount: 0,
        MaxResultCount: 10
      }
    }
    announces = (await store.dispatch('app/getAnounces', params)).items
    return { ad1, ad2, announces, group1, group2, group3 }
  },
  created() {
  },
  methods: {
    target(id) {
      window.open(`/${this.culture}/announce/detail/` + String(id, '_blank'))
    },
    getImgUrl(val) {
      if (val) return AppConsts.remoteServiceBaseUrl + val
      else return null
    },
    goNewsGroup(id, type) {
      switch (type) {
        case 1:
          this.$router.push(`/${this.culture}/news/` + String(id))
          break
        case 2:
          this.$router.push(`/${this.culture}/photonews/` + String(id))
          break
        case 3:
          this.$router.push(`/${this.culture}/product/` + String(id))
          break
      }
    },
    goNewsDetail(id, type) {
      let typename
      switch (type) {
        case 1:
          typename = 'news'
          break
        case 2:
          typename = 'photonews'
          break
        case 3:
          typename = 'product'
          break
      }
      window.open(`/${this.culture}/` + typename + '/detail/' + String(id), '_blank')
    },
    filter(val, length) {
      return tools.cutString(tools._filter(val), length)
    },
    formatDate(val) {
      return tools.date(val)
    }
  }
}
</script>
