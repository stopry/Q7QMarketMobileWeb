import {Component,OnInit,Input,EventEmitter,Output} from '@angular/core';
import {TipsService} from "../../service/tips.service";
import { Title } from '@angular/platform-browser';
import {AssignTradeService} from "./assign-trade.service";

@Component({
  selector:'assign-trade-resolve',
  templateUrl:'assign-trade-resolve.component.html'
})
export class AssignTradeResolveComponent implements OnInit{
  constructor(
    private tips:TipsService,
    private title:Title,
    private asgTrdSer:AssignTradeService
  ){}
  public topTitle = '赠送详情订单处理';
  @Input() item:any;
  @Output() onClose = new EventEmitter<any>();
  //子组件处理完成后通知父组件刷新列表
  @Output() onResolve = new EventEmitter<any>();
  hide(){//关闭
    this.onClose.emit();
  }
  //确认未完成订单
  confirmOrder(id:string,cnt,amt,proName){
    let tipsText = '确认交易此订单吗？</br>商品名称：'+proName+'<br/>交易数量:'+cnt+'<br/>支付金币:'+amt;
    this.tips.showConIpt(tipsText,(pwd)=>{
      if(!pwd){
        return;
      }
      this.asgTrdSer.confirmAssignTrade({id:id,payPassword:pwd})
        .then((res:any)=>{
          if(res){
            this.tips.msg('交易成功');
            this.onClose.emit();
            this.onResolve.emit();
          }
        })
    },()=>{});

  }
  //取消未完成订单
  cancelOrder(id:string){
    this.tips.showConDia('确认取消此订单吗？',()=>{
      this.asgTrdSer.cancelAssignTrade({id:id})
        .then((res:any)=>{
          if(res){
            this.tips.msg('撤销成功');
            this.onClose.emit();
            this.onResolve.emit();
          }
        })
    },()=>{});
  }
  back(){
    window.history.go(-1);
  }
  ngOnInit(){
    this.title.setTitle('赠送详情');
  }
}
