import ajax from "./ajax";

const BASE_URL = '/announcement'

export const reqAddAnnouncement = (announcement) => ajax(BASE_URL + '/addAnnouncement', announcement, 'POST')
export const reqDelAnnouncement = (id) => ajax(BASE_URL + '/delAnnouncement', { id })
export const reqModifyAnnouncement = (announcement) => ajax(BASE_URL + '/modifyAnnouncement', announcement, 'POST')
export const reqGetAnnouncement = (id) => ajax(BASE_URL + '/getAnnouncement', { id })
export const reqGetAnnouncementList = (page, pageSize) => ajax(BASE_URL + '/getAnnouncementList', { page, pageSize })
export const reqGetEnabledAnnouncementList = () => ajax(BASE_URL + '/getEnabledList') 