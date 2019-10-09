// components/settlement/settlement.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  data: {
    cartShow: ''
  },
  properties: {
    goodsPrice: { // 物品总价
      type: Number,
      value: 0
    },
    sub_distribution_fee: { // 满多少免配送费
      type: Number,
      value: 0
    },
    sendprice: { // 配送费
      type: Number,
      value: 0
    },
    cartShow: { // 购物车开合
      type: String,
      value: ''
    }
  },
  observers: {
    'goodsPrice': function (subfield) {
      if (subfield > 0) {
        this.triggerEvent('myevent', true)
      } else {
        this.triggerEvent('myevent', false)
      }
    },
  },
  methods: {
  }
})