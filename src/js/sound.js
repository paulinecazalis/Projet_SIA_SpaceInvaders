import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.js';

/*-------------Class pour la gestion des sons -----------*/
export default class Sound{
    static listener = new THREE.AudioListener(); //représente une ecoute virtuelle pour les sons
    static sound = new THREE.Audio( Sound.listener ); //Variable pour le son du jeu
    static audioLives = new THREE.Audio( Sound.listener ); //Variable pour le son du joueur
    static audioAliens = new THREE.Audio( Sound.listener ); //Variable pour le son des aliens
    static audioLoad = new THREE.AudioLoader(); //Permet de charger le son dans le jeu
    static boolSound = false;

    //Permet de charger la musique du jeu
    static audioLoader = () =>{
        Sound.audioLoad.load( '../src/medias/sounds/ac_nh.mp3', function( buffer ) {
            Sound.sound.setBuffer( buffer );
            Sound.sound.setLoop( true );
            Sound.sound.setVolume( 0.3 );
            Sound.sliderVolume();
            Sound.sound.play();
        });
    }

    //Permet d'activer ou de désactiver le son du jeu
    //Activation et désactivation dans le menu principal ou dans le jeu
    static volumeMusic = () =>{
        //Dans le menu principal
        document.getElementById('volume-on').onclick = function(){
            if(Sound.sound.isPlaying){
                document.getElementById('volume-on').className = 'fas fa-volume-mute';
                document.getElementById('volume-on-game').className = 'fas fa-volume-mute';
                Sound.sound.pause();
            }else{
                document.getElementById('volume-on').className ='fas fa-volume';
                document.getElementById('volume-on-game').className ='fas fa-volume';
                Sound.sound.play();
            }
        }
        //Dans le jeu
        document.getElementById('volume-on-game').onclick = function(){
            if(Sound.sound.isPlaying){
                document.getElementById('volume-on-game').className = 'fas fa-volume-mute';
                document.getElementById('volume-on').className = 'fas fa-volume-mute';
                Sound.sound.pause();
            }else{
                document.getElementById('volume-on-game').className ='fas fa-volume';
                document.getElementById('volume-on').className ='fas fa-volume';
                Sound.sound.play();
            }
        }
    }

    //Permet de charger le son du joueur
    static livesSound = (spaceship) =>{
        Sound.audioLoad.load( '../src/medias/sounds/lives.mp3', function( buffer ) {
		    Sound.audioLives.setBuffer( buffer );
			spaceship.add( Sound.audioLives );
            Sound.sliderVolumeLives();
            Sound.audioLives.play();
            setTimeout(() => {
                spaceship.remove(Sound.audioLives);
            }, 500);
        });
    }

    //Permet de charger le son des aliens
    static alienSound = (alien) =>{
        Sound.audioLoad.load( '../src/medias/sounds/alien.wav', function( buffer ) {
		    Sound.audioAliens.setBuffer( buffer );
			alien.add( Sound.audioAliens );
            Sound.sliderVolumeAlien();
            Sound.audioAliens.play();
            setTimeout(() => {
                alien.remove(Sound.audioAliens);
            }, 500);
        });
    }

     //Permet d'activer ou de désactiver le son des aliens et du joueur
    //Activation et désactivation dans le menu principal ou dans le jeu
    static volumeSound = () =>{
        //Dans le jeu
        document.getElementById('music-on-game').onclick = function(){
            Sound.boolSound = !Sound.boolSound;
            if(Sound.boolSound){
                Sound.audioAliens.pause();
                Sound.audioLives.pause();
                document.getElementById('music-on-game').className = 'fas fa-music-slash';
                document.getElementById('music-on').className = 'fas fa-music-slash';
            }else{
                document.getElementById('music-on-game').className ='fas fa-music';
                document.getElementById('music-on').className ='fas fa-music';
            }
        }
        //Dans le menu principal
        document.getElementById('music-on').onclick = function(){
            Sound.boolSound = !Sound.boolSound;
            if(Sound.boolSound){
                Sound.audioAliens.pause();
                Sound.audioLives.pause();
                document.getElementById('music-on').className = 'fas fa-music-slash';
                document.getElementById('music-on-game').className = 'fas fa-music-slash';
            }else{
                document.getElementById('music-on').className ='fas fa-music';
                document.getElementById('music-on-game').className ='fas fa-music';
            }
        }
    }

    //Permet de gérer le son du jeu
    //Disponible dans le menu option (menu principal)
    static sliderVolume = () =>{
        let slider = document.getElementById('option-sound');
        slider.value = 50;
        slider.addEventListener('mousemove', () =>{
            var x = slider.value;
            var color = 'linear-gradient(90deg, rgb(117,252,117)' + x + '%, rgb(214,214,214)' + x + '%)';
            slider.style.background = color;
            if(x >= 1 && x <= 20){
                Sound.sound.setVolume( 0.05 );
            }else if(x > 21 && x <= 40){
                Sound.sound.setVolume( 0.2 );
            }else if(x > 41 && x <= 60){
                Sound.sound.setVolume( 0.3 );
            }else if(x > 61 && x <= 80){
                Sound.sound.setVolume( 0.4 );
            }else if(x > 81 && x <= 100){
                Sound.sound.setVolume( 0.5 );
            }
        })
    }

    //Permet de gérer le son des aliens 
    //Disponible dans le menu option (menu principal)
    static sliderVolumeAlien = () => {
        let slider = document.getElementById('option-sound-alien');
        slider.value = 70;
        slider.addEventListener('mousemove', () =>{
            var x = slider.value;
            var color = 'linear-gradient(90deg, rgb(117,252,117)' + x + '%, rgb(214,214,214)' + x + '%)';
            slider.style.background = color;
            if(x >= 1 && x <= 20){
                Sound.audioAliens.setVolume( 0.1 );
            }else if(x > 21 && x <= 40){
                Sound.audioAliens.setVolume( 0.2 );
            }else if(x > 41 && x <= 60){
                Sound.audioAliens.setVolume( 0.4 );
            }else if(x > 61 && x <= 80){
                Sound.audioAliens.setVolume( 0.8 );
            }else if(x > 81 && x <= 100){
                Sound.audioAliens.setVolume( 1 );
            }
        })
    }

    //Permet de gérer le son du joueur
    //Disponible dans le menu option (menu principal)
    static sliderVolumeLives = () => {
        let slider = document.getElementById('option-sound-lives');
        slider.value = 70;
        slider.addEventListener('mousemove', () =>{
            var x = slider.value;
            var color = 'linear-gradient(90deg, rgb(117,252,117)' + x + '%, rgb(214,214,214)' + x + '%)';
            slider.style.background = color;
            if(x >= 1 && x <= 20){
                Sound.audioLives.setVolume( 0.1 );
            }else if(x > 21 && x <= 40){
                Sound.audioLives.setVolume( 0.2 );
            }else if(x > 41 && x <= 60){
                Sound.audioLives.setVolume( 0.4 );
            }else if(x > 61 && x <= 80){
                Sound.audioLives.setVolume( 0.8 );
            }else if(x > 81 && x <= 100){
                Sound.audioLives.setVolume( 1 );
            }
        })
    }






}
