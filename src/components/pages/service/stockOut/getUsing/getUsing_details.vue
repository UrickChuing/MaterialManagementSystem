<template>
  <div>
    <div>
      <el-button type="primary" :plain="true" @click="$parent.otherPage.PAGE='INDEX'">返回</el-button>
      <el-button icon="el-icon-loading" class="blue" v-if="initData" type="warning" :plain="true"><span class="red">正在初始化，请稍等。。。</span></el-button>
    </div>
    <!-- {{addItems}} -->
    <div class="input-line">
      <div class="input-block">
        <span>领用单号</span>
        <el-input value="自动生成" disabled v-if="operation == STATUS.ADD"></el-input>
        <el-input v-model="bean.code" disabled v-else></el-input>
      </div>

      <div class="input-block">
        <span>创建人</span>
        <el-input :value="userInfo.name" disabled v-if="operation == STATUS.ADD"></el-input>
        <el-input :value="bean.createUserName" disabled v-else></el-input>
      </div>

      <div class="input-block">
        <span>部门</span>
        <el-input :value="userInfo.organizationName" disabled v-if="operation == STATUS.ADD"></el-input>
        <el-input :value="bean.organizationName" disabled v-else></el-input>
      </div>

      <div class="input-block">
        <span>状态</span>
        <el-select v-model="bean.status" :placeholder="$t('quanbu')" disabled>
          <el-option v-for="(item,statusIndex) in options.status" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </div>

      <br>


      <div class="input-block">
        <span>
          说明
        </span>
        <el-input v-model="bean.description" style="width: 535px" clearable :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"></el-input>
      </div>


      <div class="input-block">
        <span>审批</span>
        <!-- <template v-if="operation != STATUS.READ">
          <el-select class="el-select-font12" v-model="bean.auditProcessId" title="请选择" style="width: 155px;"
            :placeholder="$t('quanbu')" clearable :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ">
            <el-option v-for="item in options.auditProcess" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <el-button @click="initOptions()" icon="el-icon-refresh" plain type="primary" circle :disabled="operation == STATUS.READ"></el-button>
        </template>
        <template v-else>
          <el-input v-model="bean.auditProcessName" disabled></el-input>
        </template> -->
        <el-button @click="inAdd = true ; inWhat = 'AP'" plain :disabled="operation == STATUS.READ">管理</el-button>
      </div>

      <br>


    </div>

    <div class="public-table-header">
      <div class="flexRow" v-if="bean.status != STATUS.UNCOMMIT">
        <el-button size="mini" type="warning" v-if="bean.status == STATUS.AUDIT" key>审核中</el-button>
        <el-button size="mini" type="warning" v-else-if="bean.status == STATUS.PASS" key>已通过审核</el-button>
        <span>最后提交人：{{bean.subUserName}} ( {{getCreateDateStr(new Date(bean.subTime))}} )</span>
      </div>

      <template v-if="bean.status == STATUS.UNCOMMIT">
        <el-button icon="" @click="add()" size="mini" type="success" v-if="operation == STATUS.ADD">保存</el-button>
        <el-button icon="" @click="update()" size="mini" type="success" v-if="operation == STATUS.UPDATE">保存</el-button>
      </template>


      <!-- <el-button @click="add(true)" icon="" size="mini" type="warning" v-if="operation == STATUS.ADD && bean.status == STATUS.UNCOMMIT">直接提交</el-button> -->
      <el-button @click="update(true)" icon="" size="mini" type="warning" v-if="operation == STATUS.UPDATE && bean.status == STATUS.UNCOMMIT">直接提交</el-button>


      <el-button @click="openAddPop" icon="el-icon-s-order" class="right" size="mini" type="success" v-if="bean.status == STATUS.UNCOMMIT && operation != STATUS.READ">添加物品</el-button>
      <input type="file" id="GetUsingExcel" style="display: none;" name="image" @change="excelChange($event)" accept=".xls, .xlsx">
      <el-button @click="uploadClick" type="primary" size="mini" v-if="bean.status == STATUS.UNCOMMIT && operation != STATUS.READ">导入Excel</el-button>
      <a class="flexCenter text-underline margin-left10 font13" v-if="bean.status == STATUS.UNCOMMIT && operation != STATUS.READ" target="_blank" href="/物料领取.xlsx">下载导入模板</a>

    </div>

    <el-table :data="addItems" style="width: 100%" default-expand-all cell-class-name="public-table-cell" height="500"
      :row-class-name="tableRowClassName">
      <!--      <el-table-column label="入库单" prop="code" align="center" min-width="190">
        <template slot-scope="scope">
          {{scope.row.code}}
        </template>
      </el-table-column>
      <el-table-column label="入库类型(相关单号)" prop="code" align="center" min-width="220">
        <template slot-scope="scope">
          <template v-if="scope.row.sourceType != 0">
            {{StockInSourceType.getStr(scope.row.sourceType)}}<br>
            (<span class="blue">{{scope.row.sourceCode}}</span>)
          </template>
          <template v-else>
            --
          </template>
        </template>
      </el-table-column> -->
      <el-table-column label="批次号" prop="stockInCode" align="center" min-width="190">
        <template slot-scope="scope">
          {{scope.row.stockInCode}}
        </template>
      </el-table-column>
      <el-table-column label="物品" prop="materialName" align="center" min-width="230">
        <template slot-scope="scope">
          <div class="font12 text-align-center">
            {{scope.row.materialName}}(<span class="green">{{scope.row.purchaseUnit}}</span>)<br>
            【<span class="blue text-ellipsls">{{scope.row.materialCode}}</span>】
          </div>
        </template>
      </el-table-column>
      <el-table-column label="过期时间" prop="expiration" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="规格" prop="purchaseSpecification" align="center" min-width="120">
      </el-table-column>
      <el-table-column label="单位" prop="purchaseUnit" align="center" min-width="100">
      </el-table-column>


      <el-table-column fixed="right" label="领取" prop="basisPrice" align="center" min-width="140">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.number" :min="1" style="width: 110px;" :step="1.0" controls-position="right"
            size="mini" :disabled="bean.warehouseTypeId=='' || bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"></el-input-number>
        </template>
      </el-table-column>



      <el-table-column fixed="right" label="仓库" prop="warehouseName" align="center" min-width="180">
        <template slot-scope="scope">
          {{scope.row.warehouseName}}<br>
          【<span class="blue">{{scope.row.warehouseTypeName == undefined || scope.row.warehouseTypeName == ''? '--':scope.row.warehouseTypeName}}</span>】
        </template>
      </el-table-column>



      <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="120">
        <template slot-scope="scope">
          <el-button @click="itemSplice(scope.row)" size="mini" type="danger" icon="el-icon-s-release" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"
            circle></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 		<pop-bg ref="addItems">
			<add-item></add-item>
		</pop-bg> -->
    <div style="font-size: 30px;font-weight: 60;text-align: center;">共计:{{addItems.length}}</div>
    <el-dialog :custom-class="['dialog-card','self-card']" :visible.sync="inAdd" :append-to-body="true">
      <add-item slot @itemAppend="itemAppend" @itemSplice="itemSplice" v-if="inAdd && inWhat === 'ADD'"></add-item>
      <audit-process @set="setPorcess" :processId="bean.auditProcessId" :auditProcess="bean.auditProcess" :type="AuditType.value.RECEIVING_MATERIAL"
        v-if="inAdd && inWhat === 'AP'"></audit-process>
    </el-dialog>

    <el-dialog :custom-class="['dialog-card','self-card']" :visible.sync="exportSuccess" :append-to-body="true">
      <batch-add-excel :exportdata="export_data" v-if="exportSuccess"></batch-add-excel>
    </el-dialog>
  </div>
</template>

<script>
  import addItem from './getUsing_details_add.vue';
  import auditProcess from '../../../../util/process/process.vue';

  export default {
    components: {
      addItem,
      auditProcess
    },
    data() {

      return {

        operation: this.$parent.otherPage.status.details,

        userInfo: JSON.parse(sessionStorage.userInfo),

        upload: {
          files: null,
          fileName: null
        },



        options: {
          status: this.ORDER_STATUS,
          auditProcess: []
        },

        addItems: [],
        inAdd: false,
        inWhat: null,
        exportSuccess: false,
        export_data: [],
        export_data_errArr:[],
        bean: {
          code: '',
          subUserName: '',
          organizationName: '',
          status: 0,
          warehouseTypeName: '',
          warehouseTypeTaskName: '',
          supplierName: '',
          supplierCode: '',
          supplierAgreementName: '',
          description: '',
          auditProcessId: ''
        },

        history: {
          type: 1,
          purchaseOrderId: 1
        },

        //正在初始化
        initData: true,

        authAPI: {
          isEdit: true
        },

      }
    },
    watch: {},
    activated: function() {
      var that = this;
      that.initOptions();
      if (that.operation !== that.STATUS.ADD) {
        that.bean = {};
        that.initWarehouseVouchar();
      }
    },
    created: function() {
      var that = this;

      if (that.operation !== that.STATUS.ADD) {
        that.initWarehouseVouchar();
      } else {
        that.initOptions();
      }
    },
    methods: {

      //格式化table数据
      tableRowClassName({
        row,
        rowIndex
      }) {
        if (row.ifExist != undefined) {
          return 'warning-row';
        }
        return '';
      },

      initWarehouseVouchar: function() {


        var that = this;
        var axios = that.axios;

        if (that.$parent.otherPage.data.details.id == '') {
          return
        }

        const init = function(that) {
          that.initData = true;

          axios({
            method: 'post',
            url: '/stock/out/getUsing/bean',
            data: {
              id: that.$parent.otherPage.data.details.id
            }
          }).then((response) => {
            if (!response) {
              return
            }

            var data = response.data;
            if (data.code === -304) {
              that.$parent.otherPage.PAGE = 'INDEX';
              that.initData = false;
              throw data.msg;
            }

            setTimeout(function() {
              var bean = data.data;

              if (bean.status == that.STATUS.NOPASS)
                bean.status = that.STATUS.UNCOMMIT;

              that.bean = bean;

              var addItems = JSON.parse(JSON.stringify(data.data.list))
              that.addItems = addItems;


              that.initData = false;
            }, 300)


          }).catch((error) => {
            that.errorhanding(error)
          });
        }

        that.initOptions(init);
      },

      add: function() {

        var that = this;
        //判断一下错误数据里，还有没有数据
        if(that.export_data_errArr.length > 0){
          that.errorhanding("存在错误数据，请修改");
          return false;
        }

        if (!that.checkSaveAndUpdate()) {
          return;
        }

        var axios = that.axios;

        var addData = that.details;

        var addItems = that.addItems;

        var list = []
        for (var i in addItems) {
          list.push(addItems[i]);
        }


        axios({
          method: 'post',
          url: '/stock/out/getUsing/add',
          data: {
            //说明
            description: that.bean.description,
            //采购类数量
            list: list,
            //审核流程Id
            auditProcess: that.bean.auditProcess
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }

          setTimeout(function() {
            var data = response.data;

            if (data.code == that.STATUS.SUCCESS) {
              var msg = '<div>单号为:<span class="blue">' + data.data + '</span></div>'
              that.$parent.initTableList()
              that.$parent.otherPage.PAGE = 'INDEX'
            } else {
              msg = data.msg;
            }

            that.addSuccess(data.code == that.STATUS.SUCCESS, msg);

          }, 300)


        }).catch((error) => {
          that.errorhanding(error)
        });


      },

      update: function(commit) {

        var that = this;

        if (!that.checkSaveAndUpdate()) {
          return;
        }

        var axios = that.axios;

        var addItems = that.addItems;

        var list = []
        for (var i in addItems) {
          list.push(addItems[i]);
        }

        axios({
          method: 'post',
          url: '/stock/out/getUsing/update',
          data: {
            id: that.bean.id,
            //说明
            description: that.bean.description,
            //采购类数量
            list: list,
            //审核流程Id
            auditProcessId: that.bean.auditProcessId,
            //是否直接提交
            commit: commit,
          },
          df: false
        }).then((response) => {

          setTimeout(function() {
            var data = response.data;

            if (data.code == that.STATUS.SUCCESS) {
              that.addItems = [];
              that.bean.items = [];
              that.updateSuccess(true, '修改成功<br>修改人:<span class="green">' + that.userInfo.name +
                '</span><br>修改时间:<span class="blue">' + that.getCreateDateStr(new Date()) + '</span>')
              that.initWarehouseVouchar();
              that.$parent.initTableList();

              if (commit)
                that.$parent.otherPage.PAGE = 'INDEX';

            } else {
              that.updateSuccess(false, data.msg)
            }

          }, 300)


        }).catch((error) => {
          that.errorhanding(error)
        });
      },


      //初始化options数据
      initOptions: function(callBack) {

        var that = this;

        that.initData = false;

        if (callBack != undefined && callBack != null) {
          callBack(that);
        }

        return;

        var axios = that.axios;

        axios({
          method: 'post',
          url: '/stock/out/getUsing/options',
          data: {}
        }).then((response) => {
          if (!response) {
            return
          }

          that.initData = false;
          var data = response.data;

          that.options.auditProcess = data.data.auditProcess;

          if (that.operation == that.STATUS.ADD && that.bean.auditProcessId == '' && data.data.auditProcess.length !=
            0) {
            that.bean.auditProcessId = data.data.auditProcess[0].id;
          }

          if (callBack != undefined && callBack != null) {
            callBack(that);
          }

        });
      },

      checkSaveAndUpdate: function() {
        var that = this;

        var pass = true;

        // if (that.bean.auditProcessId == '') {
        //   var msg = '请选择<span class="blue">审核流程</span>';
        //   pass = false;
        // }


        if (!pass) {
          that.$notify({
            title: '警告',
            type: 'warning',
            message: msg,
            duration: 3000,
            dangerouslyUseHTMLString: true
          });
        }

        return pass;
      },

      itemAppend: function(target) {

          var that = this;
          var demoParsee = JSON.parse(JSON.stringify(target));

          var addItems = that.addItems;

          var isHere = -1;
          for (var index in addItems) {
            var demo = addItems[index];
            if (demo.stockInId == demoParsee.stockInId) {
              isHere = index;
            }
          }

          target.fillNumber = target.actNumber;

          if (isHere == -1)
            that.addItems.push(target);
        }

        ,
      itemSplice: function(demo) {

        var that = this;

        var addItems = that.addItems;
        that.$confirm('您确定要删除吗？', '提示')
          .then(_ => {
            for (var index = 0; index < addItems.length; index++) {
              var itemDemo = addItems[index];
              //
              if (demo.materialId == itemDemo.materialId) {
                //[1,2,3]
                that.addItems.splice(index, 1);
                //[2,3]
                //判断数组是否包含某一个值，不存在返回-1 否则返回其他
                let err_index = that.export_data_errArr.indexOf(demo.materialId);
                //存在,说明移除的就是错误
                if(err_index > -1){
                    that.export_data_errArr.splice(err_index,1);
                    console.log('移除错误元素：' + that.export_data_errArr.length)
                }
                break;
              }
            }
          }).catch(_ => {});
      },

      openAddPop: function() {
        var that = this;

        if (that.bean.purchaseOrderId == '') {

          that.$notify({
            title: '警告',
            type: 'warning',
            message: '请选择<span class="blue">采购订单</span>',
            duration: 3000,
            dangerouslyUseHTMLString: true
          })

          return
        }

        this.inAdd = true;
        this.inWhat = 'ADD';
      },

      setPorcess: function(process) {
        this.bean.auditProcess = process;
      },
      excelUpload: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/stock/out/getUsing/add/excel/list',
          data: {
            excel: that.excelFile,
            lang: that.$i18n.locale
          },
          loading: true
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          if (data.code === that.STATUS.SUCCESS) {
           if(data.data.length > 0){
             for(var i = 0;i<data.data.length;i++){
               if(data.data[i].ifExist != undefined ){
                 data.data[i].materialId = i+1; //假ID  因为i是从0开始的，所以这里+1
                 that.export_data_errArr.push(data.data[i].materialId);
               }
             }
           }
           console.log('异常数组长度：'+that.export_data_errArr.length)
           that.addItems = data.data;
          } else {
            throw data.msg;
          }
        }).catch((error) => {

          that.errorhanding('导入模板有误，请检查')
        });


      },


      uploadClick: function() {
        var files = document.getElementById('GetUsingExcel');
        files.value = '';

        files.click();
      },
      excelChange: function() {
        var that = this;
        var axios = that.axios;

        let files = document.getElementById('GetUsingExcel');
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
      }

    }
  }
</script>

<style scoped="scoped">
  .table-in-table {
    height: 36px;
  }

  .table-in-table>div {
    height: 36px;
    line-height: 36px;
  }

  .table-input-number.disabled {
    background: rgba(245, 247, 250, 1);
  }

  .table-input-number:focus {
    border: 1px solid rgba(64, 158, 255, 1);
    background: white;
  }

  .table-input-number {
    padding: 0px 15px;
    border-radius: 5px;
    border: 1px solid #DCDFE6;
    width: 48px;
    height: 30px;
    transition: .2s;
    text-align: center;
    width: 39px;
  }



  .more-width {
    width: 600px !important;
  }

  .upload-button-div {
    border: solid 1px rgba(220, 220, 220, 1);
    background: white;
    height: 28px;
    line-height: 28px;
    margin-top: 5px;
    margin-bottom: 5px;
    padding: 0px 10px;
    border-radius: 5px;
  }

  .upload-button-div>span {
    border-radius: 3px;
    border: solid 1px rgba(220, 220, 220, 1);
    height: 20px;
    margin-top: 4px;
    margin-bottom: 4px;
    font-size: 12px;
    padding: 0px 10px;
    background: white;
  }

  .upload-button-div>button {
    font-size: 12px;
    background: rgba(64, 158, 255, 1);
    color: white;
    height: 20px;
    margin-top: 2px;
    margin-bottom: 2px;
    border-radius: 2px;
    padding: 0px 5px;
    margin-left: 5px;
  }

  .upload-button-div>button:hover {
    background: rgba(102, 177, 255, 1);
  }

  .upload-button-div:hover {
    background: rgba(220, 250, 255, 1);
  }
</style>
