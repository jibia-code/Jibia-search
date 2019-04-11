window.onload = addevent;
var index_name = document.currentScript.getAttribute('index_name'); //1

results ={
    "products":[
        {"name":"John", "link":"lalalal", "img_url": "kakakaka"},
         {"name": "Piet", "link":"lalalal", "img_url": "kakakaka"},
         {"name":"Klaas", "link":"lalalal", "img_url": "kakakaka"}
    ],
    "terms" : [
    ]
    }


function makeUL(productsarray,termsarray) {
    // Create the list element:
    console.log(productsarray, termsarray)
    var list = document.createElement('ul');
    list.className += "search_auto";
    list.id += "autocomplete"
    results.terms.map(function(name){ 
        let item = document.createElement('li');
        item.className += 'search_element terms_element';    
        item.innerHTML = '<a href = \'' + name.link + '\' class = \'search_link\'><p class = \'term_title\'>' + name.name + '</p></a>'
        list.appendChild(item);
    });
        productsarray.map(function(name){ 
            console.log(name)
            let item = document.createElement('li');
            let prod = name["product"]
            item.className += "search_element product_element";    
            item.innerHTML = "<a href = '" + prod["url"] + "' class = 'search_link'><img class = 'search_image' src ='" + prod["img_url"] + "'><p class = 'search_title'>" + prod["name"] + "</p> </a>"//Dit zou dan al veranderd moeten zijn voor Cloudsuite
            list.appendChild(item);
        });
    return list;
}


function reloadresults(auto_data){ 
    console.log(auto_data["result"])
    var searchBox = document.getElementById('data');//Searchbox is de veld onder de input
    searchBox.innerHTML = "";  //Dit is niet op een andere manier te doen
    searchBox.appendChild(makeUL(auto_data["result"], []));
}

function updateJSON(json) {
    latest_search_results = json
}

function sendSearchApi(value, callback=undefined){
    var req = new XMLHttpRequest();
    let token = index_name;
    req.open('GET', decodeURIComponent('https://api.jibia.nl/api/do_search?query='+value+'&token='+token+'&n=5'), true);
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
    document.getElementById('formSearch').addEventListener("input", search);//Dit is dus van belang van implementatie
    var searchBox = document.createElement('div'); 
    searchBox.id = "data"; 
    document.getElementById('formSearch').appendChild(searchBox);
    console.log("Jibia is op deze site actief man. SUPER VET!! WAUT PRIVACY DATA PRIVACY DATA TOMATEN!!!!")
}
