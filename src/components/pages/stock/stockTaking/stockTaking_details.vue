<template>
  <div>
    <div>
      <el-button type="primary" :plain="true" @click="$parent.otherPage.PAGE='INDEX'">返回</el-button>
      <el-button icon="el-icon-loading" class="blue" v-if="initData" type="warning" :plain="true"><span class="red">正在初始化，请稍等。。。</span></el-button>
    </div>
    <div class="input-line">
      <div class="input-block">
        <span>盘点号</span>
        <el-input value="自动生成" disabled v-if="operation == STATUS.ADD"></el-input>
        <el-input v-model="bean.code" disabled v-else></el-input>
      </div>

      <div class="input-block">
        <span>盘点人</span>
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
          <el-button @click="openWarehouse" type="warning" size="mini" style="padding: 5px 5px;" :disabled="operation == STATUS.READ">
            选择
          </el-button>
          <span class="font10">仓库</span>
        </span>
        <el-input v-model="bean.warehouseName" disabled title="仓库" placeholder="仓库" disabled>
        </el-input>
      </div>


      <div class="input-block">
        <span>
          说明
        </span>
        <el-input v-model="bean.description" style="width: 535px" clearable :disabled="operation == STATUS.READ"></el-input>
      </div>

    </div>

    <div class="public-table-header">


      <div class="flexRow" v-if="operation == STATUS.ADD && bean.status == STATUS.UNCOMMIT">
        <span>盘点人：{{bean.createUserName}} ( {{getCreateDateStr(new Date(bean.createTime))}} )</span>
      </div>



      <el-button icon="" @click="add()" size="mini" type="warning" v-if="operation == STATUS.ADD">保存</el-button>
      <el-button icon="" @click="update()" size="mini" type="warning" v-if="operation == STATUS.UPDATE">保存</el-button>
      <el-button icon="" @click="update(true)" size="mini" type="success" v-if="operation == STATUS.UPDATE">提交</el-button>


      <el-button @click="downloadPDF" icon="el-icon-download" class="right" size="mini" type="primary" v-if="operation != STATUS.ADD">下载库存盘点(EXCEL)</el-button>

      <el-button @click="openAddPop" icon="el-icon-s-order" :class="operation != STATUS.ADD? '':'right'" size="mini"
        type="success" v-if="operation != STATUS.READ">添加盘点</el-button>

    </div>

    <el-table :data="addItems" style="width: 100%" default-expand-all cell-class-name="public-table-cell" height="500">
      <el-table-column label="批次号" prop="stockInCode" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="物品" prop="materialName" align="center" min-width="200">
        <template slot-scope="scope">
          <div class="font12">
            {{scope.row.materialName}}(<span class="green">{{scope.row.purchaseUnit == undefined || scope.row.purchaseUnit == ''? '无单位':scope.row.purchaseUnit}}</span>)<br>
            {{scope.row.materialCode}}
            <br>
            <span style="white-space: nowrap;">
              【<span class="blue text-ellipsls">{{scope.row.categoryName == undefined? '未选择类型':scope.row.categoryName}}</span>】
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="条形码" prop="materialBarCode" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="品牌" prop="brandName" align="center" min-width="100">
      </el-table-column>
       <el-table-column label="规格" prop="purchaseSpecification" align="center" min-width="120">
      </el-table-column>
      <el-table-column prop="warehouseName" label="仓库" align="center" min-width="180">
      </el-table-column>

      <el-table-column label="数量(可用数量/实际数量)" prop="basisPrice" align="center" min-width="200" v-if="operation == STATUS.ADD">
        <template slot-scope="scope">
          <span class="blue">{{scope.row.remainNumber}}</span> / <span class="yellow">{{scope.row.beforeNumber}}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="账面数量" prop="beforeNumber" align="center" min-width="160">
        <template slot-scope="scope">
          <template v-if="operation == STATUS.ADD">
            {{scope.row.beforeNumber}}
          </template>
          <template v-else-if="operation == STATUS.UPDATE">
            <template v-if="scope.row.beforeNumber != scope.row.actNumber">
              {{scope.row.beforeNumber}} (<span class="blue">{{scope.row.actNumber}}</span>)<br>
              (<span class="red"><span class="blue">系统账面数量与盘点单创建时</span>不一致</span>)<br>
            </template>
            <template v-else>
              {{scope.row.beforeNumber}}
            </template>
          </template>
          <template v-else>
            {{scope.row.beforeNumber}}
          </template>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="盘点数量" prop="basisPrice" align="center" min-width="160">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.afterNumber" size="mini" controls-position="right" :step="1"
            step-strictly :disabled="operation == STATUS.READ"></el-input-number>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="盘盈(+)/盘亏(-)" prop="basisPrice" align="center" min-width="150">
        <template slot-scope="scope">
          <template v-if="operation == STATUS.ADD">
            <span class="red font-bold" v-if="scope.row.afterNumber - scope.row.beforeNumber > 0">
              + {{ scope.row.afterNumber - scope.row.beforeNumber }}
            </span>
            <span class="green font-bold" v-else-if="scope.row.afterNumber - scope.row.beforeNumber < 0">
              - {{ scope.row.beforeNumber - scope.row.afterNumber }}
            </span>
            <span v-else>
              --
            </span>
          </template>
          <template v-else>
            <span class="red font-bold" v-if="scope.row.afterNumber - scope.row.beforeNumber > 0">
              + {{ scope.row.afterNumber - scope.row.beforeNumber }}
            </span>
            <span class="green font-bold" v-else-if="scope.row.afterNumber - scope.row.beforeNumber < 0">
              - {{ scope.row.beforeNumber - scope.row.afterNumber }}
            </span>
            <span v-else>
              --
            </span>
          </template>
        </template>
      </el-table-column>


      <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="60">
        <template slot-scope="scope">
          <el-button @click="itemSplice(scope.row)" size="mini" type="danger" icon="el-icon-s-release" :disabled="operation == STATUS.READ"
            circle></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 		<pop-bg ref="addItems">
			<add-item></add-item>
		</pop-bg> -->
    <el-dialog :custom-class="['dialog-card','self-card']" :visible.sync="inAdd" :append-to-body="true">
      <add-item slot @itemAppend="itemAppend" @itemSplice="itemSplice" v-if="inAdd && inWhat == 'AI'"></add-item>
      <warehouse-select slot @warehouse="selectWarehouse" :targetId="bean.warehouseId" v-if="inAdd && inWhat == 'W'"></warehouse-select>
    </el-dialog>
  </div>
</template>

<script>
  import addItem from './stockTaking_details_add.vue'
  import warehouseSelect from './stockTaking_details_select.vue'

  export default {
    components: {
      addItem,
      warehouseSelect,
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
          //采购类型
          cruise: [],
          routes: [],
          purchaseOrder: [],
          auditProcess: [],
          warehouse: []
        },

        addItems: [],
        inAdd: false,
        inWhat: null,


        bean: {
          code: "",
          description: "",
          warehouseId: '',
          warehouseName: '',
          createUserName: '',
          updateUserName: "",
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

          if (oldV != null && newV != oldV && oldV != '') {
            this.addItems = [];
          }

        },
        deep: true
      }
    },
    created: function() {
      var that = this;

      if (that.operation !== that.STATUS.ADD) {
        that.initStockTaking();
      } else {
        that.initOptions();
      }


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
            url: '/stock/taking/bean',
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

              that.bean = bean;
              var addItems = JSON.parse(JSON.stringify(bean.list))
              that.addItems = addItems;


              that.initData = false;
            }, 300)


          }).catch((error) => {
            that.errorhanding(error)
          });
        }

        init(that);
      },

      add: function(commit, reSubmit) {
        var that = this;
        var axios = that.axios;

        if (that.checkWay() == false) {
          return;
        }

        axios({
          method: 'post',
          url: '/stock/taking/add',
          data: {
            warehouseId: that.bean.warehouseId,
            //说明
            description: that.bean.description,
            //采购类数量
            list: that.addItems,
            //是否同步数据
            isBeforeNumberSync: reSubmit == null ? false : reSubmit
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
            } else if (data.code == -208) {

              that.dataNeedToSync('ADD');

            } else {
              msg = data.msg;
            }

            that.addSuccess(data.code == that.STATUS.SUCCESS, msg);

          }, 300)


        }).catch((error) => {
          that.errorhanding(error)
        });


      },

      update: function(commit, reSubmit) {
        var that = this;
        var axios = that.axios;

        if (that.checkWay() == false) {
          return;
        }

        var addItems = that.addItems;

        axios({
          method: 'post',
          url: '/stock/taking/update',
          data: {
            id: that.bean.id,
            //仓库Id
            warehouseId: that.bean.warehouseId,
            //说明
            description: that.bean.description,
            //采购类数量
            list: addItems,
            //是否提交
            commit: commit,
            //是否同步数据
            isBeforeNumberSync: reSubmit == null ? false : reSubmit
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
              that.$parent.initTableList();
              if (commit)
                that.operation = that.STATUS.READ;
            } else if (data.code == -208) {

              that.dataNeedToSync('UPDATE');

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
        return;

        var that = this;
        var axios = that.axios;

        that.initData = true;

        axios({
          method: 'post',
          url: '/stock/in/getBack/options',
          data: {
            warehouse: true,
            cruise: true,
            auditProcess: true
          }
        }).then((response) => {
          if (!response) {
            return
          }

          that.initData = false;
          var data = response.data;


          that.options.supplier = data.data.supplier

          var warehouse = data.data.warehouse;
          that.options.warehouse = warehouse;
          that.options.cruise = data.data.cruise;
          that.options.purchaseOrder = data.data.purchaseOrder;
          that.options.auditProcess = data.data.auditProcess;

          if (callBack != undefined && callBack != null) {
            callBack(that);
          } else {
            that.bean.warehouseId = warehouse[0] != undefined ? warehouse[0].id : '';
          }

        });
      },
      //仓库
      initOptionsAgreement: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/stock/in/getBack/options/agreement',
          data: {
            id: that.bean.supplierId
          }
        }).then((response) => {

          if (!response) {
            return
          }

          var data = response.data;

          var list = data.data;

          var supplierAgreementId = that.bean.supplierAgreementId + 0;
          that.bean.supplierAgreementId = '';

          for (var i in list) {
            var demo = list[i];
            if (demo.id == supplierAgreementId) {
              that.bean.supplierAgreementId = supplierAgreementId;
            }
          }

          that.options.supplierAgreement = data.data;

        });
      },
      initOptionsRoute: function(taskId) {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/stock/in/getBack/options/route',
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

          var list = data.data;

          var task;
          for (var index in list) {
            var demo = list[index];
            if (taskId == demo.id) {
              task = taskId;
              break;
            } else {
              task = '';
            }
          }

          that.bean.taskId = task;
          that.options.routes = list;

        });
      },

      checkWay: function() {
        var that = this;

        var isPass = true;
        var msg;
        if (that.bean.warehouseId == '') {

          msg = '请选择<span class="blue">仓库</span>';

          isPass = false;
        }

        if (Array.isArray(that.addItems) && that.addItems.length == 0) {
          msg = '请选择<span class="blue">盘点物品</span>';

          isPass = false;
        }

        if (!isPass) {
          that.$notify({
            title: '警告',
            type: 'warning',
            message: msg,
            duration: 2500,
            dangerouslyUseHTMLString: true
          })
        }

        return isPass;
      },

      dataNeedToSync: function(type) {
        var that = this;
        that.$confirm('当前盘点部分账面数据发生改变，是否自动同步数据并保存？', '提示')
          .then(_ => {

            if (type == 'UPDATE') {
              that.update(true, true);
            } else if (type == 'ADD') {
              that.add(null, true)
            }


          }).catch(_ => {});
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
              if (demo.id == itemDemo.id) {
                that.addItems.splice(index, 1);
                break;
              }
            }
          }).catch(_ => {});

      },
      selectWarehouse: function(target) {
        var that = this;

        // var loading = that.$loading({
        //   lock: true,
        //   // text: 'Loading...',
        //   spinner: 'el-icon-loading',
        //   background: 'rgba(255, 255, 255, 0.7)'
        // });


        that.bean.warehouseId = target.id;
        that.bean.warehouseName = target.name;


      },
      openAddPop: function() {
        var that = this;

        if (that.bean.warehouseId == '') {

          that.$notify({
            title: '警告',
            type: 'warning',
            message: '请选择<span class="blue">仓库</span>',
            duration: 2500,
            dangerouslyUseHTMLString: true
          })

          return
        }

        this.inAdd = true;
        this.inWhat = 'AI';
      },
      openWarehouse: function() {
        var that = this;

        that.inAdd = true;
        that.inWhat = 'W'
      },


      downloadPDF: function() {
        var that = this;
        var axios = that.axios;

        var newTab = window.open('about:blank');

        axios({
          method: 'post',
          url: '/report/getDownload',
          data: {
            type: 'STOCK_TAKING',
            id: that.bean.id
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

      purchaseOrderIdChange: function(newV) {
        var that = this;
        that.$confirm('更改采购类型，将会清空采购单中的所有物品，是否更改？', '提示')
          .then(_ => {

            that.history.purchaseOrderId = newV;
            if (that.bean.status === that.STATUS.UNCOMMIT) {
              that.addItems = [];
              that.bean.items = [];
            }

          })
          .catch(_ => {
            that.bean.purchaseOrderId = that.history.purchaseOrderId;
          });
      },

      sysn: function(type) {
        var that = this;

        var list = that.addItems;
        if (type == 'RATE') {
          var target = that.bean.taxRate;
          for (var i in list) {
            that.addItems[i].taxRate = target;
          }
        } else if (type == 'WAREHOUSE') {
          var target = that.bean.warehouseId;
          for (var i in list) {
            that.addItems[i].warehouseId = target;
          }
        }
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
