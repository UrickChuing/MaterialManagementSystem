<template>
	<div class="card">
		<el-table :data="table.list" style="width: 100%" cell-class-name="public-table-cell" max-height="350" size="small">
			<el-table-column label="代码" prop="itemCode" align="center" min-width="160">
			</el-table-column>
			<el-table-column label="物品名称" prop="chineseName" align="center" min-width="120">
			</el-table-column>
			<el-table-column label="物品条码" prop="articleBarCode" align="center" min-width="160">
			</el-table-column>
			<el-table-column label="品牌" prop="brand" align="center" min-width="210">
			</el-table-column>
			<el-table-column label="单位" prop="purchaseSpecifications" align="center" min-width="160">
				<template slot-scope="scope">
					{{ scope.row.purchaseSpecifications + scope.row.salesUnit + '/' + scope.row.purchasingUnit }}
				</template>
			</el-table-column>
			<el-table-column label="库存" prop="applicantName" align="center" min-width="120">
				<template slot-scope="scope">
					{{ scope.row.warehouseStock + '(' + scope.row.realCurrentStock + ')'   }}
				</template>
			</el-table-column>
			<el-table-column label="采购数量" prop="purchaseSpecifications" align="center" min-width="120">
			</el-table-column>
			<el-table-column label="小计" prop="number" align="center" min-width="120">
			</el-table-column>
		</el-table>
		
		<!-- @size-change="(val)=>{reason.pageSize=val;initTableList()}" -->
		<!-- @current-change="(val)=>{reason.currentPage=val;initTableList()}" -->
		<div class="flexCenter">
			<el-pagination style="margin-left: 20px;"
			      layout="total"
			      :total="table.total">
			    </el-pagination>
		</div>
		
		
	</div>

</template>

<script>
	export default {
		data(){
			return {
				table:{
					list:[],
					currentPage: 1,
					pageSize: 5
				}
			}
		},
		props: {
			wareId:String
		},
		mounted:function(){
			var that = this;
			
			if(that.wareId != undefined && that.wareId != null && that.wareId != ''){
				that.initTableList();
			}
		},
		methods:{
			initTableList:function(){
				var that = this;
				var axios = that.axios;
				
				that.table.inSelect = true;
				axios({
					method: 'post',
					url: '/purchaseRequest/toEdit/item',
					data:{
						purchaseRequisitionID:that.wareId,
						type:1
					}
				}).then((response) => {
					if (!response) {
					  return
					}
					var data = response.data;
					
					that.table.list = data.itemList;
					that.table.total = data.itemList.length;
				
				
				}).catch( (error) => {
					that.table.inSelect = false;
				} );
			}
		}
		
	}
</script>

<style scoped="scoped">
	.card{
		border-radius: 5px;
		border: solid rgba(240,240,240,1) 1px;
		width: 100%;
	}
</style>
