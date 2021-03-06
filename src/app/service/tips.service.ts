import {Injectable} from '@angular/core';

@Injectable()

export class TipsService{
    constructor(){

    }
    msg(msg):void {
        let timer = null;
        $('#alertWeek').remove();
        let $alert = $('<div class="week-alert" id="alertWeek"></div>');
        $('body').append($alert);
        $alert.html(msg||'空');
        $alert.addClass('alert-show');
        clearTimeout(timer);
        timer = setTimeout(() => {
            $alert.remove();
        }, 2000);
    }
    public $layer;
    public $layerCon;
    private $layerLoading;
    private cancelFn:any;
    private confirmFn:any;
    //显示加载动画 bool->true显示 false隐藏
    public showLoading(bool:any):void{
      if(bool){
        if(!this.$layerLoading){
          this.$layerLoading = $('<div class="alertLayer alertLoading"><div class="loading"></div></div>');
          this.$layerLoading.css({
            height:$(window).height()
          });
          this.$layerLoading.find('.alertLoading .loading').css('marginTop',($(window).height()-100)/2);
          $('body').append(this.$layerLoading);
        }
        this.$layerLoading.show();
      }else if(!bool){
        if(this.$layerLoading){
          this.$layerLoading.hide();
        }
      }
    };
    //显示遮罩层
    showLayer(){
        if(!this.$layer){
            this.$layer = $('<div class="alertLayer"></div>');
            this.$layer.css({
                height:$(window).height(),
                top:'0px'
            });
            $('body').append(this.$layer);
        }
        this.$layer.show();
    }
    //隐藏遮罩层
    hideLayer(){
      if(!this.$layer) return;
      this.$layer.hide();
    }
    //显示确认框
    /**
    * @para text提示内容 cancelFn取消回调 confirmFn确认回调
     *
    * */
    public showConDia(text:string,confirmFn:any,cancelFn:any){
      let body = $('body');
      if(!this.$layerCon){
        this.$layerCon = $('<div class="alertLayer layerCon"></div>');
        this.$layerCon.css({
          height:$(window).height()*3,
        });
        body.append(this.$layerCon);
      }
      this.$layerCon.show();
      var self = this;
      var confirDia =$(
        '<div class="confirmDia">'+
          '<div class="conHeader"><i class="closeThis">×</i></div>'+
          '<div class="diaText">'+
            text+
          '</div>'+
          '<div class="btnWrap">'+
            '<div class="opBtn cancelBtn fl">'+
              '取消'+
            '</div>'+
            '<div class="opBtn confimBtn fr">'+
              '确定'+
            '</div>'+
          '</div>'+
        '</div>'
      );
      confirDia.css({
        height:'200px',
        top:($(window).height()-200)/2
      });
      body.append(confirDia);
      confirDia.find('.cancelBtn').click(function(){
        cancelFn();
        confirDia.remove();
        $('.confirmDia').remove();
        self.$layerCon.hide();
      });
      confirDia.find('.confimBtn').click(function(){
        confirmFn();
        $('.confirmDia').remove();
        confirDia.remove();
        self.$layerCon.hide();
      });
      //关闭
      confirDia.find('.closeThis').click(function(){
        $('.confirmDia').remove();
        confirDia.remove();
        self.$layerCon.hide();
      });
    }
    //确认框带输入密码的
  public showConIpt(text:string,confirmFn:any,cancelFn:any){
    let body = $('body');
    if(!this.$layerCon){
      this.$layerCon = $('<div class="alertLayer layerCon"></div>');
      this.$layerCon.css({
        height:$(window).height()
      });
      body.append(this.$layerCon);
    }
    this.$layerCon.show();
    var self = this;
    var confirDia =$(
      '<div class="confirmDia">'+
      '<div class="conHeader"><i class="closeThis">×</i></div>'+
      '<div class="diaText">'+
      text+
      '</div>'+
        '<input type="password" placeholder="请输入交易密码" id="payPwd">'+
      '<div class="btnWrap">'+
      '<div class="opBtn cancelBtn fl">'+
      '取消'+
      '</div>'+
      '<div class="opBtn confimBtn fr">'+
      '确定'+
      '</div>'+
      '</div>'+
      '</div>'
    );
    confirDia.css({
      height:'200px',
      top:($(window).height()-200)/2
    });
    body.append(confirDia);
    confirDia.find('.cancelBtn').click(function(){
      cancelFn();
      confirDia.remove();
      self.$layerCon.hide();
    });
    confirDia.find('.confimBtn').click(function(){
      let pwd = confirDia.find('#payPwd').val();
      if(!pwd){
        self.msg('请输入交易密码');
        return;
      }
      confirmFn(pwd);
      confirDia.remove();
      self.$layerCon.hide();
    });
    //关闭
    confirDia.find('.closeThis').click(function(){
      confirDia.remove();
      self.$layerCon.hide();
    });
  }


}
