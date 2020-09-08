const settings = {
  title: '154测试环境',
  ico: 'http://myqt.jsqiaotuo.com/jiangluhui.ico',

  baseUrl: 'http://ceshi.njlime.com/xqn', // 154测试环境
  // baseUrl: 'http://saas.njlime.com/xqn',   //小清柠社群营销平台

  // baseUrl: 'http://yjyx.jsqiaotuo.com/xqn',    //一教一学
  // baseUrl: 'http://saas.jsqiaotuo.com/xqn', //侨拓社群营销平台
  // baseUrl: 'http://jiangluhui.jsqiaotuo.com/xqn', //江陆惠测足电商平台

  // 这个压缩不收费，是在本地压缩的  不是调的七牛云api 不走流量。 是调用的js-sdk 。尺寸就是 宽*高 /1024  (kb)。 比如宽高都是1024 就是1M
  uploadpicMaxSize: 5, // 上传最大图片限制单位M
  zipPicMaxWith: 500,
  zipPicMaxHeight: 500,

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: false,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: false,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',
};

module.exports = settings;
