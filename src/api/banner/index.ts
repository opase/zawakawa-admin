import  r  from "@/utils/request.ts"

//获取banner列表
export function getBanner()  {
  return r.request<string[]>({
    url: 'http://localhost:8081/api/user/banner',
    method: 'get',
  })
}

//添加banner
export function addBanner(value: { title: string; imgSrc: string})  {
  return r.request({
    url: 'http://localhost:8081/api/admin/banner',
    method: 'post',
    data: value
  })
}

//添加banner
export function updateBanner(value: {id: string; title: string; imgSrc: string; description: string; type: string })  {
  return r.request({
    url: 'http://localhost:8081/api/admin/banner',
    method: 'put',
    data: value
  })
}

//删除banner
export function delBanner(id: string) {
  return r.request({
    url: `http://localhost:8081/api/admin/banner/${id}`,
    method: 'delete'
  })
}

//查找banner
export function searchBanner(keyword: string) {
  return r.request({
    url: `http://localhost:8081/api/admin/banner`,
    method: 'get',
    params: {value: keyword},
  })
}