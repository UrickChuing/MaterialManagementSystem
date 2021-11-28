<template>
	<div id="container" :class="baseClasses">
		<!-- <button @click="$parent.logged = !$parent.logged">back</button> -->
		<nav-left v-bind:devices="parentApp.devices" v-bind:color="settingData.navLeftColor" v-bind:leftTopLog="settingData.navLeftLogoColor"
     v-bind:leftShow="leftShow" @showChange="leftNavShowHideChange">
		</nav-left>

		<div :style="rightPart">
			<nav-top ref="navTop" v-bind:colors='settingData.navTopColor' v-bind:breadcrumbs='breadcrumbs' v-bind:devices="parentApp.devices"
			 v-bind:leftShow="leftShow" @navShow="leftNavShowHide"></nav-top>

			<!-- {{cachePage}} -->
			<div id="contenBody" :class="settingData.pageContent.classes" :style="settingData.pageContent.style">

				<transition name="routerAn">
					<!-- <keep-alive> -->
					<!--使用keep-alive会将页面缓存-->
					<!-- <router-view v-if="$route.meta.keepAlive" class="router-view-base"></router-view> -->
					<!-- </keep-alive> -->
					<!-- <router-view v-if="$route.meta.keepAlive == undefined || $route.meta.keepAlive == null" class="router-view-base"></router-view> -->
					<keep-alive :include="cachePage">
						<router-view class="router-view-base" v-if="!refresh"></router-view>
					</keep-alive>
				</transition>
				<div class="banquan">
					© {{new Date().getFullYear()}}南海邮轮 网站备案/许可证号：琼ICP备19005038号-1 技术支持：<a href="http://www.vonechina.com/" rel="nofollow" target="_blank">泛网科技</a>
				</div>
			</div>

		</div>

		<setting v-bind:settingData='settingData'></setting>


	</div>
</template>

<script>
	import navLeft from './nav/navLeft.vue'
	import navTop from './nav/navTop.vue'
	import setting from './nav/setting.vue'

	export default {
		components: {
			navLeft,
			navTop,
			setting
		},
		props: ['devices', 'screenWidth'],
		data() {

			var navLeftColor = {}
			var navTopColor = {}
      var navLeftLogoColor = {}
			try {
				navTopColor = JSON.parse(localStorage.getItem('navTopColor'))
				navLeftColor = JSON.parse(localStorage.getItem('navLeftColor'))
        navLeftLogoColor = JSON.parse(localStorage.getItem('navLeftLogoColor'))
				if (navTopColor == null) {
					throw '';
				}
				if (navLeftColor == null) {
					throw '';
				}
        if (navLeftLogoColor == null) {
        	throw '';
        }
			} catch (e) {
				navLeftColor = {
					// 背景色
					backgroundColor: "rgba(255,255,255,1)",
					// 字体颜色
					textColor: "rgba(0, 0, 0, 1.0)",
					// 被激活菜单的字体色
					activeTextColor: "rgb(64, 158, 255)"
				}
				navTopColor = {
					head: {
						backgroundColor: 'rgba(67,142,185,1)',
						color: 'rgba(255,255,255,1)',
					},
					page: {
						backgroundColor: 'rgba(00,00,00,0.15)',
						color: 'rgba(255,255,255,1)',
					}
				}
        navLeftLogoColor = {
          backgroundColor: 'rgba(67,142,185,1)'
        }
			}

			return {
				baseClasses: ['leftHide'],

				//左侧菜单的 是否展示
				leftShow: true,
				// 延迟缓冲  左侧菜单
				leftNavSetTimeOut: null,

				//最父级  可动态获取屏幕宽
				parentApp: this.$parent,

				//右侧 顶部菜单及内容 的 样式
				rightPart: {
					marginLeft: '210px',
					width: '100%',
					transition: '0.3s'
				},

				//顶部菜单的 面包屑
				breadcrumbs: [{
					name: 'qwe'
				}, {
					name: 'asd'
				}, {
					name: 'zxc'
				}],

				//设置参数
				settingData: {
					show: false,
					cache: false,
					//左侧菜单的 颜色
					navLeftColor: navLeftColor,
          //左侧菜单LOGO的颜色
          navLeftLogoColor: navLeftLogoColor,
					//顶部栏
					navTopColor: navTopColor,

					//page 内容的基础样式
					pageContent: {
						innerScroll: true,
						style: {},
						classes: ['page-part', 'public-scroll-y']
					}
				},

				//router-view 动画
				// transitionName: 'slide-left'
				cachePage: [],

				//刷新
				refresh: false

			}
		},
		watch: {
			refresh: function(newV) {

				if (newV) {
					var that = this;
					var routeName = that.$route.meta.name;
					var page = that.cachePage.indexOf(routeName);
					if (page != -1) {
						that.cachePage.splice(page, 1);
					}
					setTimeout(function() {
						if (page != -1) {
							that.cachePage.push(routeName)
						}
						that.refresh = false;
					}, 200)
				}
			},
			leftShow: function(newV) {
				this.forceChange(this.devices, newV)
				this.baseClasses = newV == false ? ['leftShow'] : ['leftHide']
			},
			devices: function(newV) {
				this.forceChange(newV, this.leftShow)
			},
			// '$route': function(to, from) {
			// 	const toDepth = to.path.split('/').length;
			// 	const fromDepth = from.path.split('/').length;
			// 	this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
			// }
			'settingData.pageContent.innerScroll': {
				handler: function(newV) {
					if (newV)
						this.settingData.pageContent.classes = ['page-part', 'public-scroll-y']
					else
						this.settingData.pageContent.classes = ['page-part', 'out-scroll']
				},
				deep: true
			},
			'settingData.navLeftColor': {
				handler: function(newV) {
					localStorage.setItem('navLeftColor', JSON.stringify(newV))
				},
				deep: true
			},
			'settingData.navTopColor': {
				handler: function(newV) {
					localStorage.setItem('navTopColor', JSON.stringify(newV))
				},
				deep: true
			},
      'settingData.navLeftLogoColor': {
      	handler: function(newV) {
      		localStorage.setItem('navLeftLogoColor', JSON.stringify(newV))
      	},
      	deep: true
      },
		},
		created: function() {
			var that = this;
			var userInfo = sessionStorage.userInfo;
			if (userInfo == null || userInfo == undefined) {
				that.$router.push('/login')
			}


			that.forceChange(that.devices, that.leftShow);

		},
		methods: {
			leftNavShowHide: function() {
				this.leftShow = !this.leftShow
			},
			leftNavShowHideChange: function(show) {
				var that = this;
				that.leftShow = show;

			},
			forceChange: function(devices, leftShow) {
				var that = this;
				if (devices == 'MOBILE' || devices == 'PHONE' || devices == 'PAD') {
					that.rightPart.transition = '0s'
					that.rightPart.marginLeft = '0px'
					that.rightPart.width = '100%'
				} else {
					if (leftShow && devices == 'PC') {
						that.rightPart.transition = '0.1s'
						that.rightPart.marginLeft = '54px'
						that.rightPart.width = 'calc(100% - 54px)'
					} else if (leftShow) {
						that.rightPart.transition = '0.4s'
						that.rightPart.marginLeft = '54px'
						that.rightPart.width = 'calc(100% - 54px)'
					} else {
						that.rightPart.transition = '0.4s'
						that.rightPart.marginLeft = '210px'
						that.rightPart.width = 'calc(100% - 210px)'
					}
				}
			},



			deleteTabByIndex:function(tabIndex){
				this.$refs.navTop.$refs.navTabs.tabDeleteByIndex(tabIndex);
			}

		}
	}
</script>

<style scoped="scoped">
	.banquan {
		background: rgba(230, 245, 245, 1);
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: 5;
		text-align: center;
		font-size: 13px;
		line-height: 30px;
		height: 30px;
	}

	.page-part.out-scroll {
		position: relative;
		/* padding: 20px; */
		/* background: rgb(240, 242, 245); */
		min-height: calc(100% - 82px);
	}

	.page-part.public-scroll-y {
		/* position: relative; */
		/* padding: 20px; */
		height: calc(100% - 82px);
	}

	.page-part {
		z-index: 2;
	}

	#container {
		display: flex;
		flex-direction: row;

		height: 100%;
		width: 100%;

	}

	.routerAn-enter-active {
		transition: routerEnter 10s;
		opacity: 0;
		-webkit-transform: translate(-60px, 0);
		transform: translate(-60px, 0);
	}

	.routerAn-leave-active {
		opacity: 0;
		-webkit-transform: translate(60px, 0);
		transform: translate(60px, 0);
	}


	.router-view-base {
		transition: all .3s cubic-bezier(.55, 0, .1, 1);

		padding: 20px 20px 0px 20px;
	}
</style>

<style>
	.page-part>div:first-child {
		margin: 0px 0px 50px 0px !important;
	}

	.left-menu .el-menu-item:hover {
		background: rgba(00, 00, 00, 0.2) !important;
	}

	.left-menu .el-submenu .el-menu {
		background: none !important;
	}

	.left-menu .el-menu-item {
		background: none !important;
	}

	/* 覆盖 左侧菜单 */
	.left-menu>.el-submenu>.el-submenu__title {
		background: none !important;
		padding: 0px 15px !important;
	}

	.left-menu>.el-menu-item {
		padding: 0px 15px !important;
	}

	.left-menu>.el-menu-item>.el-tooltip {
		padding: 0px 15px !important;
	}
</style>
