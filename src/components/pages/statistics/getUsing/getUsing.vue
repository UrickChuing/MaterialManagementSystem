<template>
  <div>

    <div class="mini">


    </div>

    <el-tabs v-model="whichView" type="border-card" class="margin-top10">
      <!--      <el-tab-pane :name="0">
        <div slot="label" class="youCanNotChoose">
          统计图
          </el-select>
          <i class="el-icon-refresh view-refresh" v-if="whichView == 0"></i>
        </div>
        <chart-view :reason="reason" v-if="whichView == 0"></chart-view>
      </el-tab-pane> -->
      <!--      <el-tab-pane :name="1">
        <div slot="label" class="youCanNotChoose">
          统计图 2
          <i class="el-icon-refresh view-refresh" v-if="whichView == 1"></i>
        </div>
        <chart-view2 :reason="reason" v-if="whichView == 1"></chart-view2>
      </el-tab-pane> -->
      <el-tab-pane :name="2">
        <div slot="label" class="youCanNotChoose">列表 <i class="el-icon-refresh view-refresh" v-if="whichView == 2"></i>
        </div>
        <table-view v-if="whichView == 2"></table-view>
      </el-tab-pane>
    </el-tabs>


  </div>
</template>

<script>
  import chartView from './chartView.vue';
  import chartView2 from './chartView2.vue';
  import tableView from './tableView.vue';

  export default {
    name: 'catigoushenqingtongji',
    components: {
      chartView,
      tableView,
      chartView2
    },
    data() {
      return {

        whichView: 2,

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

        dateTimePicker: {
          shortcuts: [{
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
          ]
        },


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

        TEST: {
          a: 1,
          b: 2
        }
      }
    },
    watch: {

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

      var test = this.TEST;
      test.a = 2;
      this.TEST = test;
      console.log(this.TEST, test);

    },
    methods: {


    }
  }
</script>

<style scoped="scoped">
  .view-refresh {
    color: #303133;
    font-weight: bold;
    margin-left: 15px;
  }

  .view-refresh:hover {
    color: #00d400;
  }
</style>
