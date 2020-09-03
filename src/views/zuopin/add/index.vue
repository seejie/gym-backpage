<template>
  <div class="my-setting-wrapper">
    <myMngr
      :crules="crules"
      :title="itemName"
      :columns="columns"
      :params="params"
      :requestUrl4Get="requestUrl4Get"
      :requestUrl4Save="requestUrl4Save"
      :requestUrl4Update="requestUrl4Update"
    ></myMngr>
  </div>
</template>
<script>
import myMngr from '@/components/myMngr';
import { pcaa } from 'area-data';
import request from '@/utils/request';
import { worksCategoryQueryAll } from '@/api/zuopin/cateory.js';
export default {
  name: 'addzuopin',
  props: {},
  components: {
    myMngr,
  },
  data() {
    return {
      itemName: '创建作品',
      params: {},
      requestUrl4Get: '', // 获取作品信息
      requestUrl4Save: '/worksmanager/saveWorks', // 保存-更新 作品信息
      requestUrl4Update: '/worksmanager/saveWorks', // 保存-更新 作品信息
      crules: {
        title: [{ required: true, message: '请输入作品标题', trigger: 'blur' }],
        introduction: [{ required: true, message: '请输入作品介绍', trigger: 'blur' }],
        categoryId1: [{ required: true, message: '请选择一级分类', trigger: ['blur', 'change'] }],
        categoryId2: [{ required: true, message: '请选择二级分类', trigger: ['blur', 'click'] }],
        creationDate: [{ required: true, message: '请选择创作日期', trigger: ['blur', 'click', 'change'] }],
        masterId: [{ required: true, message: '请选择作家', trigger: ['blur', 'click', 'change'] }],
        status: [{ required: true, message: '请选择发布时间', trigger: ['blur', 'click', 'change'] }],
      },
      columns: {
        title: {
          label: '作品标题',
          type: 'text',
          placeholder: '请输入名称，30字以内',
          rule: 'title',
          disabled: false,
        },
        summary: {
          label: '作品摘要',
          type: 'textarea',
          disabled: false,
        },
        introduction: {
          label: '作品介绍',
          type: 'editor',
          rule: 'introduction',
          disabled: false,
        },
        category: {
          label: '选择分类',
          type: 'selects',
          disabled: false,
          selects: {
            categoryId1: {
              placeholder: '一级分类',
              rule: 'categoryId1',
              list: [],
              change: () => {},
            },
            categoryId2: {
              placeholder: '二级分类',
              rule: 'categoryId2',
              list: [],
            },
          },
        },
        creationDate: {
          label: '创作日期',
          type: 'yearmonth',
          placeholder: '选择年月',
          rule: 'creationDate',
          disabled: false,
        },
        arts: {
          label: '馆藏',
          type: 'selects',
          disabled: false,
          selects: {
            storeId: {
              placeholder: '选择作品在藏场馆',
              list: [],
            },
          },
        },
        author: {
          label: '作家',
          type: 'selects',
          disabled: false,
          selects: {
            masterId: {
              placeholder: '选择作家',
              rule: 'masterId',
              list: [],
            },
          },
        },
        coverImage: {
          label: '作品封面',
          type: 'image',
          max: 1,
          disabled: false,
        },
        status: {
          label: '发布时间',
          type: 'radios',
          max: 1,
          disabled: false,
          rule: 'status',
          default: 2,
          radios: [
            {
              value: 2,
              label: '立即发布',
            },
            {
              value: 3,
              label: '草稿，暂不发布',
            },
          ],
        },
      },
    };
  },
  created() {
    if (this.$route.query.id) {
      this.params.id = this.$route.query.id;
      this.requestUrl4Get = '/worksmanager/getWorks';
    }
  },
  mounted() {
    this.getMasterList();
    this.getStoreList();
    this.getWorksCategory();
  },
  methods: {
    getWorksCategory(parentId = 0) {
      worksCategoryQueryAll({ parentId: parentId }).then(res => {
        if (res.resCode === 200) {
          // const list = res.resObject.list;
          if (parentId === 0) {
            this.columns.category.selects.categoryId1.list = res.resObject.list.map(item => {
              return {
                value: item.id,
                label: item.name,
              };
            });
            this.columns.category.selects.categoryId1.change = (val, item, key, $vm, initFlag) => {
              // $vm.mngrForm.categoryId2 = '';
              if (!initFlag) {
                $vm.mngrForm = {
                  ...$vm.mngrForm,
                  categoryId2: '',
                };
              }
              this.getWorksCategory(val);
            };
            this.columns.category.selects.categoryId2.list = [];
            if (this.$route.query.id) {
              this.getWorksCategory(this.$route.query.id);
            }
          } else {
            this.columns.category.selects.categoryId2.list = res.resObject.list.map(item => {
              return {
                value: item.id,
                label: item.name,
              };
            });
          }
          // category: {
          // label: '选择分类',
          // type: 'selects',
          // disabled: false,
          // selects: {
          //   categoryId1: {
          //     placeholder: '一级分类',
          //     rule: 'categoryId1',
          //     list: [
        }
      });
    },
    getMasterList() {
      // 大师
      request({
        url: '/storemanager/master/list',
        method: 'GET',
        params: {
          unitType: 31,
          pageSize: 1000,
          pageNum: 1,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => {
          if (res.resCode === 200 && res.resObject && res.resObject.list) {
            this.columns.author.selects.masterId.list = res.resObject.list.map(item => {
              return {
                value: item.id,
                label: item.name,
              };
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getStoreList() {
      // 艺术场馆
      request({
        url: '/storemanager/store/list',
        method: 'GET',
        params: {
          unitType: 32, // 32 标准店铺
          pageSize: 1000,
          pageNum: 1,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => {
          if (res.resCode === 200 && res.resObject && res.resObject.list) {
            this.columns.arts.selects.storeId.list = res.resObject.list.map(item => {
              return {
                value: item.id,
                label: item.name,
              };
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
};
</script>
