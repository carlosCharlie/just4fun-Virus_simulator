let infectedColor;
let countryColor;


class Connections{
    constructor(){
        this._connections = {};
        this._order = [];
    }

    getConnection(a,b){
        let newConnection = [a,b];
        newConnection = newConnection.sort();
        
        if(this._connections[newConnection[0].name]==undefined)
            this._connections[newConnection[0].name]={};
        
        if(this._connections[newConnection[0].name][newConnection[1].name]==undefined){

            this._connections[newConnection[0].name][newConnection[1].name] = document.createElementNS('http://www.w3.org/2000/svg',"line");
            this._connections[newConnection[0].name][newConnection[1].name].setAttribute("x1",newConnection[0].x);
            this._connections[newConnection[0].name][newConnection[1].name].setAttribute("y1",newConnection[0].y);
            this._connections[newConnection[0].name][newConnection[1].name].setAttribute("x2",newConnection[1].x);
            this._connections[newConnection[0].name][newConnection[1].name].setAttribute("y2",newConnection[1].y);
      //      this._connections[newConnection[0].name][newConnection[1].name].setAttribute("stroke",getComputedStyle(document.documentElement)
      //      .getPropertyValue('--connection-color'));
     //       this._connections[newConnection[0].name][newConnection[1].name].setAttribute("stroke-width","1");

            map.appendChild(this._connections[newConnection[0].name][newConnection[1].name]);

            this._order.push(this._connections[newConnection[0].name][newConnection[1].name]);
        }

        if(this._order.length>50){
            map.removeChild(this._order[0]);
            this._order[0]=undefined;
            this._order.shift();
        }
            return this._connections[newConnection[0].name][newConnection[1].name];
    }
}

let map;
let countries = {};
const connections = new Connections();
let countryOver = "usa";

alert("prueba0");

document.addEventListener("DOMContentLoaded",function(){
    document.getElementById("map").onload = function(){
        
        map = document.getElementById("map").contentDocument.activeElement;

        for(country of map.getElementsByTagName("path")){
            countries[country.id] = new Country(
            {
            size:country.getBoundingClientRect().width*country.getBoundingClientRect().height,
            html:country,
            name:country.id,
            x:(((country.getBoundingClientRect().width/2)+country.getBoundingClientRect().left)*950)/map.getBoundingClientRect().width,
            y:(((country.getBoundingClientRect().height/2)+country.getBoundingClientRect().top)*620)/map.getBoundingClientRect().height
            });

            alert("prueba1")
            countries[country.id].html.onpointerdown = function(event){
                event.preventDefault();
                countries[event.target.id].setPatientZero();
                event.target.classList.add("clicked");
                document.getElementById("click").style.display="none";
                alert("prueba2")
            };
            
            countries[country.id].html.onmouseover = function(event){
                
                document.getElementById("info").innerHTML = event.target.id +" "+ (Math.trunc(countries[event.target.id].getInfection()/2))+"%";
                countryOver = event.target.id;

            
            };
            
            
        }

        
        mainLoop();

    }
});


function mainLoop(){

    infectedColor = getComputedStyle(document.documentElement).getPropertyValue('--infection-color').match("[A-Z0-9]+")[0].match(/[A-Z0-9]{2}/g).map(e=>parseInt("0x"+e));
    countryColor = getComputedStyle(document.documentElement).getPropertyValue('--country-color').match("[A-Z0-9]+")[0].match(/[A-Z0-9]{2}/g).map(e=>parseInt("0x"+e));
    
    setInterval(function(){

        let infected = Object.values(countries).filter((country)=>country.isInfected());

        infected.forEach(i=>i.refreshState(Object.values(countries),connections));

        Object.values(countries).forEach(country => {
              
            let rawColor = countryColor.map((factor,i)=>((country.getInfection()*(infectedColor[i]-factor)/100))+factor);
            country.html.style.fill = "rgb("+rawColor[0]+","+rawColor[1]+","+rawColor[2]+")";
            if(country.getInfection()>=200)country.html.classList.add("dead");
        });

        while(connections._order.length>Object.values(countries).filter((element)=>element.getInfection()>0 && element.getInfection()<100).length){
            map.removeChild(connections._order[0]);
            connections._order[0]=undefined;
            connections._order.shift();
        }

        document.getElementById("info").innerHTML = countryOver +" "+ (Math.trunc(countries[countryOver].getInfection()/2))+"%";

    },500)
}