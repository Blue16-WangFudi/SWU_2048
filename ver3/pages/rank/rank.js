// pages/rank/rank.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     // 数据数组
     multiArray: [
      ['普通','困难'],
      ['最高分','累积得分'],
      ['学校','学院','班级']
    ],
    // 各列选择的初始值
    multiIndex: [0, 0, 0],
    typeindex:0,//监测当前选择的排名类型
    // 用于显示的变量
    modes: ['普通','困难'],
    types: [ '最高分','累积得分'],
    scopes: ['学校','学院','班级'],
    scoreList: [],
    detail:[],
    detailname:'',
    gameType:'0',
    rankType:'TopMark',
    college:null,
    className:null,
    top_n:100,
    studentInfo:'',
    selfInfo:{
      name:'',
      bestScore:0,
      totalScore:0,
      rank:0
    },
    showModal:false,
    id:''
   },
     // 监听picker选择改变
  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value,
      typeindex:e.detail.value[1]
    });
    if(e.detail.value[0] == 0){
      this.data.gameType = '0'
    }
    if(e.detail.value[0] == 1){
      this.data.gameType = '1'
    }
    if(e.detail.value[1] == 0){
      this.data.rankType = 'TopMark'
    }
    if(e.detail.value[1] == 1){
      this.data.rankType = 'TotalMark'
    }
    if(e.detail.value[2] == 0){
      this.data.className = null; 
      this.data.college = null
    }
    if(e.detail.value[2] == 1){
      this.data.className = null;
      this.data.college = this.data.studentInfo.college
    }
    if(e.detail.value[2] == 2){
      this.data.className = this.data.studentInfo.className;
      this.data.college = null
    }
    this.getScore(this.data.gameType, this.data.rankType, this.data.college, this.data.className, this.data.top_n);
    this.getMarkRank(this.data.id,this.data.gameType, this.data.rankType,this.data.college,this.data.className);
  },
  // 监听picker列改变
  bindMultiPickerColumnChange: function (e) {
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    // 如果你想在某一列改变时调整其他列的选项，可以在这里进行操作
  },

  onLoad(options) {
    const studentInfo= wx.getStorageSync('memberInfo');
    const id = wx.getStorageSync('id');
    this.setData({
      id:id,
      studentInfo:studentInfo
    })
    this.getScore(this.data.gameType, this.data.rankType, this.data.college, this.data.className, this.data.top_n)
    // this.getMarkRank(this.data.id,this.data.gameType,this.data.rankType,this.data.college,this.data.className)
  },
  //获取玩家游戏日志
  getDetailedRecords: function () {
    
  },
  //获取个人相关信息
  getMarkRank: function(id, gameType, rankType, college, className) {
    const UrlMarkRank = app.globalData.baseUrl +'rank/user_rank';
    const data = { 
      userID:id,
      gameType:gameType,
      rankType:rankType,
      college:college,
      className:className
      };
      console.log(data)
      wx.request({
        url: UrlMarkRank,
        method: 'POST',
        data: data,
        success: (res)=>{
          console.log(res)
          if(res.statusCode ===200){
            this.setData({
              'selfInfo.rank' : res.data.rank
            })
          }
        },
    })
    const baseUrl = app.globalData.baseUrl;
    const UrlG = `${baseUrl}data/${id}/total/${gameType}`;
    wx.request({
      url: UrlG,
      method: 'GET',
      success: (res) => {
          if (res.statusCode === 200) {
            this.setData({
              'selfInfo.bestScore' : res.data.topMark,
              'selfInfo.totalScore' : res.data.totalMark
            })
        }
      },
    })
  },
  //获取玩家得分榜单，从高到低
  getScore: function(gameType, rankType, college, className, top_n) {
    const UrlScore = app.globalData.baseUrl +'rank/top_n_players';
    const data = { 
      gameType:gameType,
      rankType:rankType,
      college:college,
      className:className,
      top_n:top_n
      };
      wx.request({
        url: UrlScore,
        method: 'POST',
        data: data,
        success: (res)=>{
          this.setData({
            scoreList:res.data
          })
        },
      })
  },
  //显示每个人的细节
  showDetail: function(e){
    const index = e.currentTarget.dataset.index;
    const name = this.data.scoreList[index].name;
    const college = this.data.scoreList[index].college;
    const className = this.data.scoreList[index].className;
    const sidNumber = this.data.scoreList[index].sidNumber;
    let detail = []
    detail.push({
      name:name,
      college:college,
      className:className,
      sidNumber:sidNumber
    })
    this.setData({
      detailname:name,
      detail:detail,
      showModal:true
    })
  },

  closeModal: function() {
    this.setData({
      showModal: false
    });
  },

  
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.getScore(this.data.gameType, this.data.rankType, this.data.college, this.data.className, this.data.top_n)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})