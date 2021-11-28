<template>
  <div class="public-card categroy flex1">
    <div class="public-card-header underline">
      <div>
        物品类别 <span v-if="category.select != null">【<span class="blue">{{category.select == null? '':category.select.name}}</span>】</span>
        <span class="red" v-if="inSelect">正在加载...</span>
      </div>
      <div>
        <el-button size="mini" @click.stop="category.edit = category.click;backUpName=category.select.name" icon="el-icon-edit"
          type="warning" circle v-if="category.select != null && category.edit == null"></el-button>
        <el-button size="mini" @click.stop="category.select.name = backUpName;category.edit = null" icon="el-icon-close"
          type="warning" circle v-if="category.select != null && category.edit != null"></el-button>
        <el-button size="mini" @click="inAdd=!inAdd" type="success" v-if="category.select != null && category.level != 4">添加子类</el-button>
        <el-button size="mini" @click="category.select = null;category.click=null;category.level=0;category.edit = null;"
          type="primary" v-if="category.select != null">取消选择</el-button>
        <el-button size="mini" @click="deleteCateGory()" type="danger" v-if="category.select != null">删除类</el-button>
        <el-button size="mini" @click="inAdd=!inAdd" type="success" v-if="category.select == null">添加类</el-button>
        <el-button size="mini" @click="category.select = null;category.click=null;category.level=0;category.edit = null;initCateGory()"
          icon="el-icon-refresh" type="primary" plain circle></el-button>
      </div>
    </div>
    <div class="public-card-body public-scroll-y categroy">
      <div class="tree-node-block youCanNotChoose" v-for="node1 in category.tree">
        <div :class="['tree-node-item' , category.click == node1.id? 'fucos':'']" @click="category.click = node1.id;category.select = node1;category.level=1;">
          <div>
            <i @click="node1.open = !node1.open;" class="el-icon-minus" v-if="node1.children != undefined && node1.open"></i>
            <i @click="node1.open = !node1.open;" class="el-icon-plus" v-if="node1.children != undefined && !node1.open"></i>
          </div>
          <div class="flexCenter">
            {{node1.edit? '':node1.name}}
            <template v-if="category.edit == node1.id">
              <el-input v-model="node1.name" size="mini" style="margin-left: 15px;width: 120px;"></el-input>
              <el-button @click="updateCateGory" size="mini" type="warning">保存</el-button>
              <el-button @click="category.select.name = backUpName;category.edit = null" size="mini" style="margin-left: 0px !important;"
                type="success" icon="el-icon-close"></el-button>
            </template>
          </div>
          <div class="margin-left-auto margin-right10">【<span class="blue">{{node1.code}}</span>】</div>
        </div>

        <!-- 第二层 -->

        <div class="tree-node-block youCanNotChoose" v-for="node2 in node1.children" v-if="node1.open">
          <div :class="['tree-node-item' , category.click == node2.id? 'fucos':'']" @click="category.click = node2.id;category.select = node2;category.level=2;">
            <div>
              <i @click="node2.open = !node2.open;" class="el-icon-minus" v-if="node2.children != undefined && node2.open"></i>
              <i @click="node2.open = !node2.open;" class="el-icon-plus" v-if="node2.children != undefined && !node2.open"></i>
            </div>
            <div>
              {{node2.name}}
              <template v-if="category.edit == node2.id">
                <el-input v-model="node2.name" size="mini" style="margin-left: 15px;width: 120px;"></el-input>
                <el-button @click="updateCateGory" size="mini" type="warning">保存</el-button>
                <el-button @click="category.select.name = backUpName;category.edit = null" size="mini" style="margin-left: 0px !important;"
                  type="success" icon="el-icon-close"></el-button>
              </template>
            </div>
            <div class="margin-left-auto margin-right10">【<span class="blue">{{node2.code}}</span>】</div>
          </div>
          <div class="tree-node-block youCanNotChoose" v-for="node3 in node2.children" v-if="node2.open">
            <div :class="['tree-node-item' , category.click == node3.id? 'fucos':'']" @click="category.click = node3.id;category.select = node3;category.level=3;">
              <div>
                <i @click="node3.open = !node3.open;" class="el-icon-minus" v-if="node3.children != undefined && node3.open"></i>
                <i @click="node3.open = !node3.open;" class="el-icon-plus" v-if="node3.children != undefined && !node3.open"></i>
              </div>
              <div>
                {{node3.name}}
                <template v-if="category.edit == node3.id">
                  <el-input v-model="node3.name" size="mini" style="margin-left: 15px;width: 120px;"></el-input>
                  <el-button @click="updateCateGory" size="mini" type="warning">保存</el-button>
                  <el-button @click="category.select.name = backUpName;category.edit = null" size="mini" style="margin-left: 0px !important;"
                    type="success" icon="el-icon-close"></el-button>
                </template>
              </div>
              <div class="margin-left-auto margin-right10">【<span class="blue">{{node3.code}}</span>】</div>
            </div>

            <div class="tree-node-block youCanNotChoose" v-for="node4 in node3.children" v-if="node3.open">
              <div :class="['tree-node-item' , category.click == node4.id? 'fucos':'']" @click="category.click = node4.id;category.select = node4;category.level=4;">
                <div>
                  <i @click="node4.open = !node4.open;" class="el-icon-minus" v-if="node4.children != undefined && node4.open"></i>
                  <i @click="node4.open = !node4.open;" class="el-icon-plus" v-if="node4.children != undefined && !node4.open"></i>
                </div>
                <div>
                  {{node4.name}}
                  <template v-if="category.edit == node4.id">
                    <el-input v-model="node4.name" size="mini" style="margin-left: 15px;width: 120px;"></el-input>
                    <el-button @click="updateCateGory" size="mini" type="warning">保存</el-button>
                    <el-button @click="category.select.name = backUpName;category.edit = null" size="mini" style="margin-left: 0px !important;"
                      type="success" icon="el-icon-close"></el-button>
                  </template>
                </div>
                <div class="margin-left-auto margin-right10">【<span class="blue">{{node4.code}}</span>】</div>
              </div>

            </div>

          </div>
        </div>
      </div>

    </div>

    <el-dialog title="类名(最大12位)" width="500px" :visible.sync="inAdd" :modal-append-to-body="false" :append-to-body="true">

      <div class="flexRow">
        <el-input v-model="category.name" maxlength="64"></el-input>
        <el-button @click="addCateGory" type="success">确认添加</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: '物品参数配置',
    data() {
      return {

        category: {
          tree: [],
          name: '',
          remark: '',
          click: null,
          edit: null,
          select: null,
          level: 0
        },

        backUpName: '',

        inAdd: false,
        inSelect: false

      }
    },
    watch: {
      'category.select': {
        handler: function(newV, oldV) {
          var that = this;
          console.log('newv', newV);
          console.log('oldV', oldV);

          if (oldV != null && newV.id != oldV.id && that.category.edit == oldV.id) {
            oldV.name = that.backUpName
            that.category.edit = null;
          }


        },
        deep: true
      }
    },
    created: function() {
      var that = this;

      that.initCateGory();
    },
    methods: {

      initCateGory: function() {
        var that = this;
        var axios = that.axios;

        that.inSelect = true
        axios({
          method: 'post',
          url: 'material/category/tree',
          data: {
            reason: {
              isDelete: false
            }
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          that.category.tree = data.data;
          that.inSelect = false
        }).catch((error) => {
          that.errorhanding(error)
        })

      },
      addCateGory: function() {
        var that = this;
        var axios = that.axios;

        var upData;
        if (that.category.level != 0) {
          upData = {
            name: that.category.name,
            parentId: that.category.select.id
          }
        } else {
          upData = {
            name: that.category.name,
          }
        }

        axios({
          method: 'post',
          url: 'material/category/add',
          data: upData,
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          that.addSuccess(data.code == that.STATUS.SUCCESS);
          if (data.code == that.STATUS.SUCCESS) {
            that.initCateGory();
            that.category.select = null;
            that.category.level = 0;
            that.category.click = null;
            that.category.edit = null;
            that.inAdd = false;
          }else{
            if(data.code== -301){
              that.errorhanding("类别名称重复")
            }
			  
		  }

          that.category.name = '';

        }).catch((error) => {
          that.errorhanding(error)
        })

      },
      updateCateGory: function() {
        var that = this;
        var axios = that.axios;


        axios({
          method: 'post',
          url: 'material/category/update',
          data: {
            id: that.category.select.id,
            name: that.category.select.name
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          that.updateSuccess(data.code == that.STATUS.SUCCESS);
          if (data.code == that.STATUS.SUCCESS) {
            that.category.select = null;
            that.category.level = 0;
            that.category.click = null;
            that.category.edit = null;
            that.initCateGory();
          }

        }).catch((error) => {
          that.errorhanding(error)
        })

      },
      deleteCateGory: function() {
        var that = this;
        var axios = that.axios;

        var ids = that.getIds(that.category.select);

        that.$confirm('确定删除类别？', '提示')
          .then(_ => {
            axios({
              method: 'post',
              url: 'material/category/delete',
              data: {
                ids: ids
              },
              // df: false
            }).then((response) => {
              if (!response) {
                return;
              }
              var data = response.data;
              var msg;
              if (data.code == that.STATUS.SUCCESS) {
                that.initCateGory();
                that.category.select = null;
                that.category.level = 0;
                that.category.click = null;
                that.category.edit = null;
              } else {
                msg = '<div>' +
                  '<span>请<span class="blue">刷新</span>数据,重新尝试</span>' +
                  '<div>'
              }
              that.updateSuccess(data.code == that.STATUS.SUCCESS, msg);

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
  .tree-node-block .tree-node-item.fucos .blue {
    color: white;
  }

  .tree-node-block>.tree-node-block {
    padding-left: 18px;
  }

  .tree-node-block .tree-node-item.fucos {
    background: #3A8EE6;
    color: white !important;
  }

  .tree-node-item:hover {
    color: #3FA4DD;
    cursor: pointer;
  }

  .tree-node-item {
    height: 35px;
    line-height: 35px;
    display: flex;
    border-radius: 5px;
    transition: .15s;
  }

  .tree-node-item>div:first-child {
    width: 32px;
    text-align: center;
  }


  .public-card-body.categroy {
    height: 600px;
    padding: 5px;
  }

  .flex1 {
    flex: 1;
  }

  .public-card {
    margin-top: 15px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
    min-width: 700px;
  }

  .underline {
    border-bottom: solid 1px rgba(210, 210, 210, 1) !important;
  }

  .public-card-header {
    display: flex;
  }

  .public-card-header>div:last-child {
    margin-left: auto;
  }
</style>
