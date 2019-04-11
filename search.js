window.onload = addevent;


var Params = Params || (function(){
    var _args = {}; // private

    return {
        init : function(Args) {
            _args = Args;
        },
        helloWorld : function() {
            alert('Hello World! -' + _args[0]);
        }
    };
}());


results ={
    "products":[
        {"name":"John", "link":"lalalal", "img_url": "kakakaka"},
         {"name": "Piet", "link":"lalalal", "img_url": "kakakaka"},
         {"name":"Klaas", "link":"lalalal", "img_url": "kakakaka"}
    ],
    "terms" : [
        {"name":"Kats", "link":"lalalal", "img_url": "kakakaka"},
        {"name":"John", "link":"lalalal", "img_url": "kakakaka"},
        {"name":"Boem", "link":"lalalal", "img_url": "kakakaka"}
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
            item.className += "search_element terms_element";    
            item.innerHTML = "<a href = '" + name.link + "' class = 'search_link'><img class = 'search_image' src ='" + name.img_url + "'><p class = 'search_title'>" + name.name + "</p> </a>"
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
    let token = '385eaa8e916ef7b9dfd5566015bc2a'
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
    req.send(data); 
}


function search(event) {
    sendSearchApi(event.srcElement.value, reloadresults);
}


function addevent(){
    document.getElementById('searchbar').addEventListener("input", search);//Dit is dus van belang van implementatie
}
