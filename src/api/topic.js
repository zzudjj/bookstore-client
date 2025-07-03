import ajax from './ajax';

const BASE = '/topic/v2';

export const reqGetTopicList = (page, pageSize, all=false) => ajax(BASE + '/list', {page, pageSize, all});
export const reqGetTopicDetail = (id) => ajax(BASE + '/' + id);

// 管理端
export const reqAddTopic = (topic) => ajax(BASE + '/admin', topic, 'POST');
export const reqUpdateTopic = (id, topic) => ajax(BASE + '/admin/' + id, topic, 'PUT');
export const reqDeleteTopic = (id) => ajax(BASE + '/admin/' + id);
export const reqChangeTopicStatus = (id,status)=>ajax(BASE + '/admin/' + id + '/status',{status},'PUT');
export const reqUploadCover = (id,file)=>{
  const form=new FormData();
  form.append('file',file);
  return ajax(BASE + '/admin/' + id + '/cover', form, 'POST');
} 