import {Injectable} from '@angular/core';

@Injectable()

export class UtilService{
  constructor(){

  };
  public regExp(){//正则表达式
      const regexp = {
          mobileNum : /^(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/,//手机号
          IDCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,//身份证
          checkCode: /^\d$/,//验证码
          name:new RegExp("^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9])*$"),//姓名
      };
      return regexp;
  }
  //数组对象操作
  //对象列表转数组
  public objToArray(obj:any){
    var arr = new Array();
    for(let key in obj){
      arr.push(obj[key]);
    }
    return arr;
  }
  //状态数字转文字
  public toSts(sts:any) {
    if (sts == '1') {
      return '未成交';
    } else if (sts == '2') {
      return '部分成交';
    } else if (sts == '3') {
      return '完全成交';
    } else if (sts == '4') {
      return '手动撤消';
    } else if (sts == '5') {
      return '自动撤消';
    } else if (sts == '6') {
      return '异常撤消';
    } else {
      return '待处理'
    }
  }
  //指定交易订单状态数字转文字
  public showStatus(status:any) {
    if (status == '0') {
      return '待确定';
    } else if (status == '1') {
      return '已交易';
    } else if (status == '2') {
      return '已撤消';
    } else if (status == '3') {
      return '已拒绝';
    } else if (status == '4') {
      return '失败';
    } else {
      return '';
    }
  }
  //创建uuid
  public createUUID(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  //得到上传文件中的文件
  public getFilenameSuffix(filename:any){
    let pos = filename.lastIndexOf('.')
    let suffix = '';
    if (pos != -1) {
      suffix = filename.substring(pos)
    }
    return suffix;
  }
  //得到url参数
  public getQueryString(name) {
    if(window.location.hash.indexOf("?")<0) return;
    let hash = window.location.hash.split('?')[1];
    let temp = {};
    let arr = hash.split("&");
    for(let i = 0;i<arr.length;i++){
      let str = arr[i];
      let key = arr[i].split("=")[0];
      if(key=="token"){
        var val = decodeURI(arr[i].split("=")[1]);
      }else{
        var val = arr[i].split("=")[1];
      }
      temp[key] = val;
    }
    return temp[name]?temp[name]:null;
  }
  // get_filename_suffix: function (filename) {
  //   pos = filename.lastIndexOf('.')
  //   suffix = ''
  //   if (pos != -1) {
  //     suffix = filename.substring(pos)
  //   }
  //   return suffix;
  // }
  //创建k线图数据
  public splitData(rawData) {
    var categoryData = [];
    var values = [];
    var volumes1 = [];
    var volumes2 = [];
    for (var i = 0; i < rawData.length; i++) {
      var d = [];
      d.push(rawData[i].openPrice) //开盘价
      d.push(rawData[i].closePrice) //收盘价
      d.push(rawData[i].lowPrice) //最低价
      d.push(rawData[i].heightPrice) //最高价
      d.push(rawData[i].changePrice) //涨跌额
      d.push(rawData[i].changeRate + '%') //涨跌幅
      d.push(rawData[i].tranVolume)//成交量
      categoryData.push(this.fomat(rawData[i].klTime));
      values.push(d);
      volumes1.push(rawData[i].tranVolume);
      if (rawData[i].changePrice <= 0) {
        volumes2.push(0);
      } else {
        volumes2.push(rawData[i].tranVolume);
      }
    }
    if (categoryData.length < 50) {
      var da:any = new Date(categoryData[categoryData.length - 1]);
      for (var i = 0; i < 50 - categoryData.length; i++) {
        da.setDate(da.getDate() + 1);
        categoryData.push(this.tra(da.toString())[0]);
        //categoryData.push(da.Format('yyyy/MM/dd'));
      }
    }
    return {
      categoryData: categoryData,
      values: values,
      volumes1: volumes1,
      volumes2: volumes2
    };
  }
  //短日期字符转时间
  public fomat(str:any) {
    if(!str) return;
    // console.log(str,'str');
    str = str+'';
    return str.substr(0, 4) + "/" + str.substr(4, 2) + "/" + str.substr(6);
  }
  //标准时间格式转换成日期
  public tra(str2){
    let str:any = str2.substring(0, 24)
    var d = new Date(str);
    var a:any = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
    for(var i = 0, len = a.length; i < len; i ++) {
      if(a[i] < 10) {
        a[i] = '0' + a[i];
      }
    }
    str = a[0] + '-' + a[1] + '-' + a[2] + ' ' + a[3] + ':' + a[4] + ':' + a[5];
    return str.split(' ');
  }
  /*分时图数据处理start*/
  public buildFLineDatas(res:any){
    let minuteChart:any = {};
    minuteChart.date = [];
    minuteChart.data = [];
    minuteChart.volumes = [];
    minuteChart.avgData = [];

    let retDatas = res.minuteList;
    for (var i = 0; i < retDatas.length; i++) {
      var retData = retDatas[i]
      var minuteTime = retData.minuteTime;
      minuteChart.date.push(minuteTime.substr(8, 2) + ':' + minuteTime.substr(10, 2));
      minuteChart.data.push(retData.price);
      minuteChart.volumes.push(retData.tranVolume);
      minuteChart.avgData.push(retData.average);
      minuteChart.initTime = minuteTime;
    }
    var s = minuteChart.initTime.substr(0, 4) + '/' + minuteChart.initTime.substr(4, 2) + '/' + minuteChart.initTime.substr(6, 2) + ' ' + minuteChart.initTime.substr(8, 2) +
      ':' + minuteChart.initTime.substr(10, 2) + ':00';
    var startTime = new Date(s);
    var temp = startTime.getTime();
    var endTime = res.endTime;
    while (temp < endTime) {
      temp += 60 * 1000;
      minuteChart.date.push(this.tra(new Date(temp).toString())[1]);
    }
    return minuteChart;
  }
  /*分时图数据处理end*/
  //记录当前市场的木材类型
  public marketUrl:any = '4001';
}
