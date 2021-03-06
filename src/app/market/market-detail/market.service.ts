import {Injectable} from '@angular/core';
import {HttpService} from "../../service/http.service";

@Injectable()

export class MarketService{
  constructor(
    private xhr:HttpService
  ){}

  //获取单个商品信息
  private proDetailUrl = '/getTranInfo';
  getProDetail(options){
    return this.xhr.get(this.proDetailUrl,1,options);
  }
  //得到当前委托订单列表
  private etuListUrl = '/tran/listEntrustOrder';
  getEtuList(options){
    return this.xhr.get(this.etuListUrl,1,options);
  }
  //撤销当前订单
  cancelCurOrder(options){
    return this.xhr.get('/tran/cancelOrder',1,options);
  }
  //限价买出卖出
  buySale(options){
    return this.xhr.post('/tran/entrustOrder',1,options);
  }
  //获取玩家物品数量
  getUserItem(options){
    return this.xhr.get('/user/getItem',1,options);
  }
  //获取玩家信息（给玩家可用金币赋值）
  getUserMoney(){
    return this.xhr.get('/user/getUser',1,null);
  }
  //得到k线图数据
  getKlineDatas(options){
    return this.xhr.get('/getCandleList',1,options);
  }
  //得到更新的k线图数据
  getKlineUpdate(options){
    return this.xhr.get('/getCandle',1,options);
  }

  //得到分时图数据
  getFlineDatas(options){
    return this.xhr.get('/getMinuteList',1,options);
  }
  //得到更新的分时图数据
  getFlineUpdate(options){
    return this.xhr.get('/getMinute',1,options);
  }
}

