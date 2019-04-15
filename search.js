window.onload = addevent;
var index_name = document.currentScript.getAttribute('index_name');

function makeUL(productsarray,termsarray) {
    console.log(productsarray, termsarray)
    var list = document.createElement('ul');
    list.className += "search_auto";
    list.id += "autocomplete"
    productsarray.map(function(name){ 
         let item = document.createElement('li');
        let term = name['word'];
        item.className += 'search_element terms_element';    
        item.innerHTML = '<a href = \'' + 'https://' +  window.location.hostname + '/search/' + term  + '\' class = \'search_link\'><p class = \'term_title\'>' + term + '</p></a>'
        list.appendChild(item);
    });
        productsarray.map(function(name){ 
            console.log(name)
            let item = document.createElement('li');
            let prod = name["product"]
            item.className += "search_element product_element";    
            item.innerHTML = "<a href = '" + 'https://' +  window.location.hostname + '/' + prod["url"] + '.html' + "' class = 'search_link'><img class = 'search_image' src ='" + prod["img_url"] + "'><p class = 'search_title'>" + prod["name"] + "</p> </a>"//Dit zou dan al veranderd moeten zijn voor Cloudsuite
            list.appendChild(item);
        });
    return list;
}


function reloadresults(auto_data){ 
    var autoCompleteBox = document.getElementById('data');//autoCompleteBox is the field under the inputbar
    autoCompleteBox.innerHTML = ""; 
    autoCompleteBox.appendChild(makeUL(auto_data["result"], []));
}

function updateJSON(json) {
    latest_search_results = json
}

function sendSearchApi(value, callback=undefined){
    var req = new XMLHttpRequest();
    let token = index_name;
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
