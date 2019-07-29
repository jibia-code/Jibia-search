window.onload = onLoad;

var AuthToken = document.currentScript.getAttribute('token');
//var ThemeCategory = document.currentScript.getAttribute('theme_category');
var ThemeCategory = 2;
var num_cat = document.currentScript.getAttribute('#category');
var num_prod = document.currentScript.getAttribute('#products');
var num_term = document.currentScript.getAttribute('#terms');
var attr_lang = document.currentScript.getAttribute('lang');
var lang = 'nl'
var default_lang = 'nl'
var clickedbar = ''

var configData = {
	settings: {
		default_language: 'en' 
	},
	theme: {
		num_cat: '1',
		num_prod: '5',
		num_term: '3',
		bg_color: '',
	}
}

function init() {
	var req = new XMLHttpRequest();
	lang = getcountry(attr_lang);
    req.open('GET', decodeURIComponent('https://bapi.jibia.nl/api/get_search_configuration'+'&token='+AuthToken , true));
    req.addEventListener("readystatechange", function () {
		console.log(req) // HIER GEBEURT NOG NIKS MEE
		json = JSON(req.reponse); 
    });
    req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    req.send();
} 
// ------------ CREATE RESULT OF SEARCH ------ 
function createTitle(string) {
  let titleElement = document.createElement("p")
  titleElement.innerHTML = string;
  return titleElement;
}

function createSubtitle(string) {
  let subtitleElement = document.createElement("i")
  subtitleElement.innerHTML = string;
  return subtitleElement;
}

function add_category(categoryarray, list, lang){
	categoryarray.map(function(name){
		let item = document.createElement('li');
		let cate = name["category"]
		item.className += "jibia-search-element jibia-category-element";
		item.innerHTML = "<a href = '" + 'https://' +  window.location.hostname +  '/' + lang + '/' + cate["name"] + '.html' + "' class = 'jibia-category-link'><img class = 'jibia-category-image' src ='" + cate["img_url"] + "'><p class = 'jibia-category-title'>" + cate["name"] + "</p> </a>"//Dit zou dan al veranderd moeten zijn voor Cloudsuite
		item.addEventListener("click", function() {
			var req = new XMLHttpRequest();
			req.open('POST', decodeURIComponent('https://bapi.jibia.nl/api/search_app_click_analytics'), true);
			req.setRequestHeader("Content-type", "application/json");
			var data = JSON.stringify({"origin":window.location,"query": name});
			req.send(data);
		});
		list.appendChild(item)
	});
		return list
}

function add_terms(termsarray, list, lang){
    termsarray.map(function(term){
        let item = document.createElement('li');
        item.className += 'jibia-search-element jibia-term-element';
        item.innerHTML = '<a href = \'' + 'https://' +  window.location.hostname  + '/' + lang + '/search/' + term['raw_word']  + '\' class = \'jibia-term-link\'><p class = \'jibia-term-title\'>' + term["html_word"] + '</p></a>'
		  item.addEventListener("click", function() {
			var req = new XMLHttpRequest();
			req.open('POST', decodeURIComponent('https://bapi.jibia.nl/api/search_app_click_analytics'), true);
			req.setRequestHeader("Content-type", "application/json");
			var data = JSON.stringify({"origin":window.location,"query": term});
			req.send(data)
		})
		list.appendChild(item)
	});
	return list
}

function add_products(productsarray, list, lang){
	productsarray.map(function(name){
		let item = document.createElement('li');
		let prod = name["product"]
		//let productCategory = createSubtitle("Babyspullen") //Deze is nog hardcoded
		item.className += "jibia-search-element jibia-product-element";
		item.innerHTML = "<a href = '" + 'https://' +  window.location.hostname + '/' + lang + '/' + prod["url"] + '.html' + "' class = 'jibia-product-link'><img class = 'jibia-product-image' src ='" + prod["img_url"] + "'>"+ "<div class= 'product'> <i>" +"</i> <p class = 'jibia-product-title'>" + prod["name"] + "</p></a></div>"//Dit zou dan al veranderd moeten zijn voor Cloudsuite
		item.addEventListener("click", function() {
			var req = new XMLHttpRequeswet();
			req.open('POST', decodeURIComponent('https://bapi.jibia.nl/api/search_app_click_analytics'), true);
			req.setRequestHeader("Content-type", "application/json");
			var data = JSON.stringify({"origin":window.location,"query": name});
			req.send(data);
		})
		list.appendChild(item)
	});
	return list
}

function makeUL(productsarray,termsarray, categoryarray) {
	lang = getcountry(attr_lang);
    var list = document.createElement('ul');
    list.className += "jibia-search-box";
	list.id += "jibia-autocomplete"
	if(termsarray != undefined){
		let termTitle = createTitle("Zoektermen")
		list.appendChild(termTitle);
		var t = add_terms(termsarray,list,lang);
		list = t
	}
	if(productsarray != undefined){
		let productTitle = createTitle("Artikelen")
		list.appendChild(productTitle);
		var t = add_products(productsarray,list,lang);
		list = t
	}
	if(categoryarray != undefined){
		let categoryTitle = createTitle("Categoriën")
		list.appendChild(categoryTitle);
		var t = add_category(categoryarray,list,lang);
		list = t
	}
    return list;
}

function lightspeedSearch(word){
	url = 'https://' +  window.location.hostname + '/search/' + word;
	document.location = url;
}

function reloadresults(auto_data){
  var autoCompleteBox = document.getElementById("data");
	autoCompleteBox.innerHTML = "";
	autoCompleteBox.appendChild(makeUL(auto_data["result"]["products"], auto_data["result"]["words"], auto_data["result"]["category"]));
}

function getcountry(lang){
	lang = attr_lang
	if (lang == null){
		try {
			let temp = window.location.pathname.split( '/' )[1];
			if (temp.length == 2){
				lang = temp
			} 
			else lang = configData.settings.default_lang
		}
		catch(error){
			console.error(error)
			lang = configData.settings.default_lang
		}
	}
	return lang
}

//---------- DO SEARCH -------- 

function sendSearchApi(value, callback=undefined, id){
    var req = new XMLHttpRequest();
	let numberResponse = configData.theme.num_prod;
	lang = getcountry(attr_lang);
    req.open('GET', decodeURIComponent('https://bapi.jibia.nl/api/do_search?query='+value+'&token='+AuthToken+'&n='+numberResponse+"&country_code="+lang, true));
    req.addEventListener("readystatechange", function () {
        if (req.readyState === 4) {
            var json = JSON.parse(req.responseText);
            if (callback !== undefined) {
                callback(json, id)
            } else {
                console.warn("Oi callback undefined ")
            }
        }
    });
    req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    req.send();
}

function search(event){
	let searchunit = document.getElementById("searchunit");
	//reloadresults('');
	if(event.srcElement.value != ''){
		sendSearchApi(event.srcElement.value, reloadresults, searchunit )
	}
}


// ------- POPUP  --------
function popup(event) {
	document.getElementById('searchunit').style.display = 'block';
	let inputfield = document.getElementById('searchbox');
	clickedbar = event.srcElement;
	inputfield.value = event.srcElement.value;
	inputfield.focus();
	//inputfield.select();
	search(event);
}

function closewindow(searchbars){
	if(searchunit.style.display != 'none'){
	searchunit.style.display = 'none';
	clickedbar.value = '';
	clickedbar.focus();
	}
};

// ------ SEARCHBAR FEATURES ------
function addbackspaceclose(searchbars, searchunit){
	searchunit.addEventListener("keyup", function(e){
		var temp = document.getElementById("searchbox").value;
		if(e.keyCode == 8 && temp == ''){
			closewindow(searchbars, searchunit);
		}
	});
}

function addEnterSearch(searchunit){
	searchunit.addEventListener("keyup", function(e){
		var temp = document.getElementById("searchbox").value;
		if(e.keyCode == 13 && temp != ''){
			lightspeedSearch(temp);
		}
	});
}

function addEvent(){
	let searchbars = document.getElementsByName('q');
	let searchunit = document.createElement('div');
	document.onclick = function(e){
		if(e.target.id !=='searchunit'){
			closewindow(searchbars, searchunit);
		}
	}
	searchunit.id = "searchunit"
	searchunit.className = "popup";
	searchunit.innerHTML = "<div class = 'center-box'/><i class='fa fa-search searchicon'></i><input id = 'searchbox' class = 'searchbox'></input></div>";
	let i = 0;
	searchbars.forEach(function(e){
		searchunit.setAttribute("s", i);
		e.setAttribute("searchbar", i);
		document.body.appendChild(searchunit);
		e.addEventListener("input", popup);
		e.addEventListener("click", popup);
		i = i + 1;
	});
	searchunit.addEventListener("input", search);
	let autoCompleteBox = document.createElement('div');
	autoCompleteBox.id = "data";
	searchunit.appendChild(autoCompleteBox);

	//kiezen of we met of zonder backspace delete willen!
	addbackspaceclose(searchbars, searchunit);
	addEnterSearch(searchunit);
}


function onLoad(){
	init();
	addEvent(); 
}