import Menu from "./menu.js";
import NewGame from "./newGame.js";

export default class Level{
    
    static level = 1;
    static vitesseAliens = 0.05;
    static vitesseMissileAlien = 0.1;
    static levelActive = true;
    static scoreTotal = 0;
    static partieFinie = false;
    

    static isActive = () => {
        return Level.levelActive;
    }

    static setActive = (bool) => {
        Level.levelActive = bool;
    }

    static isPartieActive = () =>{
        return Level.partieFinie;
    }

    static setPartieActive = (bool) =>{
        Level.partieFinie = bool;
    }

    static changementLevel = (level) =>{
        Level.createTransition("Level " + level, 3000);
        Level.vitesseAliens = level/20;
        Level.vitesseMissileAlien = level/10;
        
    }

    static createTransition = (text, duration) => {
        document.getElementById('title-trans').innerHTML = text;
        //document.getElementById('trans').id = "trans";
        document.getElementById('trans').style.display = "block";
        if(duration > 0){
            setTimeout(() => {
                document.getElementById('trans').style.display = "none";
                Level.setActive(false);
            }, duration);
        }
    }

    static menuLevel = () =>{
        document.getElementById('life1').innerHTML = " <img src='../src/medias/images/apple.png'>"
        document.getElementById('life2').innerHTML = " <img src='../src/medias/images/apple.png'>"
        document.getElementById('life3').innerHTML = " <img src='../src/medias/images/apple.png'>"
    }

    static removeLives = (nbLives) =>{
        nbLives == 2 ? document.getElementById('life3').style.visibility = 'hidden' : nbLives == 1 ? document.getElementById('life2').style.visibility = 'hidden' : document.getElementById('life1').style.visibility = 'hidden'
    }

    static resetLives = () =>{
        document.getElementById('life3').style.visibility = 'visible';
        document.getElementById('life2').style.visibility = 'visible';
        document.getElementById('life1').style.visibility = 'visible';
    }

    static gameOver = (text/*, scene, aliens, bunkObject*/) =>{
        document.getElementById('title-trans').innerHTML = text;
        //document.getElementById('trans').id = "trans";
        document.getElementById('trans').style.display = "block";
        document.getElementById('trans').style.minHeight = "25%";
        var btnMenu = document.createElement('button');
        btnMenu.innerHTML = 'Retour menu';
        btnMenu.id = "return-menu";
        btnMenu.onclick = () =>{
            let menu = new Menu();
            menu.loadMenu();
            document.getElementById('trans').style.display = "none";
            //document.location.reload(); //recharge la page du menu
            //NewGame.loadNewGame(scene, aliens, bunkObject);

        }
        document.getElementById('trans').appendChild(btnMenu);
    }




}
