import ajax from "./ajax";

const BASE_URL = '/about'

export const reqGetAbout = () => ajax(BASE_URL + '/get')
export const reqModifyAbout = (about) => ajax(BASE_URL + '/modify', about, 'POST')
export const reqAddAbout = (about) => ajax(BASE_URL + '/add', about, 'POST') 