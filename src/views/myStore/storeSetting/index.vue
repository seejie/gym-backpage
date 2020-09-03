<template>
  <div class="my-setting-wrapper">
    <myMngr
      :requestUrl4Get="requestUrl4Get"
      :requestUrl4Update="requestUrl4Update"
      :title="itemName"
      :columns="columns"
    ></myMngr>
  </div>
</template>
<script>
import myMngr from '@/components/myMngr';
import { pcaa } from 'area-data';
export default {
  name: 'storeSetting',
  props: {},
  components: {
    myMngr,
  },
  data() {
    return {
      itemName: '店铺设置',
      requestUrl4Get: '/sys/unit/getUnit', // 获取单位
      requestUrl4Update: '/sys/unit/saveUnitInfo', // 保存
      columns: {
        id: {
          label: '店铺ID',
          type: 'text',
          disabled: true,
        },
        unitName: {
          label: '店铺名称',
          type: 'text',
          disabled: false,
        },
        introduction: {
          label: '店铺简介',
          type: 'textarea',
          disabled: false,
        },
        address: {
          key: '',
          label: '联系地址',
          type: 'address',
          level: 1,
          disabled: false,
          submitFormater(form) {
            // 接口提交的参数格式
            const areaArr = {};
            if (form.areaArr[0]) {
              // 省份
              areaArr.provinceId = form.areaArr[0];
              areaArr.provinceName = pcaa[86][areaArr.provinceId];
            }
            if (form.areaArr[1]) {
              // 市
              areaArr.cityId = form.areaArr[1];
              areaArr.cityName = pcaa[areaArr.provinceId][areaArr.cityId];
            }
            if (form.areaArr[2]) {
              // 区县
              areaArr.areaId = form.areaArr[2];
              areaArr.areaName = pcaa[areaArr.cityId][areaArr.areaId];
            }
            console.log(areaArr);
            return areaArr;
            // if(form.areaArr)
            // console.log(citys);
          },
          initFormater(res) {
            // 初始化显示到页面 数据格式
            const areaArr = [];
            if (res.provinceId) {
              areaArr.push(res.provinceId + '');
              if (res.cityId) {
                areaArr.push(res.cityId + '');
                if (res.areaId) {
                  areaArr.push(res.areaId + '');
                }
              }
            }
            return areaArr;
          },
        },
        creatorId: {
          label: '负责人',
          type: 'text',
          disabled: true,
        },
        mobile: {
          key: 'mobile',
          label: '联系电话',
          type: 'text',
          disabled: false,
        },
        unitImg: {
          label: 'LOGO',
          type: 'headimg',
          max: 1,
          disabled: false,
        },
        unitUrl: {
          label: '店铺系统网址',
          type: 'preViewUrl',
          max: 1,
          disabled: true,
        },
        // {
        //   key: 'qrcode',
        //   label: '微信二维码',
        //   type: 'qrcode',
        //   disabled: false,
        // }
      },
    };
  },
  mounted() {},
  methods: {},
};
</script>
