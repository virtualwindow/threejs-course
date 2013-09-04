/*
@author
Diego Pintos aka @dondiegote
www.thelirios.com
/**/

// const
const G = .15;    
const F = .98;

//var altura = 500;

function Particle(floor){
    // 
    this.floor = floor || 500;
    this.y = floor+10+Math.random()*100;

    this.vy = 0;

    this.altura = 300+Math.random()*400;

    this.active = false;
    this._value = 0;
    this.botes = 0;
    this.maxbotes = 1+Math.random()*3;      // con maxbotes pierde uniformidad
};
Particle.prototype.altura = null;

Particle.prototype.update = function(value) {

    if(!this.active) {
        
        this.vy *= F;
        this.vy -= value;
        if(value<=0) this.vy-=G;
        
    } else {
        
        var fy = this.floor+(this.altura*this._value);
        if(value<=0) value = .01;
        this.vy = (fy-this.y)*.2;   //value;
        if(Math.abs(this.y-fy)<1)  this.active = false;
    }
    
    this.y += this.vy;
    if(this.y<=this.floor) {
        if(value>0 && !this.active && this.botes++>this.maxbotes) {
            this._value = value;
            this.active = true;
            this.botes = 0;
        }
        this.y = this.floor;
        this.vy*=-1;
    }
}
Particle.prototype.bump = function(value) {
        
    var fy = this.floor+(this.altura*1.3*this._value);
    if(value<=0) value = .01;
    this.vy = (fy-this.y)*.4;   //value;
    
    this.y += this.vy;
}