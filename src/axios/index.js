//axios ajax
import axios from 'axios'
//ELEMENT 弹框
import {
  Notification,
  Loading
} from 'element-ui'
//router
import router from '@/router/index'
// 转Form Data
// import qs from 'qs'


//携带cookie , sessionId;    服务端 METHODS.OPTIONS 放行
axios.defaults.withCredentials = true;
//跨域设置
axios.defaults.crossDomain = true;
var apiUrls = {
  default: 'http://127.0.0.1:8848',
  dev: 'http://192.168.8.157:8848',
  hk: 'https://192.168.8.1',
  online: 'https://192.168.8.1'
}

axios.defaults.timeout = 30000;

var a = process.env.ENV_VERSION;

if (process == null || process.env == undefined || process.env.ENV_VERSION == undefined) {
  axios.defaults.baseURL = apiUrls.dev;
} else if (process.env.ENV_VERSION === 'prod') {
  axios.defaults.baseURL = apiUrls.online;
} else if (process.env.ENV_VERSION === 'NanHai') {
  axios.defaults.baseURL = apiUrls.online;
} else if (process.env.ENV_VERSION === 'test') {
  axios.defaults.baseURL = apiUrls.dev;
} else {
  axios.defaults.baseURL = apiUrls.dev;
}

function emptyStrToNull(data) {

  for (var label in data) {
    var target = data[label];

    if (target instanceof File) {
      continue;
    }

    if (typeof(target) === 'object') {
      emptyStrToNull(target);
    }

    if (typeof(target) === 'string') {
      if (target.trim() === '') {
        data[label] = null;
      }
    }

    if (target == undefined) {
      data[label] = null;
    }

  }

  return data;
}

var loading;

axios.interceptors.request.use(config => {


  if (config.data != undefined) {
    var data = config.data
    emptyStrToNull(data)
  }

  if ((config.url).indexOf("update") != -1 && loading == null || (config.url).indexOf("add") != -1 || config.loading) {
    loading = Loading.service({
      lock: true,
      // text: 'Loading...',
      // spinner: 'el-icon-loading',
      background: 'rgba(255, 255, 255, 0.7)'
    });
  }

  if (config.df !== false) {
    // JSON 转换为 FormData
    // 设置以 form 表单的形式提交参数，如果以 JSON 的形式提交表单，可忽略
    const formData = new FormData();
    if (config.data != undefined) {
      Object.keys(config.data).forEach(key => {
        if (config.data[key] != null)
          formData.append(key, config.data[key])
      })
    }
    config.data = formData
  }
  // 下面会说在什么时候存储 token
  if (sessionStorage.token) {
    config.headers['token'] = sessionStorage.token;
    // config.headers['Accept'] = 'application/json';
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    // store.dispatch('logined', localStorage.token)
  }
  return config
}, error => {

  return Promise.reject(error)
});


var noLogin = null;
// 响应拦截
axios.interceptors.response.use(res => {

  var data = res.data;
  if (data.code === -404) {

    if (res.config.url === '/login/status') {
      return res;
    }

    clearTimeout(noLogin);
    noLogin = setTimeout(function() {
      Notification({
        title: '警告',
        message: '<div><span style="color:red">未登录 (或登陆已过期)</span><br><span class="blue">请重新登录</span></div>',
        type: 'error',
        duration: 5000,
        dangerouslyUseHTMLString: true
      });
      if (loading != null) {
        loading.close();
        loading = null;
      }
    }, 250)


    router.push("/login");
    return false;
  }

  if (((res.config.url).indexOf("update") != -1) || (res.config.url).indexOf("add") != -1 && loading != null || res
    .config.loading) {
    try {
      setTimeout(function() {
        loading.close();
        loading = null;
      }, 300)
    } catch (e) {
      console.log("NO LOADING")
    }
  }

  return res;
}, error => {

  var throwError = true;
  try {
    if ((error.config.url).indexOf("update") != -1 || (error.config.url).indexOf("add") != -1 && loading != null ||
      error.config.loading) {
      setTimeout(function() {
        loading.close();
        loading = null;
      }, 300)
    }

  } catch (e) {
    console.log("NO LOADING")
  }

  // 对响应错误做处理
  if (error.response == undefined) {
    throwError = false;
    Notification({
      title: '错误',
      message: '<div><span style="color:red">Network Error</span> <br> 连接错误，请稍后重试<br><span class="blue">若无效，请及时联系管理员</span></div>',
      type: 'error',
      duration: 20000,
      dangerouslyUseHTMLString: true
    });
  } else if (error.response.status == 500) {
    throwError = false;
    Notification({
      title: '错误',
      message: '<div>API WARN[<span style="color:red">' + error.response.config.url +
        '</span>] <br> 接口错误，请及时联系管理员</div>',
      type: 'error',
      duration: 20000,
      dangerouslyUseHTMLString: true
    });
  } else if (error.response.status == 400) {
    throwError = false;
    Notification({
      title: '错误',
      message: '<div>API WARN[<span style="color:red">' + error.response.config.url +
        '</span>] <br> 参数格式或类型错误，请及时联系管理员</div>',
      type: 'error',
      duration: 20000,
      dangerouslyUseHTMLString: true
    });
  } else {
    throwError = false;
    var message = '<div>WARN CODE:<span style="color:red">' + error.response.data.status + '</span> <br>' +
      'error: <span class="red">' + error.response.data.error + '</span> <br>' +
      'message: <span class="red">' + error.response.data.message + '</span><br>' +
      'api: <span class="blue">' + error.response.data.path + '</span> <br>' +
      'timestamp: <span class="blue">' + error.response.data.timestamp + '</span>' +
      '</div>'

    Notification({
      title: '错误代码:' + error.response.status,
      message: message,
      type: 'error',
      duration: 20000,
      dangerouslyUseHTMLString: true
    });
  }
  if (throwError) {
    return Promise.reject(error);
  } else {
    error.myError = true
    return Promise.reject(error);
  }

})
export default axios;
