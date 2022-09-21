<template>
  <a-layout>
    <a-layout-content>
      <a-page-header
          style="border: 1px solid rgb(235, 237, 240)"
          title="Translate"
          sub-title="Website translation program"
          @back="() => null"
      />

      <a-layout style="padding: 24px 0; background: #fff">
        <a-row>
          <a-col :span="5" :push="1">
            <a-tree
                :show-line="showLine"
                :show-icon="showIcon">
              <a-icon slot="icon" type="carry-out" />
              <a-tree-node :key="index" v-for="(i, index) in structure.menu">
                <a-icon slot="icon" type="carry-out" />
                <span slot="title">{{ i.name }}</span>
                <a-tree-node :key="`${i.name}.${j.name}_${jindex}`" :title="`.${j.name}`" v-for="(j, jindex) in i.child">
                  <a-icon slot="icon" type="carry-out" />
                  <a-tree-node :key="`${i.name}.${j.name}.${g.name}_${gindex}`" :title="`.${g.name}`" v-for="(g, gindex) in j.child">
                    <a-icon slot="icon" type="carry-out" />
                  </a-tree-node>
                </a-tree-node>
              </a-tree-node>
            </a-tree>
          </a-col>
          <a-col :span="18">

            <a-row type="flex">
              <a-col flex="1">
                <a-select default-value="zh-CN" style="width: 150px">
                  <a-select-option value="zh-CN">
                    zh-CN
                  </a-select-option>
                </a-select>
                <a-icon type="swap-right" />
                <a-select v-model="choose" style="width: 150px">
                  <a-select-option value="zh-CN" v-for="(lang, lang_index) in otherLang" :key="lang_index">
                    {{ lang }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col>
                <div class="switch">
                  only show need to translator <a-switch v-model="onlyTranslator" />
                </div>
              </a-col>
            </a-row>

<!--            <div class="switch">-->
<!--              choose languages <a-radio-group v-model="choose" :options="otherLang" />-->
<!--            </div>-->

            <a-collapse class="a-collapse" defaultActiveKey="0">
              <a-collapse-panel :header="item.key" v-for="(item) in defaultLangFilter" :key="item.key">
                <i18Update :defaultItem="item" :other="getOtherValue(item.key)" />
              </a-collapse-panel>
            </a-collapse>

          </a-col>
        </a-row>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>

<script>
import i18Update from '@/components/common/i18Update'

import langFormat from '../../../server/lang/zh.json';

export default {
  components: {
    i18Update
  },
  data() {
    return {
      showLine: true,
      showIcon: false,

      searchValue: '',
      other: [],
      active: [],
      onlyTranslator: false,
      lang: [],
      choose: '',
      defaultLang: [],

      structure: {
        menu: []
      }
    }
  },
  provide() {
    return {
      translator: this
    };
  },
  created (){
    this.getLangPack()

    this.structure.menu = this.creationStructure(langFormat, {});
  },
  computed: {
    onSelect(selectedKeys, info) {
      console.log('selected', selectedKeys, info);
    },
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
    creationStructure (_data, _lastData) {
      if (!_lastData) return;
      let array = []

      for (let key in _data) {
        let _row = {
          name: key,
          child: []
        };

        if (langFormat[key]) {
          for (let childKey in langFormat[key]) {
            if (langFormat[key][childKey] instanceof Object)
            {
              // console.log(langFormat[key][childKey])
              _row.child.push({
                name: childKey,
                child: this.nextChild(langFormat[key][childKey], childKey)
              });
            } else if (langFormat[key][childKey] instanceof String) {
              _row.child.push({
                name: childKey,
              });
            }
          }
        }

        array.push(_row);
      }
      return array;
    },
    nextChild (data, key) {
      let array = [];
      for (let dataKey in data) {
        if (data instanceof Object) {
          array.push({
            name: dataKey,
            child: this.nextChild(data[dataKey], dataKey),
          })
        } else if (data instanceof String) {
          array.push({
            name: dataKey,
          })
        }
      }
      return array;
    },
    getLangPack() {
      this.$store.dispatch('getLangPack').then(res => {
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
  }
}
</script>

<style lang="scss" scoped>
.a-collapse {
  margin-top: 10px;
}
.switch {
  font-size: 14px;
  margin-top: 20px;
}
</style>