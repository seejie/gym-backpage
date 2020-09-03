/* 此文件为公共组件全局注册方法 */
import myTable from '@/components/NewTable/index.vue';
import ImgInclude from '@/components/CropImgInclue/index.vue';
import myEditor from '@/components/EditorComponent/index.vue';
import formList from '@/components/FormList';
import topForm from '@/components/topSearchForm/index.vue';
// 引入组件
function plugin(Vue) {
  if (plugin.intalled) {
    return;
  }
  Vue.component('topForm', topForm);
  Vue.component('myTable', myTable);
  Vue.component('myUpload', ImgInclude);
  Vue.component('myEditor', myEditor);
  Vue.component('formList', formList);
  // 注册组件
}
export default plugin;
