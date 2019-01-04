/**
 * Created by zhu on 17/11/02.
 *
 * 邮件详情面板
 */

class PanelMailDetails extends alien.PanelBase {
	private static _instance:PanelMailDetails;

	public static getInstance():PanelMailDetails {
		if (this._instance == undefined) {
			this._instance = new PanelMailDetails();
		}
		return this._instance;
	}

	/**
	 * 内容
	 */
	public content_label: eui.Label;
	public goodsList: eui.List;

	private _goodsData:eui.ArrayCollection;
	private _canGetReward:boolean;
	private _mailData:any;

	/**
	 * 关闭按钮
	 */
	private closeImg:eui.Image;

	/**
	 * 领取按钮
	 */
	private getImg:eui.Image;

	constructor(){
		super(alien.popupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, alien.popupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});
	}

	protected init():void{
		this.skinName = panels.PanelMailDetailsSkin;
	}

	protected childrenCreated():void {
		super.childrenCreated();
		this._initEvent();
		this.goodsList.itemRenderer = MailGoodsItem;
		this.goodsList.dataProvider = this._goodsData = new eui.ArrayCollection();
	}

	/**
	 * 点击领取
	 */
	private _onClickGetRew():void{
		if(this._mailData.type == 5){
			PanelExchange2.instance.show(5);
			return;
		}
		if(this._canGetReward){
			MailService.instance.getReward(this._mailData.id);
		}
	}

	/**
	 * 点击关闭
	 */
	private _onClickClose():void{
		this.dealAction();
	}

	/**
	 * 初始化事件
	 */
	private _initEvent():void{
		this._enableEvent(true);
		this.closeImg["addClickListener"](this._onClickClose, this);
		this.getImg["addClickListener"](this._onClickGetRew, this);
	}

	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
        alien.EventManager.instance.disableOnObject(this);
		PanelMailDetails._instance = null;
	}
	/**
	 * 使能 事件
	 */
	private _enableEvent(bEnable:boolean):void{
		let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
	}

	show(mailData:any):void {
		this._mailData = mailData;
		this.popup();
		this.content_label.text = mailData.content;
		this._goodsData.source = mailData.attachment;
		this._canGetReward = false;

		//有奖励物品
		if(mailData.attachment &&mailData.attachment.length > 0){
			if(mailData.status != 2){ //未领取
				this.getImg.source = "room_get";
				this.getImg.touchEnabled = true;
				this._canGetReward = true;
			}
			else{
				this.getImg.source ="room_getGray";
				this.getImg.touchEnabled = false;
			}
		}
		else{
			this.getImg.visible = false;
		}

		if(this._mailData.type == 5){ // 夺宝奖励
			this.getImg.source = "room_get";
			this.getImg.touchEnabled = true;
			this._canGetReward = true;
			this.getImg.visible = true;
		}
	}
}

class MailGoodsItem extends eui.ItemRenderer{
	private goodsItem:GoodsItem;

	protected dataChanged():void {
		super.dataChanged();
		let data:any = this.data;
		this.goodsItem.setData(data);
	}
}