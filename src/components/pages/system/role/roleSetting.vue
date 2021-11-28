<template>

  <div :style="baseStyle" :class="baseClasses">


    <div class="public-card role-set-card">
      <!--      <div class="public-card-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item><a href="javaScript:void(0)">{{$t('juesequanxianpeizhi')}}</a></el-breadcrumb-item>
        </el-breadcrumb>
      </div> -->
      <div class="public-card-body">
        <div>

          <div class="role-inner-card">
            <div class="role-inner-title">
              <div>{{$t('jueseguanli')}}</div>
            </div>
            <div class="role-inner-body">

              <ul class="role-roles">
                <template v-for="singleRole in roles">
                  <li @click="chooseRole(singleRole.id)" style="background: rgba(204,204,204,0.8);" v-if="singleRole.id == roleId">
                    <div>{{singleRole.name}}</div>
                    <i class="el-icon-close" @click="delRole(singleRole.id)"></i>
                  </li>
                  <li @click="chooseRole(singleRole.id)" v-else>
                    <div>{{singleRole.name}}</div>
                    <i class="el-icon-close" @click="delRole(singleRole.id)"></i>
                  </li>
                </template>
              </ul>
              <div class="role-inner-add">
                <div class="role-inner-add-input" v-if="isAdd">
                  <el-input :placeholder="$t('juesemingcheng')" v-model="addRole" clearable>
                  </el-input>
                  <div class="role-inner-add-button">
                    <button @click="addRoleSubmit()"><i class="el-icon-check"></i></button>
                    <button @click="isAdd = false"><i class="el-icon-close"></i></button>
                  </div>
                </div>
                <div @click="isAdd = true"><button>+{{$t('xinzengjuese')}}</button></div>
              </div>

            </div>
          </div>

          <div class="role-inner-card">
            <div class="role-inner-title">
              <div>{{$t('juesequanxianpeizhi')}} - {{role.id == null? '未选择':role.name}}<button @click="editName()" v-if="role.id != null">{{$t('bianjimingcheng')}}</button></div>
            </div>
            <div class="role-inner-body">

              <div class="role-auths">
                <div class="role-auths-auths-line">{{$t('gongnengquanxian')}}</div>
                <div class="role-auths-grey-line">
                  <el-checkbox v-model="allAuth" @change="checked => authClick(checked,null,null,null)">{{$t('quanbu')}}</el-checkbox>
                </div>
                <template v-for="auth in auths">
                  <div class="role-auths-auths-line">
                    <el-checkbox v-model="auth.isAuth" @change="checked => authClick(checked,auth,null,null)" :disabled="auth.name == 'home'">{{$t(auth.title)}}</el-checkbox>
                  </div>
                  <div class="role-auths-line">
                    <template v-for="au in auth.child">

                      <el-checkbox v-if="au.child == undefined" @change="checked => authClick(checked,au,auth,null)"
                        v-model="au.isAuth">{{$t(au.title)}}</el-checkbox>
                      <div class="role-auths-line-inline" v-else>
                        <el-checkbox v-model="au.isAuth" @change="checked => authClick(checked,au,auth,null)">{{$t(au.title)}}</el-checkbox>
                        <div>
                          <template v-for="a in au.child">
                            <el-checkbox v-model="a.isAuth" @change="checked => authClick(checked,a,au,auth)">{{$t(a.title)}}</el-checkbox>
                          </template>
                        </div>
                      </div>

                    </template>

                    <!-- {{au.permissionName}} -->
                    <!-- <el-checkbox v-model="checked" v-for="a in au.child" >{{au.permissionName}}</el-checkbox> -->
                    <!-- <template v-if="au.child.length == 0">暂无其他权限</template> -->
                    <!-- <template>
											<el-checkbox v-model="" v-for="a in au.child" >{{a.permissionName}}a</el-checkbox>
										</template> -->

                  </div>
                </template>


              </div>

            </div>
          </div>

        </div>
      </div>
    </div>


  </div>

</template>

<script>
  export default {
    name: 'jueseguanli',
    data() {
      return {
        parent: this.$parent.$parent.$parent,

        baseStyle: {
          fontSize: '14px',
          padding: '0px 15px 0px 15px',
          padding: '0px 15px 0px 15px',
        },
        baseClasses: [],

        roles: [],


        addRole: '', //要被添加的角色名称
        isAdd: false,

        //被选择的role的id
        roleId: -1,
        role: {
          id: null,
          name: ''
        },


        allAuth: false,
        //权限
        auths: [


        ]

      }
    },
    watch: {
      auths: function(dataV) {
        // console.log(dataV)
      }
    },
    created: function() {
      var that = this;


      that.initRoles();


      that.changePad();
    },
    methods: {
      changePad: function() {
        var that = this;
        var os = that.parent.os;

        if (os == 'PAD' || os == 'PHONE') {

          that.baseClasses.push('moblie');

        } else if (os == 'PC') {

          that.baseClasses.slice(0, 1);

        }

      },
      initRoles: function() {
        var that = this;
        var axios = this.axios;

        //获得角色

        axios({
          method: 'get',
          url: '/role/list ',
          data: {},
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;

          if (data.code === that.STATUS.SUCCESS) {
            that.roles = data.data;

            if (that.roleId == -1) {
              that.chooseRole(that.roles[0].id);
            }
          } else {
            throw data.msg;
          }

        }).catch(function(error) {
          that.errorhanding(error);
        })
      },
      editName: function() {
        var that = this;
        var axios = that.axios;

        that.$prompt('', that.$t('genggaijuesemingcheng'), {
          closeOnClickModal: false,
          confirmButtonText: that.$t('queding'),
          cancelButtonText: that.$t('quxiao'),
          inputPattern: /[\S]+?/,
          inputErrorMessage: 'NOT NULL'
        }).then(({
          value
        }) => {
          axios({
            method: 'post',
            url: '/role/update',
            data: {
              id: that.roleId,
              name: value
            },
            df: false
          }).then((response) => {
            if (!response) {
              return;
            }
            var data = response.data;
            // that.auths = data.data;

            if (data.code == that.STATUS.SUCCESS) {
              that.role.name = value;
              that.initRoles();
            } else {
              throw data.msg;
            }

          }).catch(function(error) {
            that.errorhanding(error);
          })


        }).catch(() => {});
      },
      addRoleSubmit: function() {
        var that = this;
        var roleName = that.addRole.trim() + '';

        var reg_name = /^\s*$/g;
        //3.判断
        var flag = reg_name.test(roleName);
        if (flag) {
          this.$message({
            message: '请输入角色名称',
            type: 'warning'
          });
          return;
        }


        var axios = that.axios;

        axios({
          method: 'post',
          url: '/role/add',
          data: {
            name: roleName
          },
          df: true,
          loading: true
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;

          if (data.code == that.STATUS.SUCCESS) {

            that.initRoles();

            that.addRole = '';
            that.isAdd = false;
            that.addSuccess(true)
          } else {
            throw data.data.message;
          }

        }).catch(function(error) {
          loading.close()
          that.$notify.error({
            title: that.$t('cuowu'),
            message: error
          });
        })
      },
      delRole: function(id) {
        var that = this;
        var axios = that.axios;
										/* (此操作不可恢复) */
        that.$confirm('是否永久删除该项？', '提示')
          .then(_ => {

            axios({
              method: 'post',
              url: '/role/delete ',
              data: {
                id: id
              }
            }).then((response) => {
              if (!response) {
                return;
              }
              var data = response.data;

              if (data.code == that.STATUS.SUCCESS) {
                that.roles = data.data;
                that.initRoles();
                that.deleteSuccess(true)
              } else {
                throw data.msg;
              }

            }).catch(function(error) {
              that.errorhanding(error)
            })

          }).catch(_ => {})

      },
      //选择角色时 调用
      chooseRole: function(id) {
        var that = this;

        that.roleId = id;

        for (var i in that.roles) {
          var role = that.roles[i];

          if (role.id == id) {
            that.role = role;
            break;
          }

        }

        var axios = that.axios;

        axios({
          method: 'post',
          url: '/role/getMenus ',
          data: {
            roleId: id
          },
          loading: true
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          // that.auths = data.data;

          if (data.code === that.STATUS.SUCCESS) {
            var auths = data.data;
            var allauth = 0;
            for (var i in auths) {
              var auth = auths[i];
              if (auth.menu == true) {
                allauth++;
              }
            }

            that.deepTreeSetIsAuth(auths);

            that.auths = auths;

            if (allauth == that.auths.length) {
              that.allAuth = true;
            } else {
              that.allAuth = false
            }
          } else {
            throw data.msg;
          }
        }).catch(function(error) {
          that.errorhanding(error)
        })

      },
      //点击 立即 赋予至高权限
      authClick: function(checked, auth, parent, grandparent) {
        var that = this;
        var axios = that.axios;
        // console.log('id:'+id)
        // console.log('checked:'+checked)
        //所有要更新的权限
        var isAuths = [];
        //爸爸的爸爸叫爷爷
        // var parentSparent = that.getTreeNode(that.auths,parent.parentId)
        console.log(auth);

        //选择
        if (checked) {
          //选择了 全部
          if (auth == null && parent == null && grandparent == null) {
            for (var i in that.auths) {
              var auth = that.auths[i];

              //跳过主页设置
              if (auth.id === 1) {
                continue;
              }

              if (auth.isAuth != checked) {
                isAuths.push(auth.id);
                auth.isAuth = checked;
              }

              for (var index in auth.child) {
                var au = auth.child[index];
                if (au.isAuth != checked) {
                  isAuths.push(au.id);
                  au.isAuth = checked;
                }
                if (au.child != undefined && au.child != null) {

                  for (var indexs in au.child) {
                    var a = au.child[indexs];
                    if (a.isAuth != checked) {
                      isAuths.push(a.id);
                      a.isAuth = checked;
                    }
                  }
                }
              }

            }
            //选择了 第一级
          } else if (auth != null && parent == null && grandparent == null) {

            auth.isAuth = checked;
            isAuths.push(auth.id)
            //将 第一级下的 子级 下的 子级 统统选上
            for (var index in auth.child) {
              var demo = auth.child[index]
              if (demo.isAuth != checked) {
                demo.isAuth = checked;
                isAuths.push(demo.id)
              }
              if (demo.child != undefined) {
                for (var i in demo.child) {
                  var mode = demo.child[i]
                  if (mode.isAuth != checked) {
                    mode.isAuth = checked;
                    isAuths.push(mode.id)
                  }
                }
              }
            }

            //如果所有 第一级 都被选中了
            //则 将 '全部' 选择
            var isok = 0;
            for (var index in that.auths) {
              var demo = that.auths[index]
              if (demo.isAuth == checked) {
                isok++;
              }
            }
            if (isok == that.auths.length) {
              that.allAuth = checked;
            }
            //选择了 第二级
          } else if (auth != null && parent != null && grandparent == null) {

            auth.isAuth = checked;
            isAuths.push(auth.id);

            //如果 第二级 有子级 ，则将未选择的 子级都选上
            if (auth.child != undefined) {
              for (var index in auth.child) {
                var demo = auth.child[index]
                if (demo.isAuth != checked) {
                  demo.isAuth = checked
                  isAuths.push(demo.id);
                }
              }
            }

            //判断第二级的 上一级  第一级下的子级 是否都被选中了
            var isok_P = 0;
            for (var index in parent.child) {
              var demo = parent.child[index]
              if (demo.isAuth == checked) {
                isok_P++;
              }
            }
            //如果 第二级 的兄弟们 都被选上了，就把第二级的爸爸也选上
            if (isok_P == parent.child.length) {
              //就不选上了
              parent.isAuth = checked;
              isAuths.push(parent.id);

              //如果第二级的爸爸'第一级'选上
              //判断 爸爸的 兄弟们 是否被选上了
              //爸爸的兄弟们都被选上了 ，则 将 '全部' 选择
              var isok = 0;
              for (var index in that.auths) {
                var demo = that.auths[index]
                if (demo.isAuth == checked) {
                  isok++;
                }
              }
              if (isok == that.auths.length) {
                that.allAuth = checked;
              }

            }

            //如果选择了 第三级
          } else if (auth != null && parent != null && grandparent != null) {

            //第三级 没有儿子了，加上 '全部'，四世同堂了
            isAuths.push(auth.id)

            //第三级的 兄弟们是否被选上了
            var isok_P = 0;
            for (var index in parent.child) {
              var demo = parent.child[index]
              if (demo.isAuth == checked) {
                isok_P++;
              }
            }
            //如果第三级的 兄弟们被选上了，他们的爸爸 也该被选上
            if (isok_P == parent.child.length) {
              parent.isAuth = checked;
              isAuths.push(parent.id);
              //第三级的爸爸 第二级被选上了，看看第二级的兄弟们有没有被选上
              var isok_G = 0;
              for (var index in grandparent.child) {
                var demo = grandparent.child[index]
                if (demo.isAuth == checked) {
                  isok_G++;
                }
              }
              //如果第三级的爸爸 第二级的兄弟都被选上了
              //第三级的 爷爷'第一级' ， 也要被选上
              if (isok_G == grandparent.child.length) {
                grandparent.isAuth = checked;
                isAuths.push(grandparent.id);

                //爷爷的 兄弟们是否都被选上了
                var isok = 0;
                for (var index in that.auths) {
                  var demo = that.auths[index]
                  if (demo.isAuth == checked) {
                    isok++;
                  }
                }
                //爷爷的兄弟们都被选上了
                //爷爷的爸爸，祖爷爷'全部'也要被选上
                if (isok == that.auths.length) {
                  that.allAuth = checked;
                }
              }
            }
          }
          //取消选择
        } else {
          //取消了 全部
          if (auth == null && parent == null && grandparent == null) {
            for (var i in that.auths) {
              var auth = that.auths[i];

              //跳过主页设置
              if (auth.id === 1) {
                continue;
              }

              if (auth.isAuth != checked) {
                isAuths.push(auth.id);
                auth.isAuth = checked;
              }

              for (var index in auth.child) {
                var au = auth.child[index];
                if (au.isAuth != checked) {
                  isAuths.push(au.id);
                  au.isAuth = checked;
                }
                if (au.child != undefined && au.child != null) {

                  for (var indexs in au.child) {
                    var a = au.child[indexs];
                    if (a.isAuth != checked) {
                      isAuths.push(a.id);
                      a.isAuth = checked;
                    }
                  }
                }
              }

            }
            //取消了 第一级
          } else if (auth != null && parent == null && grandparent == null) {

            auth.isAuth = checked;
            isAuths.push(auth.id)
            //将 第一级下的 子级 下的 子级 统统取消
            //第一级的儿子 '第二级'
            for (var index in auth.child) {
              var demo = auth.child[index]
              if (demo.isAuth != checked) {
                demo.isAuth = checked;
                isAuths.push(demo.id)
              }
              //如果 第二级有 儿子
              if (demo.child != undefined) {
                //第二级的儿子 '第三级'
                for (var i in demo.child) {
                  var mode = demo.child[i]
                  if (mode.isAuth != checked) {
                    mode.isAuth = checked;
                    isAuths.push(mode.id)
                  }
                }
              }
            }

            //如果有一个 第一级 没被选择，是被取消的
            //则 将 '全部' 取消
            var isok = 0;
            for (var index in that.auths) {
              var demo = that.auths[index]
              if (demo.isAuth == checked) {
                isok++;
              }
            }
            if (isok != 0) {
              that.allAuth = checked;
            }
            //选择了 第二级
          } else if (auth != null && parent != null && grandparent == null) {

            auth.isAuth = checked;
            isAuths.push(auth.id);

            //如果 第二级 有子级 ，则将所有子级取消
            if (auth.child != undefined) {
              for (var index in auth.child) {
                var demo = auth.child[index]
                if (demo.isAuth != checked) {
                  demo.isAuth = checked
                  isAuths.push(demo.id);
                }
              }
            }

            //判断第二级的 上一级  第一级 是否选择的
            //由于 第二级 被取消了，所以其爸爸 第一级，不能被选中
            //所有取消 爸爸的资格
            if (parent.isAuth != checked) {
              // parent.isAuth = checked;
              // isAuths.push(parent.id)
            }

            //判断全部是否选择的
            //由于爸爸'第一级' 被取消了
            //所以取消 '全部'
            if (that.allAuth != checked) {
              that.allAuth = checked;
            }


            //如果取消了 第三级
          } else if (auth != null && parent != null && grandparent != null) {

            //第三级 没有儿子了，加上 '全部'，四世同堂了

            //第三级被取消了
            isAuths.push(auth.id)

            //第三级被取消，其爸爸'第二级'将被取消
            //如果第二级是被选择中的 状态
            if (parent.isAuth != checked) {
              //爸爸'第二级'取消
              parent.isAuth = checked;
              isAuths.push(parent.id);

              //爸爸'第二级' 被取消了
              //爸爸的爸爸，爷爷'第一级' 不能被选中
              //如果 爷爷'第一级'被选中
              if (grandparent != checked) {
                //爷爷'第一级' 取消
                grandparent.isAuth = checked;
                isAuths.push(grandparent.id);

                //爷爷 '第一级' 被取消了
                //爷爷的爸爸 祖爷爷'全部' 不能被选中
                //如果祖爷爷'全部'被选中
                if (that.allAuth != checked) {
                  //祖爷爷'全部' 取消
                  that.allAuth = checked;
                }
              }
            }
          }
        }

        console.log(that.roleId, auth.id, checked)

        axios({
          method: 'post',
          url: '/role/menu/update',
          data: {
            roleId: that.roleId,
            menus: isAuths,
            isAuth: checked
          },
          df: false,
          loading: true
        }).then((response) => {
          if (!response) {
            loading.close();
            return;
          }
          var data = response.data;

          if (data.code == that.STATUS.SUCCESS) {
            that.notic(true, '设置')
            that.chooseRole(that.roleId)
          } else {
            throw data.msg;
          }
        }).catch(function(error) {
          that.errorhanding(error);
        })

      },
      // 深度遍历 迭代
      getTreeNode: function(tree, id) {
        var isGet = false;
        var retNode = null;

        function deepSearch(tree, id) {
          for (var i = 0; i < tree.length; i++) {
            if (tree[i].children != undefined && tree[i].children.length > 0) {
              deepSearch(tree[i].children, id);
            }
            if (id === tree[i].id || isGet) {
              isGet || (retNode = tree[i]);
              isGet = true;
              break;
            }
          }
        }
        deepSearch(tree, id);
        return retNode;
      },

      selectTreeNodesAll: function(tree, checked, isAuths) {

        if (tree.child != undefined) {
          for (var index in tree) {
            var node = tree[index];

            if (node.isAuth != checked) {
              node.isAuth = checked
              isAuths.push(node.id);
            }
          }
        }
        return isAuths;
      },

      deepTreeSetIsAuth: function(tree) {

        function deep(list) {

          list.forEach(function(item) {
            item.isAuth = item.menu == 1 ? true : false;
            if (item.child != undefined && item.child.length != undefined) {
              deep(item.child);
            }
          })
        }

        deep(tree);
      }

    }
  }
</script>

<style scoped="scoped">
  .role-set-card {
    margin-top: 15px;
  }

  .role-set-card>.public-card-body>div {
    background: #C0C8D8;
    display: flex;
    flex-direction: row;
    padding: 10px;
    border-radius: 2px;
  }

  .role-inner-card {
    background: white;
    color: #727373;
    border-radius: 2px;
    padding: 10px;
    flex: 1;
  }

  .role-inner-title {
    padding: 10px 0px 0px 0px;

    border-bottom: solid #E7E7E7 2px;
  }

  .role-inner-title>div {
    padding-bottom: 10px;
  }

  .role-inner-title button {
    border: rgb(208, 208, 208) solid 1px;
    border-radius: 4px;
    font-size: 11px;
    color: rgb(110, 110, 110);
    margin-left: 15px;
    cursor: pointer;
    transition: 0.2s;
  }

  .role-inner-title button:hover {
    background: rgba(67, 142, 185, 0.2);
  }

  .role-inner-body {
    /* padding: 10px; */
  }

  .role-inner-card:first-child {
    max-width: 20%;
    min-width: 210px;
    margin-right: 10px;
    min-height: 300px;
  }

  .role-inner-card:last-child {
    min-height: 400px;
  }

  .role-roles {
    margin-top: 20px;
    background: rgb(245, 245, 245);
    border-radius: 2px;
  }

  .role-roles>li {
    padding: 10px;
    color: #696969;
    position: relative;
    cursor: pointer;
  }

  .role-roles>li:hover {
    background: rgba(204, 204, 204, 1);
  }

  .role-roles>li i {
    position: absolute;
    display: none;
    right: 10px;
    top: 10px;
    font-size: 20px;
    color: red;

    cursor: pointer;
  }

  .role-roles>li:hover i {
    display: block;
  }

  .role-roles>li i:hover {
    color: #409EFF;
  }

  .role-inner-add {
    /* padding: 0px 10px; */
  }

  .role-inner-add-input {
    padding: 10px 5px;
    background: rgba(204, 204, 204, 1);
    color: rgb(67, 142, 185);
  }

  .role-inner-add-button {
    display: flex;
    flex-direction: row;
    margin-top: 10px;
  }

  .role-inner-add-button>button {
    flex-grow: 1;
    cursor: pointer;
  }

  .role-inner-add-button>button:hover i {
    flex-grow: 1;
    color: #409EFF;
  }

  .role-inner-add-button i {
    font-size: 24px;
  }

  .role-inner-add>div:last-child {
    padding: 10px;
    background: rgb(245, 245, 245);

  }

  .role-inner-add>div:last-child>button {
    color: rgb(67, 142, 185);
    cursor: pointer;
  }

  .role-auths {
    margin-top: 20px;
  }

  .role-auths-auths-line {
    background: #E3EBF8;

    padding: 10px 40px;
    border-radius: 2px;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .role-auths>.role-auths-auths-line:first-child {
    padding: 10px 20px;
  }

  .role-auths-grey-line {
    background: rgba(245, 245, 245, 1);
    padding: 10px 40px;
  }

  .role-auths-line {
    background: rgb(245, 249, 255);
    padding: 10px 80px;

    padding-bottom: 0px;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .role-auths-line>label {
    margin-bottom: 10px;
  }

  .role-auths-line-inline {
    width: 100%;
    margin-bottom: 10px;
  }

  .role-auths-line-inline>label:first-child {
    width: 100%;
    margin-bottom: 5px;
  }

  .role-auths-line-inline>div {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding-left: 30px;
  }

  .moblie .role-set-card>.public-card-body>div {
    display: flex;
    flex-direction: column;
  }

  .moblie .role-inner-card {
    width: 100%;
    max-width: calc(100% - 20px);
  }

  .moblie .role-inner-card:last-child {
    margin-top: 10px;
  }
</style>
