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

      <el-button @click="initData" size="mini" type="success" plain>生成</el-button>

    </div>

    <div>
      <div class="flexRowWarp">
        <div class="view-row-left view-row-block">

          <ve-histogram :data="histogram_1.chartData" :extend="histogram_1.extend" :width="autoStyle.width"
            :legend-visible="false"></ve-histogram>

        </div>
        <div class="view-row-right view-row-block">
          <ve-histogram :data="histogram_2.chartData" :extend="histogram_2.extend" :width="autoStyle.width"
            :legend-visible="false"></ve-histogram>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
  export default {
    data() {
      return {

        //0供应商 ， 1部门
        type: 0, //图表类型

        reason: {
          organizationId: '',
          warehouseTypeId: '',
          warehouseTypeTaskId: '',
          subStartTime: '',
          subEndTime: '',
          materialName: '',
          materialCode: '',
          byWhitch: 'S', //O,按部门     S，按供应商
        },

        subTimes: [],

        options: {
          organizations: [],
          cruise: [],
          route: [],
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

        dateTimePicker: {
          shortcuts: [],
        },




        autoStyle: {
          // height: '1500px !important',
          width: '50px'
        },

        histogram_1: {
          extend: {
            yAxis: {
              //是否显示y轴线条
              axisLine: {
                show: true,
              },
              // 纵坐标网格线设置，同理横坐标
              splitLine: {
                show: false,
              },
              // 线条位置
              position: "left",
            },
            xAxis: {
              axisLine: {
                show: true,
              },
            },
            series: {
              label: {
                show: true,
                position: "top"
              },
            },
            //数据过多时出现横向滚动条
            dataZoom: [{
                show: true,
                realtime: true,
                start: 0,
                end: 50,
              },
              {
                type: "inside",
                realtime: true,
                start: 0,
                end: 50,
              },
            ],
          },
          chartData: {
            columns: ['organzation', 'number'],
            rows: [{
                organzation: '供应商-A',
                number: 1393
              },
              {
                organzation: '供应商-B',
                number: 3530
              },
              {
                organzation: '供应商-C',
                number: 2923
              },
              {
                organzation: '供应商-D',
                number: 1723
              },
              {
                organzation: '供应商-E',
                number: 3792
              },
              {
                organzation: '供应商-F',
                number: 4593
              }
            ]
          },
        },

        histogram_2: {
          extend: {
            yAxis: {
              //是否显示y轴线条
              axisLine: {
                show: true,
              },
              // 纵坐标网格线设置，同理横坐标
              splitLine: {
                show: false,
              },
              // 线条位置
              position: "left",
            },
            xAxis: {
              axisLine: {
                show: true,
              },
            },
            series: {
              label: {
                show: true,
                position: "top"
              },
            },
            //数据过多时出现横向滚动条
            dataZoom: [{
                show: true,
                realtime: true,
                start: 0,
                end: 50,
              },
              {
                type: "inside",
                realtime: true,
                start: 0,
                end: 50,
              },
            ],
          },
          chartData: {
            columns: ['organzation', 'amount'],
            rows: [{
                organzation: '供应商-A',
                amount: 1393
              },
              {
                organzation: '供应商-B',
                amount: 3530
              },
              {
                organzation: '供应商-C',
                amount: 2923
              },
              {
                organzation: '供应商-D',
                amount: 1723
              },
              {
                organzation: '供应商-E',
                amount: 3792
              },
              {
                organzation: '供应商-F',
                amount: 4593
              }
            ]
          },
        },




      }
    },
    watch: {
      'reason.warehouseTypeId': {
        handler: function(newV, oldV) {

          if (newV != '' && newV != null && newV != oldV) {
            this.initRoute();
          }else{
            this.options.route = [];
            this.reason.warehouseTypeTaskId = null;
          }
        },
        deep: true
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
      var that = this;

      that.initData();
      that.initOptions();
      that.initDatePicker();

      setTimeout(_ => {
        // that.autoStyle.height = '';
        that.autoStyle.width = '';
      }, 100);
    },
    methods: {

      initData: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/statistics/purchase/request/chart',
          data: that.reason,
          df: false
        }).then((response) => {
          if (!response)
            return;
          var data = response.data;
          if (data.code === that.STATUS.SUCCESS) {

            that.histogram_1.chartData.rows = data.data.his_1;
            that.histogram_2.chartData.rows = data.data.his_2;

          } else {
            throw data.msg;
          }
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
          data: {},
          df: false
        }).then((response) => {
          if (!response)
            return;
          var data = response.data;
          if (data.code === that.STATUS.SUCCESS) {

            var cruise = data.data.cruise;
            var organizations = data.data.organizations;

            that.options.cruise = cruise;
            that.options.organizations = organizations;

            if (cruise.length != 0) {
              that.reason.warehouseTypeId = cruise[0].id;
            }

            if (organizations.length != 0) {
              that.reason.organizationId = organizations[0].id;
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
      initDatePicker:function(){
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

    }
  }
</script>

<style scoped="scoped">
  .view-row-block {
    padding: 10px;
    border: rgba(187, 187, 187, 0.5) solid 1px;
    box-shadow: 0px 2px 5px rgba(187, 187, 187, 0.6);
    border-radius: 2px;
    margin-right: 10px;
    margin-top: 10px;
    position: relative;
  }

  .view-row-left {
    flex: 1;
    width: calc(50% - 10px);
    min-width: 400px;
  }

  .view-row-right {
    flex: 1;
    width: calc(50% - 10px);
    min-width: 400px;
  }
</style>
