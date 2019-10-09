// components/index-goods/index-goods.js
const app = getApp();
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    goods: {
      type: Object,
      value: {}
    },
  },
  lifetimes: {
    created: function () {
      this.busPos = {};
      this.busPos['x'] = 38; //购物车的位置
      this.busPos['y'] = app.globalData.hh - 60;
    }
  },
  data: {
    hide_good_box: true
  },
  methods: {
    reduce: function () {
      if (this.properties.goods.number > 0) {
        // 减少一条商品
        this.properties.goods.data.forEach((res, index) => {
          if (res.id === e.target.dataset.good.id) {
            e.target.dataset.good.number = res.number - 1
          }
        })
        let {
          id,
          cname,
          img1,
          price,
          number
        } = this.properties.goods;
        this.triggerEvent('goodscalc', {
          id,
          cname,
          img1,
          price,
          number: e.target.dataset.good.number
        });
      }
    },
    add: function (e) {
      // 增加一条商品
      this.properties.goods.data.forEach((res, index) => {
        // console.log(res)
        if (res.id === e.target.dataset.good.id) {
          if (!res.number) {
            res.number = 0
          }
          e.target.dataset.good.number = res.number + 1
        }
      })
      let {
        id,
        cname,
        img1,
        price,
        number
      } = this.properties.goods;
      this.triggerEvent('goodscalc', {
        id,
        cname,
        img1,
        price,
        number: e.target.dataset.good.number
      });
      this.cartBtn();
    },
    touchOnGoods: function (e) {
      this.finger = {};
      var topPoint = {};
      this.finger['x'] = e.touches["0"].clientX; //点击的位置
      this.finger['y'] = e.touches["0"].clientY;

      if (this.finger['y'] < this.busPos['y']) {
        topPoint['y'] = this.finger['y'] - 150;
      } else {
        topPoint['y'] = this.busPos['y'] - 150;
      }
      topPoint['x'] = Math.abs(this.finger['x'] - this.busPos['x']) / 2;

      if (this.finger['x'] > this.busPos['x']) {
        topPoint['x'] = (this.finger['x'] - this.busPos['x']) / 2 + this.busPos['x'];
      } else { //
        topPoint['x'] = (this.busPos['x'] - this.finger['x']) / 2 + this.finger['x'];
      }

      this.linePos = app.bezier([this.busPos, topPoint, this.finger], 30);
      this.startAnimation(e);
    },
    startAnimation: function (e) {
      var index = 0,
        that = this,
        bezier_points = that.linePos['bezier_points'];

      this.setData({
        hide_good_box: false,
        bus_x: that.finger['x'],
        bus_y: that.finger['y']
      })
      var len = bezier_points.length;
      index = len
      this.timer = setTimeout(function () {
        for (let i = index - 1; i > -1; i--) {
          that.setData({
            bus_x: bezier_points[i]['x'],
            bus_y: bezier_points[i]['y']
          })

          if (i < 1) {
            clearInterval(that.timer);
            that.add(e);
            that.setData({
              hide_good_box: true
            })
          }
        }
      }, 25);
    },
    cartBtn() {
      console.log(1)
      let isOpen = false
      app.globalData.data = {
        cartShow: 'cartclose'
      }
      app.globalData.data = {
        cartShow: 'cartopen'
      }
      setTimeout(() => {
        app.globalData.data = {
          cartShow: 'cartopen'
        }
        app.globalData.data = {
          cartShow: 'cartclose'
        }
      }, 500);
    },
  }
})