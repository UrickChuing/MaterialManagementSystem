<template>
  <div>
    <div>
      <el-button type="primary" :plain="true" @click="$parent.otherPage.PAGE='INDEX'">返回</el-button>
      <el-button icon="el-icon-loading" class="blue" v-if="initData" type="warning" :plain="true"><span class="red">正在初始化，请稍等。。。</span></el-button>
    </div>
    <div class="input-line">
      <div class="input-block">
        <span>调配单号</span>
        <el-input value="自动生成" disabled v-if="operation == STATUS.ADD"></el-input>
        <el-input v-model="bean.code" disabled v-else></el-input>
      </div>

      <div class="input-block">
        <span>调配人</span>
        <el-input :value="userInfo.name" disabled v-if="operation == STATUS.ADD"></el-input>
        <el-input :value="bean.createUserName" disabled v-else></el-input>
      </div>

      <div class="input-block">
        <span>部门</span>
        <el-input :value="userInfo.organizationName" disabled v-if="operation == STATUS.ADD"></el-input>
        <el-input :value="bean.organizationName" disabled v-else></el-input>
      </div>

      <br>

      <div class="input-block">
        <span class="text-align-left">
          <el-button @click="openWarehouse" type="warning" size="mini" style="padding: 5px 5px;" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ">
            选择
          </el-button>
          <span class="font10">仓库</span>
        </span>
        <el-input v-model="bean.warehouseName" disabled title="仓库" placeholder="仓库" disabled>
        </el-input>
      </div>

      <div class="input-block">
        <span>
          <el-button @click="sysn('WAREHOUSE')" size="mini" type="warning" style="padding: 5px 5px;" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ">同步</el-button>
          <span class="font10">目标仓库</span>
        </span>
        <el-select v-model="targetWarehouse" :placeholder="bean.status != STATUS.UNCOMMIT? '已提交':'请选择目标仓库'" @change="selectuser"
          :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ">
          <el-option v-for="item in options.warehouse.list" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
          <el-pagination class="flexCenter" @size-change="initOptionsWarehouse" @current-change="initOptionsWarehouse"
            :current-page.sync="options.warehouse.page" :page-size="options.warehouse.pageSize" layout=" prev, pager, next"
            :total="options.warehouse.total">
          </el-pagination>
        </el-select>
      </div>

      <div class="input-block">
        <span>审批</span>
        <!-- <el-select class="el-select-font12" v-model="bean.auditProcessId" title="请选择" :placeholder="$t('quanbu')" style="width: 155px;"
           :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ">
          <el-option v-for="item in options.auditProcess" :key="item.id" :label="item.name == ''? '未命名流程':item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button @click="initOptions" icon="el-icon-refresh" plain type="primary" circle :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"
          key></el-button> -->
        <el-button @click="inAdd = true ; inWhat = 'AP'" plain :disabled="operation == STATUS.READ">管理</el-button>
      </div>

      <br>

      <div class="input-block">
        <span>
          说明
        </span>
        <el-input v-model="bean.description" style="width: 535px" clearable :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"></el-input>
      </div>

    </div>

    <div class="public-table-header">

      <div class="flexRow" v-if="bean.status != STATUS.UNCOMMIT">
        <el-button size="mini" type="warning" v-if="bean.status == STATUS.AUDIT" key>审核中</el-button>
        <div class="flexRow" v-if="bean.status == STATUS.PASS">
          <span>调配人：{{bean.createUserName}} ( {{getCreateDateStr(new Date(bean.createTime))}} )</span>
        </div>
        <span>最后提交人：{{bean.subUserName}} ( {{getCreateDateStr(new Date(bean.subTime))}} )</span>
      </div>

      <template v-if="bean.status == STATUS.UNCOMMIT">
        <el-button icon="" @click="add()" size="mini" type="success" v-if="operation == STATUS.ADD">保存</el-button>
        <el-button icon="" @click="update()" size="mini" type="success" v-if="operation == STATUS.UPDATE">保存</el-button>
      </template>


      <el-button @click="openAddPop" icon="el-icon-s-order" class="right" size="mini" type="success" v-if="operation == STATUS.ADD && operation != STATUS.READ">添加调配</el-button>

    </div>

    <el-table :data="addItems" style="width: 100%" default-expand-all cell-class-name="public-table-cell" height="500">
      <el-table-column label="批次号" prop="code" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="物品编号" align="center" min-width="150">
        <template slot-scope="scope">
          <div class="font12">
            {{scope.row.materialCode}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="物品" prop="materialName" align="center" min-width="200">
        <template slot-scope="scope">
          <div class="font12">
            {{scope.row.materialName}}<br>(<span class="green">{{scope.row.purchaseUnit == undefined || scope.row.purchaseUnit == ''? '无单位':scope.row.purchaseUnit}}</span>)<br>
            <span style="white-space: nowrap;">
              【<span class="blue text-ellipsls">{{scope.row.categoryName == undefined? '未选择类型':scope.row.categoryName}}</span>】
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="条形码" prop="barCode" align="center" min-width="180">
      </el-table-column>
       <el-table-column label="规格" prop="purchaseSpecification" align="center" min-width="120">
      </el-table-column>
      <el-table-column label="品牌" prop="brandName" align="center" min-width="100">
      </el-table-column>

      <el-table-column fixed="right" label="可用数量(实际数量)" prop="basisPrice" align="center" min-width="150">
        <template slot-scope="scope">
          {{scope.row.remainNumber}} (<span class="blue">{{scope.row.actNumber}}</span>)
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="调配数量" prop="beforeNumber" align="center" min-width="150">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.number" size="mini" controls-position="right" :step="1" step-strictly
            :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"></el-input-number>
        </template>
      </el-table-column>

      <el-table-column fixed="right" prop="basisPrice" align="center" min-width="180">
        <template slot="header" slot-scope="scope">
          目标仓库 <el-button type="primary" icon="el-icon-refresh" size="small" circle plain :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"></el-button>
        </template>

        <template slot-scope="scope">
          <el-select v-model="scope.row.warehouseId" placeholder="请选择目标仓库" @change="selectuser" size="small" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ">
            <el-option v-for="item in options.warehouse.list" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
            <el-pagination class="flexCenter" @size-change="initOptionsWarehouse" @current-change="initOptionsWarehouse"
              :current-page.sync="options.warehouse.page" :page-size="options.warehouse.pageSize" layout=" prev, pager, next"
              :total="options.warehouse.total">
            </el-pagination>
          </el-select>


        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="120">
        <template slot-scope="scope">
          <el-button @click="itemSplice(scope.row)" size="mini" type="danger" icon="el-icon-s-release" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"
            circle></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :custom-class="['dialog-card','self-card']" :visible.sync="inAdd" :append-to-body="true">
      <add-item slot @itemAppend="itemAppend" @itemSplice="itemSplice" v-if="inAdd && inWhat == 'AI'"></add-item>
      <warehouse-select slot @warehouse="selectWarehouse" :targetId="bean.warehouseId" v-if="inAdd && inWhat == 'W'"></warehouse-select>
      <audit-process @set="setPorcess" :processId="bean.auditProcessId" :auditProcess="bean.auditProcess" :type="AuditType.value.MATERIAL_MOVE"
        v-if="inAdd && inWhat === 'AP'"></audit-process>
    </el-dialog>

  </div>
</template>

<script>
  import addItem from './stockMoving_details_add.vue';
  import warehouseSelect from './stockMoving_details_select.vue.vue';
  import auditProcess from '../../../util/process/process.vue';

  export default {
    components: {
      addItem,
      warehouseSelect,
      auditProcess
    },
    data() {

      return {

        operation: this.$parent.otherPage.status,

        userInfo: JSON.parse(sessionStorage.userInfo),

        upload: {
          files: null,
          fileName: null
        },

        options: {
          status: this.ORDER_STATUS,
          auditProcess: [],
          warehouse: {
            page: 1,
            pageSize: 10,
            total: 10,
            list: []
          }
        },

        addItems: [],
        inAdd: false,
        inWhat: null,
        targetWarehouse: '',

        bean: {
          code: "",
          description: "",
          warehouseId: '',
          warehouseName: '',
          createUserName: '',
          updateUserName: "",
          auditProcessId: '',
          status: 0,
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
    watch: {
      'bean.warehouseId': {
        handler: function(newV, oldV) {
          if (oldV != '' && newV != oldV && this.operation != this.STATUS.READ)
            this.addItems = [];
        },
        deep: true
      }
    },
    activated: function() {
      var that = this;
      that.initOptionsWarehouse();
      if (that.operation !== that.STATUS.ADD) {
        that.bean = {};
        that.initStockTaking();
      }
    },
    created: function() {
      var that = this;
      if (that.operation !== that.STATUS.ADD) {
        that.initStockTaking();
      } else {
        that.initOptions();
      }

      that.initOptionsWarehouse();


    },
    methods: {

      initStockTaking: function() {
        var that = this;
        var axios = that.axios;
        if (that.$parent.otherPage.data.details.id == '') {
          return
        }

        const init = function(that) {
          that.initData = true;
          axios({
            method: 'post',
            url: '/stock/allocation/bean',
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

              var addItems = JSON.parse(JSON.stringify(data.data.list));

              that.addItems = addItems;


              that.initData = false;
            }, 300)


          }).catch((error) => {
            that.errorhanding(error)
          });
        }

        that.initOptions(init);
      },

      add: function(commit) {
        var that = this;
        var axios = that.axios;

        if (that.checkWay() == false) {
          return;
        }

        for (var index in that.addItems) {
          var demo = that.addItems[index];
          if (that.bean.warehouseId == demo.warehouseId) {
            that.notic(false, '提交', '物品【<span class="blue">' + demo.materialName +
              '</span>】还在原来的仓库中<br>请<span class="red">更换</span><span class="green">目标仓库</span>')
            return;
          }
        }

        axios({
          method: 'post',
          url: '/stock/allocation/add',
          data: {
            //仓库Id
            warehouseId: that.bean.warehouseId,
            //说明
            description: that.bean.description,
            //采购类数量
            list: that.addItems,
            //审批流程Id
            auditProcess: that.bean.auditProcess
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }

          setTimeout(function() {
            var data = response.data;

            var msg = '';
            if (data.code == that.STATUS.SUCCESS) {
              msg = '<div>单号为:<span class="blue">' + data.data + '</span></div>'
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
        var axios = that.axios;

        var addItems = that.addItems;

        axios({
          method: 'post',
          url: '/stock/allocation/update',
          data: {
            id: that.bean.id,
            //仓库Id
            warehouseId: that.bean.warehouseId,
            //说明
            description: that.bean.description,
            //采购类数量
            list: addItems,
            //审批流程Id
            auditProcessId: that.bean.auditProcessId,
            //是否直接提交
            commit: commit
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
              that.initStockTaking();
              that.$parent.initTableList()
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
        this.initData = false;

        var that = this;
        var axios = that.axios;

        that.initData = true;

        axios({
          method: 'post',
          url: '/stock/allocation/options',
          data: {
            auditProcess: false
          }
        }).then((response) => {
          if (!response) {
            return
          }

          that.initData = false;
          var data = response.data;

          var auditProcess = data.data.auditProcess;

          // that.options.auditProcess = auditProcess;

          // if(auditProcess.length != 0){
          //   that.bean.auditProcessId = auditProcess[0].id;
          // }

          if (callBack != undefined && callBack != null) {
            callBack(that);
          } else {

          }

        });
      },
      //仓库
      initOptionsWarehouse: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/stock/allocation/options/warehouse',
          data: {
            page: that.options.warehouse.page,
            pageSize: that.options.warehouse.pageSize
          },
          df: false
        }).then((response) => {

          if (!response) {
            return
          }

          var data = response.data;

          var list = data.data;

          that.options.warehouse.list = data.data;
          that.options.warehouse.total = data.total;

        }).catch(error => {
          that.errorhanding(error)
        });
      },

      checkWay: function() {
        var that = this;

        var msg = null;
        if (that.bean.warehouseId == '') {
          msg = '请选择<span class="blue">仓库</span>';
        }

        // if (that.bean.auditProcessId == '') {
        //   msg = '请选择<span class="blue">审核流程</span>';
        // }

        if (msg != null) {
          that.$notify({
            title: '警告',
            type: 'warning',
            message: msg,
            duration: 2500,
            dangerouslyUseHTMLString: true
          })
        }

        return msg == null;
      },

      uploadClick: function() {
        document.getElementById('excel').click();
      },
      excelChange: function() {


        var that = this;

        let files = document.getElementById('excel').files;
        let file = document.getElementById('excel').files[0];

        if (files == undefined) {
          return
        }

        that.upload.file = file;
        that.upload.fileName = file.name;

      },

      itemAppend: function(target) {
        var that = this;
        var demoParsee = JSON.parse(JSON.stringify(target));

        var addItems = that.addItems;

        //是否在这
        var isHere = -1;
        for (var index in addItems) {
          var demo = addItems[index];
          if (demo.stockInId == demoParsee.stockInId) {
            isHere = index;
          }
        }

        // target.number = target.remainNumberIn;

        if (isHere == -1)
          that.addItems.push(target)
      },
      itemSplice: function(demo) {

        var that = this;

        var addItems = that.addItems;

        that.$confirm('您确定要删除吗？', '提示')
          .then(_ => {
            for (var index = 0; index < addItems.length; index++) {
              var itemDemo = addItems[index];
              if (demo.stockInId == itemDemo.stockInId) {
                that.addItems.splice(index, 1);
                break;
              }
            }
          }).catch(_ => {});

      },
      selectWarehouse: function(target) {
        var that = this;

        that.bean.warehouseId = target.id;
        that.bean.warehouseName = target.name;
      },
      openAddPop: function() {
        var that = this;

        if (!that.checkWay()) {
          return;
        }

        this.inAdd = true;
        this.inWhat = 'AI';
      },
      openWarehouse: function() {
        var that = this;

        that.inAdd = true;
        that.inWhat = 'W'
      },

      downloadExcelDemo: function() {
        var that = this;
        var href = that.axios.defaults.baseURL + '/excel/excelCaiGouShenQingDang.xlsx';
        window.open(href);
      },

      sysn: function(type) {
        var that = this;

        var list = that.addItems;
        if (type == 'WAREHOUSE') {
          var target = that.targetWarehouse;
          for (var i in list) {
            that.addItems[i].warehouseId = target;
          }
        }
      },

      setPorcess: function(process) {
        this.bean.auditProcess = process;
      },

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
