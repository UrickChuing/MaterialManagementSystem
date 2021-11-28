<template>
  <div class="flexRowWarp">

    <div class="tree-card">
      <div class="tree-card-header">

        <div></div>
        <div style="margin-left: auto;">
          <el-button size="mini" @click="cruise.select = null;cruise.click=null;cruise.level=0;cruise.edit = null;"
            type="primary" v-if="cruise.select != null">取消选择</el-button>
          <el-button size="mini" @click="deleteCruise()" type="danger" v-if="cruise.select != null">删除邮轮</el-button>
          <el-button size="mini" @click="cruise.inAdd=!cruise.inAdd" type="success" v-if="cruise.select == null">添加邮轮</el-button>
        </div>

      </div>

      <template v-for="node1 in cruise.list">
        <div v-if="node1.isLoading">
        </div>
        <div class="tree-node-block youCanNotChoose" v-else>
          <div :class="['tree-node-item' , cruise.click == node1.id? 'fucos':'']" @click="cruise.click = node1.id;cruise.select = node1;">
            <div>

            </div>
            <div class="flexCenter">
              {{node1.name}}
            </div>
          </div>
        </div>
      </template>



      <el-dialog title="邮轮名称(最大12位)" width="500px" :visible.sync="cruise.inAdd" :modal-append-to-body="false"
        :append-to-body="true">

        <div class="flexRow">
          <el-input v-model="cruise.name" maxlength="12"></el-input>
          <el-button @click="addCruise" type="success">确认添加</el-button>
        </div>

      </el-dialog>

    </div>

    <e-detail ref="cruise" class="warehouse-card"></e-detail>


  </div>
</template>

<script>
  import eDetail from './details.vue'

  export default {
    name: 'youlunguanli',
    components: {
      eDetail
    },
    data() {
      return {

        cruise: {
          list: [],
          click: null,
          select: null,
          inAdd: false,
          name: ''
        },

      }
    },
    watch: {
      'cruise.select': {
        handler: function(newV) {
          var that = this;


          this.$refs.cruise.cruise = JSON.parse(JSON.stringify(newV));
          try {
            this.$refs.cruise.updateName = (JSON.parse(JSON.stringify(newV))).name;
          } catch (e) {

          }

          that.cruise.inAdd = false;
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

      that.initCruise();
    },
    methods: {

      initCruise: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/cruise/list',
          data: {
            reason: {
              type: 0
            }
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;

          var list = data.data;
          // that.$set(that.cruise,'list',list);
          that.cruise.list = list;

          if (list.length != 0) {
            that.cruise.click = list[0].id;
            that.cruise.select = list[0];
            that.cruise.inAdd = false;
          } else {
            that.cruise.list.push({
              isLoading: true
            })
          }

          that.$forceUpdate();

        }).catch((error) => {
          that.errorhanding(error)
        })

      },

      addCruise: function() {
        var that = this;
        var axios = that.axios;

        var name = that.cruise.name;
        name = name == undefined ? '' : that.cruise.name + '';

        if (name === '') {
          that.notics.warning('请输入邮轮名称');
          return;
        }

        axios({
          method: 'post',
          url: '/cruise/add',
          data: {
            name: that.cruise.name
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }

          var data = response.data;
          if (data.code == that.STATUS.SUCCESS) {
            that.addSuccess(true);
            that.initCruise();
            that.cruise.click = null;
            that.cruise.select = null;
            that.cruise.inAdd = false;
          } else {
            that.addSuccess(false, data.msg)
          }

        }).catch((error) => {
          that.errorhanding(error)
        })

      },


      deleteCruise: function() {
        var that = this;
        var axios = that.axios;

        that.$confirm('确定删除邮轮？', '提示')
          .then(_ => {
            axios({
              method: 'post',
              url: '/cruise/delete',
              data: {
                id: that.cruise.select.id
              },
              df: false
            }).then((response) => {
              if (!response) {
                return;
              }
              var data = response.data;
              if (data.code == that.STATUS.SUCCESS) {
                that.deleteSuccess(true)
                that.initCruise();
                that.cruise.click = null;
                that.cruise.select = null;
                that.cruise.inAdd = false;
              } else {
                that.deleteSuccess(false)
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
