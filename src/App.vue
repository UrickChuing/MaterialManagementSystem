<template>
  <div class="baseClass" :class="baseClasses">
    <!-- {{baseClasses}} -->
    <router-view style="z-index: 3;position: relative;" :devices='devices' :screenWidth='screenWidth'></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {

		var backgroundImage;
		try{
			backgroundImage = localStorage.backgroundImage;
			backgroundImage = backgroundImage.trim();
		}catch(e){
			backgroundImage = null;
		}

		var baseStyle = {};
		if(backgroundImage != null){
      baseStyle['background-position'] = 'center';
      baseStyle['background-size'] = 'cover';
      baseStyle['background-repeat'] = 'no-repeat';
			baseStyle['background-image'] = 'url('+backgroundImage + ')';
		}

    console.log(backgroundImage)

      return {

        //屏幕宽
        screenWidth: document.body.clientWidth,
        //端
        os: null,
        //延迟 防护性能浪费
        timeOut: null,
        //基础classes  ,class 是样式依据
        baseClasses: ['baseClass'],
        //基础style
        baseStyle: baseStyle,
        //mobile 基准的 策略
        //判定是否为 移动端的策略
        //默认为 '0'
        //策略0：判断设备
        //策略1：判断宽度
        //策略2：混合判断  判断屏幕宽及设备
        //策略3：手动切换
        mobileStrategy: 1,

        //设备类型 用于设备样式判断
        //电脑端---PC
        //手机端---PHONE
        //平板端---PAD
        //泛型 移动端(包括PHONE,PAD)---MOBILE
        devices: 'PC',


        //原登录 由组件引入，现已失效
        // logged: true,
        // loginShow: false,
        // indexShow: true,

        // 输出用的参数，判断执行次数，无用
        // index:0
      }
    },
    watch: {
      //监听是否处于 登录状态
      logged: function(newV) {
        var that = this;

        if (that.logged) {
          that.indexShow = true
          that.loginShow = false
        } else {
          that.indexShow = false
          that.loginShow = true
        }

      },
      //监听屏幕宽度
      screenWidth: function(newV) {
        this.isMobile(newV)
        // console.log(this.index = this.index +1)
      }
    },
    mounted() {
      var that = this;
      // 监听窗口大小
      window.onresize = () => {
        return (() => {
          //获取 延迟
          var timeOut = that.timeOut;
          //清空延迟
          clearTimeout(timeOut);
          //执行延迟
          that.timeOut = setTimeout(function() {
            that.screenWidth = document.body.clientWidth
          }, 30)
        })()
      }

      if (sessionStorage.userInfo == undefined) {
        this.$router.push("/login")
      }
    },
    created: function() {
      this.isMobile(this.screenWidth)

      var curr = this.$router.history.current.fullPath;

      if (curr != "/") {
        this.$router.push('/');
      }

      var cookieStr = document.cookie;
      // document.cookie = 'appId=qwe';
      // document.cookie = 'appScret=asd';

      // var sTR = this.getCookie('appId');
      // this.delCookie('appId');

    },
    methods: {
      isMobile: function(width) {
        var that = this;
        var os = that.osInfo
        that.os = os;

        if (that.mobileStrategy == 0) {
          if (os.isAndroid || os.isPhone || os.isTablet) {
            that.baseClasses = ['baseClass', 'mobile']
            if (that.devices != 'MOBILE') {
              that.devices = 'MOBILE'
            }
          } else {
            that.baseClasses = []
            if (that.devices != 'PC') {
              that.devices = 'PC'
            }
          }
        } else if (that.mobileStrategy == 1) {
          if (width <= 960) {
            that.baseClasses = ['baseClass', 'mobile']
            if (that.devices != 'MOBILE') {
              that.devices = 'MOBILE'
            }
          } else {
            that.baseClasses = []
            if (that.devices != 'PC') {
              that.devices = 'PC'
            }
          }
        } else if (that.mobileStrategy == 2) {
          if (width <= 960) {
            that.baseClasses = ['baseClass', 'mobile']
            if (that.devices != 'MOBILE') {
              that.devices = 'MOBILE'
            }
          } else if (width > 960 && (os.isAndroid || os.isPhone || os.isTablet)) {
            that.baseClasses = ['baseClass', 'mobile']
            if (that.devices != 'MOBILE') {
              that.devices = 'MOBILE'
            }
          } else {
            that.baseClasses = []
            if (that.devices != 'PC') {
              that.devices = 'PC'
            }
          }
        }
      },
      forceChange: function() {
        var that = this;

        if (that.baseClasses.length == 0) {
          that.baseClasses = ['mobile']
        } else {
          that.baseClasses = []
        }

      }
    }
  }
</script>

<style scoped="scoped">
  .baseClass:after {
    content: "";

    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;

    background: inherit;
    filter: blur(2px);

    z-index: 1;
    pointer-events: none;
  }

  .baseClass {
    height: 100%;
    width: 100%;
    min-width: 360px;
    /* background: url(assets/base_back.jpg) center /cover no-repeat; */
  }

  @keyframes hide {
    from {}

    to {}
  }

  .mobile {
    /* min-width: 350px !important; */
  }
</style>
