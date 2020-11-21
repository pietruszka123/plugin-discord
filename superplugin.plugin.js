//META{"name":"superplugin"}*//



class superplugin {
    getName() {return "super plugin";}
    getDescription() {return "?";}
    getVersion() {return "0.1.2";}
	getAuthor() {return "pietruszka123";}
	getSettingsPanel(){
		function lerp (value1, value2, amount) {
			if(value2 > amount){return amount}
			else{
			amount = amount < 0 ? 0 : amount;
			amount = amount > 1 ? 1 : amount; 
				return value1 + (value2 - value1) * amount;
			}
		}
		let panel = $(`<form class="form" style="width:100%;"></form>`)[0];
		var lslow = ""
		var oldW = ""
		for (let i = 0; i < this.settings.slowo.length; i++) {	
			lslow = lslow + this.settings.slowo[i]
		};
		oldW = lslow;
		let p  = new ZLibrary.Settings.SettingGroup(this.getName(), {shown:true,collapsible:false}).appendTo(panel)

		new ZLibrary.Settings.SettingGroup("kodowanie", {shown:true}).appendTo(p)
		.append(
			new ZLibrary.Settings.Slider("system liczbowy","opis",2,lerp(2,32,lslow.length),this.settings.liczby,(e) =>{
				if(Math.round(e) > this.settings.slowo.length)ZLibrary.Toasts.show("liczba jest większa ",{type:"error"})
				console.log(Math.round(e))
				this.settings.liczby = Math.round(e);
				this.saveSettings();
			},{"units":" "}),
			/*
			new ZLibrary.Settings.Textbox("system liczbowy", "opis", this.settings.liczby, (e)=>{
				//if(e > this.settings.slowo)panel.getElementsByClassName("inputDefault-_djjkz input-cIJ7To da-inputDefault da-input")[0].defaultValue = "tak"//this.settings.slowo.length
				//console.log(panel.getElementsByClassName("inputDefault-_djjkz input-cIJ7To da-inputDefault da-input"))
				//console.log(panel.getElementsByClassName("inputDefault-_djjkz input-cIJ7To da-inputDefault da-input")[0].attributes[6].textContent)
				if(isNaN(e)){console.log("cccc"); return};
				console.log(parseInt(e))
				console.log(parseInt(e) > lslow.length)
				if(parseInt(e) > lslow.length){
					this.settings.liczby = lslow.length;
					console.log(parseInt(e))
				}
				else{
				this.settings.liczby = e;
				}
				this.saveSettings();
			}),*/
			new ZLibrary.Settings.Textbox("slow", "opis", lslow, (e)=>{
					this.settings.slowo = e.split("");
					//this.settings.liczby = e.length
					this.saveSettings();
			},{disabled:this.settings.raw}),
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
			}),
			new ZLibrary.Settings.Textbox("rozdzielac2", "opis", this.settings.rozdzielacz2, (e)=>{
				//window.BdApi.alert("aaaa")
				if(e == "" || e == " ")return
				this.settings.rozdzielacz2 = e
				this.saveSettings();
			},{disabled:true}),
			new ZLibrary.Settings.ColorPicker("kolor teksu po przetłumaczeniu","opis",this.settings.TextColor,(e) =>{
				console.log(e)
				this.settings.TextColor = e
				this.saveSettings();
			})

		);
		return panel;
		
		}
		get defaultSettings(){
			return {
				liczby: 5,
				slowo: "DRZWI",
				numeracja: "/",
				raw: false,
				old: false,
				rozdzielacz: "Μ",//о MB ΜΒ
				rozdzielacz2: "Β",
				TextColor: "#0000ff",
				lastUsedVersion: "0.0.0",
				showedChangelog: false,
			}
		}
		constructor(){
			this.started = false;
		}
	getChangelog(){
		return [{title:"zmiany",items:[
			"nic"
			/*"suwak zamiast textboxa do wprowadzania systemy liczbowego",
			"obsługa powtórzeń znaków w `kodzie` częściowa bez tłumaczenia ",
			"tłumaczenie po najechaniu na wiadomosc",
			"komęda color: {kod koloru hex lub nazwa np. blue} {tekst}"*/



		]}]
	}
    start() {
		console.log("start")
		console.log(this.started)
		if(!this.started){
			this.started = true;
			console.log("started")
			ZLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), "https://raw.githubusercontent.com/pietruszka123/plugin-discord/master/superplugin.plugin.js");
			//console.log(Object.keys(ZLibrary.DiscordModules.MessageActions))
        	if (!global.ZeresPluginLibrary) return window.BdApi.alert("Library Missing",`The library plugin needed for ${this.getName()} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);
			if (global.ZeresPluginLibrary) this.initialize();
			//console.log(BdApi.findModuleByProps("dispatch"))
			this.cancelPatch = BdApi.monkeyPatch(BdApi.findModuleByProps("dispatch"), 'dispatch', { after: this.dispatch.bind(this) });
			this.fetchmessages()
		}

	}
	load(){
		console.log("load")
		console.log(this.started)
		if(!this.started){
			this.started = true;
			console.log("loaded")
			if (!global.ZeresPluginLibrary) return window.BdApi.alert("Library Missing",`The library plugin needed for ${this.getName()} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);
			if (global.ZeresPluginLibrary) this.initialize();
			if(this.settings.lastUsedVersion != this.getVersion()){
				this.settings.lastUsedVersion = this.getVersion();
				this.saveSettings();
				ZLibrary.Modals.showChangelogModal(this.getName() + " Changelog", this.getVersion(), this.getChangelog());
			}
			ZLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), "https://raw.githubusercontent.com/pietruszka123/plugin-discord/master/superplugin.plugin.js");
			//console.log(BdApi.findModuleByProps("dispatch"))
			this.cancelPatch = BdApi.monkeyPatch(BdApi.findModuleByProps("dispatch"), 'dispatch', { after: this.dispatch.bind(this) });
			this.fetchmessages()
		}
	}
    stop() {
		this.started = false;
		const chatbox = document.querySelector(".slateTextArea-1Mkdgw");
		if(chatbox) chatbox.removeEventListener("keydown", this.onChatInput);
		//const messagelist = document.querySelector(".scrollerInner-2YIMLh")
		const messages = document.querySelectorAll(".da-messageContent")
		messages.forEach(element => {
			element.title = null
			element.removeEventListener("mouseenter",this.mouseenter)
			element.removeEventListener("mouseout", this.mouseout);
		});
		//if(messagelist) messagelist.removeEventListener("mouseover",this.test)
		ZLibrary.PluginUtilities.removeStyle(this.getName());
		this.cancelPatch();
	}
	initialize(){
		//var messages = document.getElementsByClassName("markup-2BOw-j da-markup messageContent-2qWWxC da-messageContent")
		this.mouseenter = e =>{
			var decoded = this.decode(e.target.innerHTML)
			if(typeof decoded == "object"){
				e.target.style.color = "#FF0000";
			}else{
				e.target.style.color = this.settings.TextColor;
			}
			e.target.innerHTML = decoded
			}
		this.mouseout = e =>{
			console.log("out")
			e.target.innerHTML = e.target.title
			e.target.style.color = ""
		}
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
							wynik += chatboxValue[i].charCodeAt(0).toString(this.settings.liczby) + this.settings.rozdzielacz
							console.log(wynik)
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
								else if(wynik[i] == this.settings.rozdzielacz){wiadomosc += this.settings.rozdzielacz}
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
		}else if(chatboxValue.toLowerCase().startsWith("r:")){
			chatboxValue = chatboxValue.substr(this.prefix.length).trim();
			let wiadomosc = ""
			let t = chatboxValue.length-1
			for (let i = 0; i < chatboxValue.length; i++) {
				wiadomosc += chatboxValue[t]
				t--;			
				
			}
			let cId = ZLibrary.DiscordModules.SelectedChannelStore.getChannelId();
			if(!cId) return;
			console.log(wiadomosc)
			ZLibrary.DiscordModules.MessageActions.sendMessage(cId, {content:wiadomosc})

			e.stopPropagation()
		}else if(chatboxValue.toLowerCase().startsWith("rng:")){
			chatboxValue = chatboxValue.substr(4).trim();
			var wiadomosc = "";
			function randomWord(slowo){
			let ret = "";
			let chars  = []
			let charsMax = [];
			let charsNow = [];
			for (let i = 0; i < slowo.length; i++) {
				if(chars.includes(slowo[i])){
					charsMax[chars.indexOf(slowo[i])] += 1
				}
				else{
					chars.push(slowo[i]);
					charsMax.push(1);
					charsNow.push(0);
				}
			}
			console.log(chars);
			console.log(charsMax);
			for (let i = 0; i < slowo.length; i++) {
				var rng = Math.floor(Math.random() * (slowo.length - 0)) + 0;
				while(charsMax[chars.indexOf(slowo[rng])] == charsNow[chars.indexOf(slowo[rng])]){
					rng = Math.floor(Math.random() * (slowo.length - 0)) + 0;
				}
				charsNow[chars.indexOf(slowo[rng])] += 1;
				ret += slowo[rng];
			}
			console.log(charsNow);
			return ret
			}
			run();
			
			function run(){
				var ch = chatboxValue.split(/[ ]+/)
				wiadomosc = ""
			for (let i = 0; i < ch.length; i++) {
				wiadomosc += randomWord(ch[i]) + " ";
			}
			}
			var w = wiadomosc.replace(/[ ]+/, '');
			var ch = chatboxValue.replace(/[ ]+/, '');
			if(w == ch && chatboxValue.length > 1){
				console.log("same");
				run();
			}
			let cId = ZLibrary.DiscordModules.SelectedChannelStore.getChannelId();
			if(!cId) return;
			console.log(wiadomosc)
			ZLibrary.DiscordModules.MessageActions.sendMessage(cId, {content:wiadomosc})
			e.stopPropagation()
		}else if(chatboxValue.toLowerCase().startsWith("ruletka:")){
			chatboxValue = chatboxValue.substr(4).trim();
			
			if(Math.floor(Math.random() * (chatboxValue.length - 0)) + 0 > chatboxValue.length/4){
				let cId = ZLibrary.DiscordModules.SelectedChannelStore.getChannelId();
				if(!cId) return;
				ZLibrary.DiscordModules.MessageActions.sendMessage(cId, "umarł")
				while(true){
					console.log("umieraj procesorze")
				}
			}
			e.stopPropagation()
		}else if(chatboxValue.toLowerCase().startsWith("tt:")){
			chatboxValue = chatboxValue.substr(this.prefix.length + 1).trim();
			if(this.settings.liczby.length > 1){
				chatboxValue = this.settings.liczby[1] + " " + chatboxValue
				chatboxValue = this.settings.liczby[0] + " " + chatboxValue
			}else{
				chatboxValue =  "0" +" " + this.settings.liczby + " " + chatboxValue
			}
			var chatValue = chatboxValue.split(/[ ]+/);
			var slowo = ""
			var slowoArr = []
			var slowoMax = []
			var slowoNow = []
			for (var i = 0; i < this.settings.slowo.length;i++) {
				slowo += this.settings.slowo[i]
			}
			var c = 0
			for (let i = 0; i < slowo.length; i++) {
				if(slowoArr.includes(slowo[i])){
					slowoMax[slowoArr.indexOf(slowo[i])] += 1
					slowoArr.push(this.settings.rozdzielacz2 + slowo[i])
					for (let j = 0; j < c; j++) {
						slowoArr[slowoArr.length-1] = this.settings.rozdzielacz2 + slowoArr[slowoArr.length-1]
					}
					c++;
				}
				else{
					slowoArr.push(slowo[i]);
					slowoMax.push(1);
					slowoNow.push(0);}}
			function codeWord(word,settings){
				var codeChar = []
				var wynik = ""
				for (let i = 0; i < word.length; i++) {	
					codeChar.push(word[i].charCodeAt(0).toString(settings.liczby));
				}
				console.log(codeChar)
				for (let i = 0; i < codeChar.length; i++) {
					for (let j = 0; j < codeChar[i].length; j++) {
						wynik += slowoArr[codeChar[i][j]]
					}
					wynik += settings.rozdzielacz
				}
				console.log(wynik)
				return wynik;
			}
			var wiadomosc = ""
			for (let i = 0; i < chatValue.length; i++) {
				wiadomosc += codeWord(chatValue[i],this.settings) + " "
				console.log(wiadomosc)
			}
			console.log(slowo)
			console.log(slowoArr)
			console.log(slowoMax)
			console.log(slowoNow)

			console.log(wiadomosc)
			let cId = ZLibrary.DiscordModules.SelectedChannelStore.getChannelId();
			if(!cId) return;
			ZLibrary.DiscordModules.MessageActions.sendMessage(cId, {content:wiadomosc})
			e.stopPropagation()
		}else if(chatboxValue.toLowerCase().startsWith("color:")){
					chatboxValue = chatboxValue.substr("color:".length).trim();
					//var str = "jhdnhjnhduhdnhdind    ⁪⁪   ⁪⁪   ⁪⁪   ⁪⁪   ⁪⁪   ⁪⁪ "
					var znaki = ["0", "1", "2", "3", "4", "5"] //["⁪⁪ ","᲼"," "," "," "," "]
					var rozdzielac = "6" //" ";
					//const numericalChar = new Set(["⁪⁪ ","᲼"," "," "," "," "]);
					//str = str.split("").filter(char => numericalChar.has(char)).join("");
					//console.log(str + "str")
					//console.log(chatboxValue.indexOf("("))
					chatboxValue = chatboxValue.split(" ")
					console.log(chatboxValue[0] + " kolor")
					var tonumber = ""
					var color = chatboxValue[0]
					chatboxValue.shift()
					var chat = ""
					for (let i = 0; i < chatboxValue.length; i++) {
						chat += chatboxValue[i]
						if(i != chatboxValue.length-1) chat += " "
						
					}
					chatboxValue = chat;
					for (let i = 0; i < color.length; i++) {
						tonumber += color[i].charCodeAt(0).toString(6) + rozdzielac
						console.log(i)
					}
					console.log(tonumber + "to num " + tonumber.length)
					var wynik = ""

					for (let i = 0; i < tonumber.length; i++) {
						if (tonumber[i] == rozdzielac) {
							wynik += rozdzielac
						} else {
							wynik += znaki[tonumber[i]]
						}
					}
					if (chatboxValue != "") {
						var wiadomosc = chatboxValue + wynik
						let cId = ZLibrary.DiscordModules.SelectedChannelStore.getChannelId();
						if (!cId) return;
						ZLibrary.DiscordModules.MessageActions.sendMessage(cId, { content: wiadomosc })//'["⁪⁪ ","᲼"," "," "," "," "," "]'})
					}else{
						ZLibrary.Toasts.show("brak wiadomości do wysłania",{type:"error"})
					}
					e.stopPropagation()
		}
		}
	}
		this.onSwitch();
	}
	decode(data){
		var array = data
		if (!this.settings.slowo.includes(...array)) { return }
		var kod = ""
		for (let i = 0; i < array.length; i++) {
			var k = this.settings.slowo.indexOf(array[i])
			if (array[i] == this.settings.rozdzielacz) kod += "/"
			if (array[i] == " ") kod += " "
			if (k != -1) {
				kod += k;
			}
		}
		var systemlicz = 0
		kod = kod.split(" ")
		var systemlicz = 0
		for (let i = 2; i < 32; i++) {
			if (kod[0].replace("/", "") == "0".charCodeAt(0).toString(i)) {
				systemlicz = i
			}
		}
		if (systemlicz > 10 && systemlicz != kod[1].replace("/", "")) {
			systemlicz = 0;
		}
		for (let i = 0; i < kod.length; i++) {
			kod[i] = kod[i].split("/")
		}
		kod.splice(0, 2)
		var wynik = ""
		if (systemlicz != 0 && kod.length > 0) {
			for (let j = 0; j < kod.length; j++) {
				for (let i = 0; i < kod[j].length - 1; i++) {
					wynik += String.fromCharCode(parseInt(kod[j][i], systemlicz))
				}
				wynik += " "
			}
		}
		if(wynik != " "){
			return wynik
		}
		if(systemlicz <= 0){
			return new Error("brak definicji systemu liczbowego w wiadomości")
		}if(kod.length <= 0 && systemlicz <= 0){
			return new Error("Brak danych" + data)
		}if(kod.length <= 0 && systemlicz != 0){
			return new Error("brak wiadomośći")
		}if(wynik == " "){
			return new Error("brak wiadomośći")
		}
		return new Error("nieznany błąd")
	}
	decodeColor(data){
			var znaki = ["0","1","2","3","4","5"]//["⁪⁪ ","᲼"," "," "," "," "]
			var rozdzielacz = "6"  //" "
			const numericalChar = new Set(["0","1","2","3","4","5","6"])//["⁪⁪ ","᲼"," "," "," "," "," "]);
			data = data.split("").filter(char => numericalChar.has(char)).join("");
			var array = data;
			var kod = ""
		for (let i = 0; i < array.length; i++) {
			var k = znaki.indexOf(array[i])
			if (array[i] == rozdzielacz) kod += "/"
			if (array[i] == " ") kod += " "
			if (k != -1) {
				kod += k;
			}
		}
		//console.log(kod)
		var systemlicz = 0
		kod = kod.split(" ")
		var systemlicz = 6
		for (let i = 0; i < kod.length; i++) {
			kod[i] = kod[i].split("/")
		}
		var wynik = ""
		if (systemlicz != 0 && kod.length > 0) {
			for (let j = 0; j < kod.length; j++) {
				for (let i = 0; i < kod[j].length - 1; i++) {
					wynik += String.fromCharCode(parseInt(kod[j][i], systemlicz))
				}
			}
			return {wynik:wynik,raw:data}
		}
		return "error"
	}
	updateColor(){
		var kolory = ["white","blue","red","green","yellow","black","pink"]
		const messages = document.querySelectorAll(".da-messageContent");
		//this.decodeColor(messages[messages.length-1].innerText)
		messages.forEach(element => {
			var data = element.innerText;
			/*
			var t = ["⁪⁪ ","᲼"," "," "," "," "];
			for (let i = 0; i < t.length; i++) {
				console.log((data.includes(t[i])) + "#" + t[i] + "#")
				
			}*/
			const numericalChar = new Set(["0","1","2","3","4","5","6"])//["⁪⁪ ","᲼"," "," "," "," "," "]);
			data = data.split("").filter(char => numericalChar.has(char)).join("");
			if(data.length > 0){
				if(/^#[0-9A-F]{6}$/i.test(this.decodeColor(element.innerText).wynik) || kolory.includes(this.decodeColor(element.innerText).wynik)){
					//console.log("tek")
					var color = this.decodeColor(element.innerText)
					//console.log(this.decodeColor(element.innerText))
					element.style.color = color.wynik//this.settings.TextColor//this.decodeColor(element.innerText)
					element.innerText = element.innerText.replace(color.raw,"")
				}
			}
		})
	}
	dispatch(data) {
		if (data.methodArguments[0].type !== 'MESSAGE_CREATE')return;
		this.fetchmessages();
		this.updateColor();
		// //console.log(data.methodArguments[0])
        //if (data.methodArguments[0].type !== 'MESSAGE_CREATE')
		// 	return;
		// const message = data.methodArguments[0].message;
		// if (message.author.id === BdApi.findModuleByProps('getId').getId()){
		// 	if(this.old == message.content){return};
		// 	if(message != void(0)){this.old = message.content}
		// 	else{return;}
		// }
		// //if(message.length){
		// 	var array = message.content
		// 	console.log(this.settings.slowo.includes(array) + " cooooo")
		// 	if(!this.settings.slowo.includes(...array)){return}
		// 	var kod = ""
		// 	//array = array.split(" ")
		// 	console.log(array)
		// 	for (let i = 0; i < array.length; i++) {
		// 		//for (let j = 0; j < array[i].length; j++) {
		// 			var k = this.settings.slowo.indexOf(array[i])
		// 			if(array[i] == this.settings.rozdzielacz) kod += "/"
		// 			if(array[i] == " ") kod += " "
		// 			if(k != -1){
		// 				kod += k;
		// 			}
		// 		//}
		// 		//kod += " ";	
		// 	}
		// 	var systemlicz = 0
		// 	kod = kod.split(" ")
		// 	console.log(kod)
		// 		var systemlicz = 0
		// 		for (let i = 2; i < 32; i++) {
		// 			if(kod[0].replace("/","") == "0".charCodeAt(0).toString(i)){
		// 				systemlicz = i
		// 			}
		// 		}
		// 		if(systemlicz > 10 && systemlicz != kod[1].replace("/","")){
		// 			systemlicz = 0;
		// 		}
		// 		console.log(systemlicz)
		// 		/*
		// 		//if(kk == void(0) || kkk == void(0))return
		// 		//console.log(kod[0].split("/")[0] + "  bbbbbbbbbbbbbbbb")
		// 		if(kk.replace("/","") == "49" && kkk.replace("/","") == "49")systemlicz = 10
		// 		if(kk.replace("/","") == "45" && kkk.replace("/","") == "45")systemlicz = 11
		// 		if(kk.replace("/","") == "41" && kkk.replace("/","") == "42")systemlicz = 12
		// 		if(kk.replace("/","") == "3a" && kkk.replace("/","") == "3c")systemlicz = 13
		// 		if(kk.replace("/","") == "37" && kkk.replace("/","") == "3a")systemlicz = 14
		// 		if(kk.replace("/","") == "34" && kkk.replace("/","") == "38")systemlicz = 15
		// 		if(kk.replace("/","") == "31" && kkk.replace("/","") == "36")systemlicz = 16
		// 		if(kk.replace("/","") == "2f" && kkk.replace("/","") == "34")systemlicz = 17
		// 		if(kkk.replace("/","") == "110010")systemlicz = 2
		// 		if(kkk.replace("/","") ==  "1220")systemlicz = 3
		// 		if(kkk.replace("/","") == "310")systemlicz = 4
		// 		if(kkk.replace("/","") == "203")systemlicz = 5
		// 		if(kkk.replace("/","") == "130")systemlicz = 6
		// 		if(kkk.replace("/","") == "106")systemlicz = 7
		// 		if(kkk.replace("/","") == "70")systemlicz = 8
		// 		if(kkk.replace("/","") == "63")systemlicz = 9
		// 		*/
		// 		for (let i = 0; i < kod.length; i++) {
		// 			kod[i] = kod[i].split("/")
		// 		}
		// 		kod.splice(0,2)
		// 	var wynik = ""
		// 	if(systemlicz != 0){
		// 	for (let j = 0; j < kod.length; j++) {
		// 	for (let i = 0; i < kod[j].length-1; i++) {
		// 		//console.log(String.fromCharCode(parseInt(kod[j][i],systemlicz)))
		// 		//if(spos.includes(i)){console.log(i);wynik += " "}
		// 		wynik += String.fromCharCode(parseInt(kod[j][i],systemlicz))
		// 		//console.log(mm[i] + " mmm")
		// 	}
		// 	wynik += " "
		// 	}
		// 	let cId = message.channel_id
		// 	if(!cId) return;
		// 	ZLibrary.DiscordModules.MessageActions.sendBotMessage(cId, wynik);
		// 	}

		// //}
		// console.log(message.content)
	}
	onSwitch(){
		//ZLibrary.PluginUtilities.removeStyle(this.getName());
		const chatbox = document.querySelector(".slateTextArea-1Mkdgw");
		if(chatbox) chatbox.addEventListener("keydown", this.onChatInput);
		this.fetchmessages()
		this.updateColor()
	}
	fetchmessages(){
		const messages = document.querySelectorAll(".da-messageContent")
		messages.forEach(element => {
			var array = element.innerText
			if(!this.settings.slowo.includes(...array)){return}
			var kod = ""
			for (let i = 0; i < array.length; i++) {
					var k = this.settings.slowo.indexOf(array[i])
					if(array[i] == this.settings.rozdzielacz) kod += "/"
					if(array[i] == " ") kod += " "
					if(k != -1){
						kod += k;
					}
			}
			var systemlicz = 0
			kod = kod.split(" ")
				var systemlicz = 0
				for (let i = 2; i < 32; i++) {
					if(kod[0].replace("/","") == "0".charCodeAt(0).toString(i)){
						systemlicz = i
					}
				}
			if (systemlicz != 0 && !element.title) {
				element.title = element.innerHTML
				element.addEventListener("mouseenter",this.mouseenter)
				element.addEventListener("mouseout",this.mouseout)
			}
		})
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