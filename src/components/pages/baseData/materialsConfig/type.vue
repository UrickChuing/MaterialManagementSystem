<template>
	<div class="public-card m-type">
		<div class="public-card-header underline">
			物品类型
			<div style="float: right;">
				<el-button @click="inAdd = !inAdd" type="success" size="mini">添加类型</el-button>
				<el-button @click="click=null;select=null" icon="el-icon-refresh" size="mini" type="primary">取消选择</el-button>
				<el-button @click="initType" icon="el-icon-refresh" size="mini" type="primary" circle plain></el-button>
			</div>
		</div>
		<div class="public-card-body m-type">
			
			<div @click="select = type;click = type.id" class="type-line" :style="{'background':click==type.id? '#3A8EE6':'','color':click==type.id? 'white':''}" v-for="type in mType">
				{{type.name}}
			</div>
			
			<el-dialog title="添加类型" width="500px" :visible.sync="inAdd" :modal-append-to-body="false" :append-to-body="true">
				<div class="flexRow">
					<el-input v-model="name" maxlength="64" placeholder="请输入类项名称"></el-input>
					<el-button @click="addType" type="success">确认添加</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {

				mType: [],
				click:null,
				select:null,
				
				name: '',
				
				inAdd:false

			}
		},
		created: function() {
			var that = this;
			
			that.initType();
		},
		methods: {

			initType: function() {
				var that = this;
				var axios = that.axios;

				axios({
					method: 'post',
					url: '/material/type/list',
					data: {
					},
					df: false
				}).then((response) => {
					if (!response) {
						return;
					}
					var data = response.data;
					
					that.mType = data.data;
					
				}).catch((error) => {
					that.errorhanding(error)
				})
			},
			
			addType: function() {
				var that = this;
				var axios = that.axios;
			
				axios({
					method: 'post',
					url: '/material/type/add',
					data: {
						name:that.name
					},
					df: false
				}).then((response) => {
					if (!response) {
						return;
					}
					var data = response.data;
					
					that.addSuccess(data.code === that.STATUS.SUCCESS)
					if(data.code === that.STATUS.SUCCESS){
						that.inAdd = false
						that.initType()
					}
					
				}).catch((error) => {
					that.errorhanding(error)
				})
			}
			

		}
	}
</script>

<style scoped="scoped">
	
	.type-line:hover{
		color: #3FA4DD;
	}
	
	.type-line{
		height: 35px;
		line-height: 35px;
		cursor: pointer;
		padding: 0px 15px;
		border-radius: 5px;
	}
	
	.public-card.m-type {
		min-width: 300px;
		flex: 1;
	}

	.public-card-body.m-type {
		height: 600px;
		padding: 5px;
	}

	.flex1 {
		flex: 1;
	}

	.public-card {
		margin-top: 15px;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
	}

	.underline {
		border-bottom: solid 1px rgba(210, 210, 210, 1) !important;
	}

	.public-card-header {
		display: flex;
	}

	.public-card-header>div:last-child {
		margin-left: auto;
	}
</style>
