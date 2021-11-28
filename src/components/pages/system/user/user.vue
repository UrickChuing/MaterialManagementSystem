<template>
	<div @keydown.enter="initTableList">

		<div class="reason-line">

			<div class="reason-input">
				<span>名称</span>
				<el-input v-model="reason.name" clearable></el-input>
			</div>

			<el-button @click="table.page = 1;initTableList()" icon="el-icon-search" type="primary" class="reason-button">搜索</el-button>

		</div>

		<div class="public-table-header">
			<el-button @click="add()" type="primary" size="mini">新增用户</el-button>
			<el-button @click="otherPage.status.fastAdd = true" type="primary" size="mini">快速创建用户</el-button>

			<div class="right red" v-if="table.inSelect">
				<i class="el-icon-loading"></i>
				请稍等，正在查询。。。
			</div>
		</div>
		<el-table :data="table.list" style="width: 100%" cell-class-name="public-table-cell">
			<el-table-column label="序号" type="index" align="center" min-width="48">
				<template slot-scope="scope">
					<span>{{(table.page - 1) * table.pageSize + scope.$index + 1}}</span>
				</template>
			</el-table-column>
			<el-table-column label="账号" prop="account" align="center" min-width="180">
			</el-table-column>
			<el-table-column label="用户名" prop="name" align="center" min-width="180">
			</el-table-column>
			<el-table-column label="创建时间" prop="createTime" align="center" min-width="180">
				<template slot-scope="scope">
					{{ getCreateDateStr(new Date(scope.row.createTime)) }}
				</template>
			</el-table-column>
			<el-table-column label="启用" prop="status" align="center" min-width="50">
				<template slot-scope="scope">
					<el-switch @change="($event)=>{updateStatus(scope.row.id,$event)}"
					  v-model="scope.row.status"
					  active-color="#13ce66"
					  inactive-color="grey">
					</el-switch>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="180">
				<template slot-scope="scope">
					<el-button @click="edit(scope.row)" type="warning" size="mini">编辑</el-button>
					<!-- 未提交 -->
					<!-- <el-button @click="submit(scope.row)" type="success" size="mini" >提交</el-button> -->
					<el-button @click="deleteUser(scope.row.id)" type="danger" size="mini">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="flexCenter margin-top10">
			<el-pagination @size-change="(val)=>{table.pageSize=val;initTableList()}" @current-change="(val)=>{table.page=val;initTableList()}"
			 :current-page="table.page" :page-sizes="[10, 20, 30, 40 , 50]" :page-size="table.pageSize" layout="total, sizes, prev, pager, next, jumper"
			 :total="table.total">
			</el-pagination>
		</div>

		<pop-bg ref="userDetails">
			<user-details></user-details>
		</pop-bg>

		<el-dialog title="快速创建用户:【输入用户名】" :visible.sync="otherPage.status.fastAdd" :modal-append-to-body="false">

			<div class="flexRow">
				<el-input v-model="otherPage.data.fastAdd.name" maxlength="64"></el-input>
				<el-button @click="fastAddUser" type="success">确认创建</el-button>
			</div>

		</el-dialog>

	</div>
</template>

<script>
	import userDetails from './details.vue'
	import popBg from '../../../util/contentPop/index.vue'

	export default {
		name: 'yonghuguanli',
		components: {
			popBg,
			userDetails
		},
		data() {
			return {


				otherPage: {
					PAGE: 'INDEX',
					pages: ['INDEX', 'DETAILS', 'FASTADD'],
					status: {
						details: this.STATUS.ADD, //  ['ADD','UPDATE','FINISH']
						fastAdd: false
					},
					data: {
						details: {
							id: ''
						},
						fastAdd: {
							name: ''
						}
					}
				},


				reason: {
					name: ''
				},

				table: {
					list: [],
					page: 1,
					pageSize: 10,
					total: 0
				}


			}
		},
		beforeRouteEnter: function(to, from, next) {
			next((that) => {
				that.initTableList();
			})
		},
		created: function() {
			var that = this;

			that.initTableList();
		},
		methods: {
			initTableList: function() {
				var that = this;
				var axios = that.axios;
				that.table.inSelect = true;
				axios({
					method: 'post',
					url: '/user/list',
					data: {
						page: that.table.page,
						pageSize: that.table.pageSize,
						reason: that.reason
					},
					df: false
				}).then((response) => {
					if(!response){
						return;
					}
					that.table.inSelect = false;
					var data = response.data;

					that.table.list = data.data;
					that.table.total = data.total;
				}).catch((error) => {
					that.errorhanding(error)
				})
			},


			add: function() {
				var that = this;
				that.otherPage.status.details = that.STATUS.ADD
				this.$refs.userDetails.show()
			},

			fastAddUser: function() {
				var that = this;
				var axios = that.axios;

        var name = that.otherPage.data.fastAdd.name;

        if(name == undefined || name == ''){
          that.notics.warning('请输入用户名');
          return;
        }

				axios({
					method: 'post',
					url: '/user/fastAdd',
					data: {
						name: name
					}
				}).then((response) => {
					if (!response) {
						return;
					}

					var data = response.data;
					if (data.code == that.STATUS.FAIL) {
						that.$notify({
							title: '生成失败',
							message: '<div>原因：<br>1. 用户名<span class="red">拼音过长</span><span class="blue">(根据用户名生成账号，最大32位)</span> <br>2.自动生成的账号<span class="red">重复</span><span class="blue">(在用户名后追加数字或其他字符)</span></div>',
							type: 'error',
							duration: 25000,
							dangerouslyUseHTMLString: true
						});
					} else {
						that.$notify({
							title: '创建成功',
							message: '<div>用户名：' + that.otherPage.data.fastAdd.name + '<br>账号：<span class="blue">' + data.data +
								'</span> <br>密码：<span class="blue">123456</span><br>操作密码：<span class="blue">123456</span></div>',
							type: 'success',
							duration: 30000,
							dangerouslyUseHTMLString: true
						});
						that.reason.name = that.otherPage.data.fastAdd.name
						that.otherPage.data.fastAdd.name = ''
						that.otherPage.status.fastAdd = false;
						that.initTableList();
					}


				}).catch((error) => {
					that.errorhanding(error)
				})
			},

			commit: function(id) {
				var that = this;
				var axios = that.axios;

				axios({
					method: 'post',
					url: '/supplier/commit',
					data: {
						id: id
					},
					df: false
				}).then((response) => {
					var data = response.data;

					that.table.list = data.data;
					that.table.total = data.total;
				}).catch((error) => {
					that.errorhanding(error)
				})
			},

			edit: function(row) {
				var that = this;
				that.otherPage.status.details = that.STATUS.UPDATE;
				that.otherPage.data.details.id = row.id;
				that.$refs.userDetails.show();
			},

			deleteUser: function(id) {
				var that = this;
				var axios = that.axios;

				that.$confirm('确定删除用户？','提示')
					.then(_ => {
						axios({
							method: 'post',
							url: '/user/delete',
							data: {
								id: id
							},
							df: false
						}).then((response) => {
							if (!response) {
								return;
							}
							var data = response.data;
							if (data.code == that.STATUS.SUCCESS) {
								that.deleteSuccess(true);
								that.initTableList();
							} else {
								that.deleteSuccess(false)
							}
						}).catch((error) => {
							that.errorhanding(error)
						})
						done();
					})
					.catch(_ => {});
			},

			updateStatus:function(id,status){
				var that = this;
				var axios = that.axios;

				axios({
					method: 'post',
					url: '/user/update',
					data: {
						user: {
							id:id,
							status:status
						}
					},
					df:false
				}).then((response) => {
					if (!response) {
						return;
					}
					var data =response.data;
					if(data.code == that.STATUS.SUCCESS){
						that.updateSuccess(true)
						that.initTableList();
					}
				}).catch((error) => {
					that.errorhanding(error)
				})

			}


		}
	}
</script>

<style scoped="scoped">
</style>
