<template>
	<div>
		<div class="public-table-header">
			<div>
				<el-input v-model="reason.name" size="mini" style="width: 150px;" placeholder="搜索部门名" clearable></el-input>
				<el-button id="shore_warehouse" @click="initTableList" size="mini" :icon="table.inSelect? 'el-icon-refresh' :'el-icon-search'" :type="table.inSelect? 'warning' :'success'"
				 :disabled="table.inSelect" circle></el-button>
			</div>

			<el-button @click="table.inAdd = true;" type="success" class="margin-right10" style="margin-left: auto;" size="mini">添加部门</el-button>

		</div>

		<el-table :data="table.list" style="width: 100%" height="450px" cell-class-name="public-table-cell">
			<el-table-column label="序号" type="index" align="center" min-width="48">
				<template slot-scope="scope">
					<span>{{(table.page - 1) * table.pageSize + scope.$index + 1}}</span>
				</template>
			</el-table-column>
			<el-table-column label="部门名称" prop="name" align="center" min-width="180">
			</el-table-column>
			<el-table-column label="添加人" prop="volum" align="center" min-width="180">
			</el-table-column>
			<el-table-column label="添加时间" prop="createTime" align="center" min-width="180">
				<template slot-scope="scope">
					{{ getCreateDateStr(new Date(scope.row.createTime)) }}
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="120">
				<template slot-scope="scope">
					<el-button @click="deleteOrganization(scope.row,false)" type="danger" size="mini">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
    
    <div class="flexCenter margin-top10">
      <el-pagination @size-change="(val)=>{table.pageSize=val;initTableList()}" @current-change="(val)=>{table.page=val;initTableList()}"
        :current-page="table.page" :page-sizes="[10, 20, 30, 40 , 50]" :page-size="table.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="table.total">
      </el-pagination>
    </div>
    
		<el-dialog title="添加部门" :modal-append-to-body="false" :append-to-body="true" :visible.sync="table.inAdd" width="500px"
		 center>

			<div class="public-table-header" style="margin-top: 0px;" @keydown.enter="initOrganization">
				<div>
					<el-input v-model="organization.reason.name" size="mini" style="width: 150px;" placeholder="搜索部门名称" clearable></el-input>
					<el-button @click="initOrganization()" size="mini" :icon="organization.table.inSelect? 'el-icon-refresh' :'el-icon-search'"
					 :type="organization.table.inSelect? 'warning' :'success'" :disabled="organization.table.inSelect" circle></el-button>
				</div>

			</div>

			<el-table :data="organization.table.list" style="width: 100%" cell-class-name="public-table-cell">
				<el-table-column label="序号" type="index" align="center" min-width="48">
					<template slot-scope="scope">
						<span>{{(organization.table.page - 1) * organization.table.pageSize + scope.$index + 1}}</span>
					</template>
				</el-table-column>
				<el-table-column label="部门" prop="name" align="center" min-width="180">
				</el-table-column>
				<el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="60">
					<template slot-scope="scope">
						<el-button icon="el-icon-plus" v-if="!scope.row.add" @click="addOrganization(scope.row)" type="success" size="mini"
						 :disabled="organization.table.inSelect" circle></el-button>
						<el-button icon="el-icon-minus" v-else @click="deleteOrganization(scope.row,true)" type="danger" size="mini"
						 :disabled="organization.table.inSelect" circle></el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="flexCenter margin-top20">
				<el-pagination @size-change="(val)=>{organization.table.pageSize=val;initOrganization()}" @current-change="(val)=>{organization.table.page=val;initOrganization()}"
				 :current-page="organization.table.page" :page-sizes="[10, 20, 30, 40 , 50]" :page-size="organization.table.pageSize"
				 layout="total, sizes, prev, pager, next, jumper" :total="organization.table.total">
				</el-pagination>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		props: ["warehouse"],
		data() {
			return {

				parent: this.$parent,

				updateName: null,

				reason: {
					warehouseId: this.warehouse.id,
					name: ''
				},
				table: {
					list: [],
					total: 0,
					page: 1,
					pageSize: 10,
					inSelect: false,
					inAdd: false
				},

				organization: {
					reason: {
						name: ''
					},
					table: {
						list: [],
						page: 1,
						pageSize: 10,
						total: 0,
						inSelect: false,
					}
				}


			}
		},
		watch: {
			'table.inAdd': {
				handler: function(newV) {
					if (newV) {
						this.initOrganization();
					} else {
						this.organization.reason.name = '';
						this.organization.table.page = 1;
						this.organization.table.pageSize = 10;
					}
				},
				deep: true
			},
			'warehouse':{
				handler:function(){
					this.initTableList()
				},
				deep:true
			}

		},
		created: function() {
			this.initTableList()
		},
		methods: {

			initTableList: function(initOrganization) {
				var that = this;
				var axios = that.axios;
				that.table.inSelect = true;

				axios({
					method: 'post',
					url: '/warehouse/organization/list',
					data: {
						reason: {
							warehouseId: that.warehouse.id,
              name: that.reason.name
						}
					},
					df: false
				}).then((response) => {
					if (!response) {
						return;
					}

					setTimeout(function() {

						that.table.inSelect = false;
						var data = response.data;

						that.table.list = data.data;
						that.table.total = data.total;
						if (initOrganization) {
							that.initOrganization();
						}
					}, 300)

				}).catch((error) => {
					that.table.inSelect = false;
					that.errorhanding(error)
				})
			},


			initOrganization: function() {
				var that = this;
				var axios = that.axios;
				that.organization.table.inSelect = true;
				axios({
					method: 'post',
					url: '/organization/list',
					data: {
						page: that.organization.table.page,
						pageSize: that.organization.table.pageSize,
						reason: {}
					},
					df: false
				}).then((response) => {
					if (!response) {
						return;
					}

					setTimeout(function() {

						that.organization.table.inSelect = false;
						var data = response.data;

						var olist = data.data;
						that.organization.table.total = data.total;


						var knownList = that.table.list
						for (var oIndex in olist) {
							var oDemo = olist[oIndex];
							//赋予 属性add 是否已被添加
							oDemo.add = false;
							for (var knowIndex in knownList) {
								var knowDemo = knownList[knowIndex];
								if (oDemo.id === knowDemo.organizationId) {
									oDemo.add = true;
                  oDemo.organizationId = oDemo.id;
                  break;
								}
							}
						}
						that.organization.table.list = olist;
					}, 300)

				}).catch((error) => {
					that.table.inSelect = false;
					that.errorhanding(error)
				})

			},

			addOrganization: function(row) {

				var that = this;
				var axios = that.axios;
				row.add = true;
				axios({
					method: 'post',
					url: '/warehouse/organization/add',
					data: {
						organizationId: row.id,
						warehouseId: that.warehouse.id
					},
					loading: true,
					df: false
				}).then((response) => {
					if (!response) {
						return;
					}
					var data = response.data;
					if (data.code == that.STATUS.SUCCESS) {
						that.addSuccess(true);
						that.initTableList(true);
						row.add = true;
					}
				}).catch((error) => {
					that.errorhanding(error)
				})

			},

			deleteOrganization: function(row, inner) {
				var that = this;
				var axios = that.axios;
				var id;
				if (inner) {
					row.add = true;
					id = row.organizationId
				} else {
					id = row.id
				}
				that.$confirm('您确定要删除吗？', '提示')
				  .then(_ => {
				axios({
					method: 'post',
					url: '/warehouse/organization/delete',
					data: {
						id: id
					},
					loading: true,
					df: false
				}).then((response) => {
					if (!response) {
						return;
					}
					var data = response.data;
					if (data.code == that.STATUS.SUCCESS) {
						that.deleteSuccess(true);
						that.initTableList(true);
						row.add = true;
					}
				}).catch((error) => {
					that.errorhanding(error)
				})
				}).catch(_ => {});

			},


		}
	}
</script>

<style>
</style>
