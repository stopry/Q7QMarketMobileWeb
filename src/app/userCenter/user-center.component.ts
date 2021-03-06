import {Component,OnInit,AfterViewInit} from '@angular/core';
import {TipsService} from "../service/tips.service";
import {UserCenterService} from "./user-center.service";
import {Router} from '@angular/router';
import {UtilService} from "../service/util.service";
import {Title} from "@angular/platform-browser";
import {LoginService} from "../loginRegist/login.service";

@Component({
  selector:'user-center',
  templateUrl:'user-center.component.html'
})
export class UserCenterComponent implements OnInit,AfterViewInit{
  constructor(
    private tips:TipsService,
    private uctSer:UserCenterService,
    private router:Router,
    private util:UtilService,
    private title:Title,
    private stopUpdate:LoginService
  ){}
  //是否可设置管理账户
  private canSetAct = false;
  //玩家信息
  userInfo:any = {};
  getUserInfo(){
    this.uctSer.getUserInfo()
    .then((res:any)=>{
      if(res){
        // console.log(res);
        let info = res.userInfo;
        this.userInfo.realName = info.realName;
        this.userInfo.id = info.id;
        this.userInfo.headerUrl = info.headerUrl;
        this.userInfo.blockedBalance = (info.blockedBalance).toFixed(5);//冻结金
        this.userInfo.usableBalance = (info.usableBalance).toFixed(5);//可用金
        this.userInfo.totalBalance = (info.blockedBalance+info.usableBalance).toFixed(5);//总额
        this.canSetAct = info.certLevel=="C1"|| info.certLevel=="C2";
      }
    })
  }
  //退出登录
  exit(){
    this.tips.showConDia('确定退出登录吗？',()=>{
      this.stopUpdate.stopUpdateToken();
      this.router.navigate(['login']);
      localStorage.setItem('token','');
      localStorage.setItem('pwd','');
      localStorage.setItem('act','');
    },()=>{})
  }
  //上传用户头像
  upUserHeadeImg(){
    let self = this;
    let imgName,imgUrl;
    let uploader = new plupload.Uploader({
      browse_button: 'userPic', //触发文件选择对话框的按钮，为那个元素id
      url: 'http://oss.aliyuncs.com', //服务器端的上传页面地址
      multi_selection: false,
      filters: {
        mime_types: [
          {
            title: 'Image files',
            extensions: 'jpg,jpeg,png,JPG,JPEG,PNG'
          }
        ],
        max_file_size: '1mb', //最大只能上传1mb的文件
        prevent_duplicates: false //不允许选取重复文件
      },
    });
    let index = null;
    uploader.init();
    uploader.bind('FilesAdded',function (up,files) {
      self.uctSer.getAddheadImgFn()
        .then((res:any)=>{
          if(res){
            var key = res.dir + self.util.createUUID() + self.util.getFilenameSuffix(files[0].name);
            imgName = key;
            imgUrl = res.imgUrl;
            var new_multipart_params = {
              'key': key,
              'policy': res.policy,
              'OSSAccessKeyId': res.accessid,
              'success_action_status': '200', //让服务端返回200,不然，默认会返回204
              'signature': res.signature,
            };
            uploader.setOption({
              'url': res.host,
              'multipart_params': new_multipart_params
            });
            uploader.start();
          }
        });
    });
    uploader.bind('BeforeUpload', function (up, file) {
      self.tips.showLoading(1);
    });
    uploader.bind('FileUploaded', function (up, file, info) {
      self.uctSer.saveHeadImg({'url': imgUrl + '/' + imgName})
        .then((res:any)=>{
          if(res){
            self.tips.msg('上传成功');
            self.userInfo.headerUrl = imgUrl + '/' + imgName;
            $('#userPic').attr('src',self.userInfo.headerUrl);
            self.tips.showLoading(false);
          }else{
            self.tips.msg('上传失败');
            self.tips.showLoading(false);
          }
        });
    });
    uploader.bind('Error',function (up,err) {
      self.tips.showLoading(false);
      if (err.code == -600) {
        self.tips.msg("图片不能超过1M");
      } else if (err.code == -601) {
        self.tips.msg("只支持jpg或png文件");
      } else if (err.code == -602) {
        self.tips.msg("请不要重复上传同一文件");
      } else {
        self.tips.msg("上传失败")
      }
    })

  }
  //打开关闭推广中心下拉
  isClose = true;
  openProDrop(){
    this.isClose = !this.isClose;
  }
  //底部切换去市场
  toMarket(){
    this.router.navigate(['market',this.util.marketUrl]);
  }
  //去设置管理账户
  toSetAccount(){
    if(!this.canSetAct){
      this.tips.msg('\"完善实名认证[C1]\"后才可设置账户');
      return;
    }
    this.router.navigate(['alterBankcard']);
  }
  ngAfterViewInit(){
    this.upUserHeadeImg();
  }
  ngOnInit(){
    this.getUserInfo();
    this.title.setTitle('个人中心');
  }
}
