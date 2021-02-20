export default class Menu{
    constructor(){
        this._active = true;
        this.buttonEvent();
    }
    isActive = () => {
        return this._active;
    }

    setActive = (bool) => {
        this._active = bool;
    }

    buttonEvent = () => {
        let btn = document.getElementById("button-play")
        btn.onclick = () => {
            this.discardMenu();
        }
    }

    loadMenu = () => {
        this.setActive(true);
        document.getElementById("menu").style.display = "block";
    }

    discardMenu = () => {
        document.getElementById("menu").style.display = "none";
        this.createTransition("Level 1", 3000);
    }

    createTransition = (text, duration) => {
        document.getElementById('title-trans').innerHTML = text;
        document.getElementById('trans').id = "trans";
        document.getElementById('trans').style.display = "block";
        if(duration > 0){
            setTimeout(() => {
                document.getElementById('trans').style.display = "none";
                this.setActive(false);
            }, duration);
        }
      }
}
