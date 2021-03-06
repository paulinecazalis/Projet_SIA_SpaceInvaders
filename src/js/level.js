export default class Level{
    
    static level = 1;
    static vitesseAliens = 0.05;
    static vitesseMissileAlien = 0.1;
    static levelActive = true;
    static scoreTotal = 0;
    

    static isActive = () => {
        return Level.levelActive;
    }

    static setActive = (bool) => {
        Level.levelActive = bool;
    }

    static changementLevel = (level) =>{
        Level.createTransition("Level " + level, 3000);
        Level.vitesseAliens = level/20;
        Level.vitesseMissileAlien = level/10;
        
    }

    static createTransition = (text, duration) => {
        document.getElementById('title-trans').innerHTML = text;
        document.getElementById('trans').id = "trans";
        document.getElementById('trans').style.display = "block";
        if(duration > 0){
            setTimeout(() => {
                document.getElementById('trans').style.display = "none";
                Level.setActive(false);
            }, duration);
        }
    }




}

//changement de niveau : vitesse des aliens qui augmente, level qui change (level 1 devient level 2), ia , vitesse missile

//Faire : 
// - tableau de tableau pour les différentes positions des aliens avec les niveaux
// - si level = 3 prendre tel tableau, mettre position de chaque alien en paramètre fonction create alien