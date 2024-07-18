import r from "@/utils/request.ts";

//获取分页视频信息
export function getVideos(page: number) {
  return r.request<string[]>({
    url: "http://localhost:8081/api/user/video/list/page",
    method: "get",
    params: {
      page: page,
      pageSize: 4,
    },
  });
}

//删除视频
export function delVideoById(id: string) {
  return r.request<string[]>({
    url: `http://localhost:8081/api/admin/video/${id}`,
    method: "delete",
  });
}

//模糊搜索视频
export function getVideoByName(value: string, page: number) {
  return r.request<string[]>({
    url: `http://localhost:8081/api/user/video/list`,
    method: `get`,
    params: {
      keyword: value,
      page: page,
      pageSize: 4,
    },
  });
}

//获取视频详情
export function getVideoInfoById(videoId:string) {
  return r.request<string[]>({
    url: `http://localhost:8081/api/user/video/info/${videoId}`,
    method:`get`,
  })
}
