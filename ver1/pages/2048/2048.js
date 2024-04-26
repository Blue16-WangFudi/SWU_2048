var Board = require("./grid.js");
var Main = require("./main.js");
const app = getApp();
Page({ 
  data: {
    hidden: true,
    start: "开始游戏",
    num: [],
    score: 0,
    bestScore: 0, // 最高分
    totalScore: 0, //累计得分
    endMsg: '',
    over: false,  // 游戏是否结束,
    sumScore: 0,
    flag: 0,
    sumMark:0

  },
  // 页面渲染完成
  onReady: function () {
    if(!wx.getStorageSync("highScore"))
      wx.setStorageSync('highScore', 0);
    // this.gameStart();
  },
  gameStart: function() {  // 游戏开始
    var main = new Main(4);
    this.setData({
      main: main,
      // bestScore: wx.getStorageSync('highScore')
    });
    // 结束游戏
    if(this.data.flag){
      this.setData({
        start: "开始游戏",
        flag: 0
      });
      this.gameOver();
    }else{
      // 开始游戏
    this.data.main.__proto__ = main.__proto__; 
    
    this.setData({
      hidden: true,
      over: false,
      score: 0,
      num: this.data.main.board.grid,
      start:"结束本局",
      flag:1,
      sumMark:0,
      sumScore:0,
      bestScore:0,
      totalScore:0,
      endMsg:''
    }); 
  } 
  },
  gameOver: function() {  // 游戏结束
    this.setData({
      over: true 
    });

    const id = wx.getStorageSync('id');
    // 结局游戏，上传该局的游戏得分
    const UrlP = app.globalData.baseUrl +'record';
    const data = { 
      id:id,
      gameType:'2048',
      mark: this.data.sumScore
     };
     wx.showLoading({
      title: '加载中',
      mask: true // 是否显示透明蒙层，防止触摸穿透
    });
     wx.request({
       url: UrlP,
       method: 'POST',
       data: data,
       success: (res)=>{
        // 获取最高得分
        const baseUrl = app.globalData.baseUrl;
        const UrlG = `${baseUrl}data/${id}/total/2048`;
         wx.request({
          url: UrlG,
          method: 'GET',
          success: (res) => {
              if (res.statusCode === 200) {
                wx.hideLoading();
                this.setData({
                  bestScore: res.data.topMark,
                  totalScore: res.data.totalMark
                });
                this.setData({
                  sumMark:this.data.sumScore
                })
                if (this.data.sumScore > this.data.bestScore) {
                  this.setData({
                    endMsg: '创造新纪录！' ,
                  });      
                } else {
                  this.setData({
                    endMsg: '游戏结束！',
                  });          
                } 
              }
              else{res.statusCode === 400}
              {
              }
            }
          });

       }
     });
  },
  // 屏幕触摸事件：判断如何移动
  touchStartX: 0,
  touchStartY: 0,
  touchEndX: 0,
  touchEndY: 0,
  touchStart: function(ev) { // 触摸开始坐标
    var touch = ev.touches[0];
    this.touchStartX = touch.clientX;
    this.touchEndX = this.touchStartX; //防止点击事件使用上一次的EndX，造成错误移动。即点击事件不移动
    this.touchStartY = touch.clientY;
    this.touchEndY = this.touchStartY;//防止点击事件使用上一次的EndY，造成错误移动。即点击事件不移动
  },
  touchMove: function(ev) { // 触摸最后移动时的坐标
    var touch = ev.touches[0];
    this.touchEndX = touch.clientX;
    this.touchEndY = touch.clientY;
  },
  touchEnd: function() {
    var disX = this.touchStartX - this.touchEndX;
    var absdisX = Math.abs(disX);
    var disY = this.touchStartY - this.touchEndY;
    var absdisY = Math.abs(disY);

    if(this.data.main.isOver()) { // 游戏是否结束
      this.gameOver();
      this.setData({
        start: "开始游戏",
        flag: 0
      });
    } else {
      if (Math.max(absdisX, absdisY) > 10) { // 确定是否在滑动
          // this.setData({
          //   start: "结束本局",
          //   flag: 1,
          // });

        // console.log(absdisX, absdisY);
        var direction = absdisX > absdisY ? (disX < 0 ? 1 : 3) : (disY < 0 ? 2 : 0);  // 确定移动方向
        var data = this.data.main.move(direction);
        this.setData({
          num: data,
          sumScore: this.data.main.sumScore,
        })
        // this.updateView(data);
      }   
    }      
  },
  // 更新当前最大的数字
  // updateView(data) {
  //   var max = 0;
  //   for(var i = 0; i < 4; i++)
  //     for(var j = 0; j < 4; j++)
  //       if(data[i][j] != "" && data[i][j] > max)
  //         max = data[i][j];
  //   this.setData({
  //     num: data,
  //     score: max
  //   });
  // },
  onShareAppMessage: function() {
    return {
      title: '2048小游戏',
      desc: '来试试你能达到多少分',
      path: '/page/user?id=123'
    }
  }
})