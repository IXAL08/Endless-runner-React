
import './App.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {CSS2DRenderer,CSS2DObject} from 'three/addons/renderers/CSS2DRenderer.js'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

function doThreeJS(){

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  let dModels = 5;
  let oModels = 6;
  let waitTimer = 2;
  var score = localStorage.getItem("Score") ||0;
  let MaxScore = localStorage.getItem("Score2") || 0;
  let isdead = false;
  let hit = false;
  

  //Color fondo
  scene.background = new THREE.Color(0x202020); //new THREE.Color( 'skyblue' );

  //Luz direccional
  const light = new THREE.DirectionalLight(0xffffff,0.6);
  light.position.set(0,4,2);
  scene.add(light);
  light.castShadow=true;
  
  //Luz ambiental
  const ambientLight = new THREE.AmbientLight(0x99aaff,1);
  scene.add(ambientLight);
  
  //controls
  let goingRight = false 
  let goingUp = false
  let ispressed = false;
  document.addEventListener('keydown',(event) => {
    switch (event.code) {
      case 'ArrowLeft':
        goingRight = false;
        ispressed = true;
        if ( background.isPlaying) {
          return;
        }
        else{
          background.play()
        }
        break;
      case 'ArrowRight':
        goingRight=true;
        ispressed = true;
        break;
      case 'ArrowUp':
        goingUp = true;
        ispressed = true;
        break;

      case 'ArrowDown':
        goingUp = false;
        ispressed = true;
        break
      
      default:
        break;
    }
  })

  // document.addEventListener('keyup',(event) => {
  //   switch (event.code) {
  //     case 'ArrowLeft':
  //       ispressed = false;
  //       break;
  //     case 'ArrowRight':
  //       ispressed = false;
  //       break;
  //     case 'ArrowUp':
  //       ispressed = false;
  //       break;

  //     case 'ArrowDown':
  //       ispressed = false;
  //       break
      
  //     default:
  //       break;
  //   }
  // })

  function recargar() {
    location.reload()
  }

  //html
  const htmlRenderer = new CSS2DRenderer();
  htmlRenderer.setSize(window.innerWidth, window.innerHeight);
  htmlRenderer.domElement.style.position = 'absolute';
  htmlRenderer.domElement.style.top = '0px';
  htmlRenderer.domElement.style.pointerEvents = 'none';
  document.body.appendChild(htmlRenderer.domElement)

  const ptool = document.createElement('p');
  const pContainer = document.createElement('div');
  pContainer.className = "Score"
  pContainer.appendChild(ptool);
  const PointLabel = new CSS2DObject(pContainer);
  scene.add(PointLabel)

  const ptool2 = document.createElement('p');
  const pContainer2 = document.createElement('div');
  pContainer2.className = "Score2"
  pContainer2.textContent = "Max Score : " + MaxScore
  pContainer2.appendChild(ptool2);
  const PointLabel2 = new CSS2DObject(pContainer2);
  scene.add(PointLabel2)
  
  //sonidos
  const listener = new THREE.AudioListener();
  camera.add(listener);
  const background = new THREE.Audio(listener)
  const Choque = new THREE.Audio(listener)
  const Risa = new THREE.Audio(listener)
  const audioLoader = new THREE.AudioLoader();

  audioLoader.load('/audio/background.mp3', function(buffer){
    background.setBuffer(buffer);
    background.setLoop(true);
    background.setVolume(0.5);
  })

  audioLoader.load('/audio/Crash.mp3', function(buffer){
    Choque.setBuffer(buffer);
    Choque.setLoop(false);
    Choque.setVolume(1);
  })

  audioLoader.load('/audio/Ibai.mp3', function(buffer){
    Risa.setBuffer(buffer);
    Risa.setLoop(false);
    Risa.setVolume(2);
  })

 

  const renderer = new THREE.WebGLRenderer();
  renderer.toneMapping = THREE.ACESFilmicToneMapping; //opciones aestethic
  renderer.outputColorSpace = THREE.SRGBColorSpace; //opciones aestethic
  renderer.setPixelRatio(window.devicePixelRatio); //opciones aestethic
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  scene.fog = new THREE.Fog(0x000000,0,230)

  const clock = new THREE.Clock();

  const controls = new OrbitControls( camera, renderer.domElement );

  document.body.appendChild( renderer.domElement );
  let model: THREE.Object3D<THREE.Event>;
  let modelAst: THREE.Object3D<THREE.Event>;
  let modelSol: THREE.Object3D<THREE.Event>;
  let clips: THREE.AnimationClip[] =[];
  let mixer: THREE.AnimationMixer | null;
  let ProductoPunto: THREE.Vector3

  const loader = new GLTFLoader();
  loader.load( 'models/Nave/scene.gltf', function ( gltf ) {

    model = gltf.scene;
    model.traverse(function(node){
      if(node.isMesh)
        node.castShadow=true;
    })
    
    model.scale.set(0.01,0.01,0.01);
    clips = gltf.animations;
    
    scene.add( model );

    

  }, undefined, function ( e ) {

    console.error( e );

  });

  loader.load( 'models/Asteroide/asteroide.gltf', function ( gltf ) {

    modelAst = gltf.scene;
    modelAst.traverse(function(node){
      if(node.isMesh)
        node.castShadow=true;
    })
    
    //z = 10 despawn rango: -70 a -150, y = rango: 12 a -4, x = 15 a -15
    //modelAst.position.set(-15,0,0)
    
    //scene.add( modelAst );

    

  }, undefined, function ( e ) {

    console.error( e );

  });

  loader.load( 'models/Sol/Sol.gltf', function ( gltf ) {

    modelSol = gltf.scene;
    modelSol.traverse(function(node){
      if(node.isMesh)
        node.castShadow=true;
    })
    
    //z = 10 despawn rango: -70 a -150, y = rango: 12 a -4, x = 15 a -15
    modelSol.scale.set(6,6,6)
    modelSol.position.set(200,100,-120)
    
    scene.add( modelSol );

    

  }, undefined, function ( e ) {

    console.error( e );

  });



  camera.position.z = 12;
  camera.position.y = 5;
  camera.position.x = 0;

  function GameOver(model:THREE.Object3D<THREE.Event>){
    if(model == null)
      return;

    if (!isdead && (model.position.y >= 15 || model.position.y <= -9 || model.position.x <= -21 || model.position.x >= 21)) {
      isdead= true;
      const Derrota = document.createElement("h1");
      Derrota.textContent = "Perdiste"
      let boton = document.createElement("h2");
      boton.textContent = "Haga click para reiniciar"
      const H1Container = document.createElement('div');
      H1Container.appendChild(Derrota);
      H1Container.appendChild(boton)
      H1Container.className = "Lose"
      const cartel = new CSS2DObject(H1Container);
      if (background.isPlaying) {
        background.stop()
        Risa.play()
      }
      
      addEventListener("click",(e) => {
        recargar();
      })
      scene.add(cartel)
    
    }

  }
  
  
  function UpdatePostion(nave:THREE.Object3D<THREE.Event>, asteroide:THREE.Object3D<THREE.Event>) {
    
    if (nave.position.distanceTo(asteroide.position) < 2) {
      hit = true;
      Choque.play()
    }
  }
  let delta;

  const mixers=[];
  const asteroides:any[] = [];

  function animate() {
    requestAnimationFrame( animate );

    delta = clock.getDelta();
    
    ptool.textContent = "Score: " + score;

    if (goingRight == true && ispressed == true) {
      model.translateX(10 * delta)
    }
    if (goingRight == false && ispressed == true){
      model.translateX(-10 * delta)
    }

    if (goingUp == true && ispressed == true) {
      model.translateY(10 * delta)
    }
    if (goingUp == false && ispressed == true){
      model.translateY(-10 * delta)
    }

    waitTimer-=delta;
    
    if (oModels > 0 && ispressed == true && waitTimer <= 0) {
      oModels--;
      waitTimer = 2;
      const cloneObstaculos = SkeletonUtils.clone(modelAst);
      cloneObstaculos.position.set(Math.floor(Math.random() * (15 - (-15)) + (-15)),Math.floor(Math.random() * (12 - (-4)) + (-4)),Math.floor(Math.random()* ((-70) - (-150)) + (-150)));
      scene.add(cloneObstaculos)
      asteroides.push(cloneObstaculos)
    }

    if (hit == true || isdead == true) {
      model.translateY(-1)
    }
    asteroides.forEach(element => {
      UpdatePostion(model,element)
      element.translateZ(1);
      if (element.position.z >= 10 && isdead == false) {
        element.position.set(Math.floor(Math.random() * (15 - (-15)) + (-15)),Math.floor(Math.random() * (12 - (-4)) + (-4)),Math.floor(Math.random()* ((-70) - (-150)) + (-150)));
        score ++;

        MaxScore = score >= MaxScore ? score : MaxScore;
        localStorage.setItem("Score2",MaxScore);
      }
      
    });

    
    
    GameOver(model);
    if(mixer!=null){
      mixer.update(delta);
    }

    htmlRenderer.render(scene,camera);
    renderer.render( scene, camera );
  }

  

  window.addEventListener( 'resize', onWindowResize, false );
  
  function onWindowResize(){ //funcion para redimensionar ventana si el usuario le anda moviendo
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    htmlRenderer.setSize(window.innerWidth, window.innerHeight);
  }
  

  animate(); //Iniciamos el loop
}





const App = () => {

  return (
    <>
      
      <div className='App'>{doThreeJS()}</div>       
    </>
  )
}

export default App

