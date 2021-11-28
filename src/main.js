// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import qwe from './router/routes.js';

//elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

//V-Chart
import VeLine from 'v-charts/lib/line'
Vue.component(VeLine.name, VeLine)
import VeHistogram from 'v-charts/lib/histogram'
Vue.component(VeHistogram.name, VeHistogram);

//初始化加载
sessionStorage.RESOURCE_RELOAD = 1;



Vue.prototype.errorhanding = function(error) {
  if (!error.myError) {
    ElementUI.Notification({
      title: '错误',
      message: '<div><span class="red">错误内容：</span>' + error +
        '<br> <span class="blue">(若无错内容，联系管理员)</span></div>',
      type: 'error',
      duration: 5000,
      dangerouslyUseHTMLString: true
    });
  }
}

Vue.prototype.addSuccess = function(success, message) {
  notic(success, 'ADD', message);
}

Vue.prototype.updateSuccess = function(success, message) {
  notic(success, 'UPDATE', message);
}

Vue.prototype.deleteSuccess = function(success, message) {
  notic(success, 'DELETE', message);
}
Vue.prototype.warningInfo = function(message, times, title) {
  ElementUI.Notification({
    title: title == undefined ? '警告' : title,
    type: 'warning',
    message: message,
    duration: times == undefined ? 5000 : times,
    dangerouslyUseHTMLString: true
  })
}

const notic = function(success, type, message) {
  var title;

  if (type == 'ADD') {
    title = '添加';
  } else if (type == 'UPDATE') {
    title = '修改';
  } else if (type == 'DELETE') {
    title = '删除';
  } else {
    title = type;
  }

  if (success) {
    title = title + '成功';
    var content = {
      title: title,
      type: 'success',
      duration: 5000,
      dangerouslyUseHTMLString: true
    }

    if (message != undefined && message != null) {
      content.message = message
    }

    ElementUI.Notification(content);
  } else {
    title = title + '失败';
    var content = {
      title: title,
      type: 'error',
      duration: 5000,
      dangerouslyUseHTMLString: true
    }

    if (message != undefined) {
      content.message = message
    }

    ElementUI.Notification(content);
  }
}
Vue.prototype.notic = notic;
Vue.prototype.notics = {
  fun: function(type, title, msg) {
    var content = {
      title: title,
      type: type,
      duration: 2500,
      message: msg,
      dangerouslyUseHTMLString: true
    }
    ElementUI.Notification(content);
  },
  error: function(title, msg) {
    this.fun('error', title, msg)
  },
  warning: function(title, msg) {
    this.fun('warning', title, msg)
  },
  success: function(title, msg) {
    this.fun('success', title, msg);
  },
  confirm: function(that, msg, callBack, failCallBack) {

    that.$confirm(msg,that.$t('tishi'),{type:'warning'}).then(_ => {
      if (callBack != undefined) {
        callBack();
      }
    }).catch(_ => {
      if (failCallBack != undefined) {
        failCallBack();
      }
    });
  }
};

/**
 * 引入我的工具
 */
// 小数计算
import FloatOb from './common/util/FloatOb.js'
Vue.prototype.FloatOb = FloatOb

//审核类型
import BaseDataConfig from './common/util/baseDataConfig.js'
Vue.prototype.AuditType = BaseDataConfig.AuditType;
Vue.prototype.StockInSourceType = BaseDataConfig.StockInSourceType;
Vue.prototype.InvoiceType = BaseDataConfig.Invoice


//MD5 加密
import md5 from 'js-md5'


//判断端口
Vue.prototype.osInfo = function() {
  var ua = navigator.userAgent,
    isWindowsPhone = /(?:Windows Phone)/.test(ua),
    isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
    isAndroid = /(?:Android)/.test(ua),
    isFireFox = /(?:Firefox)/.test(ua),
    isChrome = /(?:Chrome|CriOS)/.test(ua),
    isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(
      ua)),
    isPhone = /(?:iPhone)/.test(ua) && !isTablet,
    isPc = !isPhone && !isAndroid && !isSymbian;
  return {
    isTablet: isTablet,
    isPhone: isPhone,
    isAndroid: isAndroid,
    isPc: isPc
  };
}();


//国际化 i18n
//引入 i18n
import VueI18n from 'vue-i18n'
//使用 i18n
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'ZH-CN', // 语言标识
  //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    'ZH-CN': require('./common/lang/zh.js'), // 中文语言包
    // 'EN-US': require('./common/lang/en.js'), // 英文语言包
  }
})


import axios from './axios'
Vue.prototype.axios = axios;


//公共Css
import './components/public/css/public.css'


Vue.config.productionTip = false


//公共方法 ，是否有权限
const checkRight = async function(permissions, next) {

  var code;
  await axios({
      method: 'post',
      url: '/user/checkPermissions',
      df: false,
      data: {
        permissions: permissions
      }
    })
    .then((response) => {
      var data = response.data
      if (data.code != undefined && data.code != null) {

        if (data.code == 200) {
          code = 200;
        } else {
          code = false;
          var perStr = '';
          for (var i = 0; i < data.no.length; i++) {
            perStr = perStr + data.no[i];
            if (i != data.no.length - 1) {
              perStr = perStr + '、'
            }
          }
          ElementUI.Notification({
            title: '提示',
            // message: '<div>你暂无权限操作<br>【'+perStr+'】</div>',
            message: '<div>你暂无权限操作</div>',
            type: 'warning',
            duration: 5000,
            dangerouslyUseHTMLString: true
          });
        }
      } else {
        code = false;
      }
    })
    .catch((err) => {
      code = false;
    });

  return code;
}
Vue.prototype.checkPermissions = checkRight;

const getTimeStr = function(date) {

  var year = date.getFullYear();
  var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  var day = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate();
  var hours = date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours();
  var minutes = date.getMinutes() + 1 < 10 ? '0' + (date.getMinutes() + 1) : date.getMinutes() + 1;
  var seconds = date.getSeconds() + 1 < 10 ? '0' + (date.getSeconds() + 1) : date.getSeconds() + 1;

  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}
Vue.prototype.getCreateDateStr = getTimeStr;
Vue.prototype.DateToStr = getTimeStr;


//公共参数
const STATUS = {
  //添加
  ADD: 101,
  //更新
  UPDATE: 102,
  // 未选择
  NOCHOSEN: 103,
  //已选择
  CHOSEN: 104,
  //所有 除提交以外的 状态 ， 或 完成状态
  FINISH: 100,
  //只读
  READ: 105,

  //未提交
  UNCOMMIT: 0,
  //审核中
  AUDIT: 1,
  //已通过
  PASS: 2,
  //未通过
  NOPASS: 3,
  //已完成
  DONE: 4,


  //接口返回的CODE
  //成功
  SUCCESS: 1,
  //失败
  FAIL: -1

}
Vue.prototype.STATUS = STATUS;
const ORDER_STATUS = [{
    name: '未提交',
    value: 0
  },
  {
    name: '审核中',
    value: 1
  },
  {
    name: '已通过',
    value: 2
  },
  {
    name: '未通过',
    value: 3
  },
  // {
  //   name: '已完成',
  //   value: 4
  // }
]
Vue.prototype.ORDER_STATUS = ORDER_STATUS;
Vue.prototype.getSTATUS = function(index) {
  switch (index) {
    case 0:
      return '未提交';
      break;
    case 1:
      return '审核中';
      break;
    case 2:
      return '已通过';
      break;
    case 3:
      return '未通过';
      break;
    case 4:
      return '已完成';
      break;
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: {
    App
  },
  template: '<App/>'
});

console.log("%c Vone ", "background:rgba(67,142,185,1);color:white;font-size:150px");
