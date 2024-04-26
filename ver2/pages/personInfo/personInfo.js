// pages/personInfo/personInfo.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberInfo:{
      pic : '',
      name : '',
      sidNumber : '',
      className : '',
      college : '',
    },
    nomal: false
  },
    //监听勾选框时间
  agreePrivacy: function(e) {
      // 当用户点击复选框时，更新agree的状态
      if (e.detail.value.length > 0) {
        // 如果复选框被勾选，设置agree为true
        this.setData({ nomal: true });
      } else {
        // 如果复选框被取消勾选，设置agree为false
        this.setData({ nomal: false });
      }
      wx.setStorageSync('nomal',this.data.nomal);
    },
  //退出登陆
  handleLogoutClick: function() {
    wx.showModal({
      title: '确认退出',
      content: '您确定要退出登录吗？',
      success: function(res) {
        if (res.confirm) {
          // 用户点击了确认
          // 在这里处理退出登录的逻辑，比如清除用户数据、调用退出接口等
          wx.reLaunch({
            url: '/pages/login/login',
          });
        } else if (res.cancel) {
          // 用户点击了取消
          // console.log('用户取消退出登录');
        }
      }
    });
  },

  onLoad(options) {
    // 从本地存储中获取已登录的用户信息
    const id = wx.getStorageSync('id');
    const baseUrl = app.globalData.baseUrl;
    const Urlpic = `${baseUrl}data/user/info/${id}/pic`;
    this.setData({
      'memberInfo.pic' : Urlpic,
    });
    const UrlInfo = `${baseUrl}data/user/info/${id}/detail`;
    const data = id;
    wx.request({
      url: UrlInfo,
      method: 'GET',
      data: data,
      success: (res) => {
          if (res.statusCode === 200) {
            this.setData({
            'memberInfo.className' : res.data.className,
            'memberInfo.college' : res.data.college,
            'memberInfo.name' : res.data.name,
            'memberInfo.sidNumber' : res.data.sidNumber,
            })
            wx.setStorageSync('memberInfo', this.data.memberInfo);
          }
      },
      fail: function (error) {
        console.error(error);
        // 请求失败
        wx.showToast({
          title: '服务器异常',
          icon: 'none',
          duration: 2000
        });
      }
   })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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