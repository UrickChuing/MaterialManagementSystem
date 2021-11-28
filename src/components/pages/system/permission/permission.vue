<template>
	<div>
		<div class="reason-line">
			<div class="reason-input">
				<span>
					权限模块
				</span>
				<el-input></el-input>
			</div>
		</div>


		<table cellspacing="0">
			<tr>
				<th>
					序号
				</th>
				<th>
					页面
				</th>
				<th>
					名称
				</th>
				<th>
					接口
				</th>
				<th>
					启用
				</th>
			</tr>

			<tbody class="public-scroll-y table-datas" v-if="table.list.length != 0">
				<tr v-for="(permission,index) in table.list">
					<td>
						{{index+1}}
					</td>
					<td>
						{{permission.page}}
					</td>
					<td>
						{{permission.name}}
					</td>
					<td>
						{{permission.apiUri}}
					</td>
					<td>
						<el-switch v-model="permission.status" @change="statusOpen(permission.id,permission.status)" active-color="#13ce66"
						 inactive-color="grey">
						</el-switch>
					</td>
				</tr>
			</tbody>

			<tbody v-if="inAdd">
				<tr>
					<td>

					</td>
					<td>
						<el-input v-model="bean.page" size="mini"></el-input>
					</td>
					<td>
						<el-input v-model="bean.name" size="mini"></el-input>
					</td>
					<td>
						<el-input v-model="bean.apiUri" size="mini"></el-input>
					</td>
					<td>
						<el-button @click="add" type="success" size="mini">添加</el-button>
						<el-button type="warning" size="mini" @click="inAdd = false;">取消</el-button>
					</td>
				</tr>
			</tbody>


		</table>

		<div class="add pointer youCanNotChoose" @click="inAdd = true;">
			<i class="el-icon-plus"></i>添加权限
		</div>




	</div>

</template>

<script>
	export default {
		name: 'quanxianguanli',
		data() {
			return {


				reason: {
					name: '',
				},

				table: {
					list: []
				},


				inAdd: false,

				bean: {
					name: '',
					page: '',
					apiUri: '',
					status: 1
				}

			}
		},
		created: function() {

			this.initTableList();
		},
		methods: {

			initTableList: function() {
				var that = this;
				var axios = that.axios;
				that.table.inSelect = true;
				axios({
					method: 'post',
					url: '/permission/list',
					data: {
						reason: that.reason
					},
					df: false
				}).then((response) => {
					that.table.inSelect = false;
					var data = response.data;

					that.table.list = data.data;
				}).catch((error) => {that.errorhanding(error)})

			},

			add: function() {
				var that = this;
				var axios = that.axios;

				axios({
					method: 'post',
					url: '/permission/add',
					data: that.bean,
					df: false
				}).then((response) => {
					var data = response.data;

					if (data.code == -1) {
						that.$notify({
							type: 'error',
							title: '添加失败'
						})
						return;
					}
					that.bean = {
						name: '',
						page: '',
						apiUri: '',
						status: 1
					}

				}).catch((error) => {that.errorhanding(error)})
			},


			statusOpen: function(id, status) {
				var that = this;
				var axios = that.axios;
				
				that.LOADING
				axios({
					method: 'post',
					url: '/permission/update',
					data: {
						id: id,
						status: status
					},
					df: false
				}).then((response) => {

					setTimeout(function() {
						
						var data = response.data;

						if (data.code == -1) {
							that.$notify({
								type: 'error',
								title: '添加失败'
							})
							return;
						}
						that.bean = {
							name: '',
							page: '',
							apiUri: '',
							status: 1
						}

					}, 300);
				}).catch((error) => {that.errorhanding(error)})
			},

		}
	}
</script>

<style scoped="scoped">
	.add {
		height: 60px;
		background: rgba(245, 245, 245, 1);
		line-height: 60px;
		text-align: center;
		font-size: 18px;
		border-radius: 5px;
		transition: .2s;
	}

	.add:hover {
		color: white;
		background: rgba(0, 0, 0, 0.3);
	}

	.table-datas {
		height: 500px;
	}

	table {
		margin-top: 20px;
		width: 100%;
	}

	th {
		min-width: 150px;
		border-top: solid 1px #EBEEF5;
		border-bottom: solid 1px #EBEEF5;
		padding: 12px 0px;
		color: #909399;
		font-size: 14px;
	}

	td {
		border-top: solid 1px #EBEEF5;
		border-bottom: solid 1px #EBEEF5;
		padding: 12px 10px;
		text-align: center;
	}
</style>
