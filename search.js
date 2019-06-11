window.onload = addevent;
var AuthToken = document.currentScript.getAttribute('token');
//var ThemeCategory = document.currentScript.getAttribute('theme_category');
var ThemeCategory = 2;
var lang = document.currentScript.getAttribute('lang');

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
			req.open('POST', decodeURIComponent('https://api.jibia.nl/api/search_app_click_analytics'), true);
			req.setRequestHeader("Content-type", "application/json");
			var data = JSON.stringify({"origin":window.location,"query": name});
			req.send(data);
		})
        }); 
    return list;
}


function reloadresults(auto_data){ 
    var autoCompleteBox = document.getElementById("data");
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
	let lang = "en";
	if(lang == null){
		lang = window.location.pathname.split( '/' )[1];
	}
    req.open('GET', decodeURIComponent('https://api.jibia.nl/api/do_search?query='+value+'&token='+token+'&n='+numberResponse), true);
    req.addEventListener("readystatechange", function () {
        if (req.readyState === 4) {
            var json = JSON.parse(req.responseText);
            if (callback !== undefined) {
				console.log("2132323:")
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

function addevent(){
	
	let searchbars = document.getElementsByName('q');
	let searchunit = document.createElement('div');
	document.onclick = function(e){
		if(e.target.id !=='searchunit'){
			searchunit.style.display = 'none';
			searchbars.forEach(function(e){e.value = ''})
		}
	}
	searchunit.id = "searchunit"
	searchunit.className = "popup";
	searchunit.innerHTML = "<div class = 'center-box'/><input id = 'searchbox' class = 'searchbox'></input></div>"; 
	document.body.appendChild(searchunit);
	let i = 0;
	searchbars.forEach(function(searchbar) {
		searchbar.addEventListener("input", popup);
	});
	searchunit.addEventListener("input", search);
	let autoCompleteBox = document.createElement('div'); 
	autoCompleteBox.id = "data"; 
	searchunit.appendChild(autoCompleteBox); 
}
