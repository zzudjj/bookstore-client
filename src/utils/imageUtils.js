/**
 * 图片URL处理工具
 * 用于将后端返回的相对路径转换为完整的访问URL
 */

// 服务器基础URL配置
const SERVER_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://your-production-server.com' 
  : 'http://localhost:8080';

/**
 * 将相对路径转换为完整的图片URL
 * @param {string} relativePath - 后端返回的相对路径，如 'static/image/book/hongloumeng_cover.jpg'
 * @returns {string} 完整的图片URL
 */
export function getImageUrl(relativePath) {
  if (!relativePath) {
    return '';
  }
  
  // 如果已经是完整URL，直接返回
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  
  // 确保路径以 / 开头
  const normalizedPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  
  return `${SERVER_BASE_URL}${normalizedPath}`;
}

/**
 * 处理图书封面图片URL
 * @param {string} coverImg - 图书封面相对路径
 * @returns {string} 完整的封面图片URL
 */
export function getBookCoverUrl(coverImg) {
  return getImageUrl(coverImg);
}

/**
 * 处理图书图片列表URL
 * @param {Array} imgList - 图书图片相对路径数组
 * @returns {Array} 完整的图片URL数组
 */
export function getBookImagesUrl(imgList) {
  if (!Array.isArray(imgList)) {
    return [];
  }
  
  return imgList.map(img => getImageUrl(img));
}

/**
 * 获取默认图书封面
 * @returns {string} 默认封面图片URL
 */
export function getDefaultBookCover() {
  return getImageUrl('static/image/book/default-book-cover.jpg');
}

/**
 * 检查图片URL是否有效
 * @param {string} imageUrl - 图片URL
 * @returns {Promise<boolean>} 图片是否可访问
 */
export function checkImageExists(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
}

// 导出配置，供其他地方使用
export const IMAGE_CONFIG = {
  SERVER_BASE_URL,
  DEFAULT_BOOK_COVER: getDefaultBookCover(),
  // 图片路径前缀
  BOOK_IMAGE_PREFIX: 'static/image/book/',
  TOPIC_IMAGE_PREFIX: 'static/image/topic/',
};
