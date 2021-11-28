<template>

  <div class="bg" @keydown.enter="full_KeyD_Enter()">

    <div id="header">
      <div class="header">
        <!-- <img :src="require('@/assets/image/'+logoSrc)" style="width: 140px;height: 37px;"> -->
        <img :src="require('@/assets/image/'+logoSrc)" style="width: 45px;height: 37px;">
        <span style="margin-left: 10px;">{{$t('wuziguanlixitong')}}</span>
      </div>
    </div>


    <div id="loginCard">
      <div class="line">
        {{langType != 'zh-cn'?  $t('yonghu')+' '+$t('denglu'):$t('yonghu')+$t('denglu')}}
      </div>
      <div class="line blue-line triangle" style="padding-top: 20px;">
        <el-input v-model="acc" :placeholder="$t('yonghuming')" prefix-icon="el-icon-user-solid" clearable></el-input>
      </div>
      <div class="line blue-line">
        <el-input v-model="pwd" :placeholder="$t('mima')" show-password prefix-icon="el-icon-lock" clearable></el-input>
      </div>
      <div class="line blue-line two">

        <div></div>
        <div>
          <div class="remember-text" style="margin-right: 10px;">{{$t('jizhumima')}}</div>
          <el-switch style="margin-top: 4px;" v-model="remember" active-color="#13ce66"></el-switch>
        </div>
      </div>
      <!-- 			<div class="line language">
				<div :class="[$i18n.locale != 'JA-JP'&&$i18n.locale != 'ZH-CN'&&$i18n.locale != 'EN'? 'bechoice':'','pointer','youCanNotChoose']"
				 @click="languageChange('JA-JP')" v-if="$i18n.locale != 'JA-JP'&&$i18n.locale != 'ZH-CN'&&$i18n.locale != 'EN'">{{$t('language').title}}</div>
				<div :class="[$i18n.locale == 'JA-JP'? 'bechoice':'','pointer','youCanNotChoose']" @click="languageChange('JA-JP')">日本語</div>
				<div :class="[$i18n.locale == 'ZH-CN'? 'bechoice':'','pointer','youCanNotChoose']" @click="languageChange('ZH-CN')">中文</div>
				<div :class="[$i18n.locale == 'EN'? 'bechoice':'','pointer','youCanNotChoose']" @click="languageChange('EN')">English</div>
			</div> -->
      <div class="line">
        <button class="login pointer" @click="loginCheck()">
          {{$t('denglu')}}
        </button>
      </div>
    </div>


    <footer>
      © {{new Date().getFullYear()}}南海邮轮 网站备案/许可证号：琼ICP备19005038号-1 技术支持：<a href="http://vonetec.com/" target="view_window">泛网科技</a>
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
      } else {
        langType = this.$i18n.locale;
      }

      return {
        data: 'this is data',
        remember: localInfo.remember,
        acc: localInfo.acc,
        pwd: localInfo.pwd,
        // code: '001',
        fullscreenLoading: false,

        logoSrc: this.$i18n.locale == 'ZH-CN' ? 'logo-simple.png' : 'logo-simple.png',

        langType: langType

      }
    },
    created: function() {
      var that = this;
      // this.ajax();

      var token = sessionStorage.getItem('token');
      if (token != null && token != undefined) {
        that.$router.to("/home");
        return;
      } else {
        sessionStorage.clear()
      }

      // that.RouterRoles();

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
        this.logoSrc = this.$i18n.locale == 'ZH-CN' ? 'logo.png' : 'logo_en.png';

        localStorage.setItem('langType', id);

      },
      routerRoles: function(roles) {

        var that = this;
        var router = that.$router.options.routes;

        var menuRouters = router[0].children;


        //被显示的parent
        var parentBeShow = [];

        //左侧菜单权限 隐藏
        // for (var menuRouter in menuRouters) {
        //   var menu = menuRouters[menuRouter];
        //   console.log(menu.meta.title)
        //   for (var roleIndex in roles) {
        //     var role = roles[roleIndex];
        //     if (role.controllerName == menu.meta.name) {
        //       menu.meta.menu = role.isAuth;
        //       if (role.isAuth) {
        //         if (role.parentId != null && role.parentId != undefined && role.parentId != 0) {
        //           parentBeShow.push(menu.meta.parent)
        //         }
        //       }

        //     }
        //   }
        // }


        // var parentBeShowMenu = [];
        // for(var menuRouter in menuRouters){
        //   var menu = menuRouters[menuRouter];
        //   for(var parentIndex in parentBeShow){
        //     var parentMenu = parentBeShow[parentIndex]
        //     if(parentMenu == menu.meta.parentId){
        //       menu.meta.menu = true;
        //     }
        //   }
        // }


        console.log(router);



      },

    },
  }
</script>

<style scoped="scoped">
  .bg[devices='PC'] .triangle::after {
    /* content: ''; */
    position: absolute;
    height: 237px;
    width: 78px;
    background: url(../../assets/image/login-part.png) center/ 100% 100% no-repeat;
    /* left: -101px; */
    left: -77px;
    top: -0px;
  }

  .triangle {
    position: relative;
  }

  button.login:hover {
    background: rgba(19, 206, 102, 0.6);
  }

  button.login {
    width: 100%;
    background: rgba(19, 206, 102, 0.8);
    font-size: 18px;
    transition: 0.2s;
    padding: 8px;
    color: white;
    margin-bottom: 20px;
  }

  .line.language>div.bechoice {
    background: rgba(63, 127, 207, 0.3);
  }

  .line.language>div:first-child {
    margin-left: auto;
  }

  .line.language>div {
    cursor: pointer;
    padding: 0px 10px;
    margin-left: 10px;
    border-radius: 8px;
    transition: 0.6s;
    height: 30px;
    line-height: 30px;
    margin-top: 5px;
  }

  .line.language {
    display: flex;
    flex-direction: row;
  }

  .line.blue-line.two>div:last-child {
    margin-left: auto;
    display: flex;
    flex-direction: row;
    line-height: 30px;
  }

  .line.blue-line.two>div:first-child {
    width: 100px;
  }

  .line.blue-line.two {
    display: flex;
    flex-direction: row;
  }

  .line:first-child {
    font-size: 2em;
    color: rgb(102, 102, 125);
    /* font-weight: 100 !important; */
    text-align: center;
    padding: 15px;
  }

  .bg[devices='PC'] .remember-text {
    /* color: white; */
  }

  .bg[devices='PC'] .blue-line {
    /* background: rgb(63, 127, 207); */
    padding: 10px 20px !important;
  }

  .line {
    min-height: 40px;
    line-height: 40px;
    padding: 0px 20px;
  }

  #loginCard {
    min-width: 375px;
    max-width: 400px;
    min-height: 300px;
    height: auto;
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 5px;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.2);

    margin-right: 10%;
    margin-left: auto;
    margin-top: 12%;
  }

  /*  .bg[devices='PC'] {
    min-height: 800px;
    width: 1125px;
    height: 100%;
    width: 100%;
    background: url(../../assets/image/login-main-bg.jpg) center / 60% no-repeat;
    background-color: white;
    background-position-y: 116px;
    background-position-x: 75px;
  } */

  .bg[devices='PC'] {
    min-height: 800px;
    width: 1125px;
    height: 100%;
    width: 100%;
    background: url(../../assets/image/tsssg-bg.jpg) center / cover no-repeat;
  }

  .bg {}

  #header {
    height: 76px;
    /* background: url(../../assets/image/header-bg.jpg) center / 100% 100% no-repeat; */
    padding: 20px;
  }


  .bg[devices='PC'] #header>.header {
    padding: 20px 0 0 84px;
    font-size: 18px;
    color: #fff;
    font-weight: bold;
    display: flex;
    line-height: 51px;
  }

  footer {
    /* background: rgb(2, 61, 136); */
    color: white;
    position: absolute;
    width: calc(100% - 40px);
    bottom: 0;
    left: 0;
    padding: 20px;
    line-height: 20px;
    text-align: center;
  }
</style>
<style scoped="scoped">
  .bg[devices='MOBILE'] {
    height: 100%;
    background: url(../../assets/image/tsssg-bg.jpg) center / cover no-repeat;
  }

  .bg[devices='MOBILE'] .line {
    padding: 5px 20px;
    color: #303133;
  }

  .mobile #loginCard {
    margin-left: auto;
    margin-right: auto;
  }

  .mobile #header {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .mobile .header>span {
    margin-left: 0px !important;
    text-align: center;
    color: white;

    padding-top: 5px;

    border-top: white solid 1px;

    font-size: 16px;
  }

  .mobile .header>img {
    margin-bottom: 5px;
  }

  .mobile .header {
    display: flex;
    flex-direction: column;
  }
</style>
