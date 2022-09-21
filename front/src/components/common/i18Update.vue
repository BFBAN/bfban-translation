<template>
  <div :class="['content']">
    <div>
      <div class="langName">{{defaultLang.lang}}</div>
      <div>
        <a-textarea v-model="defaultItem.value" :disabled="true" />
      </div>
    </div>
    <div v-for="lang in other" :key="lang.name">
      <div class="langName">{{lang.name}}</div>
      <div>
        <a-textarea :value="lang.value" @change="(e) => updateLang(e, lang.name)" />
      </div>
    </div>
    <a-button class="button" type="primary" @click="update">Confirm</a-button>
  </div>
</template>

<script>
export default {
  inject: ['translator'],
  props: {
    defaultItem: {
      type: Object,
      default: () => {}
    },
    other: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      updateItem: {}
    }
  },
  computed: {
    defaultLang() {
      return this.translator.lang.find(item => item.isDefault) || {}
    },
  },
  methods: {// 获得焦点事件
    update() {
      const { updateItem, defaultItem } = this
      const data = {}
      data.key = defaultItem.key
      data.values = Object.keys(updateItem).map(name => {
        return {
          name, value: updateItem[name]
        }
      })
      this.$store.dispatch('updateLangPacks', data).then(res => {
        this.translator.getLangPack()
      })
    },
    updateLang(e, name) {
      this.updateItem[name] = e.target.value
    }
  },
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  align-items: center;
  >div {
    flex: 1;
    margin-right: 10px;
    .langName {
      margin-bottom: 10px;
    }
  }
  
  .button {
    margin-top: 25px;
    margin-left: 20px;
  }
}
</style>