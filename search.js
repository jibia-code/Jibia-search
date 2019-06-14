window.onload = addevent;
var AuthToken = document.currentScript.getAttribute('token');
//var ThemeCategory = document.currentScript.getAttribute('theme_category');
var ThemeCategory = 2;
var num_cat = document.currentScript.getAttribute('#category');
var num_prod = document.currentScript.getAttribute('#products');
var num_term = document.currentScript.getAttribute('#terms');
var lang = document.currentScript.getAttribute('lang');

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
function add_category(categoryarray, list){
	categoryarray.map(function(name){
		let item = document.createElement('li');
		let cate = name["category"]
		item.className += "jibia-search-element jibia-category-element";
		item.innerHTML = "<a href = '" + 'https://' +  window.location.hostname + '/' + cate["name"] + '.html' + "' class = 'jibia-category-link'><img class = 'jibia-category-image' src ='" + cate["img_url"] + "'><p class = 'jibia-category-title'>" + cate["name"] + "</p> </a>"//Dit zou dan al veranderd moeten zijn voor Cloudsuite
		item.addEventListener("click", function() {
			var req = new XMLHttpRequest();
			req.open('POST', decodeURIComponent('https://api.jibia.nl/api/search_app_click_analytics'), true);
			req.setRequestHeader("Content-type", "application/json");
			var data = JSON.stringify({"origin":window.location,"query": name});
			req.send(data);
		});
		list.appendChild(item)
	});
		return list
}

function add_terms(termsarray, list){
    termsarray.map(function(term){
        let item = document.createElement('li');
        item.className += 'jibia-search-element jibia-term-element';
        item.innerHTML = '<a href = \'' + 'https://' +  window.location.hostname + '/search/' + term['raw_word']  + '\' class = \'jibia-term-link\'><p class = \'jibia-term-title\'>' + term["html_word"] + '</p></a>'
		  item.addEventListener("click", function() {
			var req = new XMLHttpRequest();
			req.open('POST', decodeURIComponent('https://api.jibia.nl/api/search_app_click_analytics'), true);
			req.setRequestHeader("Content-type", "application/json");
			var data = JSON.stringify({"origin":window.location,"query": term});
			req.send(data)
		})
		list.appendChild(item)
	});
	return list
}

function add_products(productsarray, list){
	productsarray.map(function(name){
		let item = document.createElement('li');
		let prod = name["product"]
		//let productCategory = createSubtitle("Babyspullen") //Deze is nog hardcoded
		item.className += "jibia-search-element jibia-product-element";
		item.innerHTML = "<a href = '" + 'https://' +  window.location.hostname + '/' + prod["url"] + '.html' + "' class = 'jibia-product-link'><img class = 'jibia-product-image' src ='" + prod["img_url"] + "'>"+ "<div class= 'product'> <i>" +"</i> <p class = 'jibia-product-title'>" + prod["name"] + "</p></a></div>"//Dit zou dan al veranderd moeten zijn voor Cloudsuite
		item.addEventListener("click", function() {
			var req = new XMLHttpRequeswet();
			req.open('POST', decodeURIComponent('https://api.jibia.nl/api/search_app_click_analytics'), true);
			req.setRequestHeader("Content-type", "application/json");
			var data = JSON.stringify({"origin":window.location,"query": name});
			req.send(data);
		})
		list.appendChild(item)
	});
	return list
}

function makeUL(productsarray,termsarray, categoryarray) {
    var list = document.createElement('ul');
    list.className += "jibia-search-box";
	list.id += "jibia-autocomplete"
	if(termsarray != undefined){
		let termTitle = createTitle("Zoektermen")
		list.appendChild(termTitle);
		var t = add_terms(termsarray,list);
		list = t
	}
	if(productsarray != undefined){
		let productTitle = createTitle("Artikelen")
		list.appendChild(productTitle);
		var t = add_products(productsarray,list);
		list = t
	}
	if(categoryarray != undefined){
		let categoryTitle = createTitle("Categoriën")
		list.appendChild(categoryTitle);
		var t = add_category(categoryarray,list);
		list = t
	}
    return list;
}

function reloadresults(auto_data){
  var autoCompleteBox = document.getElementById("data");
	autoCompleteBox.innerHTML = "";
	//var temp_dict = [{"category" : {name : "citroenen", img_url : "https://upload.wikimedia.org/wikipedia/commons/3/37/Oryctolagus_cuniculus_Tasmania_2.jpg",  }}];
	/*var auto_data = {
		"ref": "https://www.graceisgreen.com/vrouw/",
		"result": {
		  "products": [
			{
			  "product": {
				"img_url": "https://cdn.webshopapp.com/shops/235598/files/228879149/50x50x2/bambooty-basics-wetbag---alle-kleuren.jpg",
				"name": "Bambooty Basics Wetbag in verschillende kleuren",
				"url": "bambooty-basics-wetbag"
			  }
			},
			{
			  "product": {
				"img_url": "https://cdn.webshopapp.com/shops/235598/files/251267771/50x50x2/inlegger-klein-3-2.jpg",
				"name": "Bambooty inlegger voor in de wasbare luier - 2 varianten.",
				"url": "bamboo-inlegger"
			  }
			},
			{
			  "product": {
				"img_url": "https://cdn.webshopapp.com/shops/235598/files/211176899/50x50x2/bambooty-zoogcompressen-zakje.jpg",
				"name": "Booby wasbare zoogcompressen dag",
				"url": "booby-wasbare-zoogcompressen-dag"
			  }
			},
			{
			  "product": {
				"img_url": "https://cdn.webshopapp.com/shops/235598/files/211177382/50x50x2/zoogcompressen-nacht-wasbaar.jpg",
				"name": "Booby wasbare zoogcompressen nacht",
				"url": "booby-wasbare-zoogcompressen-nacht"
			  }
			},
			{
			  "product": {
				"img_url": "https://cdn.webshopapp.com/shops/235598/files/263034773/50x50x2/swim-and-training-whale-hq.png",
				"name": "Actie! Zwemluier & Trainingsbroekje Bubble - 2-pak  ",
				"url": "zwemluier-trainingsbroekje-bubble"
			  }
			}
		  ],
		  "words": [
			{
			  "html_word": "<b>B</b>orstvoeding",
			  "raw_word": "Borstvoeding"
			},
			{
			  "html_word": "<b>B</b>escherming",
			  "raw_word": "Bescherming"
			},
			{
			  "html_word": "<b>B</b>abydoekjes",
			  "raw_word": "Babydoekjes"
			}
		  ]
		}
	  }
	  */
	autoCompleteBox.appendChild(makeUL(auto_data["result"]["products"], auto_data["result"]["words"], auto_data["result"]["category"]));
}

function updateJSON(json) {
    latest_search_results = json
}

function sendSearchApi(value, callback=undefined, id){
    var req = new XMLHttpRequest();
    let token = AuthToken
    let numberResponse = 5;
	let lang = "en";
	if(lang == null){
		lang = window.location.pathname.split( '/' )[1];
	}
    req.open('GET', decodeURIComponent('https://api.jibia.nl/api/do_search?query='+value+'&token='+token+'&n='+numberResponse+"&country_code="+lang, true));
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
	sendSearchApi(event.srcElement.value, reloadresults, searchunit )
}

function popup(event) {
	document.getElementById('searchunit').style.display = 'block';
	let inputfield = document.getElementById('searchbox');
	inputfield.value = event.srcElement.value;
	inputfield.focus();
	//inputfield.select();
	search(event);
}

function closewindow(searchbars){
	searchunit.style.display = 'none';
			searchbars.forEach(function(e){
				e.value = '';
				if(e.getAttribute("searchbar") == searchunit.getAttribute('s'))
				{
					e.focus();
				}
			});
};

function addbackspaceclose(searchbars, searchunit){
	document.addEventListener("keyup", function(e){
		var temp = document.getElementById("searchbox").value;
		if(e.keyCode == 8 && temp == ''){
			closewindow(searchbars, searchunit);
		}
	});
}
function addevent(){

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
		i = i + 1;
	});
	searchunit.addEventListener("input", search);
	let autoCompleteBox = document.createElement('div');
	autoCompleteBox.id = "data";
	searchunit.appendChild(autoCompleteBox);

	//kiezen of we met of zonder backspace delete willen!
	addbackspaceclose(searchbars, searchunit);
}
