// 1、待处理2、处理中3、处理完毕、4、已取消
export function getTaskStatus(status) {
  switch (status) {
    case 1:
    case "1":
      return "待处理";
    case 2:
    case "2":
      return "处理中";
    case 3:
    case "3":
      return "处理完毕";
    case 4:
    case "4":
      return "已取消";
    default:
      return "";
  }
}

export function getInsurStatus(status) {
  switch (status) {
    case 1:
      return "";
    case 0:
      return "正常";
    default:
      return "";
  }
}
