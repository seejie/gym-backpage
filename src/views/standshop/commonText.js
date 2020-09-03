

export const orderStatusOptions = [{
    label:'全部',
    name: "all",
    value: ''
},{
    label:'待付款',
    name: '0',
    value: 0
},{
    label:'待发货',
    name: '1',
    value: 1
},{
    label:'待收货',
    name: '2',
    value: 2
},{
    label:'已完成',
    name: '3',
    value: 3
},{
    label:'退款/售后',
    name: '5',
    value: 5
}]

export const pageSizesRange = [5,10,20,30]

export const deleteEmptyParams = (obj)=>{
    Object.keys(obj).forEach((i)=>{
        if(obj[i]===''){
            delete obj[i]
        }
        return obj
    })
    return obj
}
