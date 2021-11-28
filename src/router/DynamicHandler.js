import router from './index.js'

function addRouter(menu) {
  var routes = [];

  menu.forEach(function(demo) {
    if (!demo.meta.menu) {
      return;
    }
    var isComponent = true;
    if (demo.component == undefined || demo.component == null || demo.component.trim() == '') {
      isComponent = false;
    }
    var route = {
      path: demo.path,
      component(resolve) {
        require([`@/components/pages/` + demo.component], resolve)
      },
      meta: {
        // 是否进入菜单
        menu: demo.meta.menu,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: demo.meta.keepAlive,
        // title 对应的 语言文件 key
        title: demo.meta.title,
        // 图标
        icon: demo.meta.icon,
        // 父级凭证，身为父级的凭证
        parentId: demo.meta.parentId,
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: demo.meta.parent,
        //完整的访问路径
        fullPath: demo.meta.fullPath,
        //name 值 与 组件申明的 name 相同
        name: demo.meta.name,
        //排序
        order: demo.meta.order,
        //是否允许多次打开
        more: demo.meta.more
      }
    };
    routes.push(route);
  });


  var mainMenu = [{
    path: '/',
    component: resolve => require(['../components/main/index.vue'], resolve),
    // redirect: '/',
    children: routes
  }, ]
  localStorage.AZHEISMYCAIDAN = JSON.stringify(mainMenu[0].children);

  router.addRoutes(mainMenu);
  sessionStorage.RESOURCE_RELOAD = 0;
}

export default {
  addRouter,
};
