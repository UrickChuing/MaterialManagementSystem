<template>
  <div>
    <div class="mini">
      <div class="input-block">
        <span>邮轮</span>
        <el-select v-model="reason.warehouseTypeId" placeholder="请选择" size="mini" clearable>
          <el-option v-for="item in options.cruise" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>

      <div class="input-block">
        <span>航次</span>
        <el-select v-model="reason.warehouseTypeTaskId" placeholder="请选择" size="mini" clearable>
          <el-option v-for="item in options.route" :key="item.id" :label="item.taskName" :value="item.id">
          </el-option>
        </el-select>
      </div>

      <div class="input-block">
        <span>部门</span>
        <el-select v-model="reason.organizationId" placeholder="请选择" size="mini" clearable>
          <el-option v-for="item in options.organizations" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>

      <div class="input-block">
        <span>供应商</span>
        <el-select v-model="reason.supplierId" placeholder="请选择" size="mini" clearable>
          <el-option v-for="item in options.supplier" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>

      <br>

      <div class="input-block">
        <span>物品名称</span>
        <el-input v-model="reason.materialName" size="mini" clearable></el-input>
      </div>

      <div class="input-block">
        <span>物品代码</span>
        <el-input v-model="reason.materialCode" size="mini" clearable></el-input>
      </div>

      <div class="input-block">
        <span>提交时间</span>
        <el-date-picker v-model="subTimes" type="datetimerange" :picker-options="dateTimePicker" value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" style="width: 320px;">
        </el-date-picker>
      </div>

      <el-button @click="initTableList" size="mini" type="success" plain>生成</el-button>

    </div>

    <div class="public-table-header">
      <el-button @click="downloadPDF" class="right" icon="el-icon-download" size="mini" type="primary">下载统计(EXCEL)</el-button>
    </div>


    <el-table :data="table.list" style="width: 100%;border-top: 1px solid #EBEEF5;" max-height="490px" cell-class-name="public-table-cell">
      <el-table-column label="物品名称" prop="name" align="center" min-width="210">
      </el-table-column>
      <el-table-column label="物品代码" prop="code" align="center" min-width="210">
      </el-table-column>
      <el-table-column label="品牌" prop="brandName" align="center" min-width="210">
      </el-table-column>
       <el-table-column label="规格" prop="purchaseSpecification" align="center" min-width="120">
      </el-table-column>
      <el-table-column label="单位" prop="purchaseUnit" align="center" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.purchaseUnit }}
        </template>
      </el-table-column>
      <el-table-column label="采购量" prop="number" align="center" min-width="150">
      </el-table-column>
      <el-table-column label="采购单价" prop="price" align="center" min-width="150">
      </el-table-column>
      <el-table-column label="采购金额" prop="amount" align="center" min-width="150">
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

        reason: {
          organizationId: '',
          organizationName: '',

          warehouseTypeId: '',
          warehouseTypeName: '',

          warehouseTypeTaskId: '',
          warehouseTypeTaskName: '',

          supplierId: '',
          supplierName: '',

          subStartTime: '',
          subEndTime: '',
          materialName: '',
          materialCode: '',
          byWhitch: 'S', //O,按部门     S，按供应商
          excel_type: 'PO'
        },
        
        subTimes: '',
        dateTimePicker:{
          shortcuts:[]
        },

        options: {
          organizations: [],
          cruise: [],
          route: [],
          supplier:[],
          whitch: [{
              index: 'O',
              name: '按部门'
            },
            {
              index: 'S',
              name: '按供应商'
            }
          ]
        },

        table: {
          list: [],
          page: 1,
          pageSize: 10,
          total: 0,
          inSelect: false,
        },

      }
    },
    watch: {
      'reason.warehouseTypeId': {
        handler: function(newV, oldV) {
          if (newV != '' && newV != null && newV != oldV) {
            this.initRoute();
            var cruise = this.options.cruise;

            for (var index in cruise) {
              var demo = cruise[index];
              if (demo.id == newV) {
                this.reason.warehouseTypeName = demo.name;
                break;
              }
            }

          } else {
            this.options.route = [];
            this.reason.warehouseTypeTaskId = null;
            this.reason.warehouseTypeName = '';
          }
        },
        deep: true
      },
      'reason.warehouseTypeTaskId':{
        handler: function(newV,oldV){
          if (newV != '' && newV != null && newV != oldV) {
            var routes = this.options.route;
            for (var index in routes) {
              var demo = routes[index];
              if (demo.id == newV) {
                this.reason.warehouseTypeTaskName = demo.taskName;
                break;
              }
            }

          } else {
            this.reason.warehouseTypeTaskName = '';
          }
        }
      },
      'reason.organizationId':{
        handler: function(newV,oldV){
          if (newV != '' && newV != null && newV != oldV) {
            var organizations = this.options.organizations;
            for (var index in organizations) {
              var demo = organizations[index];
              if (demo.id == newV) {
                this.reason.organizationName = demo.name;
                break;
              }
            }

          } else {
            this.reason.organizationName = '';
          }
        }
      },
      'reason.supplierId':{
        handler: function(newV,oldV){
          if (newV != '' && newV != null && newV != oldV) {
            var supplier = this.options.supplier;
            for (var index in supplier) {
              var demo = supplier[index];
              if (demo.id == newV) {
                this.reason.supplierName = demo.name;
                break;
              }
            }

          } else {
            this.reason.supplierName = '';
          }
        }
      },
      subTimes: {
        handler: function(newV) {
          if (newV != null) {
            this.reason.subStartTime = newV[0] + ' 00:00:00';
            this.reason.subEndTime = newV[1] + ' 23:59:59';
          } else {
            this.reason.subStartTime = '';
            this.reason.subEndTime = '';
          }
        },
        deep: true
      }
    },
    created: function() {

      this.initOptions();
      this.initRoute();
      this.initDatePicker();
    },
    methods: {
      initTableList: function() {

        var that = this;
        var axios = that.axios;
        that.table.inSelect = true;
        axios({
          method: 'post',
          url: '/statistics/purchase/order/list',
          data: {
            page: that.table.page,
            pageSize: that.table.pageSize,
            reason: that.reason
          },
          df: false
        }).then((response) => {
          that.table.inSelect = false;
          if (!response) {
            return
          }
          var data = response.data;

          that.table.list = data.data;
          that.table.total = data.total;
        }).catch((error) => {
          that.errorhanding(error)
        });
      },
      initOptions: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/statistics/purchase/request/options',
          data: {
            supplier:true
          }
        }).then((response) => {
          if (!response)
            return;
          var data = response.data;
          if (data.code === that.STATUS.SUCCESS) {

            var cruise = data.data.cruise;
            var organizations = data.data.organizations;
            var supplier = data.data.supplier;

            that.options.cruise = cruise;
            that.options.organizations = organizations;
            that.options.supplier = supplier;

            if (cruise.length != 0) {
              that.reason.warehouseTypeId = cruise[0].id;
            }

            if (organizations.length != 0) {
              that.reason.organizationId = organizations[0].id;
            }

            if(supplier.length != 0){
              that.reason.supplierId = supplier[0].id;
            }


          } else {
            throw data.msg;
          }

        }).catch((error) => {
          that.errorhanding(error)
        });
      },
      initRoute: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/statistics/purchase/request/options/route',
          data: {
            warehouseTypeId: that.reason.warehouseTypeId
          },
          df: false
        }).then((response) => {
          if (!response)
            return;
          var data = response.data;
          if (data.code === that.STATUS.SUCCESS) {
            var route = data.data;
            that.options.route = route;

            if (route.length != 0) {
              that.reason.warehouseTypeTaskId = route[0].id;
            }

          } else {
            throw data.msg;
          }
        }).catch((error) => {
          that.errorhanding(error)
        });
      },
      initDatePicker: function() {
        this.dateTimePicker.shortcuts = [{
            text: '一月',
            onClick(picker) {
              var year = new Date().getFullYear();
              var dateList = [
                year + '-01-01 00:00:00',
                year + '-01-31 23:59:59'
              ]
              picker.$emit('pick', dateList);
            }
          }, {
            text: '二月',
            onClick(picker) {
              var year = new Date().getFullYear();

              var dateList = [
                year + '-02-01 00:00:00',
                year + '-02-' + new Date(year, 2, 0).getDate() + ' 23:59:59'
              ];
              picker.$emit('pick', dateList);
            }
          }, {
            text: '三月',
            onClick(picker) {
              var year = new Date().getFullYear();
              var dateList = [
                year + '-03-01 00:00:00',
                year + '-03-31 23:59:59'
              ]
              picker.$emit('pick', dateList);
            }
          },
          {
            text: '四月',
            onClick(picker) {
              var year = new Date().getFullYear();
              var dateList = [
                year + '-04-01 00:00:00',
                year + '-04-30 23:59:59'
              ]
              picker.$emit('pick', dateList);
            }
          },
          {
            text: '五月',
            onClick(picker) {
              var year = new Date().getFullYear();
              var dateList = [
                year + '-05-01 00:00:00',
                year + '-05-31 23:59:59'
              ]
              picker.$emit('pick', dateList);
            }
          },
          {
            text: '六月',
            onClick(picker) {
              var year = new Date().getFullYear();
              var dateList = [
                year + '-06-01 00:00:00',
                year + '-06-30 23:59:59'
              ]
              picker.$emit('pick', dateList);
            }
          },
          {
            text: '七月',
            onClick(picker) {
              var year = new Date().getFullYear();
              var dateList = [
                year + '-07-01 00:00:00',
                year + '-07-31 23:59:59'
              ]
              picker.$emit('pick', dateList);
            }
          },
          {
            text: '八月',
            onClick(picker) {
              var year = new Date().getFullYear();
              var dateList = [
                year + '-08-01 00:00:00',
                year + '-08-31 23:59:59'
              ]
              picker.$emit('pick', dateList);
            }
          },
          {
            text: '九月',
            onClick(picker) {
              var year = new Date().getFullYear();
              var dateList = [
                year + '-09-01 00:00:00',
                year + '-09-30 23:59:59'
              ]
              picker.$emit('pick', dateList);
            }
          },
          {
            text: '十月',
            onClick(picker) {
              var year = new Date().getFullYear();
              var dateList = [
                year + '-10-01 00:00:00',
                year + '-10-31 23:59:59'
              ]
              picker.$emit('pick', dateList);
            }
          },
          {
            text: '十一月',
            onClick(picker) {
              var year = new Date().getFullYear();
              var dateList = [
                year + '-11-01 00:00:00',
                year + '-11-30 23:59:59'
              ]
              picker.$emit('pick', dateList);
            }
          },
          {
            text: '十二月',
            onClick(picker) {
              var year = new Date().getFullYear();
              var dateList = [
                year + '-12-01 00:00:00',
                year + '-12-31 23:59:59'
              ]
              picker.$emit('pick', dateList);
            }
          }
        ];

      },

      downloadPDF: function() {
        var that = this;
        var axios = that.axios;

        var newTab = window.open('about:blank');

        axios({
          method: 'post',
          url: '/report/getDownload',
          data: {
            type: 'STATISTICS',
            reason: that.reason
          },
          df: false
        }).then((response) => {
          if (!response) {
            return
          }
          var href = that.axios.defaults.baseURL + '/report/excel?download=' + response.data;
          newTab.location.href = href;
        });


      },

    },
  }
</script>

<style>
</style>
