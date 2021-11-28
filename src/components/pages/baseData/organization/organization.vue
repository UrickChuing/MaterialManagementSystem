<template>
  <div class="flexRowWarp">

    <div class="tree-card">
      <div class="tree-card-header">
        <div></div>
        <div style="margin-left: auto;">
          <el-button size="mini" @click="organization.select = null;organization.click=null;organization.level=0;organization.edit = null;"
            type="primary" v-if="organization.select != null">取消选择</el-button>
          <el-button size="mini" @click="deleteOrganization()" type="danger" v-if="organization.select != null">删除部门</el-button>
          <el-button size="mini" @click="organization.inAdd=!organization.inAdd" type="success" v-if="organization.select == null">添加部门</el-button>
        </div>

      </div>
      <template v-if="organization.list.length != 0">
        <div class="tree-node-block youCanNotChoose" v-for="node1 in organization.list">
          <div :class="['tree-node-item' , organization.click == node1.id? 'fucos':'']" @click="organization.click = node1.id;organization.select = node1;">
            <div>

            </div>
            <div class="flexCenter">
              {{node1.name}}
            </div>
          </div>
        </div>
      </template>


      <el-dialog title="类名(最大12位)" width="500px" :visible.sync="organization.inAdd" :modal-append-to-body="false"
        :append-to-body="true">

        <div class="flexRow">
          <el-input v-model="organization.name" maxlength="64"></el-input>
          <el-button @click="addOrganization" type="success">确认添加</el-button>
        </div>

      </el-dialog>

    </div>

    <o-detail ref="organization" class="warehouse-card"></o-detail>


  </div>
</template>

<script>
  import oDetail from './details.vue'

  export default {
    name: 'bumengguanli',
    components: {
      oDetail
    },
    data() {
      return {

        organization: {
          list: [],
          click: null,
          select: null,
          inAdd: false,
          name: ''
        },

      }
    },
    watch: {
      'organization.select': {
        handler: function(newV) {
          var that = this;


          that.$refs.organization.organization = JSON.parse(JSON.stringify(newV));
          that.$refs.organization.updateName = (JSON.parse(JSON.stringify(newV))).name;
          that.$refs.organization.user.table.list = []
          that.$refs.organization.initTableList();
          that.organization.inAdd = false;
        },
        deep: true
      }
    },
    beforeRouteEnter: function(to, from, next) {
      next((that) => {
        that.initOrganization();
      })
    },
    created: function() {
      var that = this;

      that.initOrganization();
    },
    methods: {

      initOrganization: function(id) {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/organization/list',
          data: {
            reason: {},
            page: 1
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;

          var list = data.data;
          that.organization.list = list;

          if (id != undefined) {
            for (var oIndex in list) {
              var oDemo = list[oIndex];
              if (oDemo.id == id) {
                that.organization.click = oDemo.id;
                that.organization.select = oDemo;
              }
            }
            that.$forceUpdate();
          } else if (Array.isArray(list) && list.length != 0) {
            that.organization.click = list[0].id;
            that.organization.select = list[0];
          }


        }).catch((error) => {
          that.errorhanding(error)
        })

      },

      addOrganization: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/organization/add',
          data: {
            name: that.organization.name
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          if (data.code == that.STATUS.SUCCESS) {
            that.addSuccess(true)
            that.initOrganization();
            that.organization.click = null;
            that.organization.select = null;
            that.organization.inAdd = false;
          }
        }).catch((error) => {
          that.errorhanding(error)
        })

      },


      deleteOrganization: function() {
        var that = this;
        var axios = that.axios;

        that.$confirm('确定删除部门？', '提示')
          .then(_ => {
            axios({
              method: 'post',
              url: '/organization/delete',
              data: {
                id: that.organization.select.id
              },
              df: false
            }).then((response) => {
              if (!response) {
                return;
              }
              var data = response.data;
              if (data.code == that.STATUS.SUCCESS) {
                that.deleteSuccess(true)
                that.initOrganization();
                that.organization.click = null;
                that.organization.select = null;
                that.organization.inAdd = false;
              }
            }).catch((error) => {
              that.errorhanding(error)
            })
          }).catch(_ => {});



      },

      getIds: function(target) {
        var ids = [];
        ids.push(target.id);

        function get(list) {

          for (var i in list) {
            var demo = list[i];
            ids.push(demo.id);
            if (demo.children != undefined && demo.children != null) {
              get(demo.children);
            }
          }

        }
        get(target.children);
        return ids;
      }


    }
  }
</script>

<style scoped="scoped">
  .warehouse-card {
    min-width: 65%;
    min-height: 700px;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.3);
    padding: 10px;
    flex: 1;
    margin-right: 10px;
  }
</style>
