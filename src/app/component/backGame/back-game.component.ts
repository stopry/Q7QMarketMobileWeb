import {Component,OnInit,AfterViewInit} from '@angular/core';
@Component({
  selector:'back-game',
  template:`
    <div feedButton class="backGame" (click)="backGame()">
      回游戏
    </div> 
  `
})
export class BackGameComponent implements OnInit,AfterViewInit{
  ngOnInit(){

  }
  public backGame(){
    window.location.href = "http://wap.game.o2plan.cn";
  }
  ngAfterViewInit(){
    let isTouch = false;
    let w = $(window).width();
    let h = $(window).height();
    var btn = document.querySelector('.backGame');
    btn.addEventListener('touchstart',()=>{
      event.stopPropagation();
      // console.log("touchstart");
      isTouch = true;
    });
    btn.addEventListener('touchmove',(event)=>{
      event.stopPropagation();
      event.preventDefault();
      if(!isTouch) return;
      var x = event.changedTouches['0'].clientX-20;
      var y = event.changedTouches['0'].clientY-20;
      if(Math.abs(x)>w-20||x<-20) return;
      if(Math.abs(y)>h-20||y<-20) return;
      // console.log(x,y);
      $(btn).css({top:y,left:x});
      // console.log('touchmove');
    });
    btn.addEventListener('touchcancel',()=>{
      event.stopPropagation();
      isTouch = true;
      // console.log('touchcancel');
    });

    btn.addEventListener('touchend',()=>{
      event.stopPropagation();
      // event.preventDefault();
      isTouch = true;
      // console.log('touchend');
    });
  }
}
