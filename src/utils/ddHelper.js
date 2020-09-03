import {isFunction} from './validate'

export function confirm(self, message, sureCallback, cancelCallback) {
  self.$confirm(message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (sureCallback && isFunction(sureCallback))
      sureCallback();
  }).catch(() => {
    if (cancelCallback && isFunction(cancelCallback))
      cancelCallback();
  });
}

export function info(self,msg) {
  self.$message.info(msg)
}

export function warning(self, msg) {
  self.$message.warning(msg);
}
