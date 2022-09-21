import express from "express";
const router = express.Router();
import { promises as fs } from "fs";
import flat from 'flat';
import config from '../config.js'

router.get('/getLangPacks', async (req, res, next) => {
  const lang = {}
  for(let i in config.lang) {
    const name = config.lang[i]
    lang[name] = await fs.readFile(`${config.path}${name}`).then(buf=>buf.toString())
    lang[name] = flat(JSON.parse(lang[name]))
  }

  // 标准字段文件 
  const defaultItem = lang[config.defaultLang]
  // 其他需要修改的字段文件
  const otherLangKey = Object.keys(lang).filter(key => key!= config.defaultLang)
  // 其他文件字段补全
  Object.keys(defaultItem).forEach(key => {
    otherLangKey.forEach(item => {
      if(!lang[item][key]) lang[item][key] = ''
    }) 
  })
  // 补全完成 修改源文件
  otherLangKey.forEach(name => {
    fs.writeFile(`${config.path}${name}`, JSON.stringify(flat.unflatten(lang[name])))
  })
  res.status(200).json({
    success: 1, data: {
      // 默认语言 直接导出所有字段用于前端循环
      default: Object.keys(lang[config.defaultLang]).map(key => {
        return {
          key, value: lang[config.defaultLang][key]
        }
      }),
      // 其他语言
      other: otherLangKey.map(name => {
        return {
          name, value: lang[name]
        }
      }),
      lang: config.lang.map(item => {
        return {
          isDefault: item == config.defaultLang,
          lang: item
        }
      })
    }
  });
})

router.post('/updateLangPacks', async (req, res, next) => {
  const { key, values } = req.body
  const lang = {}
  for(let i in values) {
    const { name, value } = values[i]
    lang[name] = await fs.readFile(`${config.path}${name}`).then(buf=>buf.toString())
    console.log(lang[name])
    lang[name] = flat(JSON.parse(lang[name]))
    lang[name][key] = value
    await fs.writeFile(`${config.path}${name}`, JSON.stringify(flat.unflatten(lang[name])))
  }
  res.status(200).json({
    success: 1, data: {
      other: Object.keys(lang).map(name => {
        return {
          name, value: lang[name]
        }
      }),
      lang
    }
  })
})

// function langPacksKey(lang, key, complete) {
//   let start_key = key
//   if(key) start_key = key + '.'
//   let array = []
//   Object.keys(lang).forEach(key => {
//     const allKey = start_key + key
//     if( typeof lang[key] == 'object') {
//       // if(complete) {
//       //   if()
//       // }
//       array.push(...langPacksKey(lang[key], allKey)) 
//     }else {
//       array.push({ key: allKey, value: lang[key]})
//     }
//   })
//   return array
// }


function complete() {

}

router.get('/test', async (req, res, next) => {
  const a = {
    b: {
      c: ''
    }
  }
  res.status(200).json({success: 1, data: a['b.c']});
})


export default router;
