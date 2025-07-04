import ajax from "./ajax";

const BASE_URL = '/comment';

// 获取图书评论列表
export const reqGetComments = (bookId, page, pageSize) =>
  ajax(BASE_URL + '/getByBook', { bookId, page, pageSize });

// 点赞评论
export const reqLikeComment = (commentId, token) =>
  ajax(BASE_URL + `/like?commentId=${commentId}`, {}, 'POST', token);

// 取消点赞
export const reqUnlikeComment = (commentId, token) =>
  ajax(BASE_URL + `/unlike?commentId=${commentId}`, {}, 'POST', token);

// 添加评论（预留）
export const reqAddComment = (data, token) =>
  ajax(BASE_URL + '/add', data, 'POST', token);

// 管理员获取所有评论
export const reqAdminGetAllComments = (page, pageSize, token) =>
  ajax(BASE_URL + `/admin/getAllComments?page=${page}&pageSize=${pageSize}`, {}, 'GET', token); 