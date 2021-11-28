<template>

  <div class="baseClass">



    <div class="logo-card">
      <div class="flexCenter">
        <img class="logo" src="../../assets/image/logo-simple.png" />
      </div>
      <div class="card">

        <el-input v-model="acc" prefix-icon="el-icon-user-solid" clearable></el-input>

        <el-input v-model="pwd" style="margin-top: 20px;" show-password prefix-icon="el-icon-lock" clearable></el-input>

        <div class="line">
          <el-input v-model="code" class="company-code" prefix-icon="el-icon-s-cooperation" clearable></el-input>
          <div class="remember">
            <span style="font-size: 14px;margin-right: 10px;color: #6c6c6c;">{{$t('jizhumima')}}</span>
            <el-switch v-model="remember" active-color="#13ce66"></el-switch>
          </div>

        </div>

        <button class="login pointer" @click="loginCheck()">
          {{$t('denglu')}}
        </button>

      </div>
      <div class="language">



      	<div v-if="$i18n.locale == 'ZH-CN'" class="bechoice pointer youCanNotChoose" @click="languageChange('ZH-CN')">中文</div>
      	<div v-if="$i18n.locale != 'ZH-CN'" class="youCanNotChoose pointer" @click="languageChange('ZH-CN')">中文</div>
      	<div v-if="$i18n.locale == 'ZH-CN'" class="youCanNotChoose pointer px-marginLeft10" @click="languageChange('EN')">English</div>
      	<div v-if="$i18n.locale != 'ZH-CN'" class="bechoice pointer youCanNotChoose px-marginLeft10" @click="languageChange('EN')">English</div>
      </div>

    </div>


    <footer>
      <div>{{$t('gongsibanquan')}}</div>
      <!-- <a href="javaScript:void(0)">技术支持：珠海泛网科技有限公司</a> -->
    </footer>
  </div>

</template>

<script>
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
        data: 'this is data',
        remember: localInfo.remember,
        acc: localInfo.acc,
        pwd: localInfo.pwd,
        code: localInfo.code,
        fullscreenLoading: false,

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

        this.loginChekc();
      },
      loginCheck: function() {
        var that = this;
        var axios = that.axios;

        // var accReg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        var accReg = /^[a-zA-Z0-9_]{5,24}$/;

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

        localStorage.setItem('langType', id);

      },

    },
  }
</script>

<style scoped="scoped">

  .language{
    display: flex;
    flex-direction: row;
    color: white;
  }

  button.login {
    margin-top: 20px;

    font-family: "PingFang SC";
    font-size: 16px;

    padding: 12px 36px;
    border-radius: 61px;
    box-shadow: inset 0 0 0 2px #474E51;
    transition: 300ms box-shadow cubic-bezier(0.4, 0, 0.6, 1), 300ms background-color cubic-bezier(0.4, 0, 0.6, 1), 300ms color cubic-bezier(0.4, 0, 0.6, 1);
    ;
    color: #474E51;
  }

  button.login:hover {
    box-shadow: inset 0 0 0 4px #5778F3;
    color: #5778F3;
  }


  .remember {
    line-height: 34px;
    margin-right: 0px;
    margin-left: auto;
  }

  .line {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    height: 40px;
  }

  .company-code {
    width: 100px;
  }

  .card {
    min-height: 230px;
    min-width: 350px;
    background: rgba(255, 255, 255, 1);
    border-radius: 5px;
    box-shadow: 0px 2px 5px rgba(200, 200, 200, 1);
    margin-top: 20px;

    padding: 30px 20px 15px 20px;

    display: flex;
    flex-direction: column;
  }

  .logo {
    height: 100px;
  }

  .logo-card {
    margin-bottom: 20%;
  }

  .baseClass {
    width: 100%;
    height: 100%;
    position: relative;


    display: flex;
    justify-content: center;
    align-items: center;
    
    background: url(../../assets/image/tsssg-bg.jpg) center / cover no-repeat;

  }

  footer {
    position: absolute;
    width: calc(100% - 40px);
    bottom: 0;
    left: 0;
    padding: 20px;
    line-height: 20px;
    text-align: center;
    z-index: 2;

    background: rgba(255, 255, 255, 0.6);
  }
</style>
