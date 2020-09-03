const deleteEmptyParams = (obj)=>{
  Object.keys(obj).forEach((i)=>{
      if(obj[i]===''){
          delete obj[i]
      }
      return obj
  })
  return obj
}

export default deleteEmptyParams
