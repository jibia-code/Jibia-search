window.onload = addevent;
var AuthToken = document.currentScript.getAttribute('token');

function makeUL(productsarray,termsarray) {
    var list = document.createElement('ul');
    list.className += "search-box";
    list.id += "autocomplete"
    termsarray.map(function(term){ 
        let item = document.createElement('li');
        item.className += 'search-element term-element';    
        item.innerHTML = '<a href = \'' + 'https://' +  window.location.hostname + '/search/' + term  + '\' class = \'term-link\'><p class = \'term-title\'>' + term + '</p></a>'
        list.appendChild(item);
    });
        productsarray.map(function(name){ 
            let item = document.createElement('li');
            let prod = name["product"]
            item.className += "search-element product-element";    
            item.innerHTML = "<a href = '" + 'https://' +  window.location.hostname + '/' + prod["url"] + '.html' + "' class = 'product-link'><img class = 'product-image' src ='" + prod["img_url"] + "'><p class = 'product-title'>" + prod["name"] + "</p> </a>"//Dit zou dan al veranderd moeten zijn voor Cloudsuite
            list.appendChild(item);
        }); 
    return list;
}


function reloadresults(auto_data){ 
    console.log(auto_data);
    var autoCompleteBox = document.getElementById('data');//autoCompleteBox is the field under the inputbar
    autoCompleteBox.innerHTML = ""; 
    autoCompleteBox.appendChild(makeUL(auto_data["result"]["products"], auto_data["result"]["words"]));
}

function updateJSON(json) {
    latest_search_results = json
}

function sendSearchApi(value, callback=undefined){
    var req = new XMLHttpRequest();
    let token = AuthToken
    let numberResponse = 5;
    req.open('GET', decodeURIComponent('https://api.jibia.nl/api/do_search?query='+value+'&token='+token+'&n='+numberResponse), true);
    req.addEventListener("readystatechange", function () {
        if (req.readyState === 4) {
            var json = JSON.parse(req.responseText);
            if (callback !== undefined) {
                callback(json)
            } else {
                console.warn("Oi callback undefined ")
            }
        }
    });
    req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    req.send(); 
}


function search(event) {
    sendSearchApi(event.srcElement.value, reloadresults);
}


function addevent(){
    document.getElementById('formSearch').addEventListener("input", search);//The Eventlistner needs to be 'input'. 
    var autoCompleteBox = document.createElement('div'); 
    autoCompleteBox.id = "data"; 
    document.getElementById('formSearch').appendChild(autoCompleteBox);
}
