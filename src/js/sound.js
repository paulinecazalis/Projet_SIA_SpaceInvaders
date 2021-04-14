import * as THREE from '../lib/node_modules/three/build/three.module.js';

export default class Sound{

    // create an AudioListener and add it to the camera
    static listener = new THREE.AudioListener();
    //camera.add( listener );

    // create a global audio source
    static sound = new THREE.Audio( Sound.listener );
    static audioLives = new THREE.Audio( Sound.listener );
    static audioAliens = new THREE.Audio( Sound.listener );

    // load a sound and set it as the Audio object's buffer
    static audioLoad = new THREE.AudioLoader();

    static boolSound = false;


    static audioLoader = () =>{
        Sound.audioLoad.load( '../src/medias/sounds/ac_nh.mp3', function( buffer ) {
            Sound.sound.setBuffer( buffer );
            Sound.sound.setLoop( true );
            Sound.sound.setVolume( 0.1 );
            Sound.sound.play();
        });
    }

    static volumeMusic = () =>{
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

    static livesSound = (spaceship) =>{
        Sound.audioLoad.load( '../src/medias/sounds/lives.mp3', function( buffer ) {
		    Sound.audioLives.setBuffer( buffer );
			spaceship.add( Sound.audioLives );
            Sound.audioLives.setVolume( 0.2 );
            Sound.audioLives.play();
        });
    }

    static alienSound = (alien) =>{
        Sound.audioLoad.load( '../src/medias/sounds/sound.wav', function( buffer ) {
		    Sound.audioAliens.setBuffer( buffer );
			alien.add( Sound.audioAliens );
            Sound.audioAliens.setVolume( 0.2 );
            Sound.audioAliens.play();
        });
    }

    static volumeSound = () =>{
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






}