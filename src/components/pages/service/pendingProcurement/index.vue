<template>
	<div @keydown.enter="initTableList">

		<div class="input-line">

			<div class="input-block">
				<span>申请单号</span>
				<el-input v-model="reason.xxxx"></el-input>
			</div>

			<div class="input-block">
				<span>时间</span>
				<el-date-picker
				      v-model="reason.timeStar"
				      type="daterange"
				      range-separator="至"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期">
				    </el-date-picker>
			</div>

			<div class="input-block">
				<span>部门</span>
				<el-select v-model="reason.organizationId" placeholder="全部">
					<el-option v-for="(item,index) in options.organizations" :key="index" :label="item" :value="index">
					</el-option>
				</el-select>
			</div>

			<div class="input-block">
				<span>邮轮</span>
				<el-select v-model="reason.whereAbout" placeholder="全部">
					<el-option v-for="(item,index) in options.whereAbouts" :key="index" :label="item" :value="index">
					</el-option>
				</el-select>
			</div>

			<div class="input-block">
				<span>物料类型</span>
				<el-select v-model="reason.whereAbout" placeholder="全部">
					<el-option v-for="(item,index) in options.materialTypes" :key="index" :label="item" :value="index">
					</el-option>
				</el-select>
			</div>

			<el-button @click="table.page=1;initTableList()" icon="el-icon-search" type="primary" class="reason-button">搜索</el-button>

		</div>

		<div class="public-table-header">

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
			<el-table-column label="申请单号" prop="code" align="center" min-width="180">
			</el-table-column>
			<el-table-column label="物品编码" prop="materialCode" align="center" min-width="180">
			</el-table-column>
			<el-table-column label="数量" prop="number" align="center" min-width="80">
			</el-table-column>
			<el-table-column label="单位" prop="unit" align="center" min-width="80">
			</el-table-column>
			<el-table-column label="品牌" prop="brand" align="center" min-width="80">
			</el-table-column>
			<el-table-column label="物品类别" prop="materialCategroy" align="center" min-width="80">
			</el-table-column>
			<el-table-column label="物品类别" prop="materialType" align="center" min-width="100">
			</el-table-column>
			<el-table-column label="创建时间" prop="createTime" align="center" min-width="180">
				<template slot-scope="scope">
					{{ getCreateDateStr(new Date(scope.row.createTime)) }}
				</template>
			</el-table-column>
			<el-table-column label="申请人" prop="createUserName" align="center" min-width="100">
			</el-table-column>
			<el-table-column label="部门" prop="organizationName" align="center" min-width="100">
			</el-table-column>
			<el-table-column label="邮轮" prop="whereAbout" align="center" min-width="100">
			</el-table-column>
		</el-table>

		<div class="flexCenter margin-top10">
			<el-pagination @size-change="(val)=>{table.pageSize=val;initTableList()}" @current-change="(val)=>{table.page=val;initTableList()}"
			 :current-page="table.page" :page-sizes="[10, 20, 30, 40 , 50]" :page-size="table.pageSize" layout="total, sizes, prev, pager, next, jumper"
			 :total="table.total">
			</el-pagination>
		</div>


	</div>
</template>

<script>
	export default {
		name:'daicaigouwuzi',
		data() {
			return {


				otherPage: {
					PAGE: 'INDEX',
					pages: ['INDEX', 'DETAILS'],
					status: {
						details: this.STATUS.ADD, //  ['ADD','UPDATE','FINISH']
					},
					data: {
						details: {
							id: ''
						}
					}
				},


				reason: {
					code:'',
					timeStar:'',
					timeEnd:'',
					organizationId:'',
					whereAbout:'',
					materialType:'',
					commiter: ''
				},

				table: {
					list: [
						{
							code:'SQ2020082611350001',
							materialCode:'20200826ASDZ',
							materialName: '牛奶',
							number: '10',
							unit: '吨',
							brand: '蒙牛',
							materialCategory: '饮料',
							materialType: '普通物料',
							createTime: '2020-08-26 11:38:55',
							createUserName: 'TEST',
							organizationName: 'TEST',
							whereAbout: 'TEST'
						}
					],
					page: 1,
					pageSize: 10,
					total: 0
				},

				options:{
					organizations: [],
					whereAbouts: [],
					materialTypes: []
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
				return;
				var that = this;
				var axios = that.axios;
				that.table.inSelect = true;
				axios({
					method: 'post',
					url: '/supplier/list',
					data: {
						page: that.table.page,
						pageSize: that.table.pageSize,
						reason: that.reason
					},
					df: false
				}).then((response) => {
					that.table.inSelect = false;
					if (!response) {
						return;
					}
					var data = response.data;

					that.table.list = data.data;
					that.table.total = data.total;
				}).catch((error) => {that.errorhanding(error)});
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
				}).catch((error) => {that.errorhanding(error)})
			},

			deleteBean: function(id) {
				var that = this;
				var axios = that.axios;

				that.$confirm('您确定要删除吗？','提示')
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
