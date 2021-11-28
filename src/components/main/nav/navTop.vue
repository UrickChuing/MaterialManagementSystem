<template>

  <div :style="colors.head" class="baseClasses">
    <div :style="colors.head" id="navTop">
      <div id="leftNavShowHide" @click="leftNavShowHide()">
        <i class="el-icon-s-fold" :style="{'font-size': '25px' , color: colors.head.color}"></i>
      </div>
      <!--      <div style="height: 100%;line-height: 50px;">
        {{$t('shouquanyu')}} : {{companyName}}
      </div> -->

      <div class="nav-right">

        <!-- <div style="margin-right: 10px;">

        </div> -->

        <div class="bt-refresh youCanNotChoose" @click="$parent.refresh = true">
          <i class="el-icon-refresh-right" style="font-size: 24px;"></i>
        </div>
        <div class="youCanNotChoose">
          {{userInfo.realName}}
        </div>
        <div class="admin-avatar">
          <button id="showPersonalButton" @click="personalMenu.showPersonalMenus = ! personalMenu.showPersonalMenus">
            <i class="el-icon-user-solid" style="font-size: 24px;color: white;"></i>
            <div :class="personalMenu.showPersonalClasses">
              <div @click="personalMenu.change = true">{{$t('xiugaimima')}}</div>
              <div @click="logout()">{{$t('tuichudenglu')}}</div>
            </div>
          </button>
          <span @click="personalMenu.showPersonalMenus = ! personalMenu.showPersonalMenus" style="margin-left: 10px;font-size: 14px;"
            class="youCanNotChoose pointer">{{userInfo.loginName}}<i style="margin-left: 5px;" class="el-icon-caret-bottom"></i></span>

        </div>

      </div>
    </div>

    <nav-tabs ref="navTabs" v-bind:colors="colors.page"></nav-tabs>

    <change-pwd v-if="personalMenu.change"></change-pwd>

<!--    <el-dialog :custom-class="['dialog-card','self-card']" :visible.sync="inAdd" :append-to-body="true">

    </el-dialog> -->


  </div>

</template>

<script>
  import navTabs from './navTabs.vue'
  import changePwd from '../../login/changePwd.vue'

  export default {
    components: {
      navTabs,
      changePwd
    },
    props: ['leftShow', 'devices', 'breadcrumbs', 'colors'],
    data() {
      var leftShow = this.leftShow;

      return {
        // leftShow_data: leftShow
        baseStyle: {
          backgroundColor: this.$parent.settingData.navTopColor.backgroundColor,
        },

        personalMenu: {
          // leftShow_data: leftShow
          showPersonalClasses: ['avatar-menus', 'hide'],
          showPersonalMenus: false,
          change: false
        },

        //公司名
        // companyName:sessionStorage.companyName
        // companyName:localStorage.companyName,

        userInfo: JSON.parse(sessionStorage.userInfo == undefined ? '{}' : sessionStorage.userInfo)
      }
    },
    watch: {
      'personalMenu.showPersonalMenus': {
        handler: function(newV) {
          if (newV) {
            this.personalMenu.showPersonalClasses = ['avatar-menus', 'show']
          } else {
            this.personalMenu.showPersonalClasses = ['avatar-menus', 'hide']
          }
        },
        deep: true
      }
    },
    mounted: function() {
      var that = this;
      document.getElementById('showPersonalButton').onblur = function() {
        that.personalMenu.showPersonalMenus = false
      }
    },
    created: function() {


    },
    methods: {
      //左侧菜单 收起 展开
      leftNavShowHide: function() {
        this.$emit('navShow');
      },

      logout: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/logout',
          df: false
        }).then((response) => {
          sessionStorage.clear();
          const loading = that.$loading({
            lock: true,
            // text: 'Loading...',
            // spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.7)'
          });
          that.$router.push('/login')
          setTimeout(function(){
            loading.close();
            window.location.reload();
          },50)
        }).catch(error => {
          sessionStorage.clear()
          that.$router.push('/login')
        })

      }
    }
  }
</script>

<style scoped="scoped">
  .bt-refresh {
    cursor: pointer;
    width: 50px;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .bt-refresh:hover {
    background: rgba(00, 00, 00, 0.05);
  }

  .bt-refresh:active {
    background: rgba(00, 00, 00, 0.1);
  }

  .avatar-menus>div:hover {
    color: #46a6ff;
    background: rgba(232, 244, 255, 1);
  }

  .avatar-menus>div {
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: rgba(95, 95, 95, 1.0);
    cursor: pointer;
    white-space: nowrap;

    width: 120px;

    padding: 0px 10px;
    /* transition: 0.3; */
  }


  .avatar-menus>div:last-child {
    border-top: 1px rgba(00, 00, 00, 0.3) solid;
  }

  .avatar-menus.hide {
    animation: opacity1To0 0.15s forwards;
    pointer-events: none;
    opacity: 0;
    transition: 0.2s;
    width: 70px;
  }


  .avatar-menus.show {
    transition: 0.2s;
    width: 140px;
  }

  .avatar-menus {
    font-size: 14px;
    position: absolute;
    top: 47px;
    right: -36px;
    background: white;
    box-shadow: 0px 0px 5px rgba(00, 00, 00, 0.3);
    min-height: 50px;
    min-width: 80px;
    display: flex;
    flex-direction: column;

    overflow: hidden;
  }

  .admin-avatar {
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .admin-avatar>i {
    position: absolute;
    bottom: 3px;
    right: 3px;
    font-size: 14px;
    cursor: pointer;
  }

  .admin-avatar>button {
    width: 38px;
    height: 38px;
    background: #24C0F9;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
  }

  .nav-right {
    display: flex;
    flex-direction: row;
    margin-left: auto;
    margin-right: 10px;
  }

  #navTop {
    height: 50px;

    display: flex;
    flex-direction: row;
    z-index: 500;
    position: relative;

    line-height: 50px;

    /* box-shadow: 0px 2px 8px 0px rgba(100, 100, 100, 0.2); */

    transition: 0.15s;

    margin-left: 0px;
    width: 100%;
  }

  #leftNavShowHide {
    padding: 0px 15px;

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
  }

  #leftNavShowHide:hover {
    background: rgba(200, 200, 200, 0.1);
  }


  /* 覆盖 面包屑 */
  .el-breadcrumb {
    line-height: 50px;
    overflow: hidden;
  }

  /* 动画 */
  .el-breadcrumb__item:last-child {
    animation: breadcrumbShow 0.5s;
  }

  @keyframes breadcrumbShow {
    from {
      opacity: 0;
      transform: translate3d(50px, 0, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0px, 0, 0);
    }
  }


  .baseClasses {
    z-index: 2;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.2);
  }
</style>
