import request from '@/utils/request'
console.log(request)
const actions = {
  setGlobalLoading({ state }, globalLoading) {
    state.globalLoading = globalLoading
  },
  // 接口封装示例
  get({ commit }, data) {
    return request.get(`url`, { params: data })
  },
  post({ commit }, data) {
    return request.post(`url`, data)
  },
  getLangPack({ commit }, data) {
    return request.get(`getLangPacks`)
  },
  updateLangPacks({ commit }, data) {
    return request.post(`updateLangPacks`, data)
  },
}
 
export default actions