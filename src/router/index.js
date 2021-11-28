import Vue from 'vue'
import Router from 'vue-router'
import axios from '../axios/index.js'
import {
  Notification
} from 'element-ui'
import routerUtil from './DynamicHandler.js'


Vue.use(Router)
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

//路由重写
// const VueRouterPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push (to) {
//     return VueRouterPush.call(this, to).catch(err => err)
// }

//菜单栏配置

var loginPage;
console.log(process.env.ENV_VERSION === undefined);
console.log(process.env == undefined || process.env.ENV_VERSION == undefined);
console.log(process == null || process.env == undefined || process.env.ENV_VERSION == undefined);
if (process == null || process.env == undefined || process.env.ENV_VERSION == undefined) {
  loginPage = {
    path: '/login',
    component: resolve => require(['../components/login/login.vue'], resolve)
  };
} else if (process.env.ENV_VERSION === 'NanHai') {
  loginPage = {
    path: '/login',
    component: resolve => require(['../components/login/login.vue'], resolve)
  };
}else {
  loginPage = {
    path: '/login',
    component: resolve => require(['../components/login/login.vue'], resolve)
  };
}

const router = new Router({
  routes: [
    // {
    //     path: '/',
    //     component: resolve => require(['../components/main/index.vue'], resolve),
    //     // redirect: '/',
    //     children: []
    //   },
    loginPage,
    {
      path: '*',
      component: resolve => require(['../components/404.vue'], resolve)
    }
  
  ]
})

var SUCCESS = 1;
var LIMIT = 2;
var CLOSE = 3;

function checkLoginStatus(which) {

  return new Promise((resolve, reject) => {

    var url = '/login/status';


    if (which == 'CHECK_LOGIN') {
      url = '/login/status';
    } else if (which == 'GET_MENU') {
      url = '/login/menu';
    }

    axios({
        method: 'post',
        url: url,
        df: false
      })
      .then((response) => {
        if (!response) {
          return false;
        }
        var data = response.data
        if (data.code == SUCCESS) {

          //如果是获取菜单，则返回获取的菜单
          if (which == 'GET_MENU') {
            resolve(data.data);
            return data.data;
          } else {
            resolve(true)
            return true;
          }
        } else {
          // code = false;
          resolve(false)
          return false;
        }
      })
      .catch((err) => {
        resolve(false)
        return false;
      });

  })

}

async function checkLogin(rights) {
  var code;
  code = await checkLoginStatus(rights);
  return code;
}



Vue.prototype.MYAUTH = [];
//全局守卫
router.beforeEach(async function(to, from, next) {

  try {
    document.title = 'VONE' + (to.meta.title == undefined ? '' : ' | ' + router.app.$t(to.meta.title));
  } catch (error) {
    document.title = 'VONE | MMS'
  }


  try {

    if (to.fullPath == "/login") {
      next();
      return;
    }
    //检查登陆状态
    var loginStatus = await checkLogin('CHECK_LOGIN');
    //登陆失效、或未登录
    if (!loginStatus) {
      router.push('/login');
      Notification({
        title: '警告',
        message: '<div><span style="color:red">未登录 (或登陆已过期)</span><br><span class="blue">请重新登录</span></div>',
        type: 'error',
        duration: 5000,
        dangerouslyUseHTMLString: true
      });
    }

    //是否允许通过
    var pass = true;


    //loadingMenu 是登陆后，要前往主页才会出现的参数
    if (localStorage.loadingMenu == 'true') {
      var dontToHome = sessionStorage.MENU != '0';

      localStorage.removeItem('loadingMenu');
      var menu = await checkLogin('GET_MENU');
      routerUtil.addRouter(menu)

      if (dontToHome) {
        router.push('/home');
      }

    }

    //js 主函数被重新加载了，Menu菜单数据丢失了
    if (sessionStorage.RESOURCE_RELOAD == '1') {
      //检查登陆

      //登陆依旧有效
      if (loginStatus) {

        var menus = await checkLogin('GET_MENU');
        routerUtil.addRouter(menus);

        router.push(to.fullPath)
      }

    }

  } catch (ex) {

  }


  pass ? next() : null
});


export default router;
