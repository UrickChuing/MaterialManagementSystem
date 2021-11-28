<template>

  <div>
    <div>
      <el-button type="primary" :plain="true" @click="$parent.otherPage.PAGE='INDEX'">返回</el-button>
      <el-button icon="el-icon-loading" class="blue" v-if="initData" type="warning" :plain="true"><span class="red">正在初始化，请稍等。。。</span></el-button>
    </div>
    <div class="input-line">

      <!--  {{addItems}} -->

      <div class="input-block">
        <span>申请单号</span>
        <el-input value="自动生成" disabled v-if="operation == STATUS.ADD"></el-input>
        <el-input v-model="bean.code" disabled v-else></el-input>
      </div>

      <div class="input-block">
        <span>申请人</span>
        <el-input :value="userInfo.name" disabled v-if="operation == STATUS.ADD"></el-input>
        <el-input :value="bean.subUserName" disabled v-else></el-input>
      </div>

      <div class="input-block">
        <span>申请人部门</span>
        <el-input :value="userInfo.organizationName" disabled v-if="operation == STATUS.ADD"></el-input>
        <el-input :value="bean.organizationName" disabled v-else></el-input>
      </div>

      <div class="input-block">
        <span>状态</span>
        <el-select v-model="bean.status" :placeholder="$t('quanbu')" clearable disabled>
          <el-option v-for="(item,statusIndex) in options.status" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div class="input-block">
        <span>邮轮</span>
        <el-select v-model="bean.warehouseTypeId" @change="cruiseChange" :placeholder="$t('quanbu')" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"
          clearable>
          <el-option v-for="item in options.cruise" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>

      <div class="input-block">
        <span>航次</span>
        <el-select v-model="bean.taskId" title="请选择邮轮" :placeholder="bean.warehouseTypeId==''? '请选择邮轮':$t('quanbu')"
          clearable :disabled="bean.warehouseTypeId=='' || bean.status != STATUS.UNCOMMIT || operation == STATUS.READ">
          <el-option style="height: 50px;" v-for="item in options.routes" :key="item.id" :label="item.taskName" :value="item.id">
            <div style="line-height: 25px;">
              <span>{{item.taskName}}</span> <br>
              <span class="font6"><span class="blue">{{item.startTime}}</span><span class="red">~~</span><span class="blue">{{item.endTime}}</span></span>
            </div>
          </el-option>
        </el-select>
      </div>



      <div class="input-block">
        <span>仓库</span>
        <el-select v-model="bean.warehouseId" :placeholder="bean.warehouseTypeId==''? '请选择邮轮':$t('quanbu')" clearable
          :disabled="bean.warehouseTypeId=='' || bean.status != STATUS.UNCOMMIT || operation == STATUS.READ" v-if="operation != STATUS.READ">
          <el-option v-for="item in options.warehouse" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <el-input v-model="bean.warehouseName" disabled v-else></el-input>
      </div>

      <div class="input-block">
        <span>说明</span>
        <el-input v-model="bean.description" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"></el-input>
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

      <div class="input-block">
        <span>备注</span>
        <el-input v-model="bean.remark" class="more-width" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"></el-input>
      </div>


    </div>

    <div class="public-table-header">

      <div class="flexRow" v-if="bean.status != STATUS.UNCOMMIT">
        <el-button size="mini" type="warning" v-if="bean.status == STATUS.AUDIT">审核中</el-button>
        <el-button size="mini" type="warning" v-else>已通过审核</el-button>
        <span>最后提交人：{{bean.subUserName}} ( {{getCreateDateStr(new Date(bean.subTime))}} )</span>
      </div>

      <el-button icon="" @click="add()" size="mini" type="success" v-if="operation == STATUS.ADD">保存</el-button>
      <el-button icon="" @click="update()" size="mini" type="success" v-if="operation == STATUS.UPDATE">保存</el-button>

      <el-button @click="update(true)" icon="" size="mini" type="warning" v-if="operation == STATUS.UPDATE && bean.status == STATUS.UNCOMMIT">直接提交</el-button>


      <el-button @click="openAddPop" icon="el-icon-s-order" class="right" size="mini" type="success" v-if="bean.status == STATUS.UNCOMMIT && operation != STATUS.READ">添加物品</el-button>
      <input type="file" id="purchaseRequestExcel" style="display: none;" name="image" @change="excelChange($event)"
        accept=".xls, .xlsx">
      <el-button @click="uploadClick" type="primary" size="mini" v-if="bean.status == STATUS.UNCOMMIT && operation != STATUS.READ" >导入Excel</el-button>
      <a class="flexCenter text-underline margin-left10 font13"  v-if="bean.status == STATUS.UNCOMMIT && operation != STATUS.READ" target="_blank" href="/采购申请模板.xlsx">下载导入模板</a>

      <!-- <div class="upload-button-div pointer" @click="uploadClick" v-if="falsess">
        <i class="el-icon-upload"></i>
        <span :style="{padding:upload.fileName == null?'0px 20px':''}">
          {{upload.fileName == null? '没有文件...':upload.fileName}}
        </span>
        <button class="pointer">选择</button>
      </div>

      <input style="display: none;" id="excel" type="file" @change="excelChange" accept="application/vnd.ms-excel" />
      <el-button @click="excelToTable" icon="el-icon-plus" size="mini" type="primary" v-if="false">通过文件导入</el-button>

      <el-button @click="downloadExcelDemo" icon="el-icon-download" size="mini" type="primary" v-if="false">下载模板</el-button>

      <el-button @click="downloadPDF" icon="el-icon-download" size="mini" type="primary" v-if="false">下载PDF</el-button> -->

    </div>

    <el-table :data="addItems" style="width: 100%;border-top: 1px solid #EBEEF5;" max-height="490px" cell-class-name="public-table-cell"
      :row-class-name="tableRowClassName">
      <el-table-column label="代码" prop="code" align="center" min-width="175">
      </el-table-column>
      <el-table-column label="物品名称" prop="name" align="center" min-width="120">
      </el-table-column>
      <el-table-column label="物品条码" prop="barCode" align="center" min-width="160">
      </el-table-column>
      <el-table-column label="规格" prop="purchaseSpecification" align="center" min-width="120">
      </el-table-column>
      <el-table-column label="品牌" prop="materialBrandName" align="center" min-width="210">
      </el-table-column>
      <el-table-column label="单位" prop="purchaseUnit" align="center" min-width="80">
        <template slot-scope="scope">
          {{ scope.row.purchaseUnit }}
        </template>
      </el-table-column>
      <el-table-column label="部门库存" align="center">
        <el-table-column label="可用库存" align="center" min-width="120">
          <template slot-scope="scope">
            {{ scope.row.availOStock }}
          </template>
        </el-table-column>
        <el-table-column label="总库存" align="center" min-width="120">
          <template slot-scope="scope">
            {{ scope.row.totalOStock }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="全部库存" align="center">
        <el-table-column label="可用库存" align="center" min-width="120">
          <template slot-scope="scope">
            {{ scope.row.availStock }}
          </template>
        </el-table-column>
        <el-table-column label="总库存" prop="applicantName" align="center" min-width="120">
          <template slot-scope="scope">
            {{ scope.row.totalStock }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column fixed="right" label="数量" align="center" min-width="140">
        <template slot-scope="scope">
          <input v-model="scope.row.number" @change="" class="table-input-number" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"></input>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" min-width="290">
        <template slot-scope="scope" slot="header">
          <div class="text-align-center">
            <span>参考价格</span><br>
            <span>当前总价：<span class="blue">{{ totalPrice() }}</span></span>
          </div>
        </template>
        <el-table-column label="单价" align="center" min-width="140">
          <template slot-scope="scope">
            <input v-model="scope.row.price" @beforeupdate="log('asd')" class="table-input-number" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"></input>
          </template>
        </el-table-column>
        <el-table-column label="小计" align="center" min-width="150">
          <template slot-scope="scope">
            {{ FloatOb.multiply(scope.row.price,scope.row.number)}}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" min-width="60">
        <template slot-scope="scope">
          <el-button @click="itemSplice(scope.row)" size="mini" type="danger" icon="el-icon-s-release" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"
            circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="font-size: 30px;font-weight: 60;text-align: center;">共计:{{addItems.length}}</div>
    <el-dialog :custom-class="['dialog-card','self-card']" :visible.sync="inAdd" :append-to-body="true">
      <add-item slot @itemAppend="itemAppend" @itemSplice="itemSplice" v-if="inAdd && inWhat === 'AM'"></add-item>
      <audit-process @set="setPorcess" :processId="bean.auditProcessId" :auditProcess="bean.auditProcess" :type="AuditType.value.PURCHASE_REQUEST"
        v-if="inAdd && inWhat === 'AP'"></audit-process>
    </el-dialog>

    <!-- <el-dialog :custom-class="['dialog-card','self-card']" :visible.sync="exportSuccess" :append-to-body="true">
      <batch-add-excel :exportdata="export_data" v-if="exportSuccess"></batch-add-excel>
    </el-dialog> -->
  </div>

</template>

<script>
  import addItem from './detailsAddItem.vue';
  import auditProcess from '../../../util/process/process.vue';
  /* import batchAddExcel from './batch_addExcel.vue'
   */
  export default {
    components: {
      auditProcess,
      addItem,
      /* batchAddExcel */
    },
    data() {
      return {
        operation: this.$parent.otherPage.status.details,
        userInfo: JSON.parse(sessionStorage.userInfo),
        options: {
          cruise: [],
          warehouse: [],
          routes: [],
          status: this.ORDER_STATUS
        },

        addItems: [],
        inAdd: false,
        //导入数据预览状态
        export_data_error:0,
    /*    export_data_count: 0, */
        inWhat: null,
        export_data_errArr:[],
        bean: {
          //邮轮
          warehouseTypeId: '',
          //航次
          taskId: '',
          //状态
          status: 0,
          //仓库Id
          warehouseId: '',
          //说明
          description: '',
          //备注
          remark: '',
          //采购类数量
          items: [],
          //流程
          auditProcess: null
        },

        //正在初始化
        initData: true,

        authAPI: {
          isEdit: true
        },

        history: {
          warehouseId: null,
          taskId: null,
          warehouseTypeId: null,
        }

      }
    },
    watch: {
      'addItems': {
        handler: function(newV, oldV) {
          var numberReg = /^[0-9]{0,}$/
          var priceReg = /^[0-9]{0,}[.][0-9]{0,3}$/
          var that = this;
          for (var i in newV) {
            var demo = newV[i]
            console.log("num", demo.number)
            //判断数量是否为整数
            if (!numberReg.test(demo.number)) {
              demo.number = parseInt(demo.number);
              if (isNaN(demo.number)) {
                demo.number = 10;
              }
            } else {
              if (this.bean.items[i] != undefined) {
                this.bean.items[i].number = parseInt(demo.number);
              }
            }
            //判断价格是正常
            if (!priceReg.test(demo.price)) {
              demo.price = parseFloat(demo.price);
              if (isNaN(demo.price)) {
                demo.price = that.bean.items[i].price == "" ? 0 : that.bean.items[i].price;
              }
              var priceDemo = demo.price == "" ? 0 + '' : demo.price + '';
              var priceParts = priceDemo.split(".");

              if (priceParts.length == 2) {
                if (priceParts[1].length > 3) {
                  var target = priceParts[1].substring(0, 3);
                  demo.price = priceParts[0].trim() + '.' + target.trim();
                }
              }

            } else {
              if (this.bean.items[i] != undefined) {
                this.bean.items[i].price = parseInt(demo.price);
              }
            }
          }
        },
        deep: true
      },
      'bean.warehouseId': {
        handler: function(newV) {
          this.history.warehouseId = newV;
        },
        deep: true
      },
      'bean.taskId': {
        handler: function(newV) {
          this.history.taskId = newV;
        },
        deep: true
      },
      'bean.warehouseTypeId': {
        handler: function(newV) {
          if (newV != '') {
            this.initOptionsRoute();
            this.initOptionsWarehouse();
          } else {
            this.bean.taskId = '';
          }
        },
        deep: true
      }
    },
    activated: function() {
      var that = this;
      that.initOptions();
      if (that.operation !== that.STATUS.ADD) {
        that.bean = {};
        that.addItems = [];
        that.initPurchaseRequest();
      }
    },
    created: function() {
      var that = this;
      that.initOptions();

      if (that.operation !== that.STATUS.ADD) {
        that.initPurchaseRequest();
      } else {
        // that.authAPI.isEdit = false
      }
    },
    methods: {
      log: function(msg) {
        console.log(msg)
      },
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

      initPurchaseRequest: function() {

        var that = this;
        var axios = that.axios;


        const init = function(that) {
          that.initData = true;

          axios({
            method: 'post',
            url: '/purchaseRequest/bean',
            data: {
              id: that.$parent.otherPage.data.details.purchaseRequestId
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

              if (bean.status == that.STATUS.NOPASS) {
                bean.status = that.STATUS.UNCOMMIT;
              }

              var beanItem = []

              //复制 items
              var addItems = JSON.parse(JSON.stringify(bean.items));
              //删除原数据 items
              bean.items = [];
              that.bean = bean;
              that.history.warehouseId = bean.warehouseId;
              that.history.taskId = bean.taskId;
              that.history.warehouseTypeId = bean.warehouseTypeId;

              //将复制的数据添加
              for (var i in addItems) {
                var demo = addItems[i];
                that.itemAppend(demo, true);
              }


              that.initData = false;
            }, 300)


          }).catch((error) => {
            that.errorhanding(error)
          });
        }

        that.initOptions(init);

      },
       //添加保存
      add: function(commit) {
        var that = this;

        if(that.export_data_errArr.length > 0){
           that.errorhanding('存在错误数据，请修改');
           return false;
        }


        var axios = that.axios;

        var list = that.addItems;
        var items = [];
        for (var index in list) {
          var demo = list[index];
          items.push({
            materialId: demo.id,
            number: demo.number,
            price: demo.price
          })
        }

        axios({
          method: 'post',
          url: '/purchaseRequest/order/add',
          data: {
          
            //邮轮
            warehouseTypeId: that.bean.warehouseTypeId,
            //航次
            taskId: that.bean.taskId,
            //仓库Id
            warehouseId: that.bean.warehouseId,
            //说明
            description: that.bean.description,
            //备注
            remark: that.bean.remark,
            //审批
            auditProcess: that.bean.auditProcess,
            //采购类数量
            items: items,
            //是否直接提交
            status: commit == undefined ? null : commit ? 1 : null,
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }

          if (response.data.code != that.STATUS.SUCCESS) {
            throw response.data.msg;
          }

          setTimeout(function() {
            var data = response.data;

            if (data.code == that.STATUS.SUCCESS) {
              var msg = '<div>单号为:<span class="blue">' + data.data + '</span></div>'
              that.$parent.initTableList()
              that.$parent.otherPage.PAGE = 'INDEX'
            }

            that.addSuccess(data.code == that.STATUS.SUCCESS, msg);

          }, 300)


        }).catch((error) => {
          that.errorhanding(error)
        });


      },

      update: function(commit) {
        var that = this;
        var axios = that.axios;

        var list = that.addItems;
        var items = [];
        for (var index in list) {
          var demo = list[index];
          items.push({
            materialId: demo.id,
            number: demo.number,
            price: demo.price
          })
        }

        axios({
          method: 'post',
          url: '/purchaseRequest/order/update',
          data: {
            id: that.bean.id,
            //邮轮
            warehouseTypeId: that.bean.warehouseTypeId,
            //航次
            taskId: that.bean.taskId,
            //仓库Id
            warehouseId: that.bean.warehouseId,
            //说明
            description: that.bean.description,
            //备注
            remark: that.bean.remark,
            //采购类数量
            items: items,
            //是否直接提交
            status: commit == undefined ? null : commit ? 1 : null,
          },
          df: false
        }).then((response) => {

          setTimeout(function() {
            var data = response.data;

            if (data.code == that.STATUS.SUCCESS) {
              that.addItems = [];
              that.bean.items = [];
              that.updateSuccess(true, '修改成功<br>修改人:<span class="green">' + that.userInfo.name +
                '</span><br>单号:<span class="blue">' + that.bean.code + '</span>')
              that.initPurchaseRequest();
              that.$parent.initTableList();
              if (commit)
                that.$parent.otherPage.PAGE = 'INDEX'
            } else {
              that.notic(false, commit == undefined ? "保存" : "提交", data.msg)
            }

          }, 300)


        }).catch((error) => {
          that.errorhanding(error)
        });
      },


      //初始化options数据
      initOptions: function(callBack) {

        var that = this;
        var axios = that.axios;

        that.initData = true;

        axios({
          method: 'post',
          url: '/purchaseRequest/options',
          data: {
            organization: false,
            cruise: true,
            warehouse: true,
            auditProcess: false
          }
        }).then((response) => {
          if (!response) {
            return
          }

          that.initData = false;
          var data = response.data;

          that.options.cruise = data.data.cruise;

          if (that.operation == that.STATUS.ADD && that.bean.warehouseTypeId == '' && data.data.cruise.length !=
            0) {
            that.bean.warehouseTypeId = data.data.cruise[0].id;
          }

          that.options.warehouse = data.data.warehouse;

          if (callBack != undefined && callBack != null) {
            callBack(that);
          }

        });
      },
      //航次
      initOptionsRoute: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/purchaseRequest/options/task',
          data: {
            reason: {
              warehouseTypeId: that.bean.warehouseTypeId
            }
          },
          df: false
        }).then((response) => {

          if (!response) {
            return
          }

          var data = response.data;
          that.options.routes = data.data;

        });
      },
      //仓库
      initOptionsWarehouse: function() {
        //失效
        return;

        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/purchaseRequest/options/warehouse',
          data: {
            reason: {
              warehouseTypeId: that.bean.warehouseTypeId
            }
          },
          df: false
        }).then((response) => {

          if (!response) {
            return
          }

          var data = response.data;
          that.options.warehouse = data.data;

        });
      },

      cruiseChange: function(newV) {
        var that = this;
        if (newV == '') {
          that.bean.warehouseId = '';
          that.bean.taskId = '';
        }
        // that.$confirm('更改邮轮，将会重置航次和仓库，是否更改？', '提示')
        //   .then(_ => {

        //     that.history.warehouseId = that.bean.warehouseId;
        //     that.history.taskId = that.bean.taskId;
        //     that.history.warehouseTypeId = newV;

        //     that.bean.warehouseId = '';
        //     that.bean.taskId = '';

        //   })
        //   .catch(_ => {
        //     that.bean.warehouseTypeId = that.history.warehouseTypeId;
        //     that.bean.warehouseId = that.history.warehouseId;
        //     that.bean.taskId = that.history.taskId;
        //   });
      },
      excelUpload: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/purchaseRequest/add/excel/list',
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
                    data.data[i].id = i+1; //假ID
                    that.export_data_errArr.push(data.data[i].id);
                 /* that.export_data_error ++; */
                }
                if(data.data[i].price == undefined || data.data[i].number == undefined){
                  if(data.data[i].price == undefined){
                    data.data[i].price = 0;
                  }
                  if(data.data[i].number == undefined){
                    data.data[i].number = 0;
                  }
                }
               }
            }
            that.addItems = data.data;
           /* that.export_data_count = data.data.length; */

          } else {
            throw data.msg;
            //that.errorhanding('存在错误数据，请修改');
          }

        }).catch((error) => {
          that.errorhanding('导入模板有误，请检查')
        });


      },


      uploadClick: function() {
        var files = document.getElementById('purchaseRequestExcel');
        files.value = '';

        files.click();
      },
      /* excelChange: function() {


        var that = this;

        let files = document.getElementById('excel').files;
        let file = document.getElementById('excel').files[0];

        if (files == undefined) {
          return
        }

        that.upload.file = file;
        that.upload.fileName = file.name;

      },
 */
      excelChange: function() {
        var that = this;
        var axios = that.axios;

        let files = document.getElementById('purchaseRequestExcel');
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

      itemAppend: function(demo, notPop) {
        var that = this;

        var demoParsee = JSON.parse(JSON.stringify(demo));

        if (notPop != undefined && notPop)
          demoParsee.price = demo.price == undefined ? 0 : demo.price;
        else
          demoParsee.price = demo.popPrice == undefined ? 0 : demo.popPrice;
        delete demoParsee.popPrice;

        var item = {
          materialId: demoParsee.id,
          number: demoParsee.number,
          price: demoParsee.price
        }

        //用于 接口参数
        that.bean.items.push(item);
        //用于 显示
        that.addItems.push(demoParsee);
        that.export_data_count++;


      },
      itemSplice: function(demo) {
        var that = this;
        //这里是页面列表的所有数据
        var addItems = that.addItems;
        that.$confirm('您确定要删除？', '提示')
          .then(_ => {
            for (var index = 0; index < addItems.length; index++) {
              var itemDemo = addItems[index];
              if (demo.id == itemDemo.id) {
                that.addItems.splice(index, 1);
                //判断数组是否包含某一个值，不存在返回-1 否则返回其他
                let err_index = that.export_data_errArr.indexOf(demo.id);
                //存在,说明移除的就是错误
                if(err_index > -1){
                    that.export_data_errArr.splice(err_index,1);
                    console.log('移除错误元素：' + that.export_data_errArr.length)
                }
          /*
                that.export_data_count--;
                that.export_data_error--;
                that.bean.items.splice(index, 1); */
                break;
              }
            }
          }).catch(_ => {});

      },

      openAddPop: function() {
        this.inAdd = true;
        this.inWhat = 'AM';
      },

      downloadPDF: function() {
        var that = this;
        var href = that.axios.defaults.baseURL + '/purchaseRequest/download.do?purchaseRequisitionID=' + that.details
          .purchaseRequisitionID
        window.open(href);
      },

      downloadExcelDemo: function() {
        var that = this;
        var href = that.axios.defaults.baseURL + '/excel/excelCaiGouShenQingDang.xlsx';
        window.open(href);
      },

      totalPrice: function() {
        var that = this;

        var total = 0;
        for (var index in that.addItems) {
          var demo = that.addItems[index];
          total = that.FloatOb.add(total, that.FloatOb.multiply(demo.price, demo.number))
        }
        return total;
      },

      setPorcess: function(process) {
        this.bean.auditProcess = process;
      }
    }
  }
</script>


<style scoped="scoped">
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
    width: 62px;
    height: 30px;
    transition: .2s;
    text-align: center;
  }

  .input-line {}

  .input-block {
    display: inline-block;
    margin-top: 10px;
    width: auto;
    margin-right: 20px;
  }

  .input-block>span {
    display: inline-block;
    width: 90px;
    text-align: right;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    padding: 0px 10px;
    border-radius: 5px;
    background: rgba(240, 240, 240, 1);
    margin-right: -5px;
  }

  .input-block>div {
    display: inline-block;
    width: 200px;
  }


  .more-width {
    width: 534px !important;
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
