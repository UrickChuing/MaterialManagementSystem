<template>
  <div @keydown.enter="initTableList" v-if="otherPage.PAGE == 'INDEX'">

    <div class="input-line">

      <div class="input-block">
        <span>批次</span>
        <el-input v-model="reason.code" clearable></el-input>
      </div>
	  <div class="input-block">
	    <span>物品编码</span>
	    <el-input v-model="reason.materialBaseCode" clearable></el-input>
	  </div>

      <div class="input-block">
        <span>仓库</span>
        <el-select v-model="reason.warehouseId" placeholder="全部" clearable>
          <el-option v-for="(item,index) in options.warehouse" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>

      <div class="input-block">
        <span>排序</span>
        <el-select v-model="reason.order" placeholder="全部" clearable>
          <el-option v-for="(item,index) in options.order" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div class="input-block">
        <span>排序方式</span>
        <el-select v-model="reason.orderWay" placeholder="全部">
          <el-option v-for="(item,index) in options.orderWay" :key="item.value" :label="item.name" :value="item.value">
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
      <el-table-column label="批次" prop="code" align="center" min-width="170">
      </el-table-column>
	  <el-table-column label="物品编码" prop="materialBaseCode" align="center" min-width="170">
	  </el-table-column>
      <el-table-column label="入库单号" prop="warehouseVoucherCode" align="center" min-width="190">
      </el-table-column>
      <el-table-column label="物品" prop="materialName" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="规格" prop="purchaseSpecification" align="center" min-width="120">
      </el-table-column>
      <el-table-column label="仓库" prop="warehouseName" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="实际数量" prop="actNumber" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="可用数量" prop="remainNumber" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="过期时间" prop="expiration" align="center" min-width="180">
        <template slot-scope="scope">
          {{scope.row.expiration ==undifined ? '2099-12-31':DateToStr(new Date(scope.row.expiration)).split(" ")[0]}}
        </template>
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

        options: {
          warehouse: [],
          order: [{
              value: 'expiration',
              name: '按有效期'
            },
            {
              value: 'number',
              name: '按实际数量'
            },
            {
              value: 'remainNumber',
              name: '按可用数量'
            }
          ],
          orderWay: [{
              value: 'DESC',
              name: '倒序'
            },
            {
              value: 'ASC',
              name: '顺序'
            }
          ]
        },

        reason: {
          code: '',
		  materialBaseCode:'',
          warehouseId: '',
          isMaster: true,
          order: '',
          orderWay: 'DESC',

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

        var query = to.query;
        if (query.type == 'SEARCH') {
          that.reason.order = query.reason.order;
          that.reason.orderWay = query.reason.orderWay;
        }

        that.initTableList();
      })
    },
    created: function() {
      var that = this;

      that.initTableList();
      that.initOptions();
    },
    methods: {
      initTableList: function() {
        var that = this;
        var axios = that.axios;
        that.table.inSelect = true;
        axios({
          method: 'post',
          url: '/stock/list',
          data: {
            page: that.table.page,
            pageSize: that.table.pageSize,
            reason: that.reason
          },
          df: false
        }).then((response) => {
          if (!response)
            return;
          that.table.inSelect = false;
          var data = response.data;

          that.table.list = data.data;
          that.table.total = data.total;
        }).catch((error) => {
          that.errorhanding(error)
        });
      },

      //初始化options数据
      initOptions: function() {

        var that = this;
        var axios = that.axios;

        that.initData = true;

        axios({
          method: 'post',
          url: '/stock/options',
          data: {}
        }).then((response) => {
          if (!response) {
            return
          }

          that.initData = false;
          var data = response.data;

          that.options.warehouse = data.data.warehouse;

        });
      },

    }
  }
</script>

<style scoped="scoped">
</style>
