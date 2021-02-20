export default class Level{
    constructor(level, vitesseAliens, vitesseMissile){
        this._level = level;
        this._vitesseAliens = vitesseAliens;
        this._vitesseMissile = vitesseMissile;
    }

    changementLevel = () =>{
        this.createTransition(this._level, 3000);
        this._vitesseAliens = this._vitesseAliens + 0.1;
        this._vitesseMissile += 0.1;
    }

    createTransition = (text, duration) => {
        document.getElementById('title-trans').innerHTML = text;
        document.getElementById('trans').id = "trans";
        document.getElementById('trans').style.display = "block";
        if(duration > 0){
            setTimeout(() => {
                document.getElementById('trans').style.display = "none";
            }, duration);
        }
    }

    moveAlien = () => {
        box = new THREE.Box3().setFromObject(aliens);
        if( box.max.x >= 15 || box.min.x <= -15){
          posAlien = !posAlien;
          aliens.position.z -= 1;
          finPartie();
        }
        if(posAlien){
          aliens.position.x += vitesseAliens;
        }else{
          aliens.position.x -= vitesseAliens;
        }
      }


}

//changement de niveau : vitesse des aliens qui augmente, level qui change (level 1 devient level 2), ia , vitesse missile

//Faire : 
// - tableau de tableau pour les différentes positions des aliens avec les niveaux
// - si level = 3 prendre tel tableau, mettre position de chaque alien en paramètre fonction create alien