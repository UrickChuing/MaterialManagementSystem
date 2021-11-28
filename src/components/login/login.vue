<template>
  <div id="app" :class="baseClasses" @keydown.enter="full_KeyD_Enter()">

    <header>

      <h1>
        <!-- <img :src="logoSrc" style="width: 140px;height: 37px;"> -->
        <img :src="logoSrc" style="width: 45px;height: 37px;">
        <span style="margin-left: 10px;">物资管理系统</span>
      </h1>

    </header>

    <div class="login-body">
      <div class="login-card px-boxShadow">
        <div class="login-card-line login-card-line-head">
          <h1 v-if="langType != 'zh-cn'">{{$t('yonghu')}} {{$t('denglu')}}</h1>
          <h1 v-else>{{$t('yonghu')}}{{$t('denglu')}}</h1>
        </div>
        <div class="login-card-line login-card-line-acc">
          <el-input v-model="acc" placeholder="账号" maxlength="24" prefix-icon="el-icon-user" clearable></el-input>
        </div>
        <div class="login-card-line">
          <el-input v-model="pwd" placeholder="密码" show-password prefix-icon="el-icon-lock" clearable></el-input>
        </div>
        <div class="login-card-line">
          <!-- <div>{{$t('gongsidaima')}}</div> -->
          <!-- <input v-model="code" maxlength="6" :placeholder="$t('gongsidaima')" :class="['company-code-input',code==''? 'no-code':'got-code']" /> -->
          <div style="float: right;display: flex;line-height: 29px;">
            <div style="margin-right: 10px;color: white;">{{$t('jizhumima')}}</div>
            <el-switch style="margin-top: 4px;" v-model="remember" active-color="#13ce66"></el-switch>
          </div>

        </div>
        <div class="login-card-line remember" v-if="false">


        </div>
        <div class="login-lang-change" v-if="false">
          <div v-if="$i18n.locale == 'ZH-CN'" class="bechoice" @click="languageChange('ZH-CN')">中文</div>
          <div v-if="$i18n.locale != 'ZH-CN'" @click="languageChange('ZH-CN')">中文</div>
          <div v-if="$i18n.locale == 'ZH-CN'" @click="languageChange('EN')">English</div>
          <div v-if="$i18n.locale != 'ZH-CN'" class="bechoice" @click="languageChange('EN')">English</div>

        </div>

        <div class="login-card-line login-card-line-foot">
          <button @click="loginCheck()" class="pointer">
            {{$t('denglu')}}
          </button>
        </div>
      </div>

    </div>

    <footer>
      <div>
        © {{new Date().getFullYear()}}南海邮轮 网站备案/许可证号：琼ICP备19005038号-1 技术支持：<a href="http://www.vonechina.com/" rel="nofollow" target="_blank">泛网科技</a>
      </div>
      <!-- <a href="javaScript:void(0)">技术支持：珠海泛网科技有限公司</a> -->
    </footer>

  </div>
</template>

<script>
  import logo from '@/assets/image/logo-simple.png';
  import nanHaiLogo from '@/assets/image/logo-simple_nanhai.png'

  export default {
    data() {

      var localInfo = localStorage.getItem('secretInfo');
      if (localInfo == null || localInfo == undefined) {
        localInfo = {
          acc: '',
          pwd: '',
          code: '',
          remember: false
        }
      } else {
        try {
          // 对base64转编码
          var base64Str = atob(localInfo);
          // 编码转字符串
          var decode = decodeURI(base64Str)

          localInfo = JSON.parse(JSON.parse(decode))
        } catch (e) {
          //TODO handle the exception
          localInfo = {
            acc: '',
            pwd: '',
            code: '',
            remember: false
          }
        }

      }



      var langType = localStorage.getItem('langType')
      if (langType != undefined && langType != null) {
        this.$i18n.locale = langType;
      }

      return {

        baseClasses: process.env.ENV_VERSION === 'NanHai'? ['nanhai']:[],

        data: 'this is data',
        remember: localInfo.remember,
        acc: localInfo.acc,
        pwd: localInfo.pwd,
        code: localInfo.code,
        fullscreenLoading: false,

        logoSrc: process.env.ENV_VERSION === 'NanHai'? nanHaiLogo:logo,

        langType: langType

      }
    },
    created: function() {
      var that = this;
      var axios = that.axios;
      // this.ajax();

      var token = sessionStorage.getItem('token');
      if (token != null && token != undefined) {
        that.$router.to("/home");
        return;
      } else {
        sessionStorage.clear()
      }

    },
    methods: {
      full_KeyD_Enter: function() {

        this.loginCheck();
      },
      loginCheck: function() {
        var that = this;
        var axios = that.axios;

        // var accReg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        var accReg = /^[a-zA-Z0-9_]{1,24}$/;

        var pwdReg = /^[\s\S]{6,18}$/;

        if (!accReg.test(that.acc)) {

          if (that.acc.trim().length != 0) {
            that.$notify.error({
              title: that.$t('cuowu'),
              message: that.$t('LOGIN_RE.accountWrongFormat')
            });
          } else {
            that.$notify.error({
              title: that.$t('cuowu'),
              message: that.$t('LOGIN_RE.accountNull')
            });
          }
        } else if (!pwdReg.test(that.pwd)) {
          that.$notify.error({
            title: that.$t('cuowu'),
            message: that.$t('LOGIN_RE.passwordNull')
          });
        } else {

          const loading = this.$loading({
            lock: true,
            text: 'Login...',
            // spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.7)'
          });

          //ajax请求

          axios({
            method: 'post',
            url: '/login',
            data: {
              acc: that.acc,
              pwd: md5(that.pwd),
            },
            df: false
          }).then((response) => {
            if (!response) {
              loading.close();
              return;
            }
            var data = response.data;

            setTimeout(function() {
              loading.close();

              if (data.code == 1) {
                // that.routerRoles(data.roles);

                var info = {
                  acc: that.acc,
                  pwd: that.pwd,
                  remember: that.remember
                };

                // sessionStorage.setItem('userInfo', JSON.stringify(data.data));
                // sessionStorage.setItem('userName',data.data.name);

                sessionStorage.setItem('userInfo', JSON.stringify(data.data));
                sessionStorage.setItem('userName', data.data.name);
                localStorage.setItem('loadingMenu', true);

                if (that.remember) {
                  var base64Str = JSON.stringify(JSON.stringify(info));

                  // 对字符串进行编码
                  var encode = encodeURI(base64Str);

                  var base64Str = btoa(encode);

                  localStorage.setItem('secretInfo', base64Str);

                  //设置公司名
                  // sessionStorage.setItem('companyName', data.companyName)
                } else {
                  localStorage.removeItem('secretInfo');
                }
                that.$router.push("home");
                // window.location.reload()
              } else if (data.code == -406) {
                that.$notify.error({
                  title: '提示',
                  message: data.msg
                });
              } else {
                that.$notify.error({
                  title: '错误',
                  message: '账号或密码错误'
                });
              }
            }, 1000)


          }).catch(function(error) {
            that.errorhanding(error)

            loading.close();
          })



        }

      },
      languageChange: function(id) {


        this.$i18n.locale = id;
        this.logoSrc = this.$i18n.locale == 'ZH-CN' ? logo : logoEn;

        localStorage.setItem('langType', id);

      },

    },
  }
</script>

<style scoped="scoped">
  @import url('./login.css');

  #app {
    font-family: Helvetica, sans-serif;
    background-color: white;
  }

  .company-code-input {
    background: rgba(255, 255, 255, 1);
    width: 30%;
    border: solid rgba(0, 0, 0, 0) 1px;
    border-radius: 5px;
    padding: 10px;
    /* float: right; */
    text-align: right;
    font-weight: bold;
  }

  .company-code-input.got-code {
    opacity: 0.5;
  }

  .company-code-input.no-code {
    border: solid rgba(255, 0, 0, 1) 1px;
  }
</style>
