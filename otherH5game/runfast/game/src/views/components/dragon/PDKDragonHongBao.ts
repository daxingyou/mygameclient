/**
 *
 * @author 
 *
 */
class PDKDragonHongBao extends PDKDragonBase {
    private armature1: dragonBones.Armature;
    private armature2: dragonBones.Armature;
    /**
     *zhu 王炸红包奖励的关闭按钮
     */
    private _closeImg:eui.Image;
    private btn:PDKStateButton;
    public constructor() {
        super("pdk_hongbao");
        this.armature1 = this.addArmature("pdk_hongbao");
        this.armature2 = this.addArmature("pdk_hongbao");
        this.btn = new PDKStateButton();
        this.btn.skinName = ui.PDKPlayOrangeButtonSkin;
        this.btn.labelIcon="pdk_play_btn_13_h";
        this.btn.x=-100;
        this.btn.y=203;
        this.addChild(this.btn);
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
        this.btn.visible=false;
        this.stop1();
        this.stop2();
        //        this.armature.animation.timeScale = 0.5;
    }

    protected addToStage(e: egret.Event): void {
        super.addToStage(e);
        this.onResize(e);
//        this.play2();
    }

    protected removeFromStage(e: egret.Event): void {
        super.removeFromStage(e);
    }
    
    protected onResize(e: egret.Event): void {
        this.x = PDKalien.StageProxy.stage.stageWidth >> 1;
        this.y = PDKalien.StageProxy.stage.stageHeight >> 1;
    }

    private stop1(): void {     
        this.armature1.removeEventListener(egret.Event.COMPLETE,this.onComplete1.bind(this),this);
        this.armature1.animation.gotoAndStop("pdk_hongbao1",1); 
        this.armature1.display.visible = false;
    }
    
    private stop2(): void {      
        this.armature2.removeEventListener(egret.Event.COMPLETE,this.onComplete2.bind(this),this);
        this.armature2.animation.gotoAndStopByFrame("pdk_hongbao2",1);
        this.armature2.display.visible=false;
    }

    public play1(isPlay:boolean): void {
        this.stop2();
        this.armature1.display.visible = true;
        this.btn.visible=false;
        if (isPlay)
        {
            this.armature1.animation.gotoAndPlayByFrame("pdk_hongbao1",1,1);
            this.armature1.addEventListener(egret.Event.COMPLETE,this.onComplete1.bind(this),this);
        }
        else
            this.armature1.animation.gotoAndPlayByFrame("pdk_hongbao1",55,1);
    }
//    342 21
    public play2(): void {
        this.stop1();
        this.armature2.display.visible = true;
        this.btn.visible=false;
        /**
         * zhu 新手王炸胜利红包界面
         */
        this._closeImg = new eui.Image("pdk_common_close_n");
        this.addChild(this._closeImg);
		this._closeImg["addClickListener"](this._onTouchClose, this);
        if(this.parent){
            this._closeImg.x = this.parent.width * 0.5 - 400;
            this._closeImg.y = -this.parent.height * 0.5 + 180;
        }
        this.armature2.addEventListener(egret.Event.COMPLETE,this.onComplete2.bind(this),this);
        this.armature2.animation.gotoAndPlayByFrame("pdk_hongbao2",1,1);
    }

    private onComplete1(e: egret.Event): void {
        this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
    }
  
    private onComplete2(e: egret.Event): void {
        this.btn.visible=true;       
    }
    
    private onTap(e:egret.TouchEvent):void
    {
        this.stop1();
        this.stop2();
        if (this.parent)
            this.parent.removeChild(this);
            
        PDKExchangeService.instance.doChou(1003);
        //PanelExchange1.instance.show();
    }

    
	/**
	 * 点击关闭
	 */
	private _onTouchClose():void{
        if (this.parent)
            this.parent.removeChild(this);
	}
}
