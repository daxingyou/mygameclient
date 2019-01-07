/**
 * Created by rockyl on 15/12/28.
 *
 * 提示面板类
 * 通过CCDDZAlert.show()来调用
 */

class CCDDZPanelAlert3 extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelAlert3;
    public static get instance(): CCDDZPanelAlert3 {
		if (this._instance == undefined) {
            this._instance = new CCDDZPanelAlert3();
		}
		return this._instance;
	}

	private labContent:eui.Label;
	private grpButton:eui.Group;
	public btnConfirm:CCDDZStateButton;
    public btnCancel:CCDDZStateButton;
	
	private _defaultConfirmString:string;
	private _defaultCancelString:string;

	private btnClose:eui.Button;
	private ctxScroller:eui.Scroller;
	protected init():void {
		this.skinName = panels.CCDDZPanelAlertSkin;

		this._defaultConfirmString = this.btnConfirm.labelIcon;
		this._defaultCancelString = this.btnCancel.labelIcon;
	}

	constructor() {
		super(CCalien.CCDDZpopupEffect.Scale, {
			withFade: true,
			ease: egret.Ease.backOut
		}, CCalien.CCDDZpopupEffect.Scale, {withFade: true, ease: egret.Ease.backIn});
	}

	createChildren():void {
		super.createChildren();

		this.grpButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGrpButtonTap, this);

		this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.dealAction.bind(this,"close"), this);
	}

	private onGrpButtonTap(event:egret.TouchEvent):void {
		this.dealAction(event.target.name);
	}

	// private onClose(event:egret.TouchEvent):void {
		// if(this._excludeActionsClose.indexOf('xx') < 0) {
			// this.close();
		// }
		// this.dealAction('cancel');
	// }
	
	show(content, type = 0, callback = null, showClose:boolean = false):void {
		this.popup();
		this.btnConfirm.labelIcon = this._defaultConfirmString ;
		 this.btnCancel.labelIcon =this._defaultCancelString ;

		this.btnClose.visible = showClose;
        this.labContent.textFlow = (new egret.HtmlTextParser).parser(content) ;
		this._callback = callback;

		this.labContent.validateNow();
		if(this.labContent.textHeight < this.ctxScroller.height){
			this.labContent.y = (this.ctxScroller.height - this.labContent.textHeight) *0.5;
		}else{
			this.labContent.y = 0;
		}
		
		this.ctxScroller.stopAnimation();
		this.ctxScroller.viewport.scrollV =0;
		this.ctxScroller.validateNow();

		switch (type) {
			case 0:
				if (this.grpButton.contains(this.btnCancel)) {
					this.grpButton.removeChild(this.btnCancel);
				}
				break;
			case 1:
				if (!this.grpButton.contains(this.btnCancel)) {
					this.grpButton.addChild(this.btnCancel);
				}
				break;
		}
	}
}

class CCDDZAlert3 {

    static show(content: string, callback: Function = null,str:string="", showClose:boolean = false):void {
        CCDDZPanelAlert3.instance.show(content, 0, callback, showClose);
        CCDDZPanelAlert3.instance.btnConfirm.labelIcon = str;
    }
}