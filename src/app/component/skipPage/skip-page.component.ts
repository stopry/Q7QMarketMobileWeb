import {Component,OnInit} from '@angular/core';
import {Router} from '@angular/router';
@Component({
  selector:'Skip-Page',
  template:`
    <div class="skipPage">
      <!--空白页用于跳转-->
    </div>
  `,
})

export class SkipPageComponent implements OnInit{
  constructor(
    private router:Router
  ){}
  ngOnInit(){
      this.getTokenRelocation();
  }
  //得到url参数
  getQueryString(name) {
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
  //接收token跳转页面
  getTokenRelocation(){
    let link = this.getQueryString('link');
    let token = this.getQueryString("token");
    if(token){
      localStorage.setItem("token",token)
    }
    if(link=="marketDetail"){//进入市场详情
      let id = this.getQueryString("id");
      this.router.navigate(["market",id]);
    }else if(link=="userCenter"){//进入用户中心
      this.router.navigate(["userCenter"]);
    }else if(link=="market"){//进入交易市场行情页面
      this.router.navigate(['market']);
    }
  }
}
