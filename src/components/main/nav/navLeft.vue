<template>
  <div id="baseDiv" :class="baseClasses">
    <!-- 		<el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
		  <el-radio-button :label="false">展开</el-radio-button>
		  <el-radio-button :label="true">收起</el-radio-button>
		</el-radio-group> -->
    <el-menu default-active="1-4-1" :background-color="color.backgroundColor" :text-color="color.textColor" class="el-menu-vertical-demo public-scroll-y-hide left-menu"
      :active-text-color="color.activeTextColor" @open="handleOpen" @close="handleClose" :collapse="leftShow"
      :collapse-transition="showAn" :router='true' :default-active="currenIndex" :unique-opened="true">
      <div class="leftNavLog" :style="{'background-color':leftTopLog.backgroundColor}">
        <el-image v-if="!leftShow" class="show" :src="leftTopLog.imagePath != null? leftTopLog.imagePath:logoSrc" fit="fit"></el-image>
        <el-image v-if="leftShow" class="hide" :src="leftTopLog.imagePath_sm != null? leftTopLog.imagePath_sm:logoSrc_mini" fit="fit"></el-image>
        <!-- <img src="../../../assets/image/logo_en.png" /> -->
      </div>

      <!-- 第一层级 循环 -->
      <template v-for="(menu,indexMenu) in menus">
        <!-- {{menu.children != undefined}}{{menu.children != null}} -->
        <!-- 如果为 单层级结构 -->
        <el-menu-item :index="menu.path" v-if="menu.children == undefined || menu.children == null || menu.children.length == 0">
          <i :class="menu.meta.icon"></i>
          <span slot="title">{{ $t(menu.meta.title) }}</span>
        </el-menu-item>

        <!-- 如果为 多层级结构 -->
        <el-submenu :index="menu.path" v-else>
          <template slot="title">
            <i :class="menu.meta.icon"></i>
            <span slot="title">{{ $t(menu.meta.title) }}</span>
          </template>

          <!-- 如果为 单层级结构 -->
          <template v-for="(me,indexMenu) in menu.children">
            <el-menu-item :index="me.path" v-if="me.children == undefined || me.children == null">
              <i :class="me.meta.icon"></i>
              <span slot="title">{{ $t(me.meta.title) }}</span>
            </el-menu-item>

            <el-submenu :index="me.path" v-else>
              <template slot="title">
                <i :class="me.meta.icon"></i>
                <span slot="title">{{ $t(me.meta.title) }}</span>
              </template>

              <!-- 如果为 单层级结构 -->
              <template v-for="(e,indexMenu) in me.children">
                <el-menu-item :index="e.path" v-if="e.children == undefined || e.children == null">
                  <i :class="e.meta.icon"></i>
                  <span slot="title">{{ $t(e.meta.title) }}</span>
                </el-menu-item>


              </template>


            </el-submenu>

          </template>


        </el-submenu>

      </template>

    </el-menu>
    <div v-if="devices != 'PC' && leftShow == false" class="moblie-back" @click.stop=" $emit('showChange', true); "></div>
  </div>
</template>

<script>
  import logo from '@/assets/image/logo_en.png';
  import logo_mini from '@/assets/image/logo-simple.png';
  import logo_nanhai from '@/assets/image/logo_en_nanhai.png';
  import logo_mini_nanhai from '@/assets/image/logo-simple_nanhai.png';

  export default {
    props: ['color', 'leftShow', 'devices','leftTopLog'],
    data: function() {

      var build_version;
      if(process.env != undefined){
        build_version = process.env.ENV_VERSION;
      }

      var logoSrc = logo;
      var logoSrc_mini = logo_mini;
      if(build_version == 'NanHai'){
        logoSrc = logo_nanhai;
        logoSrc_mini = logo_mini_nanhai;
      }


      return {

        baseClasses: [],

        //是否展开 菜单组件
        //element 原生
        isCollapse: false,

        //左上角logo
        logoSrc:logoSrc,
        logoSrc_mini: logoSrc_mini,

        //获取根
        // parentApp:this.$parent.$parent

        // 定时缓冲
        setTimeOut: null,

        //是否展示 伸缩动画
        showAn: false,

        //菜单数据
        menus: [{
            name: '首页',
            path: '/',
            icon: 'el-icon-s-home'
          },
          {
            name: 'Table表格2',
            path: '/table',
            icon: 'el-icon-date'
          },
          {
            name: 'Table表格3',
            path: '/inputTest',
            icon: 'el-icon-date',
            children: [{
                name: this.$t('music'),
                path: '/inputTest',
                icon: 'el-icon-date',
                children: [{
                    name: this.$t('music'),
                    path: '/inputTest',
                    icon: 'el-icon-date'
                  }, {
                    name: 'Table表格3-2',
                    path: '/table3-2',
                    icon: 'el-icon-date'
                  }

                ]
              }, {
                name: 'Table表格3-2',
                path: '/table3-2',
                icon: 'el-icon-date'
              }

            ]
          }
        ],

        //当前菜单
        currenIndex: ''



      }
    },
    watch: {
      leftShow: function(newV) {
        this.animation(this.devices, newV)
      },
      devices: function(newV) {
        var that = this;

        if (!that.leftShow) {
          that.$emit('showChange', !that.leftShow);
        }

        that.animation(newV, that.leftShow);

      },
      '$route': function(newV) {
        const path = newV.path
        this.currenIndex = path

        // const fromDepth = from.path.split('/').length;
        // this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      }
    },
    created: function() {
      var that = this;
      that.animation(that.devices, that.leftShow);
      that.initMenus();

      that.currenIndex = that.$route.path
    },
    methods: {
      handleOpen: function(key, keyPath) {
        // console.log('handleOpen:' + key, keyPath);
      },
      handleClose: function(key, keyPath) {
        // console.log('handleClose:' + key, keyPath);
      },

      initRouter: function(){
        var that = this;
        var axios = that.axios;
        axios({
            method: 'post',
            url: 'user/',
            df: false
          })
          .then((response) => {
            if(!response){
              return false;
            }
            var data = response.data
            if (data.code == 1) {

              //如果是获取菜单，则返回获取的菜单
              if(which == 'GET_MENU'){
                resolve(data.data);
                return data.data;
              }else{
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
      },

      //初始化菜单
      initMenus: function(){
        var that = this;
        if(localStorage.AZHEISMYCAIDAN == undefined){
          return;
        }
        // var menusBase = this.$router.options.routes;
        var menusBase = JSON.parse(localStorage.AZHEISMYCAIDAN);
        function listToTree(oldArr){
          oldArr.forEach(element => {
            let parent = element.meta.parent;
            if(parent !== 0 && parent != undefined){
              oldArr.forEach(ele => {
                if(ele.meta.parentId == parent){ //当内层循环的ID== 外层循环的parendId时，（说明有children），需要往该内层id里建个children并push对应的数组；
                  if(!ele.children){
                    ele.children = [];
                  }
                  ele.children.push(element);
                }
              });
            }
          });
          oldArr = oldArr.filter(ele => ele.meta.parent === undefined); //这一步是过滤，按树展开，将多余的数组剔除；
          return oldArr;
        }

        menusBase = listToTree(menusBase);

        //排序
        function listSort(arr) {
          for (var i = 0; i < arr.length - 1; i++) {
            // 内层循环,控制比较的次数，并且判断两个数的大小
            for (var j = 0; j < arr.length - 1 - i; j++) {
              // 白话解释：如果前面的数大，放到后面(当然是从小到大的冒泡排序)
              if (arr[j].order > arr[j + 1].order) {
                var temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
              }
            }
          }
        }

        function deepMenusSort(menus) {
          for (var index = 0; index < menus.length; index++) {
            var demo = menus[index]

            if (demo.children != undefined && demo.children != null && demo.children.length != 0) {
              deepMenusSort(demo.children)
            }
          }
          listSort(menus);
        }

        deepMenusSort(menusBase)
        that.menus = menusBase

      },

      //被废弃
      initMenus_dis: function() {
        var that = this;
        if(localStorage.AZHEISMYCAIDAN == undefined){
          return;
        }
        // var menusBase = this.$router.options.routes;
        var menusBase = JSON.parse(localStorage.AZHEISMYCAIDAN);

        var menusAll = that.deepNode(menusBase);
        var menus = [];

        //多层级结构
        var menusMore = [];
        //根级
        var menuBase = []
debugger

        // 第一遍循环，取出所有父级 及 无子级单层结构 及 多层级结构
        for (var index = 0; index < menusAll.length; index++) {
          var menuDemo = menusAll[index];
          var parentId = menuDemo.parentId;
          var parent = menuDemo.parent;
          // 如果是父级、多层级、单层 结构
          //	根父级 parentId != undefined && parent == undefined
          //  多层 parentId != undefined && parent != undefined
          //  单层 、	| 根单层	最高层 parentId == undefined && parent == undefined
          //        	|      	最底层 parentId == undefined && parent != undefined
          if (parentId != undefined && parent == undefined) {
            menuBase.push(menuDemo);
            menusAll.splice(index, 1);
            index--;
          } else if (parentId != undefined && parent != undefined) {
            menusMore.push(menuDemo);
            menusAll.splice(index, 1);
            index--;
          } else if (parentId == undefined && parent == undefined) {
            menuBase.push(menuDemo);
            menusAll.splice(index, 1);
            index--;
          }
          // else if(parentId == undefined && parent != undefined){
          // 剩下来的都是最底层的
          // }
        }

        // menusAll 剩下的全是最底层
        // 第二遍循环 将最底层 代入上层多层级结构结构中
        for (var index = 0; index < menusMore.length; index++) {
          var demo = menusMore[index]
          for (var i = 0; i < menusAll.length; i++) {
            var model = menusMore[i];
            if (demo.parent == model.parentId) {
              demo.children.push(model);
              menusAll.splice(i, 1);
              i;
              break;
            }
          }
        }

        // menusMore 已经被 底层数据填充完毕
        // 第三遍循环，将被填充好的 多层结构 填入 根结构中
        for (var index = 0; index < menuBase.length; index++) {
          var demo = menuBase[index];
          for (var i = 0; i < menusMore.length; i++) {
            var model = menusMore[i]
            if (model.parentId == demo.parent) {
              demo.children.push(model);
              menusMore.splice(index, 1);
              i--;
            }
          }
        }

        //// menuBese 已经被 多层结构填充完毕
        // 最后循环，将单层结构 填入 根结构中
        for (var index = 0; index < menuBase.length; index++) {
          var demo = menuBase[index];
          for (var i = 0; i < menusAll.length; i++) {
            var model = menusAll[i]
            if (model.parent == demo.parentId) {
              demo.children.push(model);
              menusAll.splice(i, 1);
              i--;
            }
          }
        }



        //排序
        function listSort(arr) {
          for (var i = 0; i < arr.length - 1; i++) {
            // 内层循环,控制比较的次数，并且判断两个数的大小
            for (var j = 0; j < arr.length - 1 - i; j++) {
              // 白话解释：如果前面的数大，放到后面(当然是从小到大的冒泡排序)
              if (arr[j].order > arr[j + 1].order) {
                var temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
              }
            }
          }
        }

        function deepMenusSort(menus) {
          for (var index = 0; index < menus.length; index++) {
            var demo = menus[index]

            if (demo.children != undefined && demo.children != null && demo.children.length != 0) {
              deepMenusSort(demo.children)
            }
          }
          listSort(menus);
        }

        deepMenusSort(menuBase)
        that.menus = menuBase

        // that.menus = menuBase

      },
      deepNode: function(list) {
        var that = this;
        var result = [];

        var totalIndex = 1;
        function deep(list) {
          for (var i in list) {
            var node = list[i];
            //如果不是menu，跳过
            var demo = null;
            //是否有子级
            if (node.children != undefined && node.children != null && node.children.length != 0) {
              deep(node.children);
            }

            if (node.meta != undefined && node.meta.menu != undefined && node.meta.menu == true) {
              var parentId = node.meta.parentId;
              var parent = node.meta.parent;
              // 如果是父级、多层级、单层 结构
              //	根父级 parentId != undefined && parent == undefined
              //  多层 parentId != undefined && parent != undefined
              //  单层 、	| 根单层	最高层 parentId == undefined && parent == undefined
              //        	|      	最底层 parentId == undefined && parent != undefined
              if(node.meta.fullPath == undefined){
                node.meta.fullPath = (totalIndex - 1) + "-" + totalIndex
                totalIndex ++;
              }

              if (parentId != undefined && parent == undefined) {
                demo = {
                  name: node.meta.title,
                  path: node.meta.fullPath,
                  icon: node.meta.icon,
                  parentId: node.meta.parentId,
                  children: [],
                  order: node.meta.order == undefined ? 99 : node.meta.order
                }
              } else if (parentId != undefined && parent != undefined) {
                demo = {
                  name: node.meta.title,
                  path: node.path,
                  icon: node.meta.icon,
                  parent: node.meta.parent,
                  parentId: node.meta.parentId,
                  children: [],
                  order: node.meta.order == undefined ? 99 : node.meta.order
                }
              } else if (parentId == undefined && parent == undefined) {
                demo = {
                  name: node.meta.title,
                  path: node.meta.fullPath,
                  icon: node.meta.icon,
                  order: node.meta.order == undefined ? 99 : node.meta.order
                }
              } else if (parentId == undefined && parent != undefined) {
                demo = {
                  name: node.meta.title,
                  path: node.meta.fullPath,
                  icon: node.meta.icon,
                  parent: node.meta.parent,
                  order: node.meta.order == undefined ? 99 : node.meta.order
                }
              }

              result.push(demo);
            }
          }
        }

        deep(list);
        return result;
      },

      //动画切换
      animation: function(devices, leftShow) {
        var that = this;
        //获取设备
        // var devices = that.devices

        //判断 当时是否为 PC样式
        if (devices == 'PC') {
          // PC 展开
          if (!leftShow) {
            that.baseClasses = ['show']
          } else {
            that.baseClasses = ['hiden']
          }


        } else if (devices == 'MOBILE' || devices == 'PHONE' || devices == 'PAD') {

          //判断 当时是否为 移动样式
          if (!leftShow) {
            that.baseClasses = ['mobile', 'show']
          } else {
            that.baseClasses = ['mobile', 'hiden']
          }

        }

      }
    }
  }
</script>

<style scoped="scoped">
  #baseDiv {
    width: 210px;
    position: fixed;

    height: 100%;
    -webkit-transition-duration: .3s;
    transition-duration: .3s;

    z-index: 500;

    display: flex;
    flex-direction: row;

    z-index: 501;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 210px;
    max-height: 100%;
    height: 100%;
  }

  .el-menu-vertical-demo {
    max-height: 100%;
    height: 100%;
    border-right: none;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.2);
  }



  /* 左侧 LOG */
  .leftNavLog {
    height: 50px;
    display: flex;
    /* justify-content: center; */
    align-items: center;
	background: rgba(67,142,185,1);
  }

  .leftNavLog>div.show {
    width: 120px;
    height: 36px;
    margin-left: 35px;
  }

  .leftNavLog>div.hide {
    width: 30px;
    height: 30px;
    margin-left: auto;
    margin-right: auto;
  }

  /* PC */
  #baseDiv.hiden {
    width: 54px !important;
    transition-duration: 0.1s;
  }

  #baseDiv.hiden .el-menu {
    width: 54px !important;
    animation: elmenuHiden 0.3s forwards;
  }

  @keyframes elmenuHiden {
    from {
      width: 210px;
    }

    to {
      width: 54px;
    }
  }

  #baseDiv.show {
    width: 210px !important;
  }

  #baseDiv.show .el-menu {
    animation: elmenuShow 0.3s forwards;
  }

  @keyframes elmenuShow {
    from {
      width: 54px;
    }

    to {
      width: 210px;
    }
  }

  /* 移动端 */
  #baseDiv.mobile {
    height: 100%;
    width: 210px;

    position: fixed;
    left: 0;
    top: 0;

    -webkit-transition-duration: .3s;
    transition-duration: .3s;
    /* -webkit-transform: translate3d(-210px, 0, 0); */
    /* transform: translate3d(-210px, 0, 0); */
  }

  #baseDiv.show.mobile {
    width: 100% !important;
    z-index: 501;
  }

  #baseDiv.hiden.mobile {
    -webkit-transform: translate3d(-210px, 0, 0);
    transform: translate3d(-210px, 0, 0);
    transition-duration: .8s;
  }

  #baseDiv.show.mobile .el-menu {
    position: fixed;
    z-index: 401;
    border-right: none;
  }

  #baseDiv.show.widthLock {
    width: 54px;
    overflow: hidden;
  }

  .moblie-back {
    position: fixed;
    left: 0px;
    top: 0;

    width: calc(100vw + 210px);
    height: 100vh;



    z-index: 400;

    animation: moblieBack .3s forwards;
  }

  @keyframes moblieBack {
    from {
      background: rgba(0, 0, 0, 0.0);
    }

    to {
      background: rgba(0, 0, 0, 0.2);
    }
  }


  /* element 原生样式覆盖 */
  /* 收起的样式 */
  .el-menu--collapse {
    width: 54px;
  }

  /* 	.el-submenu__title i {
		margin-right: 15px;
	} */
</style>
