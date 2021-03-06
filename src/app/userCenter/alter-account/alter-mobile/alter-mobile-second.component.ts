import {Component,OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {TipsService} from "../../../service/tips.service";
import {AlterAccountService} from "../alter-account.service";
import {UtilService} from "../../../service/util.service";

@Component({
  selector:'alter-mobile-second',
  templateUrl:'alter-mobile-second.component.html'
})
export class AlterMobileSecondComponent implements OnInit{
  constructor(
    private tips:TipsService,
    private route:ActivatedRoute,
    private util:UtilService,
    private router:Router,
    private altActSer:AlterAccountService
  ){}
  private timer = 60;//60s后重新获取
  canGetVcode = true;//是否可以的到验证码
  private interVal = null;//定时器
  public getCodeText = '获取验证码';
  //图形验证码
  //图形验证码图形链接
  public codeUrl='';
  public getCaptcha() {
    let captchaCode = this.util.createUUID();
    this.para.captchaCode = captchaCode;
    this.codeUrl = '/market/captcha-image' + '?ck=' + captchaCode + '&' + new Date().getTime();
  }
  //发送验证码
  getBindMobileMsg(){
    if(!this.para.mobile){
      this.tips.msg('请填写新的手机号码');
      return;
    }
    if(!this.util.regExp().mobileNum.test(this.para.mobile)){
      this.tips.msg('手机号码格式有误');
      return;
    }
    if(!this.canGetVcode){
      this.tips.msg('请稍后再试');
      return;
    }
    if(!this.para.captchaValue){
      this.tips.msg('请输入图形验证码');
      return;
    }
    this.altActSer.getBindMobileMsg({mobile:this.para.mobile})
    .then((res:any)=>{
      if(res){
        this.interVal = setInterval(()=>{
          this.timer--;
          this.canGetVcode = false;
          this.getCodeText = '重新获取'+this.timer;
          if(this.timer<=0){
            clearInterval(this.interVal);
            this.canGetVcode = true;
            this.getCodeText = '获取验证码';
            this.timer=60;
          }
        },1000);
        this.tips.msg('短信验证码发送成功');
      }
    });
  }

  //提交参数
  para = {
    captchaCode:'',//图形验证码上的后缀uuid
    captchaValue:'',//图形验证码
    code:'',//短信验证码
    mobile:'',//新手机号
    uuid:this.getUrlPar()||null//uuid
  };
  //绑定手机
  bindMobile(){
    if(!this.para.mobile){
      this.tips.msg('请输入新的手机号');
      return;
    }
    if(!this.util.regExp().mobileNum.test(this.para.mobile)){
      this.tips.msg('手机号码格式有误');
      return;
    }
    if(!this.para.captchaValue){
      this.tips.msg('请输入图形验证码');
      return;
    }
    if(!this.para.code){
      this.tips.msg('请输入短信验证码');
      return;
    }
    this.altActSer.bindMobile(this.para)
    .then((res:any)=>{
      if(res){
        this.para.mobile = '';
        this.tips.msg('绑定手机号码成功');
        this.tips.showConDia('绑定手机号码成功,点击确定返回个人中心？',()=>{
          this.router.navigate(['userCenter']);
        },()=>{

        });
      }
    })
  }

  //得到url参数 商品id值
  getUrlPar(){
    let val:any = this.route.paramMap;
    return val.destination.value.uuid;
  }

  public headerTitle = '修改手机号码';
  back(){
    window.history.go(-1);
  }
  ngOnInit(){
    this.getCaptcha();
    console.log(this.getUrlPar());
  }
}
