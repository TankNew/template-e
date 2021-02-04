<template>
  <section class="home">
    <section class="container">
      <section v-if="ad1 || (announces && announces.length > 0)" class="ad-announce">
        <section v-if="ad1" class="ad-block">
          <div class="ad-content">
            <h3 class="title">
              <span class="name">{{ ad1.title }}</span>
            </h3>
            <div class="text" v-html="ad1.text"></div>
            <div class="links">
              <a :href="ad1.url ? ad1.url : 'javascript:void(0)'" class="button-gray">{{ $L(`More`) }} ></a>
            </div>
          </div>
        </section>
        <section v-if="announces && announces.length > 0" class="announce-block">
          <section class="looper">
            <div v-swiper="announceSwiperOption">
              <div class="swiper-wrapper">
                <div v-for="item in announces" :key="item.id" class="swiper-slide" @click="target(item.id)">
                  <div class="cover">
                    <img :src="item.cover" />
                  </div>
                  <h3>{{ item.title }}</h3>
                </div>
              </div>
            </div>
          </section>
        </section>
      </section>
      <section v-if="group1" class="news-block">
        <div class="news-list">
          <dl>
            <dt class="block-title">
              <span class="name">{{ group1.title }}</span>
              <span class="more">
                <a href="javascript:void(0)" @click="goNewsGroup(group1.catalogGroupId, group1.type)"
                  >{{ $L('More') }} ></a
                >
              </span>
            </dt>
            <dd v-for="item in group1.items" :key="item.id">
              <a class="gray" href="javascript:void(0)" @click="goNewsDetail(item.id, group1.type)">{{ item.title }}</a>
              <i>{{ formatDate(item.creationTime) }}</i>
              <p>{{ filter(item.content, 200) }}</p>
            </dd>
          </dl>
        </div>
      </section>
    </section>
    <section v-if="group2" class="picnews-block">
      <!-- <h3 class="block-title">
        <span class="name">{{ group2.title }}</span>
        <span class="more">
          <a
            href="javascript:void(0)"
            @click="goNewsGroup(group2.catalogGroupId,group2.type)"
          >{{ $L('More') }} ></a>
        </span>
      </h3>-->
      <section class="container">
        <section class="looper">
          <client-only>
            <div v-swiper:group2Swipper="swiperOption">
              <div class="swiper-wrapper position-relative">
                <div
                  v-for="item in group2.items"
                  :key="item.id"
                  :data-index="item.id"
                  :data-group="group2.type"
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
      </section>
    </section>
    <section class="container">
      <section v-if="group3" class="product-block">
        <h3 class="block-title">
          <span class="name">{{ group3.title }}</span>
          <span class="more">
            <a href="javascript:void(0)" @click="goNewsGroup(group3.catalogGroupId, group3.type)">{{ $L('More') }} ></a>
          </span>
        </h3>
        <ul>
          <li v-for="item in group3.children" :key="item.id" @click="goNewsGroup(item.id, group3.type)">
            <div class="product-icon-container">
              <div class="product-icon">
                <img :src="item.icon" />
              </div>
              <div class="product-cover">
                <span>
                  <img :src="item.cover" />
                </span>
              </div>
              <div class="product-info">
                <h4>{{ item.displayName }}</h4>
                <p>{{ item.info }}</p>
              </div>
            </div>
          </li>
        </ul>
      </section>
      <section v-if="ad2" class="ad-img-block">
        <h3 class="title">
          <span class="name">{{ ad2.title }}</span>
        </h3>
        <a :href="ad2.url ? ad2.url : 'javascript:void(0)'" class="img-url">
          <img :src="ad2.img" />
        </a>
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
    if (group2 && group2.items) group2.items = group2.items.slice(0, 6)
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
  created() {},
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
