<template>
  <div v-show="expand" :class="['navbar','sub',expand?'expand':'']">
    <ul>
      <li
        v-for="(item,index) in arry"
        :key="index"
        @click.stop.prevent="expandItem(item,index)"
      >
        <a class="nav-link white" @click.stop.prevent="go(item,index)">
          <span
            v-if="hasChildren(item)"
            :class="['expand-icon',item.expand?'expand':'']"
            @click.stop.prevent="expandItem(item,index)"
          >
            <i class="fas fa-caret-right"></i>
          </span>
          <span class="name">{{ item.displayName }}</span>
        </a>
        <navbar-sub-items
          v-if="hasChildren(item)"
          :items="item.children"
          :expand="item.expand"
          v-bind="$attrs"
          v-on="$listeners"
        ></navbar-sub-items>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'NavbarSubItems',
  data() {
    return {
      arry: []
    }
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    expand: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    $attrs: {
      handler(nv, ov) {
        if (nv['active-id'] !== ov['active-id'])
          this.arry.forEach(x => {
            x.expand = false
          })
      }
    }
  },
  inheritAttrs: false,
  created() {
    this.arry = this.items.map(x => {
      x.expand = false
      return x
    })
  },
  methods: {
    go(item, index) {
      if (item.navbarType !== 0) {
        this.routerUrl(item)
      } else {
        this.expandItem(item, index)
      }
    },
    hasChildren(item) {
      return item.children.length > 0
    },
    expandItem(item, index) {
      if (this.hasChildren(item)) {
        item.expand = !item.expand
        /* 触发视图响应 */
        this.$set(this.arry, index, item)
      } else {
        this.routerUrl(item)
      }
    },
    routerUrl(item) {
      this.$router.push({ path: item.url })
      if (this.$attrs.pc) this.$emit('unExpandAll')
      else this.$emit('trigger')
    }
  }
}
</script>
<style lang="less">
</style>
