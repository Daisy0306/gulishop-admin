import request from "@/utils/request";

// 用的对象写法，比较简单
// 之前用的函数写法
export default {
  // DELETE /admin/product/baseTrademark/remove/{id}
  // 删除BaseTrademark
  delete(id) {
    return request.delete(`/admin/product/baseTrademark/remove/${id}`)
  },

  // POST /admin/product/baseTrademark/save
  // 新增BaseTrademark

  // PUT /admin/product/baseTrademark/update
  // 修改BaseTrademark
  addOrUpdate(trademark) {
    if (trademark.id) {
      return request.put('/admin/product/baseTrademark/update', trademark)
    } else {
      return request.post('/admin/product/baseTrademark/save', trademark)
    }
  },

  // GET /admin/product/baseTrademark/{page}/{limit}
  // 分页列表
  getPageList(page, limit) {
    return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
  }
}
