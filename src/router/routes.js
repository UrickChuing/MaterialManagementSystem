const backSysPage = [

  {
    path: 'home',
    component: resolve => require(['../components/pages/home/home.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'zhuye',
      // 图标
      icon: 'el-icon-s-grid',
      //完整的访问路径
      fullPath: '/home',
      //name 值 与 组件申明的 name 相同
      name: 'home'
    }
  },

  /**
   * 业务处理
   */
  {
    // 这是一个多层菜单的总菜单
    path: '/service',
    redirect: '/service/purchaseRequest',
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存
      // title 对应的 语言文件 key
      title: 'yewuchuli',
      // 图标
      icon: 'el-icon-copy-document',
      // 父级: defalt 为默认，默认为当前父级 节点
      // 没有父级 ，则进入总栏
      parentId: 'yewuchuli'
    }
  },
  {
    path: '/service/purchaseRequest',
    component: resolve => require(['../components/pages/service/purchaseRequest/index.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'caigoushenqing',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'yewuchuli',
      //完整的访问路径
      fullPath: '/service/purchaseRequest',
      //name 值 与 组件申明的 name 相同
      name: 'purchaseRequest',
      //所需要满足的权限
      auth: ['查看采购申请', '查看全部采购申请']
    }
  },
  {
    path: '/service/toBePurchased',
    component: resolve => require(['../components/pages/service/toBePurchased/toBePurhcased.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'daicaigouwuzi',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'yewuchuli',
      //完整的访问路径
      fullPath: '/service/toBePurchased',
      //name 值 与 组件申明的 name 相同
      name: 'daicaigouwuzi',
      //所需要满足的权限
      auth: ['查看采购申请', '查看全部采购申请']
    }
  },
  {
    path: '/service/pendingProcurement',
    component: resolve => require(['../components/pages/service/pendingProcurement/index.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: false,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'daicaigouwuzi',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'yewuchuli',
      //完整的访问路径
      fullPath: '/service/pendingProcurement',
      //name 值 与 组件申明的 name 相同
      name: 'pendingProcurement',
      //所需要满足的权限
      auth: ['查看待采购物资', 'qwe']
    }
  },
  {
    path: '/service/purchaseOrder',
    component: resolve => require(['../components/pages/service/purchaseOrder/purchaseOrder.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'caigoudingdan',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'yewuchuli',
      //完整的访问路径
      fullPath: '/service/purchaseOrder',
      //name 值 与 组件申明的 name 相同
      name: 'caigoudingdan',
      //所需要满足的权限
      auth: ['查看待采购物资', 'qwe']
    }
  },
  {
    path: '/service/stockInOrdinary',
    component: resolve => require(['../components/pages/service/stockIn/ordinary/ordinary.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'putongruku',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'yewuchuli',
      //完整的访问路径
      fullPath: '/service/stockInOrdinary',
      //name 值 与 组件申明的 name 相同
      name: 'putongruku',
      //所需要满足的权限
      auth: ['查看待采购物资', 'qwe']
    }
  },
  {
    path: '/service/stockInPurchaseOrder',
    component: resolve => require(['../components/pages/service/stockIn/purchaseOrder/stockIn.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'caigouruku',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'yewuchuli',
      //完整的访问路径
      fullPath: '/service/stockInPurchaseOrder',
      //name 值 与 组件申明的 name 相同
      name: 'caigouruku',
      //所需要满足的权限
      auth: ['查看待采购物资', 'qwe']
    }
  },
  {
    path: '/service/returnRequest',
    component: resolve => require(['../components/pages/service/stockOut/returnRequest/returnRequest.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'tuihuoshenqing',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'yewuchuli',
      //完整的访问路径
      fullPath: '/service/returnRequest',
      //name 值 与 组件申明的 name 相同
      name: 'tuihuoshenqing',
      //所需要满足的权限
      auth: ['查看待采购物资', 'qwe']
    }
  },
  {
    path: '/service/returnStockOut',
    component: resolve => require(['../components/pages/service/stockOut/returnStockOut/returnStockOut.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'tuihuochuku',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'yewuchuli',
      //完整的访问路径
      fullPath: '/service/returnStockOut',
      //name 值 与 组件申明的 name 相同
      name: 'tuihuochuku',
      //所需要满足的权限
      auth: ['查看待采购物资', 'qwe']
    }
  },
  /**
   * 业务处理
   */
  {
    // 这是一个多层菜单的总菜单
    path: '/service/exchange',
    redirect: '/service/exchange/request',
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存
      // title 对应的 语言文件 key
      title: 'huanhuo',
      // 图标
      icon: 'el-icon-copy-document',
      // 父级: defalt 为默认，默认为当前父级 节点
      // 没有父级 ，则进入总栏
      parentId: 'huanhuo'
    }
  },
  {
    path: '/service/exchange/request',
    component: resolve => require(['../components/pages/service/stockOut/exchangeRequest/exchangeRequest.vue'],
      resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'huanhuoshenqing',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'huanhuo',
      //完整的访问路径
      fullPath: '/service/exchange/request',
      //name 值 与 组件申明的 name 相同
      name: 'huanhuoshenqing',
      //所需要满足的权限
      auth: ['查看待采购物资', 'qwe']
    }
  },
  {
    path: '/service/exchange/out',
    component: resolve => require(['../components/pages/service/stockOut/exchangeOut/exchangeOut.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'huanhuochuku',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'huanhuo',
      //完整的访问路径
      fullPath: '/service/exchange/out',
      //name 值 与 组件申明的 name 相同
      name: 'huanhuochuku',
      //所需要满足的权限
      auth: ['查看待采购物资', 'qwe']
    }
  },
  {
    path: '/service/exchange/in',
    component: resolve => require(['../components/pages/service/stockIn/exchangeIn/exchangeIn.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'huanhuoruku',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'huanhuo',
      //完整的访问路径
      fullPath: '/service/exchange/in',
      //name 值 与 组件申明的 name 相同
      name: 'huanhuoruku',
      //所需要满足的权限
      auth: ['查看待采购物资', 'qwe']
    }
  },

  /**
   * 物料领取管理
   */
  {
    // 这是一个多层菜单的总菜单
    path: '/getUsing',
    redirect: '/getUsing/get',
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存
      // title 对应的 语言文件 key
      title: 'wuliaolingquguanli',
      // 图标
      icon: 'el-icon-copy-document',
      // 父级: defalt 为默认，默认为当前父级 节点
      // 没有父级 ，则进入总栏
      parentId: 'wuliaolingquguanli'
    }
  },
  {
    path: '/getUsing/get',
    component: resolve => require(['../components/pages/service/stockOut/getUsing/getUsing.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'lingquwuliao',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'wuliaolingquguanli',
      //完整的访问路径
      fullPath: '/getUsing/get',
      //name 值 与 组件申明的 name 相同
      name: 'lingquwuliao',
      order: 1
    }
  },
  {
    path: '/getUsing/back',
    component: resolve => require(['../components/pages/service/stockIn/getUsingBack/getUsingBack.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'lingliaoguihuan',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'wuliaolingquguanli',
      //完整的访问路径
      fullPath: '/getUsing/back',
      //name 值 与 组件申明的 name 相同
      name: 'lingliaoguihuan',
      order: 1
    }
  },

  /**
   * 库存管理
   */
  {
    // 这是一个多层菜单的总菜单
    path: '/stock',
    redirect: '/stock/taking',
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存
      // title 对应的 语言文件 key
      title: 'kucunguanli',
      // 图标
      icon: 'el-icon-copy-document',
      // 父级: defalt 为默认，默认为当前父级 节点
      // 没有父级 ，则进入总栏
      parentId: 'kucunguanli'
    }
  },
  {
    path: '/stock/taking',
    component: resolve => require(['../components/pages/stock/stockTaking/stockTaking.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'kucunpandian',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'kucunguanli',
      //完整的访问路径
      fullPath: '/stock/taking',
      //name 值 与 组件申明的 name 相同
      name: 'kucunpandian',
      order: 1
    }
  },
  {
    path: '/stock/allocation',
    component: resolve => require(['../components/pages/stock/stockMoving/stockMoving.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'kucundiaopei',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'kucunguanli',
      //完整的访问路径
      fullPath: '/stock/allocation',
      //name 值 与 组件申明的 name 相同
      name: 'kucundiaopei',
      order: 1
    }
  },
  {
    path: '/stock/loss',
    component: resolve => require(['../components/pages/stock/stockLoss/stockLoss.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'kucunbaosun',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'kucunguanli',
      //完整的访问路径
      fullPath: '/stock/loss',
      //name 值 与 组件申明的 name 相同
      name: 'kucunbaosun',
      order: 1
    }
  },

  /**
   * 系统统计
   */
  {
    // 这是一个多层菜单的总菜单
    path: '/statistics',
    redirect: '/statistics/relation',
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存
      // title 对应的 语言文件 key
      title: 'xitongtongji',
      // 图标
      icon: 'el-icon-copy-document',
      // 父级: defalt 为默认，默认为当前父级 节点
      // 没有父级 ，则进入总栏
      parentId: 'xitongtongji'
    }
  },
  {
    path: '/statistics/relation',
    component: resolve => require(['../components/pages/statistics/relation/relation.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'guanlianchaxun',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'xitongtongji',
      //完整的访问路径
      fullPath: '/statistics/relation',
      //name 值 与 组件申明的 name 相同
      name: 'guanlianchaxun',
      order: 1
    }
  },
  {
    path: '/statistics/relation',
    component: resolve => require(['../components/pages/statistics/purchaseRequest/purchaseRequest.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'guanlianchaxun',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'xitongtongji',
      //完整的访问路径
      fullPath: '/statistics/relation',
      //name 值 与 组件申明的 name 相同
      name: 'guanlianchaxun',
      order: 1
    }
  },
  {
    path: '/statistics/stockIn',
    component: resolve => require(['../components/pages/statistics/stockIn/stockIn.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'guanlianchaxun',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'xitongtongji',
      //完整的访问路径
      fullPath: '/statistics/stockIn',
      //name 值 与 组件申明的 name 相同
      name: 'guanlianchaxun',
      order: 1
    }
  },
  {
    path: '/statistics/getUsing',
    component: resolve => require(['../components/pages/statistics/getUsing/getUsing.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'guanlianchaxun',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'xitongtongji',
      //完整的访问路径
      fullPath: '/statistics/stockIn',
      //name 值 与 组件申明的 name 相同
      name: 'guanlianchaxun',
      order: 1
    }
  },
  {
    path: '/statistics/relation',
    component: resolve => require(['../components/pages/statistics/purchaseOrder/purchaseOrder.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'caigoutongji',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'xitongtongji',
      //完整的访问路径
      fullPath: '/statistics/relation',
      //name 值 与 组件申明的 name 相同
      name: 'guanlianchaxun',
      order: 1
    }
  },


  /**
   * 发票
   */
  {
    path: 'invoice',
    component: resolve => require(['../components/pages/invoice/invoice.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'fapiao',
      // 图标
      icon: 'el-icon-s-grid',
      //完整的访问路径
      fullPath: '/invoice',
      //name 值 与 组件申明的 name 相同
      name: 'fapiao'
    }
  },

  /**
   * 审批
   */
  {
    // 这是一个多层菜单的总菜单
    path: '/audit',
    redirect: '/audit/myAudit',
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存
      // title 对应的 语言文件 key
      title: 'shengpi',
      // 图标
      icon: 'el-icon-copy-document',
      // 父级: defalt 为默认，默认为当前父级 节点
      // 没有父级 ，则进入总栏
      parentId: 'shengpi'
    }
  },
  {
    path: '/audit/myAudit',
    component: resolve => require(['../components/pages/audit/myAudit.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'wodeshenpi',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'shengpi',
      //完整的访问路径
      fullPath: '/audit/myAudit',
      //name 值 与 组件申明的 name 相同
      name: 'wodeshenpi',
      order: 1
    }
  },

  /**
   * 基础数据
   */
  {
    // 这是一个多层菜单的总菜单
    path: 'baseData',
    redirect: '/table',
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存
      // title 对应的 语言文件 key
      title: 'jichushuju',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      // 没有父级 ，则进入总栏
      parentId: 'jichushuju'
    }
  },
  {
    path: '/baseData/supplier',
    component: resolve => require(['../components/pages/baseData/supplier/supplier.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'gongyingshang',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'jichushuju',
      //完整的访问路径
      fullPath: '/baseData/supplier',
      //name 值 与 组件申明的 name 相同
      name: 'gongyingshang',
      order: 3
    }
  },

  {
    path: '/baseData/supplierAgrement',
    component: resolve => require(['../components/pages/baseData/supplierAgrement/supplierAgrement.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'gongyingshangxieyi',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'jichushuju',
      //完整的访问路径
      fullPath: '/baseData/supplierAgrement',
      //name 值 与 组件申明的 name 相同
      name: 'gongyingshangxieyi',
      order: 4
    }
  },

  {
    path: '/baseData/materials',
    component: resolve => require(['../components/pages/baseData/materials/materials.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'wupinguanli',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'jichushuju',
      //完整的访问路径
      fullPath: '/baseData/materials',
      //name 值 与 组件申明的 name 相同
      name: 'wupinguanli',
      order: 1
    }
  },
  {
    path: '/baseData/materialsConfig',
    component: resolve => require(['../components/pages/baseData/materialsConfig/materialsConfig.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'wupingcanshupeizhi',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'jichushuju',
      //完整的访问路径
      fullPath: '/baseData/materialsConfig',
      //name 值 与 组件申明的 name 相同
      name: 'wupingcanshupeizhi',
      order: 2
    }
  },
  {
    path: '/baseData/warehouse',
    component: resolve => require(['../components/pages/baseData/warehouse/warehouse.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'cangkuguanli',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'jichushuju',
      //完整的访问路径
      fullPath: '/baseData/warehouse',
      //name 值 与 组件申明的 name 相同
      name: 'cangkuguanli',
      order: 5
    }
  },
  {
    path: '/baseData/cruise',
    component: resolve => require(['../components/pages/baseData/cruise/cruise.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'youlunguanli',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'jichushuju',
      //完整的访问路径
      fullPath: '/baseData/cruise',
      //name 值 与 组件申明的 name 相同
      name: 'youlunguanli',
      order: 7
    }
  },
  {
    path: '/baseData/shore',
    component: resolve => require(['../components/pages/baseData/shore/shore.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'anshangcangguanli',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'jichushuju',
      //完整的访问路径
      fullPath: '/baseData/shore',
      //name 值 与 组件申明的 name 相同
      name: 'anshangcangguanli',
      order: 6
    }
  },
  {
    path: '/baseData/organization',
    component: resolve => require(['../components/pages/baseData/organization/organization.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'bumenguanli',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'jichushuju',
      //完整的访问路径
      fullPath: '/baseData/organization',
      //name 值 与 组件申明的 name 相同
      name: 'bumenguanli',
      order: 7
    }
  },
  {
    path: '/baseData/audit',
    component: resolve => require(['../components/pages/baseData/audit/audit_type.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'shenpiguanli',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'jichushuju',
      //完整的访问路径
      fullPath: '/baseData/audit',
      //name 值 与 组件申明的 name 相同
      name: 'shenheguanli',
      order: 7
    }
  },


  /**
   * 系统设置
   */
  {
    // 这是一个多层菜单的总菜单
    path: 'system',
    redirect: '/system',
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存
      // title 对应的 语言文件 key
      title: 'xitongshezhi',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      // 没有父级 ，则进入总栏
      parentId: 'xitongshezhi'
    }
  },
  {
    path: '/system/permisson',
    component: resolve => require(['../components/pages/system/permission/permission.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'quanxianguanli',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'xitongshezhi',
      //完整的访问路径
      fullPath: '/system/permisson',
      //name 值 与 组件申明的 name 相同
      name: 'quanxianguanli',
      order: 2
    }
  },
  {
    path: '/system/user',
    component: resolve => require(['../components/pages/system/user/user.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'yonghuguanli',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'xitongshezhi',
      //完整的访问路径
      fullPath: '/system/user',
      //name 值 与 组件申明的 name 相同
      name: 'yonghuguanli',
      order: 1
    }
  },
  {
    path: '/system/role',
    component: resolve => require(['../components/pages/system/role/roleSetting.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: true,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: true,
      // title 对应的 语言文件 key
      title: 'jueseguanli',
      // 图标
      icon: 'el-icon-s-grid',
      // 父级: defalt 为默认，默认为当前父级 节点
      parent: 'xitongshezhi',
      //完整的访问路径
      fullPath: '/system/role',
      //name 值 与 组件申明的 name 相同
      name: 'jueseguanli',
      order: 1
    }
  },


  //无权限页面
  {
    path: '/noPermission',
    component: resolve => require(['../components/pages/noPermission/index.vue'], resolve),
    meta: {
      // 是否进入菜单
      menu: false,
      // 是否缓存 ， 不缓存无需添加
      keepAlive: false,
      // title 对应的 语言文件 key
      title: '无权限',
      //完整的访问路径
      fullPath: '/noPermission',
      more: true

    }
  }
]


export default [
  [

    {
      path: '/service/stockInOrdinary',
      component: 'service/stockIn/ordinary/ordinary.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'putongruku',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'yewuchuli',
        //完整的访问路径
        fullPath: '/service/stockInOrdinary',
        //name 值 与 组件申明的 name 相同
        name: 'putongruku',
        //所需要满足的权限
        auth: ['查看待采购物资', 'qwe']
      }
    },
    {
      path: '/service/stockInPurchaseOrder',
      component: 'service/stockIn/purchaseOrder/stockIn.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'caigouruku',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'yewuchuli',
        //完整的访问路径
        fullPath: '/service/stockInPurchaseOrder',
        //name 值 与 组件申明的 name 相同
        name: 'caigouruku',
        //所需要满足的权限
        auth: ['查看待采购物资', 'qwe']
      }
    },
    {
      path: '/service/returnRequest',
      component: 'service/stockOut/returnRequest/returnRequest.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'tuihuoshenqing',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'yewuchuli',
        //完整的访问路径
        fullPath: '/service/returnRequest',
        //name 值 与 组件申明的 name 相同
        name: 'tuihuoshenqing',
        //所需要满足的权限
        auth: ['查看待采购物资', 'qwe']
      }
    },
    {
      path: '/service/returnStockOut',
      component: 'service/stockOut/returnStockOut/returnStockOut.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'tuihuochuku',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'yewuchuli',
        //完整的访问路径
        fullPath: '/service/returnStockOut',
        //name 值 与 组件申明的 name 相同
        name: 'tuihuochuku',
        //所需要满足的权限
        auth: ['查看待采购物资', 'qwe']
      }
    },
    /**
     * 业务处理
     */
    {
      // 这是一个多层菜单的总菜单
      path: '/service/exchange',
      redirect: '/service/exchange/request',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存
        // title 对应的 语言文件 key
        title: 'huanhuo',
        // 图标
        icon: 'el-icon-copy-document',
        // 父级: defalt 为默认，默认为当前父级 节点
        // 没有父级 ，则进入总栏
        parentId: 'huanhuo'
      }
    },
    {
      path: '/service/exchange/request',
      component: 'service/stockOut/exchangeRequest/exchangeRequest.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'huanhuoshenqing',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'huanhuo',
        //完整的访问路径
        fullPath: '/service/exchange/request',
        //name 值 与 组件申明的 name 相同
        name: 'huanhuoshenqing',
        //所需要满足的权限
        auth: ['查看待采购物资', 'qwe']
      }
    },
    {
      path: '/service/exchange/out',
      component: 'service/stockOut/exchangeOut/exchangeOut.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'huanhuochuku',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'huanhuo',
        //完整的访问路径
        fullPath: '/service/exchange/out',
        //name 值 与 组件申明的 name 相同
        name: 'huanhuochuku',
        //所需要满足的权限
        auth: ['查看待采购物资', 'qwe']
      }
    },
    {
      path: '/service/exchange/in',
      component: 'service/stockIn/exchangeIn/exchangeIn.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'huanhuoruku',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'huanhuo',
        //完整的访问路径
        fullPath: '/service/exchange/in',
        //name 值 与 组件申明的 name 相同
        name: 'huanhuoruku',
        //所需要满足的权限
        auth: ['查看待采购物资', 'qwe']
      }
    },

    /**
     * 物料领取管理
     */
    {
      // 这是一个多层菜单的总菜单
      path: '/getUsing',
      redirect: '/getUsing/get',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存
        // title 对应的 语言文件 key
        title: 'wuliaolingquguanli',
        // 图标
        icon: 'el-icon-copy-document',
        // 父级: defalt 为默认，默认为当前父级 节点
        // 没有父级 ，则进入总栏
        parentId: 'wuliaolingquguanli'
      }
    },
    {
      path: '/getUsing/get',
      component: 'service/stockOut/getUsing/getUsing.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'lingquwuliao',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'wuliaolingquguanli',
        //完整的访问路径
        fullPath: '/getUsing/get',
        //name 值 与 组件申明的 name 相同
        name: 'lingquwuliao',
        order: 1
      }
    },
    {
      path: '/getUsing/back',
      component: 'service/stockIn/getUsingBack/getUsingBack.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'lingliaoguihuan',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'wuliaolingquguanli',
        //完整的访问路径
        fullPath: '/getUsing/back',
        //name 值 与 组件申明的 name 相同
        name: 'lingliaoguihuan',
        order: 1
      }
    },

    /**
     * 库存管理
     */
    {
      // 这是一个多层菜单的总菜单
      path: '/stockMenu',
      redirect: '/stock/taking',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存
        // title 对应的 语言文件 key
        title: 'kucunguanli',
        // 图标
        icon: 'el-icon-copy-document',
        // 父级: defalt 为默认，默认为当前父级 节点
        // 没有父级 ，则进入总栏
        parentId: 'kucunguanli'
      }
    },
    {
      path: '/stock/taking',
      component: resolve => require(['../components/pages/stock/stockDetails/stock.vue'], resolve),
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'kucunpandian',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'kucunguanli',
        //完整的访问路径
        fullPath: '/stock/taking',
        //name 值 与 组件申明的 name 相同
        name: 'kucunpandian',
        order: 1
      }
    },
    {
      path: '/stock/taking',
      component: 'stock/stockTaking/stockTaking.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'kucunpandian',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'kucunguanli',
        //完整的访问路径
        fullPath: '/stock/taking',
        //name 值 与 组件申明的 name 相同
        name: 'kucunpandian',
        order: 1
      }
    },
    {
      path: '/stock/allocation',
      component: 'stock/stockMoving/stockMoving.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'kucundiaopei',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'kucunguanli',
        //完整的访问路径
        fullPath: '/stock/allocation',
        //name 值 与 组件申明的 name 相同
        name: 'kucundiaopei',
        order: 1
      }
    },
    {
      path: '/stock/loss',
      component: 'stock/stockLoss/stockLoss.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'kucunbaosun',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'kucunguanli',
        //完整的访问路径
        fullPath: '/stock/loss',
        //name 值 与 组件申明的 name 相同
        name: 'kucunbaosun',
        order: 1
      }
    },

    /**
     * 系统统计
     */
    {
      // 这是一个多层菜单的总菜单
      path: '/statistics',
      redirect: '/statistics/relation',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存
        // title 对应的 语言文件 key
        title: 'xitongtongji',
        // 图标
        icon: 'el-icon-copy-document',
        // 父级: defalt 为默认，默认为当前父级 节点
        // 没有父级 ，则进入总栏
        parentId: 'xitongtongji'
      }
    },
    {
      path: '/statistics/relation',
      component: 'statistics/relation/relation.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'guanlianchaxun',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'xitongtongji',
        //完整的访问路径
        fullPath: '/statistics/relation',
        //name 值 与 组件申明的 name 相同
        name: 'guanlianchaxun',
        order: 1
      }
    },


    /**
     * 发票
     */
    {
      path: 'invoice',
      component: 'invoice/invoice.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'fapiao',
        // 图标
        icon: 'el-icon-s-grid',
        //完整的访问路径
        fullPath: '/invoice',
        //name 值 与 组件申明的 name 相同
        name: 'fapiao'
      }
    },

    /**
     * 审批
     */
    {
      // 这是一个多层菜单的总菜单
      path: '/audit',
      redirect: '/audit/myAudit',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存
        // title 对应的 语言文件 key
        title: 'shengpi',
        // 图标
        icon: 'el-icon-copy-document',
        // 父级: defalt 为默认，默认为当前父级 节点
        // 没有父级 ，则进入总栏
        parentId: 'shengpi'
      }
    },
    {
      path: '/audit/myAudit',
      component: 'audit/myAudit.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'wodeshenpi',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'shengpi',
        //完整的访问路径
        fullPath: '/audit/myAudit',
        //name 值 与 组件申明的 name 相同
        name: 'wodeshenpi',
        order: 1
      }
    },

    /**
     * 基础数据
     */
    {
      // 这是一个多层菜单的总菜单
      path: 'baseData',
      redirect: '/table',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存
        // title 对应的 语言文件 key
        title: 'jichushuju',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        // 没有父级 ，则进入总栏
        parentId: 'jichushuju'
      }
    },
    {
      path: '/baseData/supplier',
      component: 'baseData/supplier/supplier.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'gongyingshang',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'jichushuju',
        //完整的访问路径
        fullPath: '/baseData/supplier',
        //name 值 与 组件申明的 name 相同
        name: 'gongyingshang',
        order: 3
      }
    },

    {
      path: '/baseData/supplierAgrement',
      component: 'baseData/supplierAgrement/supplierAgrement.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'gongyingshangxieyi',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'jichushuju',
        //完整的访问路径
        fullPath: '/baseData/supplierAgrement',
        //name 值 与 组件申明的 name 相同
        name: 'gongyingshangxieyi',
        order: 4
      }
    },

    {
      path: '/baseData/materials',
      component: 'baseData/materials/materials.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'wupinguanli',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'jichushuju',
        //完整的访问路径
        fullPath: '/baseData/materials',
        //name 值 与 组件申明的 name 相同
        name: 'wupinguanli',
        order: 1
      }
    },
    {
      path: '/baseData/materialsConfig',
      component: 'baseData/materialsConfig/materialsConfig.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'wupingcanshupeizhi',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'jichushuju',
        //完整的访问路径
        fullPath: '/baseData/materialsConfig',
        //name 值 与 组件申明的 name 相同
        name: 'wupingcanshupeizhi',
        order: 2
      }
    },
    {
      path: '/baseData/warehouse',
      component: 'baseData/warehouse/warehouse.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'cangkuguanli',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'jichushuju',
        //完整的访问路径
        fullPath: '/baseData/warehouse',
        //name 值 与 组件申明的 name 相同
        name: 'cangkuguanli',
        order: 5
      }
    },
    {
      path: '/baseData/cruise',
      component: 'baseData/cruise/cruise.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'youlunguanli',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'jichushuju',
        //完整的访问路径
        fullPath: '/baseData/cruise',
        //name 值 与 组件申明的 name 相同
        name: 'youlunguanli',
        order: 7
      }
    },
    {
      path: '/baseData/shore',
      component: 'baseData/shore/shore.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'anshangcangguanli',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'jichushuju',
        //完整的访问路径
        fullPath: '/baseData/shore',
        //name 值 与 组件申明的 name 相同
        name: 'anshangcangguanli',
        order: 6
      }
    },
    {
      path: '/baseData/organization',
      component: 'baseData/organization/organization.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'bumenguanli',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'jichushuju',
        //完整的访问路径
        fullPath: '/baseData/organization',
        //name 值 与 组件申明的 name 相同
        name: 'bumenguanli',
        order: 7
      }
    },
    {
      path: '/baseData/audit',
      component: 'baseData/audit/audit_type.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'shenpiguanli',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'jichushuju',
        //完整的访问路径
        fullPath: '/baseData/audit',
        //name 值 与 组件申明的 name 相同
        name: 'shenheguanli',
        order: 7
      }
    },


    /**
     * 系统设置
     */
    {
      // 这是一个多层菜单的总菜单
      path: 'system',
      redirect: '/system',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存
        // title 对应的 语言文件 key
        title: 'xitongshezhi',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        // 没有父级 ，则进入总栏
        parentId: 'xitongshezhi'
      }
    },
    {
      path: '/system/permisson',
      component: 'system/permission/permission.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'quanxianguanli',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'xitongshezhi',
        //完整的访问路径
        fullPath: '/system/permisson',
        //name 值 与 组件申明的 name 相同
        name: 'quanxianguanli',
        order: 2
      }
    },
    {
      path: '/system/user',
      component: 'system/user/user.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'yonghuguanli',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'xitongshezhi',
        //完整的访问路径
        fullPath: '/system/user',
        //name 值 与 组件申明的 name 相同
        name: 'yonghuguanli',
        order: 1
      }
    },
    {
      path: '/system/role',
      component: 'system/role/roleSetting.vue',
      meta: {
        // 是否进入菜单
        menu: true,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: true,
        // title 对应的 语言文件 key
        title: 'jueseguanli',
        // 图标
        icon: 'el-icon-s-grid',
        // 父级: defalt 为默认，默认为当前父级 节点
        parent: 'xitongshezhi',
        //完整的访问路径
        fullPath: '/system/role',
        //name 值 与 组件申明的 name 相同
        name: 'jueseguanli',
        order: 1
      }
    },


    //无权限页面
    {
      path: '/noPermission',
      component: 'noPermission/index.vue',
      meta: {
        // 是否进入菜单
        menu: false,
        // 是否缓存 ， 不缓存无需添加
        keepAlive: false,
        // title 对应的 语言文件 key
        title: '无权限',
        //完整的访问路径
        fullPath: '/noPermission',
        more: true

      }
    }
  ]
];
