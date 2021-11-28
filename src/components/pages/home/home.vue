<template>
  <div :class="baseClasses" :style="baseStyle">

    <div class="flexRow">
      <div class="inner-card flex1">

        <div class="title">未提交</div>

        <div class="lrs">
          待提交的采购申请
          <span><a @click="toPage('PR',0)">{{pr.wait}}</a>条</span>
        </div>

        <div class="lrs">
          待提交的采购订单
          <span><a @click="toPage('PO',0)">{{po.wait}}</a>条</span>
        </div>

        <div class="lrs">
          待提交的退货申请
          <span><a @click="toPage('DR',0)">{{dr.wait}}</a>条</span>
        </div>

      </div>
      <div class="inner-card flex1">

        <div class="title">审批中</div>

        <div class="lrs">
          审批中的采购申请
          <span><a @click="toPage('PR',1)">{{pr.onAudit}}</a>条</span>
        </div>

        <div class="lrs">
          审批中的采购订单
          <span><a @click="toPage('PO',1)">{{po.onAudit}}</a>条</span>
        </div>

        <div class="lrs">
          审批中的退货申请
          <span><a @click="toPage('DR',1)">{{dr.onAudit}}</a>条</span>
        </div>

      </div>
    </div>


    <div class="flexRow">
      <div class="inner-card flex1">

        <div class="title">申请已通过</div>

        <div class="lrs">
          已通过的采购申请
          <span><a @click="toPage('PR',2)">{{pr.pass}}</a>条</span>
        </div>

        <div class="lrs">
          已通过的采购订单
          <span><a @click="toPage('PO',2)">{{po.pass}}</a>条</span>
        </div>

        <div class="lrs">
          已通过的退货申请
          <span><a @click="toPage('DR',2)">{{dr.pass}}</a>条</span>
        </div>

      </div>
      <div class="inner-card flex1">

        <div class="title">申请未通过</div>

        <div class="lrs">
          未通过的采购申请
          <span><a @click="toPage('PR',3)">{{pr.noPass}}</a>条</span>
        </div>

        <div class="lrs">
          未通过的采购订单
          <span><a @click="toPage('PO',3)">{{po.noPass}}</a>条</span>
        </div>

        <div class="lrs">
          未通过的退货申请
          <span><a @click="toPage('DR',3)">{{dr.noPass}}</a>条</span>
        </div>

      </div>
    </div>

    <div class="flexRowWarp">
      <div class="inner-card flex1">

        <div class="title-lrs">
          库存预警
          <span><a @click="toList('SI',{order:'number',orderWay:'DESC'})">详情</a></span>
        </div>

        <table border="0" rules="none">
          <tr>
            <th>物品代码</th>
            <th>物品名称</th>
            <th>物品条码</th>
            <th>预警类型</th>
          </tr>

          <tr v-for="kuncun in stockWarning">


            <td>{{kuncun.code }}</td>
            <td>{{kuncun.name }}</td>
            <td>{{kuncun.barCode }}</td>
            <td>库存较少</td>

          </tr>

        </table>


      </div>
      <div class="inner-card flex1">

        <div class="title-lrs">
          有效期预警
          <span><a @click="toList('SI',{order:'expiration',orderWay:'DESC'})">详情</a></span>
        </div>

        <table border="0" rules="none">
          <tr>
            <th>物品代码</th>
            <th>物品名称</th>
            <th>物品条码</th>
            <th>有效期</th>
          </tr>

          <tr v-for="kuncun in validityWarning">


            <td>{{kuncun.code }}</td>
            <td>{{kuncun.name }}</td>
            <td>{{kuncun.barCode }}</td>
            <td>{{kuncun.expiration == undifined ? '2099-12-31 23:59:59':DateToStr(new Date(kuncun.expiration))}}</td>

          </tr>

        </table>


      </div>
    </div>


  </div>
</template>

<script>
  export default {
    name: 'name',
    data() {
      return {
        baseClasses: ['baseClass'],
        baseStyle: {},


        pr: {
          noPass: 0,
          onAudit: 0,
          pass: 0,
          wait: 0,
        },

        po: {
          noPass: 0,
          onAudit: 0,
          pass: 0,
          wait: 0,
        },

        dr: {
          noPass: 0,
          onAudit: 0,
          pass: 0,
          wait: 0,
        },

        stockWarning: [],
        validityWarning: [],


      }
    },
    created: function() {

      this.initAll()
    },
    methods: {

      toPage: function(type, status) {
        var target;

        switch (type) {
          case 'PR':
            target = '/service/purchaseRequest'
            break;
          case 'PO':
            target = '/service/purchaseOrder'
            break;
          case 'DR':
            target = 'service/returnRequest'
            break;
        }

        this.$router.push({
          path: target,
          query: {
            type: 'SEARCH',
            reason: {
              status: status
            }
          }
        })
      },

      toList: function(type, reason) {
        var target;
        switch (type) {
          case 'SI':
            target = '/stock'
            break;
        }

        this.$router.push({
          path: target,
          query: {
            type: 'SEARCH',
            reason: reason
          }
        })

      },


      initAll: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/home',
          df: false
        }).then((response) => {
          if (!response)
            return;

            var data = response.data;

            that.pr = data.data.pr;
            that.po = data.data.po;
            that.dr = data.data.dr;

            that.stockWarning = data.data.stockWarning;
            that.validityWarning = data.data.validityWarning;

        });

      }

    }
  }
</script>

<style scoped="scoped">
  table {
    margin-top: 10px;
  }

  table,
  tr {
    width: 100%;
    text-align: center;
  }

  td {
    border: 1px solid rgba(150, 150, 150, 0.3);
    height: 40px;
    line-height: 40px;
    white-space: nowrap;
    width: 25%;
    overflow: hidden;
  }

  th {
    background-color: rgb(67, 142, 185);
    border: rgb(67, 142, 185);
    height: 40px;
    line-height: 40px;
  }

  .title-lrs {
    font-weight: 600;
    font-size: 19px;
  }

  .title-lrs>span {
    font-size: 16px;
    float: right;
  }

  .title-lrs>span>a {
    color: #2b7dbc;
    cursor: pointer;
  }

  .lrs {
    /* margin-top: 5px; */
    font-size: 17px;

    line-height: 40px;

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .lrs>span {
    float: right;
  }

  .lrs>span>a {
    margin-right: 5px;
    cursor: pointer;
  }

  .title {
    font-weight: 600;
    font-size: 19px;
    margin-bottom: 20px;
  }

  .inner-card {
    border-radius: 8px;
    border: rgba(189, 189, 189, 0.7) solid 1px;

    padding: 10px;

    margin-top: 10px;
    transition: 0.2s;
    margin-right: 10px;
  }

  .inner-card:hover {
    box-shadow: 0px 2px 2px rgba(00, 00, 00, 0.5);
  }



  .flex1 {
    flex: 1;
  }

  .colum {
    display: flex;
    flex-direction: column;
  }


  .baseClass {
    padding-top: 10px;
  }
</style>
