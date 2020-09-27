//META{"name":"superplugin"}*//

const { get } = require("request");

class superplugin {
    getName() {return "super plugin";}
    getDescription() {return "?";}
    getVersion() {return "0.0.1";}
    getAuthor() {return "pietruszka123";}
	getSettingsPanel(){
		let panel = $(`<form class="form" style="width:100%;"></form>`)[0];
		var lslow = ""
		for (let i = 0; i < this.settings.slowo.length; i++) {	
			lslow = lslow + this.settings.slowo[i]
		};

		new ZLibrary.Settings.SettingGroup(this.getName(), {shown:true}).appendTo(panel)
		.append(
			new ZLibrary.Settings.Textbox("system liczbowy", "opis", this.settings.liczby, (e)=>{
				this.settings.liczby = e;
				///*if(e > this.settings.slowo)*/panel.getElementsByClassName("inputDefault-_djjkz input-cIJ7To da-inputDefault da-input")[0].defaultValue = "tak"//this.settings.slowo.length
				//console.log(panel.getElementsByClassName("inputDefault-_djjkz input-cIJ7To da-inputDefault da-input"))
				//console.log(panel.getElementsByClassName("inputDefault-_djjkz input-cIJ7To da-inputDefault da-input")[0].attributes[6].textContent)
				this.saveSettings();
			}),
			new ZLibrary.Settings.Textbox("slow", "opis", lslow, (e)=>{
					this.settings.slowo = e.split("");
					this.settings.liczby = e.length
					this.saveSettings();
			}),
			new ZLibrary.Settings.Switch("same liczby", "opis", this.settings.raw, (e)=>{
				//window.BdApi.alert("aaaa")
				this.settings.raw = e
				this.saveSettings();
			}),
			new ZLibrary.Settings.Switch("stary system", "opis", this.settings.old, (e)=>{
				//window.BdApi.alert("aaaa")
				this.settings.old = e
				this.saveSettings();
			}),
			new ZLibrary.Settings.Textbox("rozdzielac", "opis", this.settings.rozdzielacz, (e)=>{
				//window.BdApi.alert("aaaa")
				if(e == "" || e == " ")return
				this.settings.rozdzielacz = e
				this.saveSettings();
			})

		);
		return panel;
		
		}
		get defaultSettings(){
			return {
				liczby: 5,
				slowo: "DRZWI",
				raw: false,
				old: false,
				rozdzielacz: "Q",
				lastUsedVersion: "0.0.0"
			}
		}
    start() {
        if (!global.ZeresPluginLibrary) return window.BdApi.alert("Library Missing",`The library plugin needed for ${this.getName()} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);
		if (global.ZeresPluginLibrary) this.initialize();
		ZLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), "https://raw.githubusercontent.com/pietruszka123/plugin-discord/master/superplugin.plugin.js");
		this.cancelPatch = BdApi.monkeyPatch(BdApi.findModuleByProps("dispatch"), 'dispatch', { after: this.dispatch.bind(this) });

    }

    stop() {
		const chatbox = document.querySelector(".slateTextArea-1Mkdgw");
		if(chatbox) chatbox.removeEventListener("keydown", this.onChatInput);
		this.cancelPatch();
	}
	initialize(){
		this.old = ""
		this.loadSettings();
		this.prefix = "t:";
		this.onChatInput = e => {
			const chatbox = document.querySelector(".slateTextArea-1Mkdgw");
			if(e.which == 13/*123*/ && !e.shiftKey && !e.ctrlKey && chatbox.innerText){
				let chatboxValue = chatbox.innerText;
				if(chatboxValue.toLowerCase().startsWith(this.prefix)){
					chatboxValue = chatboxValue.substr(this.prefix.length).trim();
					if(!this.settings.raw){
					if(this.settings.liczby.length > 1){
						chatboxValue = this.settings.liczby[1] + " " + chatboxValue
						chatboxValue = this.settings.liczby[0] + " " + chatboxValue
					}else{
						chatboxValue =  "0" +" " + this.settings.liczby + " " + chatboxValue
					}
					}else{
						if(this.settings.liczby.length > 1){
							chatboxValue = this.settings.liczby[1] + chatboxValue
							chatboxValue = this.settings.liczby[0] + chatboxValue
						}else{
							chatboxValue =  "0" + this.settings.liczby + chatboxValue
						}
					}
					console.log(chatboxValue)
					let wynik = "";
					for (var i=0; i < chatboxValue.length; i++) {
						if(!this.settings.raw){
						if(chatboxValue[i] == " "){wynik += " "}
						else{
							wynik +=chatboxValue[i].charCodeAt(0).toString(this.settings.liczby)+this.settings.rozdzielacz
						}
					}else{
						wynik +=chatboxValue[i].charCodeAt(0).toString(this.settings.liczby) + " "
					}
				   }
				   let slowo = this.settings.slowo
				   let wiadomosc = ""

				   console.log(this.settings.raw + " aaa")
				   if(this.settings.raw){
					   if(this.settings.liczby == 2){
					   wiadomosc = wynik.split(" ")
					   let w = ""
					   for (var i=0; i < wiadomosc.length; i++) {
							w += "0" + wiadomosc[i] + " "
						   }
						console.log(w.slice(0,w.length-3))
						
					   wiadomosc = w.slice(0,w.length-3)
						}else{
							wiadomosc = wynik
						}
					}else if(!this.settings.raw){
				   		let w = ""
				   		for (let i = 0; i < wynik.length; i++) {
							if(this.settings.old){
						   	if(wynik[i] != " "){
							   	w = w + wynik[i]
							   	if(w.length > 2){
								   	let k = ""
								   	for (let j = 0; j < w.length; j++) {
										k = k + slowo[parseInt(w[j])]
								   	}
								   	wiadomosc = wiadomosc + k + " "
								   	w = ""
								   	k = ""
								   
							   }
							   }
							}else{
								if(wynik[i] == " "){wiadomosc += " "}
								else if(wynik[i] == "Q"){wiadomosc +="Q"}
								else{
									wiadomosc += slowo[wynik[i]]
								}
							}
							
						}
					}
					console.log(wiadomosc.slice(wiadomosc.length-2,wiadomosc.length-1))
					//window.BdApi.alert(wiadomosc)
					let cId = ZLibrary.DiscordModules.SelectedChannelStore.getChannelId();
					if(!cId) return;
					//ZLibrary.DiscordModules.MessageActions.sendBotMessage(cId, chatboxValue);
					ZLibrary.DiscordModules.MessageActions.sendMessage(cId, {content:wiadomosc})
					//ZLibrary.DiscordModules.MessageActions.sendBotMessage(cId, "Please use a smaller field size.")
			//}
			e.stopPropagation()
		}
		}
	}
		this.onSwitch();
	}
	dispatch(data) {
		
		//console.log(data.methodArguments[0])
        if (data.methodArguments[0].type !== 'MESSAGE_CREATE')
			return;
		const message = data.methodArguments[0].message;
		if (message.author.id === BdApi.findModuleByProps('getId').getId()){
			if(this.old == message.content){return};
			if(message != void(0)){this.old = message.content}
			else{return;}
		}
		//if(message.length){
			var array = message.content
			var kod = ""
			array = array.split(" ")
			for (let i = 0; i < array.length; i++) {
				for (let j = 0; j < array[i].length; j++) {
					var k = this.settings.slowo.indexOf(array[i][j])
					if(array[i][j] == "Q") kod += " "
					if(k != -1){
						kod += k;
					}
				}
				//kod += " ";	
			}
			console.log(kod)
			var systemlicz = 0
			if(kod.split(" ")[0] == "49" && kod.split(" ")[1] == "49")systemlicz = 10
			if(kod.split(" ")[0] == "45" && kod.split(" ")[1] == "45")systemlicz = 11
			if(kod.split(" ")[0] == "41" && kod.split(" ")[1] == "42")systemlicz = 12
			if(kod.split(" ")[0] == "3a" && kod.split(" ")[1] == "3c")systemlicz = 13
			if(kod.split(" ")[0] == "37" && kod.split(" ")[1] == "3a")systemlicz = 14
			if(kod.split(" ")[0] == "34" && kod.split(" ")[1] == "38")systemlicz = 15
			if(kod.split(" ")[0] == "31" && kod.split(" ")[1] == "36")systemlicz = 16
			if(kod.split(" ")[0] == "2f" && kod.split(" ")[1] == "34")systemlicz = 17
			if(kod.split(" ")[1] == "110010")systemlicz = 2
			if(kod.split(" ")[1] ==  "1220")systemlicz = 3
			if(kod.split(" ")[1] == "310")systemlicz = 4
			if(kod.split(" ")[1] == "203")systemlicz = 5
			if(kod.split(" ")[1] == "130")systemlicz = 6
			if(kod.split(" ")[1] == "106")systemlicz = 7
			if(kod.split(" ")[1] == "70")systemlicz = 8
			if(kod.split(" ")[1] == "63")systemlicz = 9
			kod = kod.split(" ")
			kod.splice(0,2)
			//console.log(kod.splice(0,2))
			// var system = [array[0],array[1]]
			// array.splice(0,1);
			// if(system[0] != 0){
			// 	system = parseInt(system[0]+system[1])
			// 	console.log(system)
			// }else{
			// 	console.log(system[1])
			// }
			var wynik = ""
			if(systemlicz != 0){
			for (let i = 0; i < kod.length-1; i++) {
				console.log(String.fromCharCode(parseInt(kod[i],systemlicz)))
				if(message.content[i] == " ")wynik += " "
				wynik += String.fromCharCode(parseInt(kod[i],systemlicz))
			}
			let cId = message.channel_id
			if(!cId) return;
			ZLibrary.DiscordModules.MessageActions.sendBotMessage(cId, wynik);
			}

		//}
		console.log(message.content)
	}
	onMessageContextMenu(){
		console.log("tak")
	}
	onMessageOptionContextMenu(){
		console.log("taktak")
	}
	onMessageOptionToolbar(){
		console.log("taktaktak")
	}

	onSwitch(){
		const chatbox = document.querySelector(".slateTextArea-1Mkdgw");
		if(chatbox) chatbox.addEventListener("keydown", this.onChatInput);
	}
	saveSettings() {
		ZLibrary.PluginUtilities.saveSettings(this.getName(), this.settings);
	}
	loadSettings() {
		this.settings = ZLibrary.PluginUtilities.loadSettings(this.getName(), this.defaultSettings);
	}
	onMessage() {
		// Called when a message is received
		console.log("aaaaaaaaaaaaaaaaaaaaa")
    };

}