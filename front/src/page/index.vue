<template>
  <div class="translator">
    <!-- <a-input
      class="inputBox"
      placeholder="search lang text"
      size="large"
      v-model="searchValue"
    /> -->
    <div class="switch">
      choose languages <a-radio-group v-model="choose" :options="otherLang" />
    </div>
    <div class="switch">
      only show need to translator <a-switch v-model="onlyTranslator" />
    </div>
    <a-collapse class="a-collapse" defaultActiveKey="0">
      <a-collapse-panel :header="item.key" v-for="(item) in defaultLangFilter" :key="item.key">
        <i18Update :defaultItem="item" :other="getOtherValue(item.key)" />
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
import i18Update from '@/components/common/i18Update'
export default {
  components: { i18Update },
  data() {
    return {
      searchValue: '',
      other: [],
      active: [],
      onlyTranslator: false,
      lang: [],
      choose: '',
      defaultLang: []
    }
  },
  provide() {
    return {
      translator: this
    };
  },
  computed: {
    otherLang() {
      return this.lang.filter(item => !item.isDefault).map(item => item.lang)
    },
    filterField() {
      const { other, choose, onlyTranslator } = this
      if(onlyTranslator && choose) {
        const chooseLang = other.find(item => item.name == choose) || { value: [] }
        return Object.keys(chooseLang.value).filter(key => !chooseLang.value[key])
      }else {
        return []
      }
    },
    defaultLangFilter() {
      const { defaultLang, filterField, onlyTranslator, choose } = this
      if(choose && onlyTranslator) {
        return defaultLang.filter(item => filterField.includes(item.key))
      }else {
        return defaultLang
      }
    }
  },
  methods: {
    getLangPack() {
      this.$store.dispatch('getLangPack').then(res => {
        console.log(res)
        this.defaultLang = res.data.default
        this.lang = res.data.lang
        this.other = res.data.other
      })
    },
    getOtherValue(key) {
      return this.other.map(lang => {
        const { name, value } = lang
        return {
          name, value: value[key]
        }
      })
    }
  },
  created() {
    this.getLangPack()
  }
}
</script>

<style lang="scss" scoped>
  .translator {
    padding: 20px 50px;
  }
.a-collapse {
  margin-top: 10px;
}
.switch {
  font-size: 14px;
  margin-top: 20px;
}
</style>