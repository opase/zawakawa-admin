import r from "@/utils/request.ts";

//获取分页视频信息
export function getVideos(page: number) {
  return r.request<string[]>({
    url: `/api/user/video/list/page`,
    method: "get",
    params: {
      page: page,
      pageSize: 5,
    },
  });
}

//删除视频
export function delVideoById(id: string) {
  return r.request<string[]>({
    url: `/api/admin/video/${id}`,
    method: "delete",
  });
}

//模糊搜索视频
export function getVideoByName(value: string, page: number) {
  return r.request<string[]>({
    url: `/api/admin/video/list`,
    method: `get`,
    params: {
      keyword: value,
      page: page,
      pageSize: 4,
    },
  });
}

//获取视频详情
export function getVideoInfoById(videoId: string) {
  return r.request<string[]>({
    url: `/api/user/video/info/${videoId}`,
    method: `get`,
  });
}

//获取已上传分片数
export function askChunk(md5: string) {
  return r.request<string[]>({
    url: `/api/admin/video/ask-chunk`,
    method: `get`,
    params: {
      hash: md5
    }
  });
}

//上传视频文件
export function uploadFileByChunk(formData: any) {
  return r.request<string[]>({
    url: `/api/admin/video/upload-chunk`,
    method: `post`,
    data: formData,
  });
}

//获取视频url
export function uploadedUrl(hash: string): Promise<string> {
  return r.request<{ data: string }>({
    url: `/api/admin/video/upload-video/${hash}`,
    method: 'get'
  }).then(res => res.data.data);
}

//上传封面获取url
export function uploadCover(formData: any) {
  return r.request<{data: string}>({
    url: `/api/admin/video/upload-cover`,
    method: `post`,
    data:formData,
  }).then(res => res.data.data);
}

//新增视频
export function createVideoInfo(value: { title: string; imgSrc: string; date:string; type:number; producer:string; score:number; category:string; description:string; episode:number; videoSrc:string})  {
  return r.request({
    url: `/api/admin/video`,
    method: 'post',
    data: value
  })
}

//更新视频
export function updateVideoInfo(value: {id:string; title: string; imgSrc: string; date:string; type:number; producer:string; score:number; category:string; description:string; episode:number; videoSrc:string})  {
  return r.request({
    url: `/api/admin/video`,
    method: 'put',
    data: value
  })
}