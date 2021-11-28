<template>
  <div>
    <div class="margin-top15" v-if="$parent.tree.select != null">

      <div class="input-line">
        <div class="input-block">
          <span>协议名</span>
          <el-input v-model="reason.name" style="width: 150px;" placeholder="搜索协议名" clearable></el-input>
        </div>

        <el-button id="shore_warehouse" @click="initTableList" :icon="table.inSelect? 'el-icon-refresh' :'el-icon-search'"
          :type="table.inSelect? 'warning' :'success'" :disabled="table.inSelect">搜索</el-button>

      </div>

      <div class="public-table-header">

        <el-button @click="$parent.addAgreement()" type="success" class="margin-right10" style="margin-left: auto;"
          size="mini">添加协议</el-button>

      </div>

      <el-table :data="table.list" style="width: 100%" height="450px" cell-class-name="public-table-cell">
        <el-table-column label="协议代码" prop="code" align="center" min-width="100">
        </el-table-column>
        <el-table-column label="协议名称" prop="name" align="center" min-width="180">
        </el-table-column>
        <el-table-column label="有效时间" align="center" min-width="190">
          <template slot-scope="scope">
            自：{{ scope.row.dateFrom == undefined? '--' :getCreateDateStr(new Date(scope.row.dateFrom)) }}<br>
            至：{{ scope.row.dateTo == undefined? '--' :getCreateDateStr(new Date(scope.row.dateTo)) }}
          </template>
        </el-table-column>
        <el-table-column label="添加时间" prop="createTime" align="center" min-width="180">
          <template slot-scope="scope">
            {{ getCreateDateStr(new Date(scope.row.createTime)) }}
          </template>
        </el-table-column>
        <el-table-column label="启用" align="center" min-width="190">
          <template slot-scope="scope">
            <el-switch @change="($event)=>{updateStatus(scope.row.id,$event)}" v-model="scope.row.isDelete"
              active-color="#13ce66" inactive-color="grey" :active-value="false" :inactive-value="true">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="255">
          <template slot-scope="scope">
            <el-button @click="filesManager.open = true;filesManager.supplierAgreementId = scope.row.id" type="primary"
              size="mini">文件管理</el-button>
            <el-button @click="$parent.updateAgreement(scope.row)" type="success" size="mini">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flexCenter margin-top20">
        <el-pagination @size-change="(val)=>{table.pageSize=val;initOrganization()}" @current-change="(val)=>{table.page=val;initOrganization()}"
          :current-page="table.page" :page-sizes="[10, 20, 30, 40 , 50]" :page-size="table.pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="table.total">
        </el-pagination>
      </div>

      <el-dialog :custom-class="['dialog-card','self-card','mini']" :visible.sync="filesManager.open" :append-to-body="true">
        <div class="padding20 padding-top0">
          <div class="flexCenter">
            <h2>文件列表</h2>
          </div>

          <div class="public-table-header">
            <input type="file" id="fileInput" style="display: none;" name="image" @change="fileChange($event)">
            <el-button @click="uploadClick" class="right" type="primary" size="mini">上传文件</el-button>
          </div>



          <div class="flexColumn" v-if="filesManager.list.length != 0">
            <div class="file-line" v-for="file in filesManager.list">
              <div class="file-line-left youCanNotChoose">
                <span class="text-ellipsls" :title="file.fileName">{{file.fileName}}</span>
                <div class="text-ellipsls" :title="file.filePath">
                  {{file.filePath}}
                </div>
              </div>
              <div class="file-line-right flexRow">
                <a :href="axios.defaults.baseURL + '/' + file.filePath" class="flexCenter margin-right20" target="view_window">下载</a>
                <a @click="fileDelete(file.fileName)" class="red flexCenter pointer">删除</a>
              </div>
            </div>
          </div>
          <div class="flexCenter margin-top10" v-else>
            暂无数据
          </div>
        </div>
      </el-dialog>

    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {

        supplierId: null,

        reason: {
          name: '',
          code: '',
          supplierId: null
        },

        table: {
          list: [],
          page: 1,
          pageSize: 10,
          total: 0,
          inSelect: false,
          inAdd: false
        },

        filesManager: {
          file: null,
          open: false,
          supplierAgreementId: '',
          list: []
        }

      }
    },
    watch: {
      supplierId: {
        handler: function(newV) {
          this.initTableList()
        },
        deep: true
      },
      'filesManager.open': {
        handler: function(newV, oldV) {

          if (newV)
            this.initFileList();
          else
            this.filesManager.list = [];

        },
        deep: true
      }
    },
    created: function() {

    },
    methods: {
      initTableList: function() {
        var that = this;
        var axios = that.axios;

        that.reason.supplierId = that.supplierId

        axios({
          method: 'post',
          url: '/supplierAgreement/list',
          data: {
            reason: that.reason,
            page: that.table.page,
            pageSize: that.table.pageSize
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          that.table.list = data.data;
          that.table.total = data.total;

        }).catch((error) => {
          that.errorhanding(error)
        })
      },

      //更新状态
      updateStatus: function(id, status) {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/supplierAgreement/update/status',
          data: {
            id: id,
            status: status
          },
          df: true
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          if (data.code == that.STATUS.SUCCESS) {
            that.updateSuccess(true)
            that.initTableList();
          }else{
            throw data.msg;
          }
        }).catch((error) => {
          that.errorhanding(error)
        })

      },

      initFileList: function() {
        var that = this;
        var axios = that.axios;
        axios({
          method: 'post',
          url: '/supplierAgreement/file/list',
          data: {
            id: that.filesManager.supplierAgreementId
          },
          df: true
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          that.filesManager.list = data.data;

        }).catch((error) => {
          that.errorhanding(error)
        })
      },

      fileDelete: function(name) {
        var that = this;
        var axios = that.axios;
        that.$confirm('您确定要删除吗？', '提示')
          .then(_ => {
        axios({
          method: 'post',
          url: '/supplierAgreement/file/delete',
          data: {
            fileName: name,
            id: that.filesManager.supplierAgreementId
          },
          loading: true
        }).then((response) => {
          that.initTableList();
          if (!response) {
            return;
          }
          var data = response.data;

          if (data.code === that.STATUS.SUCCESS) {
            that.notic(true, '删除文件')
            that.initFileList();
          } else {
            throw data.msg;
          }

        }).catch((error) => {
          that.errorhanding(error)
        })
        done();
        })
        .catch(_ => {});


      },


      uploadClick: function() {
        var files = document.getElementById('fileInput');
        files.value = '';

        files.click();
      },

      fileChange: function() {
        var that = this;
        var axios = that.axios;

        let files = document.getElementById('fileInput');
        let file = files.files[0]
        if (file == undefined) {
          return
        }

        let name = file.name
        let arr = name.split('.')
        // console.log(arr);
        // image/jpg,image/jpeg,image/png
        var nameSuffix = arr[arr.length - 1];
        if (nameSuffix == '') {

          that.$notify.error({
            title: that.$t('错误'),
            message: that.$t('未检测到文件类型，请上传正确的文件(非文件夹)'),
            duration: 5000
          });
          return false;
        }
        let fileSize = 0;
        let fileMaxSize = 1024 * 1024 * 10; //10M
        if (file) {
          fileSize = file.size;
          if (fileSize > fileMaxSize) {
            that.$notify.error({
              title: '错误',
              message: '文件过大(大于 10 Mb )',
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
        that.filesManager.file = file;
        that.fileUpload();
      },

      fileUpload: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/supplierAgreement/file/upload',
          data: {
            file: that.filesManager.file,
            id: that.filesManager.supplierAgreementId
          },
          loading: true
        }).then((response) => {
          that.initTableList();
          if (!response) {
            return;
          }
          var data = response.data;

          if (data.code === that.STATUS.SUCCESS) {
            that.notic(true, '上传')
            that.initFileList();
          } else {
            throw data.msg;
          }

        }).catch((error) => {
          that.errorhanding(error)
        });


      },

    }

  }
</script>

<style scoped="scoped">
  .file-line {
    display: flex;
    flex-direction: row;
    padding: 10px 10px;
    border-radius: 5px;
  }

  .file-line:hover {
    background: rgba(116, 206, 196, 0.1);
    color: #1598ED;
  }

  .file-line-left {
    display: flex;
    flex-direction: column;
    width: calc(100% - 90px);
    margin-right: 10px;
  }

  .file-line-right {
    width: 80px;
  }

  .file-line-left>span:first-child {
    font-size: 16px;
    width: 100%;
    height: 30px;
    line-height: 30px;
  }

  .file-line-left>div:last-child {
    font-size: 12px;
    width: 100%;
  }
</style>
