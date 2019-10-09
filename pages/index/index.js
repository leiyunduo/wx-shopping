//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    cartShow: '',
    hotList: [
      {
        title: "超值套餐", modid: 27, data: [
          { cname: "大骨面", modid: 27, number: 0, img1: "../../assets/image/banner-free.jpg", price: 17 },
          { cname: "冷面", modid: 27, number: 0, img1: "../../assets/image/test-1.png", price: 23, bprice: 1.5, mold: "超值套餐"}
        ]
      }
    ],
    orderGoodsList: [],
    isSelect: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow() {
    let orderGoodsList2 = wx.getStorageSync('orderGoodsList')
    this.setData({
      orderGoodsList: orderGoodsList2
    })
    // 监听回调   -
    getApp().watch(this.watchBack);
  },
  onMyevent: function (e) {
    this.setData({
      isSelect: e.detail
    });
  },
  //生成订单函数
  goodsCalc: function (e) {
    console.log(e)
    let list = this.data.orderGoodsList;
    let flag = false;
    let filterIndex = -1;
    if (list.length > 0) {
      list.forEach((item, index) => {
        if (item.id === e.detail.id) {
          filterIndex = index;
          flag = true;
        }
      });
    }
    if (flag && filterIndex > -1) {
      list[filterIndex] = e.detail;
    } else {
      list.push(e.detail);
    }
    this.setData({
      orderGoodsList: list
    });
    // 生成订单时，清空number为0的值
    if (e.detail.orderGoodsList3 && e.detail.orderGoodsList3.length > 0) {
      let lists = e.detail.orderGoodsList3;
      wx.removeStorageSync("orderGoodsList");
      wx.setStorageSync('orderGoodsList', lists);
      this.setData({
        orderGoodsList: lists
      });
    } else {
      wx.setStorageSync('orderGoodsList', this.data.orderGoodsList);
    }
    // 点击add时，增加一个number， number+1
    let num = e.detail.number
    this.data.hotList.forEach((item, index) => {
      if (e.detail.id === item.id) {
        let temp = 'hotList[' + index + '].number'
        this.setData({
          [temp]: num
        })
      }
    })
    this.priceCalc();
  },
  priceCalc: function () {
    let { starprice, orderGoodsList } = this.data;
    let goodsPrice = 0;
    // 配送费
    let sendprice = 0;
    let sub_distribution_fee = 0;
    if (orderGoodsList.length > 0) {
      orderGoodsList.forEach(item => {
        goodsPrice += item.price * item.number;
      });
    }
    if (+goodsPrice >= sub_distribution_fee || +goodsPrice === 0) {
      sendprice = 0;
    }
    app.globalData.goodsPrice = goodsPrice;
    this.setData({
      goodsPrice,
      sendprice,
      sub_distribution_fee
    });
  },
  //app 监听回调方法
  watchBack: function (value) { //这里的value 就是 app.js 中 watch 方法中的 set, 返回整个 globalData
    console.log(value)
    this.setData({
      cartShow: value.cartShow
    });
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
