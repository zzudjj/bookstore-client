import Vue from 'vue';
import Router from 'vue-router';
import Login from "../pages/Login/Login";
import Index from "../pages/Index/Index";

import UserHome from "../pages/UserHome/UserHome";
import Book from "../pages/Book/Book";
import Register from "../pages/Register/Register";
import Spike from "../pages/Spike/Spike";
import Admin from "../pages/AdminHome/Admin";
import BookTopic from "../pages/BookList/BookTopic";
import BookList from "../components/AdminHome/bookNav/book/BookList";
import AddBook from "../components/AdminHome/bookNav/book/components/BookDetail";
import OrderList from "../components/AdminHome/orderNav/OrderList";
import OrderSet from "../components/AdminHome/orderNav/OrderSet";

import BookRecommend from "../components/AdminHome/market/BookRecommend";
import CouponManagement from "../pages/AdminHome/CouponManagement";
import SpikeSet from "../components/AdminHome/market/SpikeSet";
import MenuList from "../components/AdminHome/authority/MenuList";
import RolesList from "../components/AdminHome/authority/RolesList";
import UserList from "../components/AdminHome/authority/UserList";
import EnhancedDashboard from "../components/AdminHome/EnhancedDashboard";
import TopicManage from "../components/AdminHome/bookNav/topic/TopicManage";
import Search from "../pages/Search/Search";
import Upload3 from "../components/Upload3";
import Cart from "../pages/Cart/Cart";

import AddSort from "../components/AdminHome/bookNav/sort/components/SortDetail";
import Publish from "../components/AdminHome/bookNav/publish/Publish";

import AddPublish from "../components/AdminHome/bookNav/publish/AddPublish";
import UpdatePublish from "../components/AdminHome/bookNav/publish/UpdatePublish";

import UpdateFirstSort from "../components/AdminHome/bookNav/sort/UpdateFirstSort";
import UpdateSecondSort from "../components/AdminHome/bookNav/sort/UpdateSecondSort";
import FirstSortList from "../components/AdminHome/bookNav/sort/FirstSortList";
import SecondSortList from "../components/AdminHome/bookNav/sort/SecondSortList";
import UpdateBook from "../components/AdminHome/bookNav/book/UpdateBook";
import BookTopicDetail from "../components/AdminHome/bookNav/topic/component/BookTopicDetail";
import UpdateBookTopic from "../components/AdminHome/bookNav/topic/UpdateBookTopic";
import AddBookTopic from "../components/AdminHome/bookNav/topic/AddBookTopic";
import SubTopicList from "../components/AdminHome/bookNav/topic/SubTopicList";
import Address from "../components/UserHome/home/Address";
import MesNotice from "../components/UserHome/home/MesNotice";
import UserCenter from "../components/UserHome/home/UserCenter";
import PwdManage from "../components/UserHome/manage/PwdManage";
import UserInfo from "../components/UserHome/manage/UserInfo";
import Evaluate from "../components/UserHome/order/Evaluate";
import UserOrder from "../components/UserHome/order/UserOrder";
import MyComments from "../components/UserHome/order/MyComments";
import OrderReview from "../components/UserHome/order/OrderReview";



import BuyPage from "../pages/BuyPage/BuyPage";
import OrderDetail from "../components/AdminHome/orderNav/OrderDetail";
import Deliver from "../components/AdminHome/orderNav/Deliver";
import UserOrderDetail from "../components/UserHome/order/UserOrderDetail";
import TopicsList from "../pages/Topic/TopicsList";
import TopicDetail from "../pages/Topic/TopicDetail";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta: {
        requiresAuth: false  // 首页不需要认证
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        requiresAuth: false  // 登录页面不需要认证
      }
    },
    {
      path: "/register",
      name: 'Register',
      component: Register,
      meta: {
        requiresAuth: false  // 注册页面不需要认证
      }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
      meta: {
        title: '首页',
        url: '/admin/home',
        requiresAuth: true,// 添加该字段，表示进入这个路由是需要登录的
        requiresManage: true,
      },
      children:[
        {
          path: 'home',
          name: 'home',
          component: EnhancedDashboard,
          meta: {
            title: '管理仪表盘',
            url: '/admin/home',
            requiresAuth: true,
            requiresManage: true
          },
        },
        {
          path: 'bookList',
          name: 'BookList',
          component: BookList,
          meta: {
            title: '图书列表',
            url: '/admin/bookList',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: 'addBook',
          name: 'AddBook',
          component: AddBook,
          meta: {
            title: '添加图书',
            url: '/admin/addBook',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: 'updateBook',
          name: 'UpdateBook',
          component: UpdateBook,
          meta: {
            title: '更新图书',
            url: '/admin/updateBook',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: 'publish',
          name: 'Publish',
          component: Publish,
          meta: {
            title: '出版社列表',
            url: '/admin/publish',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: 'addPublish',
          name: 'AddPublish',
          component: AddPublish,
          meta: {
            title: '添加出版社',
            url: '/admin/addPublish',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: 'updatePublish',
          name: 'UpdatePublish',
          component: UpdatePublish,
          meta: {
            title: '更新出版社',
            url: '/admin/updatePublish',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: 'addSort',
          name: 'AddSort',
          component: AddSort,
          meta: {
            title: '添加分类',
            url: '/admin/addSort',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: 'updateFirstSort',
          name: 'UpdateFirstSort',
          component: UpdateFirstSort,
          meta: {
            title: '更新一级分类',
            url: '/admin/updateFirstSort',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: 'updateSecondSort',
          name: "UpdateSecondSort",
          component: UpdateSecondSort,
          meta: {
            title: '更新二级分类',
            url: '/admin/updateSecondSort',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: 'firstSortList',
          name: "FirstSortList",
          component: FirstSortList,
          meta: {
            title: '一级分类列表',
            url: '/admin/firstSortList',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: "secondSortList",
          name: "SecondSortList",
          component: SecondSortList,
          meta: {
            title: '二级分类列表',
            url: '/admin/secondSortList',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: 'orderList',
          name: 'OrderList',
          component: OrderList,
          meta: {
            title: '订单列表',
            url: '/admin/orderList',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: 'orderSet',
          name: 'OrderSet',
          component: OrderSet,
          meta: {
            title: '订单设置',
            url: '/admin/orderSet',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: 'orderDetail',
          name: 'OrderDetail',
          component: OrderDetail,
          meta: {
            title: '订单详情',
            url: '/admin/orderDetail',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: 'deliver',
          name: 'Deliver',
          component: Deliver,
          meta: {
            title: '发货',
            url: '/admin/deliver',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },

        {
          path: 'bookRecommend',
          name: 'BookRecommend',
          component: BookRecommend,
          meta: {
            title: '图书推荐',
            url: '/admin/bookRecommend',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: 'bookTopicSet',
          name: 'BookTopicSet',
          component: TopicManage,
          meta: {
            title: '图单专题',
            url: '/admin/bookTopicSet',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: 'coupon',
          name: 'Coupon',
          component: CouponManagement,
          meta: {
            title: '优惠券管理',
            url: '/admin/coupon',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: 'spikeSet',
          name: 'SpikeSet',
          component: SpikeSet,
          meta: {
            title: '秒杀设置',
            url: '/admin/spikeSet',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: 'menuList',
          name: 'MenuList',
          component: MenuList,
          meta: {
            title: '菜单列表',
            url: '/admin/menuList',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: 'rolesList',
          name: 'RolesList',
          component: RolesList,
          meta: {
            title: '角色列表',
            url: '/admin/rolesList',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: 'userList',
          name: 'UserList',
          component: UserList,
          meta: {
            title: '用户列表',
            url: '/admin/userList',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },

        {
          path: 'bookTopicDetail',
          name: "BookTopicDetail",
          component: BookTopicDetail,
          meta: {
            title: '书单详情',
            url: '/admin/bookTopicDetail',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: "updateBookTopic",
          name: "UpdateBookTopic",
          component: UpdateBookTopic,
          meta: {
            title: '更新书单',
            url: '/admin/updateBookTopic',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: "addBookTopic",
          name: "AddBookTopic",
          component: AddBookTopic,
          meta: {
            title: '添加书单',
            url: '/admin/addBookTopic',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: 'subTopicList',
          name: "SubTopicList",
          component: SubTopicList,
          meta: {
            title: '子书单',
            url: '/admin/subTopicList',
            requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: '/admin/commentList',
          name: 'AdminCommentList',
          component: () => import('../pages/AdminHome/CommentList.vue')
        },
        {
          path: 'announcementManage',
          name: 'AnnouncementManage',
          component: () => import('../components/AdminHome/content/announcement/AnnouncementManage'),
          meta: {
            title: '公告管理',
            url: '/admin/announcementManage',
            requiresAuth: true
          }
        },
        {
          path: 'aboutManage',
          name: 'AboutManage',
          component: () => import('../components/AdminHome/content/about/AboutManage'),
          meta: {
            title: '网站介绍',
            url: '/admin/aboutManage',
            requiresAuth: true
          }
        },
      ]
    },
    {
      path: '/user',
      name: 'UserHome',
      component: UserHome,
      meta: {
        title: '应用详情',
        url: '/user/userCenter', //这里用户界面第一步是进入到用户中心
        requiresAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        requiresUser: true,
      },
      children:[
        {
          path: 'address',
          name: "Address",
          component: Address
        },

        {
          path: 'coupons',
          name: "CouponCenter",
          component: () => import('../pages/UserHome/CouponCenter.vue'),
          meta: {
            title: '优惠券中心',
            requiresAuth: true,
            requiresUser: true,
          }
        },
        {
          path: 'mesNotice',
          name: "MesNotice",
          component: MesNotice
        },
        {
          path: 'userCenter',
          name: "UserCenter",
          component: UserCenter
        },
        {
          path: 'pwdManage',
          name: "PwdManage",
          component: PwdManage
        },
        {
          path: "userInfo",
          name: "UserInfo",
          component: UserInfo
        },
        {
          path: "evaluate",
          name: "Evaluate",
          component: Evaluate
        },
        {
          path: "myComments",
          name: "MyComments",
          component: MyComments,
          meta: {
            title: '我的评价',
            requiresAuth: true,
            requiresUser: true,
          }
        },
        {
          path: "orderReview",
          name: "OrderReview",
          component: OrderReview,
          meta: {
            title: '评价订单',
            requiresAuth: true,
            requiresUser: true,
          }
        },
        {
          path: "userOrder",
          name: "UserOrder",
          component: UserOrder
        },
        {
          path: "userOrderDetail",
          name: "UserOrderDetail",
          component: UserOrderDetail
        },


      ]
    },
    {
      path: '/bookTopic',
      name: 'BookTopic',
      component: BookTopic,
      meta: {
        title: '书单列表',
        url: '/admin/bookTopic',
        requiresAuth: true,
      },
    },
    {
      path: '/book',
      name: 'Book',
      component: Book
    },
    {
      path: '/spike',
      name: 'Spike',
      component: Spike
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },



    {
      path: '/upload3',
      name: 'upload3',
      component: Upload3
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart,
      meta: {
        title: '购物车',
        requiresAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        requiresUser: true,
      },
    },
    {
      path: "/buyPage",
      name: 'BuyPage',
      component: BuyPage,
      meta: {
        title: '购买页面',
        requiresAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        requiresUser: true,
      },
    },
    {
      path: '/announcement',
      name: 'AnnouncementPage',
      component: () => import('../pages/Announcement/Announcement')
    },
    {
      path: '/about',
      name: 'AboutPage',
      component: () => import('../pages/About/About')
    },
    {
      path: '/announcement/detail',
      name: 'AnnouncementDetail',
      component: () => import('../pages/Announcement/AnnouncementDetail')
    },
    {
      path: '/topics',
      name: 'TopicsList',
      component: TopicsList
    },
    {
      path: '/topic',
      name: 'TopicDetail',
      component: TopicDetail
    },
    {
      path: '/bookTopic',
      redirect: to => ({path:'/topic',query: to.query})
    },
  ]
})
