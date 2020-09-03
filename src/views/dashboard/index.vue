<template>
  <div class="managePage">
    <div class="title">服务数据大盘</div>

    <el-card shadow="never">
      <div class="box-card">
        <div class="header-img">
          <i class="el-icon-user-solid"></i>
        </div>
        <div class="number-box">
          <div class="number-title">今日总服务量</div>
          <div class="number">{{productData.allTicket+productData.allInn+productData.allProduct+productData.allActive}}</div>
          <div>
            <span class="down-color">
              <i class="el-icon-caret-bottom"></i>10%
            </span>
            <span class="number-tip">同比上周</span>
          </div>
        </div>
        <div class="number-box">
          <div class="number-title">门票发布（个）</div>
          <div class="number">{{productData.allTicket}}</div>
          <div>
            <span class="down-color" v-if="productData.currentTicket!=0&&productData.beforeTicket!=0">
              <i class="el-icon-caret-bottom"></i>{{productData.beforeTicket==0?'0%':productData.currentTicket/productData.beforeTicket*100+'%'}}
            </span>
            <span class="number-tip">
              <i style="font-style:normal" v-if="productData.currentTicket==0||productData.beforeTicket==0">
                {{productData.beforeTicket==0?'0%':productData.currentTicket/productData.beforeTicket*100+'%'}}
              </i>
              同比上周</span>
          </div>
        </div>
        <div class="number-box">
          <div class="number-title">客栈发布（个）</div>
          <div class="number">{{productData.allInn}}</div>
          <div>
            <span class="up-color" v-if="productData.beforeInn!=0&&productData.currentInn!=0">
              <i class="el-icon-caret-top"></i>{{productData.beforeInn==0?'0%':Math.round(productData.currentInn/productData.beforeInn*100)+'%'}}
            </span>
            <span class="number-tip">
              <i style="font-style:normal" v-if="productData.beforeInn==0||productData.currentInn==0">
                {{productData.beforeInn==0?'0%':Math.round(productData.currentInn/productData.beforeInn*100)+'%'}}
              </i>
              同比上周</span>
          </div>
        </div>
        <div class="number-box">
          <div class="number-title">商品发布（次）</div>
          <div class="number">{{productData.allProduct}}</div>
          <div>
            <span class="down-color" v-if="productData.beforeProduct!=0&&productData.currentProduct!=0">
              <i class="el-icon-caret-bottom"></i>{{productData.beforeProduct==0?'0%':Math.round(productData.currentProduct/productData.beforeProduct*100)+'%'}}
            </span>
            <span class="number-tip">
              <i style="font-style:normal" v-if="productData.beforeProduct==0||productData.currentProduct==0">
                {{productData.beforeProduct==0?'0%':Math.round(productData.currentProduct/productData.beforeProduct*100)+'%'}}
              </i>
              同比上周</span>
          </div>
        </div>
        <div class="number-box">
          <div class="number-title">活动发布（个）</div>
          <div class="number">{{productData.allActive}}</div>
          <div>
            <span class="down-color" v-if="productData.beforeActive!=0&&productData.currentActive!=0">
              <i class="el-icon-caret-bottom"></i>{{productData.beforeActive==0?'0%':Math.round(productData.currentActive/productData.beforeActive*100)+'%'}}
            </span>
            <span class="number-tip">
              <i style="font-style:normal" v-if="productData.beforeActive==0||productData.currentActive==0">
                {{productData.beforeActive==0?'0%':Math.round(productData.currentActive/productData.beforeActive*100)+'%'}}
              </i>
              同比上周</span>
          </div>
        </div>
        <div class="number-box">
          <div class="number-title">课程发布（个）</div>
          <div class="number">124,345</div>
          <div>
            <span class="down-color">
              <i class="el-icon-caret-bottom"></i>{{Math.round(1/3*100)+'%'}}
            </span>
            <span class="number-tip">同比上周</span>
          </div>
        </div>
        <div class="number-box">
          <div class="number-title">入驻网点（个）</div>
          <div class="number">{{productData.allUnit}}</div>
          <div>
            <span class="down-color" v-if="productData.beforeUnit!=0&&productData.currentUnit!=0">
              <i class="el-icon-caret-bottom"></i>{{productData.beforeUnit==0?'0%':Math.round(productData.currentUnit/productData.beforeUnit*100)+'%'}}
            </span>
            <span class="number-tip">
              <i style="font-style:normal" v-if="productData.beforeUnit==0||productData.currentUnit==0">
                {{productData.beforeUnit==0?'0%':Math.round(productData.currentUnit/productData.beforeUnit*100)+'%'}}
              </i>
              同比上周</span>
          </div>
        </div>

      </div>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="never">
          <div slot="header">
            <span>订单趋势</span>
          </div>
          <div>
            <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 20px">
              <div style="display: flex;align-items: center">
                <div>
                  <span style="font-size: 24px">21000</span>
                  <span style="color: #989898;font-size: 12px">订单总数</span>
                </div>
                <div style="margin-bottom: 0;margin-left: 20px" class="btn-box">
                  <a class="active">付费订单</a>
                  <a>取消订单</a>
                </div>
              </div>
              <div style="display: flex;align-items: center">
                <div class="btn-box2">
                  <a class="active">今日</a>
                  <a>本周</a>
                  <a>本月</a>
                </div>
                <el-date-picker v-model="value1" type="daterange" start-placeholder="开始日期"
                                end-placeholder="结束日期"></el-date-picker>
              </div>
            </div>
            <div style="height: 294px">
              <e-charts :options="option" :init-options="initOptions" autoresize/>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never">
          <div slot="header">
            <span>渠道排行榜</span>
            <el-link style="float: right;" type="primary">更多</el-link>
          </div>
          <div class="btn-box">
            <a class="active">今日</a>
            <a>本周</a>
            <a>本月</a>
          </div>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column label="排名" type="index"></el-table-column>
            <el-table-column prop="date" label="渠道"></el-table-column>
            <el-table-column prop="name" label="销售额">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
                <el-progress :show-text="false" :percentage="50"></el-progress>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="周环比">
              <template slot-scope="scope">
                <span class="down-color">
                  <i class="el-icon-caret-bottom"></i>
                  {{ scope.row.address }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="never">
          <div slot="header">
            <span>用户趋势</span>
          </div>
          <div>
            <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 20px">
              <div>
                <span style="font-size: 24px">21000</span>
                <span style="color: #989898;font-size: 12px">累计注册用户数</span>
              </div>
              <div style="display: flex;align-items: center">
                <div class="btn-box2">
                  <a class="active">今日</a>
                  <a>本周</a>
                  <a>本月</a>
                </div>
                <el-date-picker type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </div>
            </div>
            <div style="height: 344px">
              <e-charts :options="lineOption" :init-options="initOptions" autoresize/>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never">
          <div slot="header">
            <span>指标评估图</span>
            <el-link style="float: right;" type="primary">更多</el-link>
          </div>
          <div style="height: 400px">
            <e-charts :options="radarOption" :init-options="initOptions" autoresize/>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>UGC发布</span>
      </div>
      <div style="display: flex;">
        <div style="border-right: 1px solid #ededed;width: 10%">
          <div class="number-box" style="margin-bottom: 50px">
            <div class="number-title">今日总服务量</div>
            <div class="number">124,345</div>
            <div>
            <span class="down-color">
              <i class="el-icon-caret-bottom"></i>10%
            </span>
              <span class="number-tip">同比上周</span>
            </div>
          </div>
          <div class="number-box">
            <div class="number-title">今日总服务量</div>
            <div class="number">124,345</div>
            <div>
            <span class="down-color">
              <i class="el-icon-caret-bottom"></i>10%
            </span>
              <span class="number-tip">同比上周</span>
            </div>
          </div>
        </div>
        <div style="width: 90%">
          <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 20px">
            <div style="margin-left: 20px">
              <span>用户发布</span>
            </div>
            <div style="display: flex;align-items: center">
              <div class="btn-box2">
                <a class="active">今日</a>
                <a>本周</a>
                <a>本月</a>
              </div>
              <el-date-picker type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </div>
          </div>
          <div style="height: 300px">
            <e-charts :options="lineOption2" :init-options="initOptions" autoresize/>
          </div>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span>游玩订单统计图</span>
          </div>
          <div style="height: 400px">
            <e-charts :options="mapOption" :init-options="initOptions" autoresize/>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span>全国省市占比情况</span>
          </div>
          <div style="height: 400px">
            <e-charts :options="pieOption" :init-options="initOptions" autoresize/>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>
<script>
  import ECharts from 'vue-echarts'
  import 'echarts/lib/chart/bar'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/chart/pie'
  import 'echarts/lib/chart/map'
  import 'echarts/lib/chart/radar'
  import 'echarts/lib/chart/scatter'
  import 'echarts/lib/chart/effectScatter'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/polar'
  import 'echarts/lib/component/geo'
  import 'echarts/lib/component/legend'
  import 'echarts/lib/component/title'
  import 'echarts/lib/component/visualMap'
  import 'echarts/lib/component/dataset'
  import 'echarts/map/js/china'
  import 'zrender/lib/svg/svg'


  export default {
    components: {
      ECharts
    },
    data() {
      let data = [
        {name: "北京", value: 199},
        {name: "天津", value: 42},
        {name: "河北", value: 102},
        {name: "山西", value: 81},
        {name: "内蒙古", value: 47},
        {name: "辽宁", value: 67},
        {name: "吉林", value: 82},
        {name: "黑龙江", value: 123},
        {name: "上海", value: 24},
        {name: "江苏", value: 92},
        {name: "浙江", value: 114},
        {name: "安徽", value: 109},
        {name: "福建", value: 116},
        {name: "江西", value: 91},
        {name: "山东", value: 119},
        {name: "河南", value: 137},
        {name: "湖北", value: 116},
        {name: "湖南", value: 114},
        {name: "重庆", value: 91},
        {name: "四川", value: 125},
        {name: "贵州", value: 62},
        {name: "云南", value: 83},
        {name: "西藏", value: 9},
        {name: "陕西", value: 80},
        {name: "甘肃", value: 56},
        {name: "青海", value: 10},
        {name: "宁夏", value: 18},
        {name: "新疆", value: 180},
        {name: "广东", value: 123},
        {name: "广西", value: 59},
        {name: "海南", value: 14},
      ];
      let gridData = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      };
      let gridData2 = {
        left: 60,
        right: 20,
        top: 30,
        bottom: 20,
      };
      return {
        value1: '',
        initOptions: {
          renderer: 'canvas'
        },
        mapOption: {
          grid: gridData,
          visualMap: {
            show: true,
            min: 0,
            max: 300,
            splitNumber: 6,
            calculable: false,
            color: ['#e0022a', '#e13b1b', '#e0740e', '#c5b03e', '#a8d074', '#99e090',]
          },
          series: [
            {
              type: 'map',
              map: 'china',
              geoIndex: 0,
              aspectScale: 0.75, //长宽比
              showLegendSymbol: false, // 存在legend时显示
              label: {
                show: true,
                formatter: '·{b}',
                position: ['top']
              },
              zoom: 1.2,
              roam: false,
              itemStyle: {
                areaColor: '#cccccc',
                borderWidth: 0
              },
              silent: true,
              data: data
            },
          ]
        },
        lineOption: {
          tooltip: {
            trigger: 'axis'
          },
          grid: gridData2,
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          yAxis: {
            type: 'value',
            splitLine: {
              show: false
            }
          },
          series: [
            {
              name: '邮件营销',
              type: 'line',
              stack: '总量',
              data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
              name: '联盟广告',
              type: 'line',
              stack: '总量',
              data: [220, 182, 191, 234, 290, 330, 310]
            },
          ]
        },
        lineOption2: {
          grid: gridData2,
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value',
            splitLine: {
              show: false
            }
          },
          series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true,
            areaStyle: {}
          }]
        },
        pieOption: {
          grid: gridData,
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              selectedMode: 'single',
              center: ['50%', '50%'],
              data: [
                {value: 335, name: '直接访问', selected: true},
                {value: 310, name: '邮件营销'},
                {value: 234, name: '联盟广告'},
                {value: 135, name: '视频广告'},
                {value: 1548, name: '搜索引擎'}
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        },
        radarOption: {
          legend: {
            data: ['7月数据', '6月数据', '5月数据'],
            itemGap: 50,
          },
          radar: {
            name: {
              textStyle: {
                color: 'rgb(152, 152, 152)',
              }
            },
            center: ['50%', '60%'],
            indicator: [
              {name: '付费率', max: 6500},
              {name: '分享率', max: 16000},
              {name: '活跃度', max: 30000},
              {name: '留存率', max: 38000},
              {name: '满意度', max: 52000},
            ]
          },
          series: [{
            type: 'radar',
            data: [
              {
                value: [4300, 10000, 28000, 35000, 50000],
                name: '7月数据'
              },
              {
                value: [5000, 14000, 28000, 31000, 42000],
                name: '6月数据'
              },
              {
                value: [2000, 4000, 8000, 3000, 2000],
                name: '5月数据'
              }
            ]
          }]
        },
        option: {
          grid: gridData2,
          legend: {
            right: 0,
            itemGap: 40,
          },
          dataset: {
            source: [
              ['product', '2015', '2016', '2017'],
              ['Matcha Latte', 43.3, 85.8, 93.7],
              ['Milk Tea', 83.1, 73.4, 55.1],
              ['Cheese Cocoa', 86.4, 65.2, 82.5],
              ['Walnut Brownie', 72.4, 53.9, 39.1]
            ]
          },
          xAxis: {
            type: 'category',
          },
          yAxis: {
            splitLine: {
              show: false
            }
          },
          series: [
            {type: 'bar'},
            {type: 'bar'},
            {type: 'bar'}
          ]
        },
        tableData: [
          {
            date: '渠道渠道A',
            name: '22000',
            address: '10%'
          },
          {
            date: '渠道渠道A',
            name: '21000',
            address: '10%'
          },
          {
            date: '渠道渠道A',
            name: '17000',
            address: '10%'
          },
          {
            date: '渠道渠道A',
            name: '15000',
            address: '10%'
          },
          {
            date: '渠道渠道A',
            name: '10000',
            address: '10%'
          }
        ],
        productData: {}
      }
    },
    created() {
      // this.productCount();
    },
    methods: {
      //商品统计接口
      // productCount() {
      //   this.$ajax.get('sys/index/productCount')
      //     .then(res => {
      //       if (res.resCode == 200) {
      //         this.productData = res.productCount;
      //       }
      //     })
      //     .catch(err => console.log(err))
      // }
    }
  }
</script>

<style lang="scss" scoped>
  .echarts {
    width: 100%;
    height: 100%;
  }

  .el-card__body {
    /*height: 400px;*/
  }

  .managePage {
    overflow: auto;
    padding: 20px;
    padding-bottom: 0;
    height: calc(100vh - 100px);

    .title {
      margin-bottom: 20px;
    }

    .el-card {
      margin-bottom: 20px;
    }

    .header-img {
      font-size: 60px;
      border-radius: 50%;
      width: 90px;
      height: 90px;
      background-color: #00b6ef;
      display: flex;
      align-items: center;
      justify-content: center;

      .el-icon-user-solid {
        color: #FFFFFF;
      }
    }

    .box-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .number-box {
      .number-title {
        font-size: 12px;
        color: #989898;
      }

      .number {
        font-weight: 500;
        font-size: 28px;
        color: #666666;
      }

      .number-tip {
        font-size: 12px;
        color: #CCCCCC;
      }
    }

    .down-color {
      font-size: 12px;
      color: #FE5500;
    }

    .up-color {
      font-size: 12px;
      color: #2EBA07;
    }

    .btn-box {
      margin-bottom: 20px;

      .active {
        border: 1px solid #29bc4f;
        color: #29bc4f;
      }

      a {
        display: inline-block;
        font-size: 14px;
        padding: 9px 12px;
        border: 1px solid #DCDFE6;
      }

      a:first-child {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
      }

      a:last-child {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
      }
    }

    .btn-box2 {
      .active {
        color: #29bc4f;
      }

      a {
        display: inline-block;
        font-size: 14px;
        padding: 9px 12px;
      }
    }

  }
</style>

