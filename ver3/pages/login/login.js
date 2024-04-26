// pages/login/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sidNumber: '',
    password: '',

  },

  // 监听输入框变化
  bindInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [field]: e.detail.value
    });
  },

  // 提交表单
  onLogin: function() {
    const { sidNumber, password } = this.data;
    // console.log(this.data.password,1);
    // 在这里进行登录验证
    const urlauth = app.globalData.baseUrl +'auth';
    const data = { sidNumber, password };
    if(sidNumber.length === 0 || password.length === 0){
      wx.showToast({
        title: '请输入完整信息！',
        icon: 'none',
        duration: 2000
      });
    }
    else{
      wx.request({
        url: urlauth,
        method: 'POST',
        data: data,
        success: (res) => {
            if (res.statusCode === 200) {
            // 登陆成功，进行相应处理，例如跳转页面等
            wx.showToast({
              title: '登陆成功',
              icon: 'success',
              duration: 2000
            });
            // console.log(res);
            wx.setStorageSync('id', res.data.id);
            wx.switchTab({
              url: '../2048/2048'
            })
          } else {
            wx.showToast({
              title: '账号或密码错误',
              icon: 'none',
              duration: 3000
            });
            
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
    }
  },

  yinsi: function (){
    wx.navigateTo({
      url: '/pages/yinsi/yinsi',
    });
  },

  // 页面销毁时清除计时器
  onUnload() {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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