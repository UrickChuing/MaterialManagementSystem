<template>
  <div @keydown.enter="initTableList" v-if="otherPage.PAGE == 'INDEX'">

    <div class="reason-line">

      <div class="reason-input">
        <span>物品编码</span>
        <el-input v-model="reason.code" clearable></el-input>
      </div>

      <div class="reason-input">
        <span>物品名称</span>
        <el-input v-model="reason.name" clearable></el-input>
      </div>

<!--      <div class="reason-input">
        <span>状态</span>
        <el-select v-model="reason.status" placeholder="全部" clearable>
          <el-option v-for="(item,index) in options.status" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </div> -->

      <div class="reason-input" v-if="false">
        <span>类型</span>
        <el-select v-model="reason.materialTypeId" placeholder="请选择">
          <el-option v-for="item in options.materialType" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>

      <el-button @click="table.page=1;initTableList()" icon="el-icon-search" type="primary" class="reason-button">搜索</el-button>

    </div>

    <div class="public-table-header">
      <el-button @click="otherPage.PAGE = 'DETAILS';otherPage.status.details = STATUS.ADD" type="primary" size="mini">新增物品</el-button>
      <input type="file" id="excel" style="display: none;" name="image" @change="excelChange($event)" accept=".xls, .xlsx">
      <el-button @click="uploadClick" type="primary" size="mini">导入Excel</el-button>

      <a class="flexCenter text-underline margin-left10 font13" target="_blank" href="/物品导入.xlsx">下载导入模板</a>

      <div class="right red" v-if="table.inSelect">
        <i class="el-icon-loading"></i>
        请稍等，正在查询。。。
      </div>
    </div>
    <el-table :data="table.list" style="width: 100%" cell-class-name="public-table-cell">
      <el-table-column label="序号" align="center" min-width="48">
        <template slot-scope="scope">
          <span>{{(table.page - 1) * table.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="物品编码" prop="code" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="物品名称" prop="name" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="物品条码" prop="barCode" align="center" min-width="180">
      </el-table-column>
       <el-table-column label="规格" prop="purchaseSpecification" align="center" min-width="120">
      </el-table-column>
      <el-table-column label="状态" prop="createTime" align="center" min-width="180" v-if="false">
        <template slot-scope="scope">
          <el-switch @change="($event)=>{updateStatus(scope.row)}" v-model="scope.row.status" active-color="#13ce66"
            inactive-color="grey">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="180">
        <template slot-scope="scope">
          <el-button @click="page_DetailsUpdate(scope.row)" type="warning" size="mini">编辑</el-button>
          <!-- 未提交 -->
          <el-button @click="submit(scope.row)" type="success" size="mini" v-if="scope.row.auditStatus == 0">提交</el-button>
          <el-button @click="deleteBean(scope.row)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="flexCenter margin-top10">
      <el-pagination @size-change="(val)=>{table.pageSize=val;initTableList()}" @current-change="(val)=>{table.page=val;initTableList()}"
        :current-page="table.page" :page-sizes="[10, 20, 30, 40 , 50]" :page-size="table.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="table.total">
      </el-pagination>
    </div>

    <el-dialog :custom-class="['dialog-card','self-card']" :visible.sync="inAdd" :append-to-body="true">
      <batch-add :materials="excel" v-if="inAdd"></batch-add>
    </el-dialog>


  </div>
  <m-detail v-else-if="otherPage.PAGE == 'DETAILS'"></m-detail>
</template>

<script>
  import mDetail from './details.vue'
  import batchAdd from './batch_add.vue'

  export default {
    name: 'wupinguanli',
    components: {
      mDetail,
      batchAdd
    },
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
          materialType: [],
          status: [{
            value: true,
            name: '启用'
          }, {
            value: false,
            name: '禁用'
          }]
        },

        reason: {
          code: '',
          name: '',
          status: '',
          materialTypeId: ''
        },

        inAdd: false,

        table: {
          list: [],
          page: 1,
          pageSize: 10,
          total: 0
        },


        excelFile: null,
        excel: {
          label: [],
          list: []
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
      that.initType();
    },
    methods: {
      initTableList: function() {
        var that = this;
        var axios = that.axios;
        that.table.inSelect = true;
        axios({
          method: 'post',
          url: '/material/list',
          data: {
            page: that.table.page,
            pageSize: that.table.pageSize,
            reason: that.reason
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          that.table.inSelect = false;
          var data = response.data;

          that.table.list = data.data;
          that.table.total = data.total;
        }).catch((error) => {
          that.$notify({
            title: '错误',
            message: '<div><span class="red">错误内容：</span>' + error +
              '<br> <span class="blue">(若无错内容，联系管理员)</span></div>',
            type: 'error',
            duration: 5000,
            dangerouslyUseHTMLString: true
          });
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
        })
      },

      deleteBean: function(row) {
        var that = this;
        var axios = that.axios;
							/* (可以复原) */
        that.$confirm('确定删除物品？', '提示')
          .then(_ => {
            axios({
              method: 'post',
              url: '/material/delete',
              data: {
                id: row.id,
              },
              df: false
            }).then((response) => {
              if (!response) {
                return;
              }

              var data = response.data;
              that.deleteSuccess(data.code == that.STATUS.SUCCESS);

              that.initTableList();
            })
          }).catch(_ => {})
      },

      updateStatus: function(row) {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/material/update',
          data: {
            material: {
              id: row.id,
              status: row.status
            }
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          if (data.code == that.STATUS.SUCCESS) {
            that.updateSuccess(true)
            that.initTableList();
          }
        }).catch((error) => {
          that.errorhanding(error)
        })

      },

      initType: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/material/type/list',
          data: {},
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;

          that.options.materialType = data.data;


        }).catch((error) => {
          that.errorhanding(error)
        });
      },

      excelUpload: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/material/add/excel/list',
          data: {
            excel: that.excelFile,
            lang: that.$i18n.locale
          },
          loading: true
        }).then((response) => {
          that.initTableList();
          if (!response) {
            return;
          }
          var data = response.data;

          if (data.code === that.STATUS.SUCCESS) {

            if (!Array.isArray(data.data.list) || data.data.list.length == 0) {
              that.$notify({
                title: '警告',
                message: '获取Excel内容失败!<br>' +
                  '请核对excel内容，物品类别需要提前录入系统。<br>' +
                  '不存在类别的物品无法录入',
                type: 'error',
                duration: 5000,
                dangerouslyUseHTMLString: true
              });
            } else {
              that.excel.label = data.data.label;
              that.excel.list = data.data.list;
              that.inAdd = true;
            }

          } else {
            throw data.msg;
          }

        }).catch((error) => {
          that.errorhanding(error)
        });


      },

      uploadClick: function() {
        var files = document.getElementById('excel');
        files.value = '';

        files.click();
      },

      excelChange: function() {
        var that = this;
        var axios = that.axios;

        let files = document.getElementById('excel');
        let file = files.files[0]
        if (file == undefined) {
          return
        }

        let name = file.name
        let arr = name.split('.')
        // console.log(arr);
        // image/jpg,image/jpeg,image/png
        var nameSuffix = arr[arr.length - 1];
        if (nameSuffix != 'xls' && nameSuffix != 'xlsx') {

          that.$notify.error({
            title: that.$t('错误'),
            message: that.$t('请上传xls、xlsx格式的Excel文件'),
            duration: 5000
          });
          return false;
        }

        let fileSize = 0;
        let fileMaxSize = 1024 * 1024 * 512; //1M
        if (files) {
          fileSize = files.size;
          if (fileSize > fileMaxSize) {
            that.$notify.error({
              title: '错误',
              message: '文件过大(大于 5 Mb )',
              duration: 5000
            });
            // file.value = "";
            return false;
          } else if (fileSize <= 0) {
            that.$notify.error({
              title: '错误',
              message: '文件大小异常(小于0)',
              duration: 5000
            });
            return false;
          }
        } else {
          return false;
        }
        that.excelFile = file;
        that.excelUpload();
      },


      page_DetailsUpdate: function(row) {
        var that = this;

        that.otherPage.data.details.id = row.id;

        that.otherPage.status.details = that.STATUS.UPDATE

        that.otherPage.PAGE = 'DETAILS'
      }
    }
  }
</script>

<style scoped="scoped">
</style>
