import * as THREE from '../lib/node_modules/three/build/three.module.js';

export default class Sound{

    // create an AudioListener and add it to the camera
    static listener = new THREE.AudioListener();
    //camera.add( listener );

    // create a global audio source
    static sound = new THREE.Audio( Sound.listener );

    // load a sound and set it as the Audio object's buffer
    static audioLoad = new THREE.AudioLoader();

    static audioLoader = () =>{
        Sound.audioLoad.load( '../src/medias/sounds/ac_nh.mp3', function( buffer ) {
            Sound.sound.setBuffer( buffer );
            Sound.sound.setLoop( true );
            Sound.sound.setVolume( 0.2 );
            Sound.sound.play();
        });
    }

    static volumeMusic = () =>{
        document.getElementById('volume-on').onclick = function(){
            if(Sound.sound.isPlaying){
                document.getElementById('volume-on').className = 'fas fa-volume-mute';
                Sound.sound.pause();
            }else{
                document.getElementById('volume-on').className ='fas fa-volume';
                Sound.sound.play();
            }
        }
    }




}
