import cityList from '@/utils/citys';
import assign from 'object-assign';

export const count = {
  form: {
    proCity: [],
    province: '',
    city: '',
    area: '',
    beginTime: '',
    endTime: '',
    areaId: '',
    date: [],
    pageNum: 1,
    pageSize: 10
  },
  courseStatus: [],
  multipleTable: [],
  currentPage: 1,
  total: 0,
  tableData: [],
  options: cityList.map(v => assign({
    value: v.code,
    label: v.name,
    children: v.city.map(v => ({
      value: v.code,
      label: v.name
    }))
  })),
  areaList: [],
  cityList: [],
  ids: [],
  showSearch: true,
}

export const listData = {
  filter: {
    orderSn: '',
    customerName: '',
    customerPhone: '',
    status: '',
    unitName: '',
    beginTime: '',
    date: [],
    endTime: '',
    pageSize: 10,
    pageNum: 1,
  },
  total: 0,
  detailId: 0,
  showSearch: true,
  showModal: false,
  tableData: [],
  statusList: [
    { id: '1', name: '待支付' },
    { id: '2', name: '待核销' },
    { id: '3', name: '待评价' },
    { id: '4', name: '待退款' },
    { id: '5', name: '已退款' },
    { id: '6', name: '已完成' },
  ],
}
