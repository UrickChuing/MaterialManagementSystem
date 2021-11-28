<template>

  <div class="tabs" :style="colors">
    <button :style="{color:colors.color}" class="pointer" @click="tabsMoving(0)"><i class="el-icon-arrow-left"></i></button>
    <div id="tabs" class="public-scroll-x-hide">
      <template v-for="tab in tabs.list">
        <div :id="tab.titleLang" class="tab on" v-if="tabs.tab == tab.id">
          {{$t(tab.titleLang)}}{{tab.suffix != undefined && tab.suffix != '' ? ' | '+tab.suffix:''}}<i @click.stop="tabDelete(tab)" class="el-icon-close"
            v-if="tab.canClosed"></i>
        </div>
        <div :id="tab.titleLang" @click="tabChange(tab)" class="tab" v-else>
          {{$t(tab.titleLang)}}{{tab.suffix != undefined && tab.suffix != '' ? ' | '+tab.suffix:''}}<i @click.stop="tabDelete(tab)" class="el-icon-close"
            v-if="tab.canClosed"></i>
        </div>
      </template>

    </div>
    <button :style="{color:colors.color}" class="pointer" @click="tabsMoving(1)"><i class="el-icon-arrow-right"></i></button>
  </div>

</template>

<script>
  export default {
    props: ['colors'],
    data() {
      return {
        tabs: {
          tab: 'zhuye',
          list: []
        },

        //分页背景色
        midColor: {
          backgroundColor: this.$parent.$parent.settingData.navTopColor.midColor,
        },

        //动画 ID
        anId: null
      }
    },
    watch: {
      '$route': function(newV) {
        this.tabCreate(newV);
      },
      'tabs.list': {
        handler: function(newV) {
          var that = this;
          var cachePages = []
          for (var index in newV) {
            var tab = newV[index];
            if (tab.keepAlive) {
              cachePages.push(tab.name)
            }

          }
          this.$parent.$parent.cachePage = cachePages;

        },
        deep: true
      }
    },
    created: function() {
      var that = this;

      var tabs = null;

      //获取缓存数据
      try {
        tabs = JSON.parse(sessionStorage.getItem('tabs'));
        if (tabs != null && (tabs.list != null || tabs.list != undefined))
          that.tabs = tabs;
      } catch (e) {

      }

      that.tabCreate(that.$route);

      return;


      var tabNotExit = true;
      for (var index in that.tabs.list) {
        var tab = that.tabs.list[index];
        if (that.tabs.tab == tab.id) {
          tabNotExit = false;
          break;
        }
      }

      if (tabNotExit) {
        var newV = that.$route

        if (newV.meta.menu) {
          var tab = {
            path: newV.path,
            title: that.$t(newV.meta.title),
            titleLang: newV.meta.title,
            icon: newV.meta.icon,
            canClosed: true,
            name: newV.meta.name
          }
          that.tabs.list.push(tab);
          that.$nextTick(function() {
            that.tabClick(tab)
          });


        }
      }
    },
    methods: {

      tabCreate:function(newV){
        var that = this;
        var tabs = that.tabs.list;
        //当前完整path (包含组件本身path 和 参数)
        // var path = newV.fullPath;
        var fullPath = newV.fullPath;
        //组件本身的path
        // var routerPath = newV.path;
        var path = newV.meta.fullPath;

        //即将进入的tab标签
        var toTab = null;
        //组件重复的数量 (path相同的)
        var path_repetitions = 0;
        //完整path重复的数量(fullPath 相同的)
        var fullPath_repetitions = 0;

        tabs.forEach(tab => {

          if (tab.path == path)
            path_repetitions = path_repetitions + 1;

          if (tab.fullPath == fullPath)
            fullPath_repetitions = fullPath_repetitions + 1;

        });

        var suffix = newV.query.suffix;
        if (suffix != undefined) {
          suffix = atob(suffix);
          suffix = decodeURI(suffix)
        } else {
          suffix = ''
        }

        var tabDemo = {
          id: newV.meta.parentId,
          path: newV.meta.fullPath,
          fullPath: newV.fullPath,
          title: this.$t(newV.meta.title),
          titleLang: newV.meta.title,
          icon: newV.meta.title.icon,
          canClosed: true,
          name: newV.meta.name,
          prefix: '',
          suffix: suffix,
          keepAlive: newV.meta.keepAlive
        }

        if(path == '/home'){
          tabDemo.canClosed = false;
        }

        //如果是被允许加载多个 tab 占位
        if (newV.meta.more) {

          //如果组件重复，新增tab占位
          if(path_repetitions != 0){
            tabDemo.id = fullPath;

            that.tabs.list.push(tabDemo);
            that.$nextTick(function() {
              that.tabClick(tabDemo);
            });
          }else{
            that.tabClick(tabDemo);
          }



        } else {

          //组件不重复
          if (path_repetitions == 0) {
            that.tabs.list.push(tabDemo);
            that.$nextTick(function() {
              that.tabClick(tabDemo);
            });

          } else {
            //组件重复了，则跳转值重复组件
            that.tabClick(tabDemo);
          }


        }
      },

      tabChange: function(tabInfo) {
        this.$router.push(tabInfo.path);
      },
      //tab 点开
      tabClick: function(tabInfo) {
        var that = this;
        this.tabs.tab = tabInfo.id
        // this.$router.push(tabInfo.path);
        // console.log('name',this)

        var tabsInfo = document.getElementById('tabs');
        var tab = document.getElementById('inputceshi');
        tab = document.getElementById(tabInfo.titleLang);

        //取出当前scroll 所展示的区间
        // 结束位置
        var starPoint = tabsInfo.scrollLeft;
        // 开始位置
        var endPoint = starPoint + tabs.offsetWidth;

        // 被点击的子元素的位置区间
        var tabStartPoint = tab.offsetLeft - 24;
        var tabEndPoint = tabStartPoint + tab.offsetWidth;

        var fn = null;
        var target = 0;



        //    +~~~~~~~~~~~~~~~~展示的区间~~~~~~~~~~~~~~~~+
        //	  |      +~~tab~~~+                         |
        //  --+------+--------+-------------------------+----
        //当前 tab 在区间内  ，  无需处理
        if ((starPoint <= tabStartPoint && tabStartPoint <= endPoint) && (starPoint <= tabEndPoint && tabEndPoint <=
            endPoint)) {

          //什么都不做


          //       +~~~~~~~~~~~~~~~~展示的区间~~~~~~~~~+
          //	  +~~tab~~+                             |
          //  --+--+----+-----------------------------+----
          //当前 tab 在区间 左侧
        } else if (tabStartPoint < starPoint && tabEndPoint >= starPoint) {


          var maxScrollLeft = tabsInfo.scrollWidth - tabsInfo.offsetWidth;

          //方案一:  用上一个兄弟重定位
          // var sibling = tab.previousElementSibling
          // target = (sibling.offsetLeft - 14) + sibling.offsetWidth;
          //方案二:  用自己重定位
          target = tab.offsetLeft - 24;

          fn = function() {
            tabsInfo.scrollLeft = tabsInfo.scrollLeft - 20
            if (tabsInfo.scrollLeft <= target) {
              tabsInfo.scrollLeft = target;
              that.anId = null;
              return;
            }
            requestAnimationFrame(fn);
          }


          //       +~~~~~~~~展示的区间~~~~~~~+
          //	     |                    +~~tab~~+
          //  -----+--------------------+---+---+--
          //当前 tab 在区间 右侧
        } else if (tabStartPoint <= endPoint && tabEndPoint > endPoint) {

          target = (tabsInfo.scrollLeft - 24) + ((tab.offsetLeft + tab.offsetWidth) - endPoint);

          fn = function() {
            tabsInfo.scrollLeft = tabsInfo.scrollLeft + 20
            if (tabsInfo.scrollLeft >= target || tabsInfo.scrollLeft >= maxScrollLeft) {
              tabsInfo.scrollLeft = target;
              that.anId = null;
              return;
            }
            requestAnimationFrame(fn);
          }

          //           +~~~~~~~~~~~~~~~~展示的区间~~~~~~~~~+
          //   +~~tab~~+                                  |
          //  -+-------+----------------------------------+----
          //当前 tab 在区间 最左侧
        } else if (tabStartPoint < starPoint && tabEndPoint <= starPoint) {
          var maxScrollLeft = tabsInfo.scrollWidth - tabsInfo.offsetWidth;

          //方案一:  用上一个兄弟重定位
          // var sibling = tab.previousElementSibling
          // target = (sibling.offsetLeft - 14) + sibling.offsetWidth;
          //方案二:  用自己重定位
          target = tab.offsetLeft - 24;

          fn = function() {
            tabsInfo.scrollLeft = tabsInfo.scrollLeft - 20
            if (tabsInfo.scrollLeft <= target) {
              tabsInfo.scrollLeft = target;
              that.anId = null;
              return;
            }
            requestAnimationFrame(fn);
          }


          //       +~~~~~~~~展示的区间~~~~~~~+
          //	     |                        +~~tab~~+
          //  -----+------------------------+---+---+--
          //当前 tab 在区间 右侧
        } else if (tabStartPoint >= endPoint && tabEndPoint > endPoint) {
          target = (tabsInfo.scrollLeft - 24) + ((tab.offsetLeft + tab.offsetWidth) - endPoint);

          fn = function() {
            tabsInfo.scrollLeft = tabsInfo.scrollLeft + 20
            if (tabsInfo.scrollLeft >= target || tabsInfo.scrollLeft >= maxScrollLeft) {
              tabsInfo.scrollLeft = target;
              that.anId = null;
              return;
            }
            requestAnimationFrame(fn);
          }
        }

        if (fn != null)
          that.anId = requestAnimationFrame(fn)

        sessionStorage.setItem('tabs', JSON.stringify(this.tabs));
      },

      //点击切换页数
      tabsMoving: function(direction) {
        var that = this;

        that.anId = null;

        //获取所有tab的爸爸
        var tabsInfo = document.getElementById('tabs');
        var scrollLeft = tabsInfo.scrollLeft;


        if (direction == 0 && scrollLeft == 0) {
          return;
        }



        var tabsWidth = tabsInfo.offsetWidth;
        var tabsWidthFull = tabsInfo.scrollWidth;
        // var page = Math.ceil(tabsWidthFull / tabsWidth);

        // var tabs = tabsInfo.children;

        var fn = null;
        //目标值
        var target = 0;
        if (direction == 1) {
          //最大滚动系数
          var maxScrollLeft = tabsInfo.scrollWidth - tabsWidth;

          target = scrollLeft + tabsWidth;

          fn = function() {
            tabsInfo.scrollLeft = tabsInfo.scrollLeft + 20
            if (tabsInfo.scrollLeft >= target || tabsInfo.scrollLeft >= maxScrollLeft) {
              tabsInfo.scrollLeft = target;
              that.anId = null;
              return;
            }
            requestAnimationFrame(fn);
          }
        } else {

          target = scrollLeft - tabsWidth <= 0 ? 0 : scrollLeft - tabsWidth;

          fn = function() {
            tabsInfo.scrollLeft = tabsInfo.scrollLeft - 20
            if (tabsInfo.scrollLeft <= target) {
              tabsInfo.scrollLeft = target;
              that.anId = null;
              return;
            }
            requestAnimationFrame(fn);
          }
        }

        that.anId = requestAnimationFrame(fn)
      },

      tabDelete: function(tab) {
        var that = this;

        var list = that.tabs.list;

        var beDelete = 0;
        for (var index in list) {
          var demo = list[index];
          if (demo === tab) {
            that.tabs.list.splice(index, 1);
            beDelete = index;
            break;
          }
        }

        this.$router.push(list[beDelete - 1].path)
        that.tabClick(list[beDelete - 1]);

      },


      tabDeleteByIndex: function(tabIndex) {
        var that = this;

        var list = that.tabs.list;

        var beDelete = 0;
        for (var index in list) {
          var demoIndex = list[index].index;
          if (demoIndex == tab.index) {
            that.tabs.list.splice(index, 1);
            beDelete = index;
            break;
          }
        }

        this.$router.push(list[beDelete - 1].path)
        that.tabClick(list[beDelete - 1]);

      },

      addNoPermission: function(title) {
        var that = this;

        var list = that.tabs.list;

        var beDelete = 0;
        for (var listIndex in list) {
          var demo = list[listIndex];
          if (demo.index === index) {
            that.tabs.list.splice(index, 1);
            beDelete = index;
            break;
          }
        }

        that.$router.push(list[beDelete - 1].path)
        that.tabClick(list[beDelete - 1]);
      },

      setRouteNameByTitle: function(title, name) {


        var isGet = false;

        var routes = this.$router.options.routes;

        function forEachRoute(list) {
          for (var index in list) {
            var route = list[index];
            if (route.children != undefined && route.children != null) {
              forEachRoute(route.children);
            }

            if (route.meta != undefined && route.meta.title != undefined) {
              if (title == route.meta.title && route.meta.name == undefined) {

                route.meta.name = name;
                isGet = true;
              }
            }

            if (isGet)
              break;
          }
        }

        forEachRoute(routes);

      }

    }
  }
</script>

<style scoped="scoped">
  .tabs {
    height: 30px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    display: flex;
    flex-direction: row;

    position: relative;
    z-index: 2;
  }

  .tabs>div {
    width: 100%;
    display: flex;
    flex-direction: row;
    /* overflow: hidden; */

    padding: 3px 0px 2px 0px;

    box-shadow: 0px 1px 1px 0px rgba(100, 100, 100, 0.2);
  }

  .tab {
    flex: none;
    border-radius: 3px;
    border: solid 1px rgba(0, 0, 0, 0.3);
    height: 23px;
    padding: 0 10px;

    background: rgba(255, 255, 255, 1);
    color: rgba(0, 0, 0, 0.65);

    -webkit-touch-callout: none;
    /* iOS Safari */

    -webkit-user-select: none;
    /* Chrome/Safari/Opera */

    -khtml-user-select: none;
    /* Konqueror */

    -moz-user-select: none;
    /* Firefox */

    -ms-user-select: none;
    /* Internet Explorer/Edge */

    user-select: none;

    cursor: pointer;

    font-size: 14px;

    line-height: 23px;

    transition: 0.3s;
  }

  .tab.on {
    background-color: #24C0F9;
    color: #fff;
    border-color: #24C0F9;
  }

  .tab:not(:first-child) {
    margin-left: 10px;
  }

  .tab:not(.on):hover {
    color: #409EFF;
    border: #409EFF solid 1px;
  }

  .tab>i {
    margin-left: 10px;
    font-size: 14px;
    height: 14px;
    width: 14px;
    transition: 0.15s;
  }

  .tab>i:hover {
    background: rgba(180, 188, 204, 1);
    border-radius: 50%;

    color: white;

    /* 		height: 16px;
		width: 16px;
		line-height:16px */
  }


  .tabs>button {
    font-size: 24px;
    line-height: 32px;
    box-shadow: 0px 1px 1px 0px rgba(100, 100, 100, 0.2);
  }

  .tabs>button:first-child {}

  .tabs>button:hover {
    color: #409EFF;
  }
</style>
