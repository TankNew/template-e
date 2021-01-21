<template>
  <div class="container">
    <div class="page-content">
      <div class="honor-list">
        <ul>
          <li
            v-for="(item, index) in pageContent.items"
            :key="item.id"
            :style="'animation-delay:' + index * 0.5 + 's;'"
          >
            <span class="img-container">
              <img :src="item.miniCover" />
            </span>
            <a href="javascript:void(0)" class="gray">
              <span>{{ item.title }}</span>
            </a>
            <i
              >{{ formatDate(item.startDate) }}{{ formatDate(item.startDate)!=null
               && formatDate(item.endDate)!==null ? ' 一 ' : ''
              }}{{ formatDate(item.endDate) }}</i
            >
          </li>
        </ul>
      </div>
      <div class="my-5">
        <pagination
          v-model="currentPage"
          :per-page="perPage"
          :total-rows="pageContent.totalCount"
          @input="pageChange"
        ></pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import tools from '../../utiltools/tools'

const c = 1
const p = 8
export default {
  data() {
    return {
      currentPage: c,
      perPage: p
    }
  },
  computed: {
    ...mapState({
      currentPath: state => state.app.currentPath,
      currentPathParent: state => state.app.currentPathParent
    })
  },
  async asyncData({ isDev, route, store, env, params, query, req, res, redirect, error }) {
    const param = {
      params: {
        IsActive: true,
        SkipCount: (c - 1) * p,
        MaxResultCount: p
      }
    }
    const json = await store.dispatch('app/getHonorList', param)
    return { pageContent: json }
  },
  created() {},
  methods: {
    formatDate(val) {
      return tools.dateOnly(val)
    },
    async pageChange() {
      const params = {
        params: {
          SkipCount: (this.currentPage - 1) * this.perPage,
          MaxResultCount: this.perPage
        }
      }
      this.pageContent = await this.$store.dispatch('app/getHonorList', params)
    }
  }
}
</script>
