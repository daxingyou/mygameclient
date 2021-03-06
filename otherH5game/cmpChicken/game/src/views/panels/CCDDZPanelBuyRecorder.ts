/**
 *
 * @ cyj
 *
 */
class CCDDZPanelBuyRecorder extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelBuyRecorder;
    public static get instance(): CCDDZPanelBuyRecorder {
        if(this._instance == undefined) {
            this._instance = new CCDDZPanelBuyRecorder();
        }
        return this._instance;
    }

    constructor() {
        super(
            CCalien.CCDDZpopupEffect.Scale,{ withFade: true,ease: egret.Ease.backOut },
            CCalien.CCDDZpopupEffect.Scale,{ withFade: true,ease: egret.Ease.backIn }
        );
    }

    //    private rectMask: eui.Rect;
    private btnClose: eui.Button;
    // private btnExchange:eui.Button;
    private btn1: eui.Button;
    private btn2: eui.Button;
    private btn3: eui.Button;

    private lbRemain:eui.Label;
    private lbExpire:eui.Label;
    protected init(): void {
        this.skinName = panels.CCDDZPanelBuyRecorderSkin;
    }

    createChildren(): void {
        super.createChildren();
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtnCloseClick,this);
        this.btn1.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuyClick,this);
        this.btn2.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuyClick,this);
        this.btn3.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuyClick,this);
    }

    addListeners(): void {
        let e:CCalien.CCDDZEventManager = CCDDZEventManager.instance;
        e.registerOnObject(this, CCalien.CCDDZDispatcher, CCGlobalEventNames.MY_USER_INFO_UPDATE, this.onMyUserInfoUpdate, this);
        CCalien.CCDDZEventManager.instance.enableOnObject(this);
    }

    removeListeners(): void {
        CCalien.CCDDZEventManager.instance.disableOnObject(this);
    }

    private onMyUserInfoUpdate(event:egret.Event = null):void {
		let userInfoData:CCGlobalUserInfoData = event ? event.data.userInfoData : CCDDZMainLogic.instance.selfData;

        var remaintime:number = 0;
        var expiredate:string = '';
        if(userInfoData.cardsRecorder){
            if(userInfoData.cardsRecorder[6] > 0){
                remaintime = Math.ceil(userInfoData.cardsRecorder[6] / 3600 / 24);
                expiredate = '(至' + userInfoData.cardsRecorder[0] + '年' + userInfoData.cardsRecorder[1] + '月' +userInfoData.cardsRecorder[2] + '日' + userInfoData.cardsRecorder[3] + ':' + userInfoData.cardsRecorder[4] + ')';
            }
        }
       
        this.lbRemain.text = String(remaintime);
        if(remaintime > 0){
            this.lbRemain.textColor = 0x208720;
            egret.localStorage.setItem("opencardsrecorder", '1');
            egret.localStorage.removeItem("cardsrecorderexpirenotice");
        }else{
            this.lbRemain.textColor = 0xff0000;
        }

        this.lbExpire.text = expiredate;
        // if(remaintime > 0){
        //     var expiredate:Date = new Date();
        //     var origin = expiredate.getTime();
        //     expiredate.setTime(origin + remaintime);
        //     this.lbExpire.text = '(' + expiredate.toLocaleDateString() + ')';
        // }else{
        //     this.lbExpire.text = '';
        // }
	}

    show(callback: Function = null, data: any = null): void {
        CCDDZMainLogic.instance.refreshSelfInfo();
        this.addListeners();
        this._callback = callback;
        // CCDDZMainLogic.instance.updateRecorderExpireTime();
        this.onMyUserInfoUpdate();
        this.popup();
    }
    
    private onBuyClick(event: egret.TouchEvent) {
        var id = Number(event.currentTarget.name) - 1;
        var cfg = CCGlobalGameConfig.cardsRecorderConfig[id];
        if(cfg && cfg.id){
            CCDDZRechargeService.instance.doRecharge(cfg.id);
        }
    }
        
    private onBtnCloseClick(event: egret.TouchEvent): void {
        // if(this._callback){
        //     this._callback('confirm');
        // }
        this.removeListeners();
        this.dealAction();
    }
}