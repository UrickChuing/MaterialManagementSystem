<template>
  <div class="flexRowWarp">

    <div class="tree-card">
      <div class="tree-card-header">
        <div></div>
        <div style="margin-left: auto;">
          <el-button size="mini" @click="shore.select = null;shore.click=null;shore.level=0;shore.edit = null;" type="primary"
            v-if="shore.select != null">取消选择</el-button>
          <el-button size="mini" @click="deleteShore()" type="danger" v-if="shore.select != null">删除岸上位置</el-button>
          <el-button size="mini" @click="shore.inAdd=!shore.inAdd" type="success" v-if="shore.select == null">添加岸上位置</el-button>
        </div>

      </div>
      <template v-if="shore.list.length != 0">
        <div class="tree-node-block youCanNotChoose" v-for="node1 in shore.list">
          <div :class="['tree-node-item' , shore.click == node1.id? 'fucos':'']" @click="shore.click = node1.id;shore.select = node1;">
            <div>

            </div>
            <div class="flexCenter">
              {{node1.name}}
            </div>
          </div>
        </div>
      </template>

      <el-dialog title="地点简称(最大16位)" width="500px" :visible.sync="shore.inAdd" :modal-append-to-body="false"
        :append-to-body="true">

        <div class="flexRow">
          <el-input v-model="shore.name" maxlength="64"></el-input>
          <el-button @click="addShore" type="success">确认添加</el-button>
        </div>

      </el-dialog>

    </div>

    <e-detail ref="shore" class="warehouse-card"></e-detail>


  </div>
</template>

<script>
  import eDetail from './details.vue'

  export default {
    name: 'anshangcangguanli',
    components: {
      eDetail
    },
    data() {
      return {

        shore: {
          list: [],
          click: null,
          select: null,
          inAdd: false,
          name: ''
        },

      }
    },
    watch: {
      'shore.select': {
        handler: function(newV) {
          var that = this;


          this.$refs.shore.shore = JSON.parse(JSON.stringify(newV));
          this.$refs.shore.updateName = (JSON.parse(JSON.stringify(newV))).name;
          that.shore.inAdd = false;
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

      that.initShore();
    },
    methods: {

      initShore: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/cruise/list',
          data: {
            reason: {
              type: 1
            }
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;

          var list = data.data;
          that.shore.list = list

          if (list.length != 0) {
            that.shore.click = list[0].id;
            that.shore.select = list[0];
            that.$refs.shore.shore = JSON.parse(JSON.stringify(list[0]));
            that.$refs.shore.updateName = (JSON.parse(JSON.stringify(list[0]))).name;
            that.shore.inAdd = false;
          }


        }).catch((error) => {
          that.errorhanding(error)
        })

      },

      addShore: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/cruise/add',
          data: {
            name: that.shore.name,
            type: 1
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          if (data.code == that.STATUS.SUCCESS) {
            that.addSuccess(true)
            that.initShore();
            that.shore.click = null;
            that.shore.select = null;
            that.shore.inAdd = false;
          }
        }).catch((error) => {
          that.errorhanding(error)
        })

      },


      deleteShore: function() {
        var that = this;
        var axios = that.axios;
        that.$confirm('确定删除岸上位置？', '提示')
          .then(_ => {
            axios({
              method: 'post',
              url: '/cruise/delete',
              data: {
                id: that.shore.select.id
              },
              df: false
            }).then((response) => {
              if (!response) {
                return;
              }
              var data = response.data;
              if (data.code == that.STATUS.SUCCESS) {
                that.deleteSuccess(true)
                that.initShore();
                that.shore.click = null;
                that.shore.select = null;
                that.shore.inAdd = false;
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
