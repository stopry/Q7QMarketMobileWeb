//切换图标类型脚本
export class ChangeChartTypeService {

  //标准时间格式转换成日期
  public tra(str2) {
    let str: any = str2.substring(0, 24);
    var d = new Date(str);
    var a: any = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
    for (var i = 0, len = a.length; i < len; i++) {
      if (a[i] < 10) {
        a[i] = '0' + a[i];
      }
    }
    str = a[0] + '-' + a[1] + '-' + a[2] + ' ' + a[3] + ':' + a[4] + ':' + a[5];
    return str.split(' ')[0];
  }

  public calculateMA(dayCount, data) {
    var result = [];
    for (var i = 0, len = data.length; i < len; i++) {
      if (i < dayCount) {
        result.push('-');
        continue;
      }
      var sum = 0;
      for (var j = 0; j < dayCount; j++) {
        sum += data[i - j][1];
      }
      result.push(sum / dayCount);
    }
    return result;
  }

  public fOption(date, data) {//分时图配置
    var self = this;
    return {
      background: '#fffff',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
        ,
        backgroundColor: 'rgba(245, 245, 245, 0.8)',
        borderColor: '#ccc',
        textStyle: {
          color: '#000'
        },
        formatter: function (params, ticket, callback) {
          var str = self.tra((new Date()).toString()) + "<br>";
          var val = "";
          var nowPrice = "";
          var avgPrice = "";
          var volume = "";
          params.forEach(function (value, index, array) {
            if (value.seriesName == '分时') {
              val = value.axisValue + "<br>";
              var data = value.data;
              nowPrice = "成交价: " + data + "<br>";
            } else if (value.seriesName == '成交量') {
              var data = value.data;
              volume = "成交量: " + data + "<br>";
            } else if (value.seriesName == '均线') {
              var data = value.data;
              avgPrice = "平均价: " + data + "<br>";
            }
          });
          return str + val + nowPrice + avgPrice + volume;
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date,
        splitLine: {//分割线
          show: true,
          lineStyle: {
            color: ['#f4f4f4'],
            width: 1,
            type: 'solid'
          }
        },
        axisLine: {
          lineStyle: {color: '#000'}
        },
      },
      yAxis: {
        show: true,
        type: 'value',
        scale: true,
        boundaryGap: [0, '100%'],
        splitLine: {//分割线
          show: true,
          lineStyle: {
            color: ['#f4f4f4'],
            width: 1,
            type: 'solid'
          }
        },
        axisLine: {
          lineStyle: {color: '#000'}
        },
        axisLabel: {
          margin: -38,
        }
      },
      grid: [{
        left: '0%',
        right: '0%',
        bottom: '0%',
        top: '0%',
        height: '249px'
      }],
      series: [
        {
          name: '模拟数据',
          type: 'line',
          smooth: true,
          symbol: 'none',
          sampling: 'average',
          itemStyle: {
            normal: {
              color: 'rgb(125,179,220)',
            }
          },
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: '#B2D6F2',
            }
          },
          data: data
        }
      ]
    }
  }

  public kOption(dates, data) {//k线图配置
    var self = this;
    return {
      backgroundColor: '#ffffff',//图表背景色
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter: function (params, ticket, callback) {
          var str = '';
          params.forEach(function (value, index, array) {
            if (value.seriesName == '日K') {
              str += value.axisValue + "<br>";
              var data = value.data;
              var color = "";
              if (parseFloat(data[5]) < 0) {
                color = '#354D5E';
              } else if (parseFloat(data[5]) > 0) {
                color = '#D53A35';
              }
              str += "开盘价:" + data[1] + "<br>";
              str += "收盘价:" + data[2] + "<br>";
              str += "最低价:" + data[3] + "<br>";
              str += "最高价:" + data[4] + "<br>";
              str += "涨跌额:<em style=\"color: " + color + "\">" + data[5] + "</em><br>";
              str += "涨跌幅:<em style=\"color: " + color + "\">" + data[6] + "</em><br>";
              str += "成交量:" + data[7] + "<br>";
            }
          });
          return str;
        },
        axisPointer: {
          animation: false,
          type: 'cross',
        }
      },
      xAxis: {
        type: 'category',
        data: dates,
        scale: true,
        splitLine: {//分割线
          show: true,
          lineStyle: {
            color: ['#f4f4f4'],
            width: 1,
            type: 'solid'
          }
        },
        textStyle: {
          fontSize: 10
        }
      },
      yAxis: {
        show: true,
        scale: true,
        axisTick: {
          inside: true,
        },
        splitLine: {//分割线
          show: true,
          lineStyle: {
            color: ['#f4f4f4'],
            width: 1,
            type: 'solid'
          }
        },
        axisLabel: {
          //rotate:30,
          margin: -38,
        },
      },
      dataZoom: [{
        type: 'inside',
        startValue: dates.length - 30,
        endValue: dates.length,
      }],
      grid: [{
        left: '0%',
        right: '0%',
        bottom: '0%',
        top: '0%',
        height: '249px'
      }],
      animation: true,
      series: [
        {
          type: 'candlestick',
          name: '日K',
          data: data,
          itemStyle: {
            normal: {
              color: '#FD1050',
              color0: '#0CF49B',
              borderColor: '#FD1050',
              borderColor0: '#0CF49B'
            }
          }
        },
        /*{
          name: 'MA5',
          type: 'line',
          data: self.calculateMA(5,dates),
          smooth: true,
          lineStyle: {
            normal: {opacity: 0.5}
          }
        },
        {
          name: 'MA10',
          type: 'line',
          data: self.calculateMA(10,dates),
          smooth: true,
          lineStyle: {
            normal: {opacity: 0.5}
          }
        },
        {
          name: 'MA20',
          type: 'line',
          data: self.calculateMA(20,dates),
          smooth: true,
          lineStyle: {
            normal: {opacity: 0.5}
          }
        },
        {
          name: 'MA30',
          type: 'line',
          data: self.calculateMA(30,dates),
          smooth: true,
          lineStyle: {
            normal: {opacity: 0.5}
          }
        }*/
      ]
    }
  }
}
