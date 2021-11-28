<template>
  <div class="flexRowWarp">

    <div class="tree-card">
      <div class="tree-card-header">
        <div></div>
        <div style="margin-left: auto;">
          <!-- <el-button size="mini" @click="tree.inAdd=!tree.inAdd" type="success" v-if="tree.select != null && tree.level != 4 && !tree.inAdd">添加子库</el-button> -->
          <el-button size="mini" @click="tree.select = null;tree.click=null;tree.level=0;tree.edit = null;" type="primary"
            v-if="tree.select != null">取消选择</el-button>
          <el-button size="mini" @click="deleteWarehouse()" type="danger" v-if="tree.select != null">删除库</el-button>
          <el-button size="mini" @click="tree.inAdd=!inAdd;" type="success" v-if="tree.click==nunll">添加库</el-button>
        </div>
      </div>
      <div class="tree-node-block youCanNotChoose" v-for="node1 in tree.list">
        <div :class="['tree-node-item' , tree.click == node1.id? 'fucos':'']" @click="tree.click = node1.id;tree.select = node1;tree.level=1;">
          <div>
            <!-- <i @click="node1.open = !node1.open;" class="el-icon-minus" v-if="node1.children != undefined && node1.open"></i>
						<i @click="node1.open = !node1.open;" class="el-icon-plus" v-if="node1.children != undefined && !node1.open"></i> -->
          </div>
          <div class="flexCenter">
            {{node1.name}}
          </div>
          <div class="margin-left-auto margin-right15" :class="[node1.organizationNumber==0? 'red':'blue']">

          </div>
        </div>
      </div>

    </div>

    <w-detail ref="warehouse" class="warehouse-card"></w-detail>


  </div>
</template>

<script>
  import wDetail from './details.vue'

  export default {
    name: 'cangkuguanli',
    components: {
      wDetail
    },
    data() {
      return {

        tree: {
          list: [],
          click: null,
          select: null,
          level: 0,
          inAdd: false
        },

      }
    },
    watch: {
      'tree.select': {
        handler: function(newV) {
          var that = this;

          this.$refs.warehouse.warehouse = JSON.parse(JSON.stringify(newV));
          that.tree.inAdd = false;
        },
        deep: true
      },
      'tree.inAdd': {
        handler: function(newV) {
          var that = this;

          this.$refs.warehouse.inAdd = newV

        },
        deep: true
      }
    },
    beforeRouteEnter: function(to, from, next) {
      next((that) => {

      })
    },
    created: function() {
      var that = this;

      that.initTree();
    },
    methods: {

      initTree: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/warehouse/list',
          data: {},
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;

          that.tree.list = data.data

        }).catch((error) => {
          that.errorhanding(error)
        })

      },


      deleteWarehouse: function(id) {
        var that = this;
        var axios = that.axios;

        var ids = [that.tree.select.id];

        that.$confirm('确定删除仓库？', '提示')
          .then(_ => {

            axios({
              method: 'post',
              url: '/warehouse/delete',
              data: {
                ids: ids
              }
            }).then((response) => {
              if (!response) {
                return;
              }
              var data = response.data;
              if (data.code == that.STATUS.SUCCESS) {
                that.updateSuccess(true)
                that.initTree();
                that.tree.click = null;
                that.tree.select = null;
                that.tree.inAdd = false;
                that.tree.level = 0;
              }
            }).catch((error) => {
              that.errorhanding(error)
            })

          })
          .catch(_ => {});

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
