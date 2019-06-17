const MAX_DIST = 150;

class Country{


    constructor(data={size:0,html:null,name:null,x:0,y:0,wealth:0,population:0}){

        this.size = data.size;
        this.html = data.html;
        this.name = data.name;
        this.x = data.x;
        this.y = data.y;
        this._wealth = data.wealth;
        this._population = data.population;
        this._infection = 0;

    }

    getInfected(n){
        this._infection = this._infection>=200 ? 200: this._infection+n;
    }

    getInfection(){
        return this._infection;
    }
    setPatientZero(){
        if(this._infection==0)
            this._infection = 1;
    }

    isInfected(){
        return this._infection != 0;
    }

    refreshState(countries,connections){
        
        if(this._infection>0 && this._infection<200){
            countries.forEach(country=>{
                if(Math.random()>(d(this,country)/MAX_DIST) && Math.random()<((2*this._infection)+this.size)/270000 && country.name!=this.name && country.getInfection()<100){
                    country.getInfected(0.1);
                    connections.getConnection(this,country);
                }
            })

            this._infection = this._infection>=200 ? 200: this._infection+ (0.5*(4-(this.size*4/200000)));
        }

    }

}

function d(country1,country2){
    return Math.sqrt(Math.pow(country1.x-country2.x,2)+Math.pow(country1.y-country2.y,2));
}