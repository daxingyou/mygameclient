import NavigationPage = CCalien.NavigationPage;
/**
 * Created by rockyl on 16/3/28.
 */

class CCDDZPage extends NavigationPage{
	private label:eui.Label;
	private bg:eui.Rect;

	constructor() {
		super();

		this.init();
	}

	private init():void {
		this.skinName = components.CCDDZPageSkin;
	}

	protected createChildren():void {
		super.createChildren();

		this.percentWidth = 100;
		this.percentHeight = 100;
	}

	beforeShow(action:string, params:any):void {
		if(action == 'push'){
			this.label.text = params.label;
			this.bg.fillColor = Math.floor(Math.random() * 0xFFFFFF);
		}
	}

}