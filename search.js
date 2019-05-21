window.onload = addevent;
var AuthToken = document.currentScript.getAttribute('token');
var ThemeCategory = 0;

function makeUL(productsarray,termsarray) {
    var list = document.createElement('ul');
    list.className += "jibia-search-box";
    list.id += "jibia-autocomplete"
    termsarray.map(function(term){ 
        let item = document.createElement('li');
        item.className += 'jibia-search-element jibia-term-element';    
        item.innerHTML = '<a href = \'' + 'https://' +  window.location.hostname + '/search/' + term['raw_word']  + '\' class = \'jibia-term-link\'><p class = \'jibia-term-title\'>' + term["html_word"] + '</p></a>'
        list.appendChild(item);
		item.addEventListener("click", function() {
			var req = new XMLHttpRequest();
			req.open('POST', decodeURIComponent('https://api.jibia.nl/api/search_app_click_analytics'), true);
			req.setRequestHeader("Content-type", "application/json");
			var data = JSON.stringify({"origin":window.location,"query": term});
			req.send(data);
		})
    });
        productsarray.map(function(name){ 
            let item = document.createElement('li');
            let prod = name["product"]  
            item.className += "jibia-search-element jibia-product-element";    
            item.innerHTML = "<a href = '" + 'https://' +  window.location.hostname + '/' + prod["url"] + '.html' + "' class = 'jibia-product-link'><img class = 'jibia-product-image' src ='" + prod["img_url"] + "'><p class = 'jibia-product-title'>" + prod["name"] + "</p> </a>"//Dit zou dan al veranderd moeten zijn voor Cloudsuite
            list.appendChild(item);
		item.addEventListener("click", function() {
			var req = new XMLHttpRequest();
			req.open('POST', decodeURIComponent('http://146.185.174.192/api/search_app_click_analytics'), true);
			//req.open('POST', decodeURIComponent('https://api.jibia.nl/api/search_app_click_analytics'), true);
			req.setRequestHeader("Content-type", "application/json");
			var data = JSON.stringify({"origin":window.location,"query": name});
			req.send(data);
		})
        }); 
    return list;
}


function reloadresults(auto_data, id){ 
    var autoCompleteBox = document.getElementById(id);
    autoCompleteBox.innerHTML = ""; 
    autoCompleteBox.appendChild(makeUL(auto_data["result"]["products"], auto_data["result"]["words"]));
}

function updateJSON(json) {
    latest_search_results = json
}

function sendSearchApi(value, callback=undefined, id){
    var req = new XMLHttpRequest();
    let token = AuthToken
    let numberResponse = 5;
	let lang = document.documentElement.getAttribute("lang")
	if(lang == null){
		lang = window.location.pathname.split( '/' )[1];
	}
	req.open('GET', decodeURIComponent('http://146.185.174.192/api/do_search?query='+value+'&token='+token+'&n='+numberResponse+'&country_code='+lang), true);
    //req.open('GET', decodeURIComponent('https://api.jibia.nl/api/do_search?query='+value+'&token='+token+'&n='+numberResponse+'&country_code='+lang), true);
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


function search(event) {
	let nodeParent = event.srcElement.parentNode;
	while(nodeParent.tagName != "FORM"){
		nodeParent = nodeParent.parentNode;
	}
	nodeParent = nodeParent.parentNode;
    sendSearchApi(event.srcElement.value, reloadresults, nodeParent.lastChild.id);
}

function addevent(){
    let searchbars = document.getElementsByName('q');
	let i = 0;
	searchbars.forEach(function(searchbar) {
		searchbar.addEventListener("input", search);
		let autoCompleteBox = document.createElement('div'); 
		autoCompleteBox.id = "data"+i; 
		let nodeParent = searchbar.parentNode;
		while(nodeParent.tagName != "FORM"){
			nodeParent = nodeParent.parentNode;
		}
		nodeParentParent = nodeParent.parentNode;
		nodeParentParent.appendChild(autoCompleteBox);
		autoCompleteBox.style.position = "relative";
		
		if(theme_category == 1){
			autoCompleteBox.style.paddingTop = window.getComputedStyle(searchbar,null).getPropertyValue("height");
		}
		else if(theme_category == 2){
			autoCompleteBox.style.paddingTop = window.getComputedStyle(nodeParent,null).getPropertyValue("height");
		}
		//autoCompleteBox.style.width = window.getComputedStyle(nodeParent,null).getPropertyValue("width");
		i += 1;
		let autocompletes = document.getElementsByClassName('autocomplete');
		for ( let autocomplete of autocompletes) {
			autocomplete.remove();
			}
		}
	)
	
}
