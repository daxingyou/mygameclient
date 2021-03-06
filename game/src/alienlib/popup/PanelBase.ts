/**
 * Created by rockyl on 16/3/9.
 */

module alien {
	export class PanelBase extends eui.Component {
		protected showEffect:any;
		protected showEffectParams:any;
		protected closeEffect:any;
		protected closeEffectParams:any;
		protected popupShowBanner:boolean;

		protected _callback:Function;
		protected _excludeActionsClose:string[] = [];

		constructor(showEffect:any = null, showEffectParams:any = null, closeEffect:any = null, closeEffectParams:any = null, popupShowBanner:boolean = false) {
			super();

			this.showEffect = showEffect || alien.popupEffect.None;
			this.showEffectParams = showEffectParams;

			this.closeEffect = closeEffect || alien.popupEffect.None;
			this.closeEffectParams = closeEffectParams;

			this.popupShowBanner = popupShowBanner;

			this._excludeActionsClose = [];
			this.init();
		}

		protected init():void {

		}

		/**
		 * 添加不用关闭的动作
		 * @param actions
		 */
		addExcludeForClose(actions:string[]):void {
			this._excludeActionsClose = this._excludeActionsClose.concat(actions);
		}

		dealAction(action:string = null, data:any = null):void {
			let callback = this._callback;
			if (this._excludeActionsClose.indexOf(action) < 0) {
				this.close();
			}
			if (callback) {
				callback(action || 'close', data);
			}
		}

		popup(modalTouchFun:Function = null, modal:boolean = true, modalConfig:any = null):void {
			alien.PopUpManager.addPopUp(this, this.showEffect, this.showEffectParams, modalTouchFun, modal, modalConfig);
		}

		close(noAct:boolean = false,func:Function = null):void{
			alien.PopUpManager.removePopUp(this, this.closeEffect, this.closeEffectParams,noAct,func);
		}
	}
}