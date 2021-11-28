const AuditType = {
  value: {
    PURCHASE_REQUEST: 0,
    PURCHASE_ORDER: 1,
    STOCKIN_ORDINARY: 2,
    STOCKIN_PURCHASE: 3,
    DELIVERY_REQUEST: 4,
    DELIVERY_VOUCHER: 5,
    RECEIVING_MATERIAL: 6,
    RECIVEING_MATERIAL_RETURN: 7,
    INVOICE_PURCHASE: 8,
    INVOICE_FREIGHT: 9,
    INVOICE_RED_PURCHASE: 10,
    INVOICE_RED_FREIGHT: 11,
    MATERIAL_MOVE: 12,
    EXCHANGE_REQUEST: 13,
    EXCHANGE_OUT: 14,
    EXCHANGE_IN: 15,
    STOCK_LOSS: 16,
  },
  data: [{
      value: 0,
      name: '采购申请',
      nameCode: 'caigoushenqing'
    },
    {
      value: 1,
      name: '采购订单',
      nameCode: 'caigoudingdan'
    },
    {
      value: 2,
      name: '普通入库',
      nameCode: 'putongruku'
    },
    {
      value: 3,
      name: '采购入库',
      nameCode: 'caigouruku'
    },
    {
      value: 4,
      name: '退货申请',
      nameCode: 'tuihuoshenqing'
    }, {
      value: 5,
      name: '退货出库',
      nameCode: 'tuihuochuku'
    }, {
      value: 6,
      name: '领用物资',
      nameCode: 'lingyongwuzi'
    }, {
      value: 7,
      name: '领用物资退还',
      nameCode: 'lingyongwuzituihuan'
    }, {
      value: 8,
      name: '采购发票',
      nameCode: 'caigoufapiao'
    }, {
      value: 9,
      name: '运费发票',
      nameCode: 'yunfeifapiao'
    }, {
      value: 10,
      name: '红字采购发票',
      nameCode: 'hongzicaigoufapiao'
    }, {
      value: 11,
      name: '红字运费发票',
      nameCode: 'hongziyunfeifapiao'
    },
    {
      value: 12,
      name: '库存调配',
      nameCode: 'wuzidiaopei'
    },
    {
      value: 13,
      name: '换货申请',
      nameCode: 'huanhuoshenqing'
    },
    {
      value: 14,
      name: '换货出库',
      nameCode: 'huanhuochuku'
    },
    {
      value: 15,
      name: '换货入库',
      nameCode: 'huanhuoruku'
    },
    {
      value: 16,
      name: '库存报损',
      nameCode: 'kucunbaosun'
    }
  ],
  getStr: function(code) {
    switch (code) {
      case 0:
        return "采购申请";
      case 1:
        return "采购订单";
      case 2:
        return "普通入库";
      case 3:
        return "采购入库";
      case 4:
        return "退货申请";
      case 5:
        return "退货出库";
      case 6:
        return "物资领用";
      case 7:
        return "物资领用归还";
      case 8:
        return "采购发票";
      case 9:
        return "运费发票";
      case 10:
        return "红字采购发票";
      case 11:
        return "红字运费发票";
      case 12:
        return "库存调配";
      case 13:
        return "换货申请";
      case 14:
        return "换货出库";
      case 15:
        return "换货入库";
      case 16:
        return "库存报损";
      default:
        return "不存在该流程类型";
    }
  }
}

const StockInSourceType = {
  list: function() {
    return [{
        label: '--',
        value: 0
      },
      {
        label: '换货入库',
        value: 1
      },
      {
        label: '领用归还',
        value: 2
      },
      {
        label: '盘点入库',
        value: 3
      },
      {
        label: '调配入库',
        value: 4
      }
    ];
  },
  value: {
    COMMON: 0,
    PURCHASE: 0,
    CHANGE: 1,
    USING_BACK: 2,
    TAKING: 3,
    STOCK_MOVING: 4
  },
  getStr: function(type) {
    switch (type) {
      case 0:
        return '--';
      case 1:
        return '换货入库';
      case 2:
        return '领用归还'
      case 3:
        return "盘点入库";
      case 4:
        return "调配入库"
    };
  },
}

const Invoice = {
  type: [{
      label: '采购发票',
      value: 1
    },
    {
      label: '运费发票',
      value: 2
    },
    {
      label: '红字采购发票',
      value: -1
    },
    {
      label: '红字运费发票',
      value: -2
    }
  ],
  getTypeStr: function(value) {
    switch (value) {
      case 1:
        return '采购发票';
      case 2:
        return '运费发票';
      case -1:
        return '红字采购发票'
      case -2:
        return "红字运费发票";
    };
  },
  category: [{
      label: '增值税专用发票',
      value: 1
    },
    {
      label: '普通发票',
      value: 2
    },
    {
      label: '专业发票',
      value: 3
    }
  ],
  getCategoryStr: function(value) {
    switch (value) {
      case 1:
        return '增值税专用发票';
      case 2:
        return '普通发票';
      case 3:
        return '专业发票'
    };
  },
}

module.exports = {
  AuditType,
  StockInSourceType,
  Invoice
};
