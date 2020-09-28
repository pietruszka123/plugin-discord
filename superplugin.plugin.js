//META{"name":"superplugin"}*//

const { get } = require("request");

class superplugin {
    getName() {return "super plugin";}
    getDescription() {return "?";}
    getVersion() {return "0.0.5";}
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
				///*if(e > this.settings.slowo)*/panel.getElementsByClassName("inputDefault-_djjkz input-cIJ7To da-inputDefault da-input")[0].defaultValue = "tak"//this.settings.slowo.length
				//console.log(panel.getElementsByClassName("inputDefault-_djjkz input-cIJ7To da-inputDefault da-input"))
				//console.log(panel.getElementsByClassName("inputDefault-_djjkz input-cIJ7To da-inputDefault da-input")[0].attributes[6].textContent)
				if(isNaN(e)){console.log("cccc"); return};
				console.log(parseInt(e) < lslow.length)
				if(!parseInt(e) < lslow.length){
					this.settings.liczby = lslow.length;
					console.log("czemu")
				}
				else{
				this.settings.liczby = e;
				}
				this.saveSettings();
			}),
			new ZLibrary.Settings.Textbox("slow", "opis", lslow, (e)=>{
					this.settings.slowo = e.split("");
					//this.settings.liczby = e.length
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
		this.cancelPatch = BdApi.monkeyPatch(BdApi.findModuleByProps("dispatch"), 'dispatch', { after: this.dispatch.bind(this) });

    }

    stop() {
		const chatbox = document.querySelector(".slateTextArea-1Mkdgw");
		if(chatbox) chatbox.removeEventListener("keydown", this.onChatInput);
		this.cancelPatch();
	}
	initialize(){
		ZLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), "https://raw.githubusercontent.com/pietruszka123/plugin-discord/master/superplugin.plugin.js");
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

				   console.log(this.settings.raw + " aaaa")
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
			console.log(this.settings.slowo.includes(array) + " cooooo")
			if(!this.settings.slowo.includes(...array)){return}
			var kod = ""
			//array = array.split(" ")
			console.log(array)
			for (let i = 0; i < array.length; i++) {
				//for (let j = 0; j < array[i].length; j++) {
					var k = this.settings.slowo.indexOf(array[i])
					if(array[i] == "Q") kod += "/"
					if(array[i] == " ") kod += " "
					if(k != -1){
						kod += k;
					}
				//}
				//kod += " ";	
			}
			var systemlicz = 0
			kod = kod.split(" ")
			console.log(kod)		
				var kk = kod[0]
				var kkk = kod[1]
				//if(kk == void(0) || kkk == void(0))return
				//console.log(kod[0].split("/")[0] + "  bbbbbbbbbbbbbbbb")
				if(kk.replace("/","") == "49" && kkk.replace("/","") == "49")systemlicz = 10
				if(kk.replace("/","") == "45" && kkk.replace("/","") == "45")systemlicz = 11
				if(kk.replace("/","") == "41" && kkk.replace("/","") == "42")systemlicz = 12
				if(kk.replace("/","") == "3a" && kkk.replace("/","") == "3c")systemlicz = 13
				if(kk.replace("/","") == "37" && kkk.replace("/","") == "3a")systemlicz = 14
				if(kk.replace("/","") == "34" && kkk.replace("/","") == "38")systemlicz = 15
				if(kk.replace("/","") == "31" && kkk.replace("/","") == "36")systemlicz = 16
				if(kk.replace("/","") == "2f" && kkk.replace("/","") == "34")systemlicz = 17
				if(kkk.replace("/","") == "110010")systemlicz = 2
				if(kkk.replace("/","") ==  "1220")systemlicz = 3
				if(kkk.replace("/","") == "310")systemlicz = 4
				if(kkk.replace("/","") == "203")systemlicz = 5
				if(kkk.replace("/","") == "130")systemlicz = 6
				if(kkk.replace("/","") == "106")systemlicz = 7
				if(kkk.replace("/","") == "70")systemlicz = 8
				if(kkk.replace("/","") == "63")systemlicz = 9
				for (let i = 0; i < kod.length; i++) {
					kod[i] = kod[i].split("/")
				}
				kod.splice(0,2)
			//console.log(systemlicz)
			//console.log(kod)
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
			for (let j = 0; j < kod.length; j++) {
			for (let i = 0; i < kod[j].length-1; i++) {
				//console.log(String.fromCharCode(parseInt(kod[j][i],systemlicz)))
				//if(spos.includes(i)){console.log(i);wynik += " "}
				wynik += String.fromCharCode(parseInt(kod[j][i],systemlicz))
				//console.log(mm[i] + " mmm")
			}
			wynik += " "
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