const getters = {
  //session
  device: state => state.session.device,//设备
  theme: state => state.session.theme,//主题
  color: state => state.session.color,//主题颜色
  multiTab: state => state.session.multiTab,//多标签
  appSession:state => state.session.appSession,
  welcome: state => state.session.welcome,//欢迎信息
  avatar: state => state.session.appSession.user.profilePictureId ? state.session.appSession.user.profilePictureId : '/avatar2.jpg',
  nickname: state => state.session.appSession.user.name + state.session.appSession.user.surname,
  //tokenAuth
  token: state => state.tokenAuth.token,//Token
  //permission
  addRouters: state => state.permission.addRouters,//权限路由



}

export default getters
