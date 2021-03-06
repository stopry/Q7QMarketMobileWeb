import {Component,OnInit,AfterViewInit} from '@angular/core';
import {TipsService} from "../service/tips.service";
import {UserInfoService} from "../service/user-info.service";
import { Title } from '@angular/platform-browser';


@Component({
  selector:'promote-link',
  templateUrl:'promote-link.component.html'
})
export class PromoteLinkComponent implements OnInit,AfterViewInit{
  constructor(
    private title:Title,
    private tips:TipsService,
    private uInfoSer:UserInfoService
  ){}

  promoteCode = '0';
  promoteLink = 'http://market.o2plan.cn?id=0';
  promoteCodeImg = '';
  //得到用户信息
  getUserInfo(){
    this.uInfoSer.getUserInfo()
    .then((res:any)=>{
      if(res){
        let info = res.userInfo;
        this.promoteCode = info.id;
        this.promoteLink ='http://market.o2plan.cn?id='+info.id;
        this.promoteCodeImg = '';
        var qrcode = new QRCode(document.getElementById("qrcode"), {
          width : 100,
          height : 100
        });
        qrcode.makeCode(this.promoteLink);
      }
    })
  }
  public headerTitle = '推广链接';
  back(){
    window.history.go(-1);
  }
  ngOnInit(){
    this.title.setTitle('推广链接');
  }
  ngAfterViewInit(){
    this.getUserInfo();
    /*var qrcode = new QRCode(document.getElementById("qrcode"), {
      width : 100,
      height : 100
    });
    qrcode.makeCode(this.promoteLink);*/
  }
}
