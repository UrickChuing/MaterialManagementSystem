<template>
  <div>
    <div class="public-table-header">
      <div>
        <el-input v-model="reason.name" size="mini" style="width: 150px;" placeholder="搜索仓库名" clearable></el-input>
        <el-button id="shore_warehouse" @click="initTableList" size="mini" :icon="table.inSelect? 'el-icon-refresh' :'el-icon-search'"
          :type="table.inSelect? 'warning' :'success'" :disabled="table.inSelect" circle></el-button>
      </div>

      <el-button @click="table.inAdd = true;" type="success" class="margin-right10" style="margin-left: auto;" size="mini">添加仓库</el-button>

    </div>

    <el-table :data="table.list" style="width: 100%" height="450px" cell-class-name="public-table-cell">
      <el-table-column label="序号" type="index" align="center" min-width="48">
        <template slot-scope="scope">
          <span>{{(table.page - 1) * table.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓库名" prop="name" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="体积(m³)" prop="volum" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="承重(KG)" prop="bearing" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="添加时间" prop="createTime" align="center" min-width="180">
        <template slot-scope="scope">
          {{ getCreateDateStr(new Date(scope.row.createTime)) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="230">
        <template slot-scope="scope">
          <el-button @click="deleteWarehouse(scope.row,false)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="height: 32px;margin-top: 10px;"></div>

    <el-dialog title="添加仓库" :modal-append-to-body="false" :append-to-body="true" :visible.sync="table.inAdd" width="700px"
      center>

      <div class="public-table-header" style="margin-top: 0px;" @keydown.enter="initWarehouse">
        <div>
          <el-input v-model="warehouse.reason.name" size="mini" style="width: 150px;" placeholder="搜索仓库名" clearable></el-input>
          <el-button @click="initWarehouse()" size="mini" :icon="warehouse.table.inSelect? 'el-icon-refresh' :'el-icon-search'"
            :type="warehouse.table.inSelect? 'warning' :'success'" :disabled="warehouse.table.inSelect" circle></el-button>
        </div>

      </div>

      <el-table :data="warehouse.table.list" style="width: 100%" cell-class-name="public-table-cell">
        <el-table-column label="序号" type="index" align="center" min-width="48">
          <template slot-scope="scope">
            <span>{{(warehouse.table.page - 1) * warehouse.table.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="仓库名" prop="name" align="center" min-width="180">
        </el-table-column>
        <el-table-column label="体积(m³)" prop="volum" align="center" min-width="180">
        </el-table-column>
        <el-table-column label="承重(KG)" prop="bearing" align="center" min-width="180">
        </el-table-column>
        <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="60">
          <template slot-scope="scope">
            <el-button icon="el-icon-plus" v-if="!scope.row.add" @click="addWarehouse(scope.row)" type="success" size="mini"
              :disabled="warehouse.table.inSelect" circle></el-button>
            <el-button icon="el-icon-minus" v-else @click="deleteWarehouse(scope.row,true)" type="danger" size="mini"
              :disabled="warehouse.table.inSelect" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flexCenter margin-top20">
        <el-pagination @size-change="(val)=>{warehouse.table.pageSize=val;initWarehouse()}" @current-change="(val)=>{warehouse.table.page=val;initWarehouse()}"
          :current-page="warehouse.table.page" :page-sizes="[10, 20, 30, 40 , 50]" :page-size="warehouse.table.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="warehouse.table.total">
        </el-pagination>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    props: ["shore"],
    data() {
      return {

        parent: this.$parent,

        updateName: null,

        reason: {
          warehouseTypeId: this.shore.id,
          name: ''
        },
        table: {
          list: [],
          total: 0,
          page: 1,
          pageSize: 10,
          inSelect: false,
          inAdd: false
        },

        warehouse: {
          reason: {
            name: ''
          },
          table: {
            list: [],
            page: 1,
            pageSize: 10,
            total: 0,
            inSelect: false,
          }
        }


      }
    },
    watch: {
      'table.inAdd': {
        handler: function(newV) {
          if (newV) {
            this.initWarehouse();
          } else {
            this.warehouse.reason.name = '';
            this.warehouse.table.page = 1;
            this.warehouse.table.pageSize = 10;
          }
        },
        deep: true
      },
      'shore': {
        handler: function() {
          this.initTableList()
        },
        deep: true
      }

    },
    created: function() {
      this.initTableList()
    },
    methods: {

      initTableList: function(initWarehouse) {
        var that = this;
        var axios = that.axios;
        that.table.inSelect = true;

        axios({
          method: 'post',
          url: '/cruise/warehouse/list',
          data: {
            reason: {
              warehouseTypeId: that.shore.id,
            },
            page: that.table.page
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }

          setTimeout(function() {

            that.table.inSelect = false;
            var data = response.data;

            that.table.list = data.data;
            that.table.total = data.total;
            if (initWarehouse) {
              that.initWarehouse();
            }
          }, 300)

        }).catch((error) => {
          that.table.inSelect = false;
          that.errorhanding(error)
        })
      },


      initWarehouse: function() {
        var that = this;
        var axios = that.axios;
        that.warehouse.table.inSelect = true;
        axios({
          method: 'post',
          url: '/warehouse/list',
          data: {
            page: that.warehouse.table.page,
            pageSize: that.warehouse.table.pageSize,
            reason: {
              notInWarehouseBaseType: true,
              warehouseTypeId: that.shore.id,
              name: that.warehouse.reason.name
            }
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }

          setTimeout(function() {

            that.warehouse.table.inSelect = false;
            var data = response.data;

            var warehouseList = data.data;
            that.warehouse.table.total = data.total;


            var knownList = that.table.list
            for (var warehouseIndex in warehouseList) {
              var warehouseDemo = warehouseList[warehouseIndex];
              //赋予 属性add 是否已被添加
              warehouseDemo.add = false;
              for (var knowIndex in knownList) {
                var knowDemo = knownList[knowIndex];
                if (warehouseDemo.id === knowDemo.warehouseId) {
                  warehouseDemo.add = true;
                  warehouseDemo.warehouseBaseTypeId = knowDemo.id;
                  break;
                }
              }
            }
            that.warehouse.table.list = warehouseList;
          }, 300)

        }).catch((error) => {
          that.table.inSelect = false;
          that.errorhanding(error)
        })

      },

      addWarehouse: function(row) {

        var that = this;
        var axios = that.axios;
        row.add = true;
        axios({
          method: 'post',
          url: '/cruise/warehouse/add',
          data: {
            warehouseId: row.id,
            warehouseTypeId: that.shore.id
          },
          loading: true,
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          if (data.code == that.STATUS.SUCCESS) {
            that.addSuccess(true);
            that.initTableList(true);
            row.add = true;
          }
        }).catch((error) => {
          that.errorhanding(error)
        })

      },

      deleteWarehouse: function(row, inner) {
        var that = this;
        var axios = that.axios;
        var id;
        if (inner) {
          row.add = true;
          id = row.warehouseBaseTypeId
        } else {
          id = row.id
        }
        that.$confirm('您确定要删除吗？', '提示')
          .then(_ => {
            axios({
              method: 'post',
              url: '/cruise/warehouse/delete',
              data: {
                id: id
              },
              loading: true,
              df: false
            }).then((response) => {
              if (!response) {
                return;
              }
              var data = response.data;
              if (data.code == that.STATUS.SUCCESS) {
                that.deleteSuccess(true);
                /* that.initTableList(true); */
                if (inner) {
                  row.add = true;
                }
                that.initTableList(true);
              }

            }).catch((error) => {
              that.errorhanding(error)
            })
            done();
          })
          .catch(_ => {});

      },


    }
  }
</script>

<style>
</style>
