import ajax from "./ajax";

const BASE_URL = '/book'  // 正确的API路径

//添加出版社newProduct: true,
//                 recommend
export const reqAddBook = (book) => ajax(BASE_URL+'/addBook', {
  author: book.author,
  isbn: book.isbn,
  publish: book.publish,
  birthday: book.birthday,
  marketPrice: book.marketPrice,
  price: book.price,
  stock: book.stock,
  description: book.description,
  put: book.put,
  bookName: book.bookName,
  rank: book.rank,
  newProduct: book.newProduct,
  recommend: book.recommend,
  bookSort: book.bookSort
}, 'POST')

export const reqModifyBook = (book) => ajax(BASE_URL+'/modifyBook', {
  author: book.author,
  isbn: book.isbn,
  publish: book.publish,
  birthday: book.birthday,
  marketPrice: book.marketPrice,
  price: book.price,
  stock: book.stock,
  description: book.description,
  put: book.put,
  bookName: book.bookName,
  rank: book.rank,
  newProduct: book.newProduct,
  recommend: book.recommend,
  bookSort: book.bookSort,
  id: book.id
}, 'POST')


export const reqGetBookList = (page,pageSize)=>ajax(BASE_URL+'/getBookList',{page, pageSize})
export const reqGetBook = (id)=>ajax(BASE_URL+'/getBook',{id})

export const reqGetRecBookList = (sort)=>ajax(BASE_URL+'/getRecBookList',{sort})



//删除
export const reqDelBook = (bookId)=>ajax(BASE_URL+'/delBook',{bookId})
export const reqDelBookImg = (bookId,url)=>ajax(BASE_URL+'/delOneImg',{bookId,url})


export const reqGetBookImgPathList = (isbn)=>ajax(BASE_URL+'/getImgPaths',{isbn})


export const reqModifyPut = (bookId,put)=>ajax(BASE_URL+'/modifyPut',{bookId,put})
export const reqModifyRec = (bookId,recommend)=>ajax(BASE_URL+'/modifyRec',{bookId,recommend})
export const reqModifyNew = (bookId,newProduct)=>ajax(BASE_URL+'/modifyNew',{bookId,newProduct})

//getSortBookList
export const reqGetSortBookList = (sortId)=>ajax(BASE_URL+'/getSortBookList',{sortId})

//getSortBookListBySort
export const reqGetBookListBySort = (sortId,page,pageSize)=>ajax(BASE_URL+'/getBookListBySort',{sortId,page, pageSize})


// 搜索图书 - 标准接口（使用POST避免中文编码问题）
export const reqSearchBooks = (keyword, page = 1, pageSize = 10) => {
  return ajax(BASE_URL + '/searchBooks', {
    keyword: keyword,
    page: page,
    pageSize: pageSize
  }, 'POST');
}

// 搜索图书 - GET方法（备用）
export const reqSearchBooksGet = (keyword, page = 1, pageSize = 10) => {
  return ajax(BASE_URL + '/searchBooks', {
    keyword: keyword,
    page: page,
    pageSize: pageSize
  }, 'GET');
}

// 搜索图书 - 兼容旧接口
export const reqSearchBookByKeyword = (keyword, page, pageSize) => ajax(BASE_URL+'/searchBooks', {keyword, page, pageSize}, 'POST')

// 高级搜索图书
export const reqAdvancedSearchBooks = (searchParams) => ajax(BASE_URL+'/advancedSearch', searchParams, 'POST')

// 获取所有图书（用于选择器等场景）
export const reqGetAllBooks = () => ajax(BASE_URL+'/all', {}, 'GET')
