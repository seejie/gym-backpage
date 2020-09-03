import request from "@/utils/request";

export function bindOpenPlateform(data) {
  return request({
    url: "/sys/sys_setting/bindKaifangpingtai",
    method: "post",
    data
  });
}
