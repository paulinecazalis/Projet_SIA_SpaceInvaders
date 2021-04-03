import Alien from "./alien.js"
import Menu from "./menu.js";
import PlayerClass from "./player.js";

export default class NewGame{


    static async loadNewGame(scene, aliens, bunkObject){
        NewGame.loadNewAlien(scene, aliens);
        NewGame.loadNewBunker(scene, bunkObject);
    }

    static async loadNewAlien(scene, aliens){
        await Alien.createAlien(6, 30).then((value) => {
            aliens = value;
            scene.add(value);
        });
    }

    static async loadNewBunker(scene, bunkObject){
        await PlayerClass.createBunker().then((value) => {
            bunkObject = value;
            scene.add(value);
        })
    }
}