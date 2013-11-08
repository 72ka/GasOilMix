enyo.kind({
    classes: "app enyo-fit enyo-unselectable",
    name: "App",
    published: {
        appPrefs: {
			volume: 5,
			ratio: 40,
			units: "unit1",
			volSlider: 50,
		},
    },
    components: [
		 {kind: "Signals", onload: "load"},
         {kind: "FittableRows", classes: "enyo-fit", components: [        
			 {name: "mainPane", kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", classes: "toolbar", components: [
				{content: "Gas&Oil Mixture ratio calculator"},
			]},
			{classes: "horizontal-shadow-top"},
			{name: "mainScroller", fit: true, kind: "enyo.Scroller", touch: true, fixedTime: true, classes: "mainScroll", horizontal: "hidden", components: [

						{kind: "onyx.RadioGroup", name: "UnitRadio", onActivate:"unitsActivated", classes: "Unitradio", components: [
							{name: "unit1", content: "Liters", value: 1, secondvalue: 1000, stringResult: "milliliters"},
							{name: "unit2", content: "U.K. Gallons", value: 0.219969157, secondvalue: 160, stringResult: "U.K. ounces"},
							{name: "unit3", content: "U.S. Gallons", value: 0.264172052, secondvalue: 128, stringResult: "U.S. fluid ounces"}
						]},
						
						{classes: "onyx-divider", content: "Volume of Gas (petrol)"},
						{kind:"Image", src:"images/canister.png", classes: "image"},
						{name: "volume", classes: "value"},
						{kind: "onyx.Slider", value: 50, onChanging:"volumeChanging", onChange:"volumeChanged", name: "volumeSlider"},
						{tag: "br"},
						
						{classes: "onyx-divider", content: "Mixture ratio"},
						{kind:"Image", src:"images/oil.png", classes: "image"},
						{name: "ratio", classes: "value"},
						{kind: "onyx.Slider", value: 50, onChanging:"ratioChanging", onChange:"ratioChanged", name: "ratioSlider"},
						{tag: "br"},
						
						{kind: "onyx.Groupbox", classes:"onyx-result-box", components: [
							{kind: "onyx.GroupboxHeader", content: "Result"},
							{name:"result", classes:"onyx-result", content:"Not yet calculated"}
						]},
						{content: "Gas&Oil Mixture ratio calculator v 0.0.1 by Jan Heřman (72ka)", classes: "info"}
                  
			]},
		 ]},
		 {name: "Popup", kind: "onyx.Popup", centered: true, floating: true, classes:"onyx-sample-popup", style: "padding: 10px;"},
     ],
     
    create: function (){

        this.inherited(arguments);

		/* Get preferences */
		this.getPrefs();	
    },
       
    load: function() {
		// fix layout once all the images are loaded
		this.resized();
	},
	
	cleanup: function () {
		this.savePrefs();
	},
	
	getPrefs: function () {
		//get prefs from the cookie if they exist
		var cookie = enyo.getCookie("gomAppPrefs");
		enyo.log("COOKIES: ", cookie);
		if (cookie) {
			// if it exists, else use the default
			this.appPrefs = enyo.mixin(this.appPrefs, enyo.json.parse(cookie));
		
			if (this.appPrefs.units == "unit2") this.$.unit2.active = true;
			if (this.appPrefs.units == "unit3") { this.$.unit3.active = true
			} else {this.$.unit1.active = true};
		
			//enyo.log("volume prefs: ", this.appPrefs.volume);
			
			this.$.volumeSlider.animateTo(this.appPrefs.volSlider);
			//this.appPrefs.volume = this.$.volumeSlider.value/2 * this.unitRatio;
			this.$.volume.setContent(this.appPrefs.volume.toFixed(1) + " " + this.unitName);
			//this.$.volume.setContent(" test");
			this.$.ratioSlider.animateTo(this.appPrefs.ratio);
			
			
			
		};

		this.calculateResult();
	},
	
	savePrefs: function () {
		this.log("Saving Prefs");
		enyo.setCookie("gomAppPrefs", enyo.json.stringify(this.appPrefs));
		//enyo.log("COOKIES To SAVE: ", this.appPrefs);
	},

    aboutClick: function(){
		//reserved
    },
    
    unitsActivated: function(inSender, inEvent) {
		if (inEvent.originator.getActive()) {
			this.unitName = inEvent.originator.getContent();
			this.unitRatio = inEvent.originator.value;
			this.unitResult = inEvent.originator.secondvalue;
			this.stringResult = inEvent.originator.stringResult;
			this.appPrefs.units = inEvent.originator.name;
			this.refreshValues();
		}
	},
    
    volumeChanging: function(inSender, inEvent) {
		this.appPrefs.volume = Math.round(inSender.getValue())/2 * this.unitRatio;
		this.$.volume.setContent(this.appPrefs.volume.toFixed(1) + " " + this.unitName);
	},
	volumeChanged: function(inSender, inEvent) {
		this.appPrefs.volume = Math.round(inSender.getValue())/2 * this.unitRatio;
		this.$.volume.setContent(this.appPrefs.volume.toFixed(1) + " " + this.unitName);
		this.appPrefs.volSlider = inSender.getValue();
		this.calculateResult();
	},
	
	ratioChanging: function(inSender, inEvent) {
		this.appPrefs.ratio = Math.round(inSender.getValue());
		this.$.ratio.setContent("1 : " + this.appPrefs.ratio);
	},
	
	ratioChanged: function(inSender, inEvent) {
		this.appPrefs.ratio = Math.round(inSender.getValue());
		this.$.ratio.setContent("1 : " + this.appPrefs.ratio);
		this.calculateResult();
	},
	
	calculateResult: function() {
		var result = this.appPrefs.volume/this.appPrefs.ratio;
		this.$.result.setContent("Add " + (result*this.unitResult).toFixed(1) + " " + this.stringResult + " of oil");
		this.savePrefs();
	},
	
	refreshValues: function() {
		
		//this.$.volume.setContent(this.appPrefs.volume.toFixed(1) + " " + this.unitName);
		this.appPrefs.volume = this.$.volumeSlider.value/2 * this.unitRatio;
		this.$.volume.setContent(this.appPrefs.volume.toFixed(1) + " " + this.unitName);
		//this.$.volume.setContent(" test");
		this.calculateResult();
		this.$.ratio.setContent("1 : " + this.appPrefs.ratio);
	}
});
