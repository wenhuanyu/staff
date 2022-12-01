import Vue from 'vue'
import App from './App'
import common from './utils/common.js';
import store from './store/index.js';

import commonTop from './components/commonTop.vue'    //页面头部
import searchBox from './components/search/index'   //顶部搜索
import examinePeople from './components/examinePeople/index.vue'     //选择审批人
import fixedApproval from './components/examinePeople/fixedApproval.vue'   //固定审批
import approvalStatus from './components/examinePeople/approvalStatus.vue'   //审批流程详情
import uploadImg from './components/uploadImg/index.vue'     //上传图片
import uploadFile from './components/uploadFile/index.vue'    //上传附件
import morePop from './components/morePop.vue'       // 讨论  传阅
import handWrittenSign from './components/handwrittenSign.vue'   //手写签名
Vue.component("common-top",commonTop)
Vue.component("search-box",searchBox)
Vue.component("examine-people",examinePeople)    //选择审批人
Vue.component("fixed-approval",fixedApproval)    //固定审批
Vue.component("approval-status",approvalStatus)     //审批流程详情
Vue.component("upload-img",uploadImg)
Vue.component("upload-file",uploadFile)
Vue.component("more-pop",morePop)
Vue.component('handWrittenSign',handWrittenSign)

Vue.config.productionTip = false
Vue.prototype.$noMultipleClicks = common.noMultipleClicks;
Vue.prototype.handleSearchForm = common.handleSearchForm  //处理搜索表单
Vue.prototype.handleSureSearch = common.handleSureSearch
Vue.prototype.handleResetSearch = common.handleResetSearch
Vue.prototype.handleChangeSearchValue = common.handleChangeSearchValue    //搜索表单修改值时
Vue.prototype.handleFormDefaultValue = common.handleFormDefaultValue    //查看详情时给form表单赋值
Vue.prototype.changeFormData = common.changeFormData      //自定义form表单  修改值赋值
Vue.prototype.checkCommonForm = common.checkCommonForm     //提交的数据进行校验
Vue.prototype.handleTime = common.handleTime
Vue.prototype.$deWeight = common.deWeight     //去重
Vue.prototype.openCommonFile = common.openCommonFile   //打开文档
Vue.prototype.openCommonImg = common.openCommonImg    //打开图片
Vue.prototype.$store = store;

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
