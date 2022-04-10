import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { back, front, left, right, bottom, top } from '../models';

var socket = io('http://localhost:1235', {transports: ['websocket']});

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, document.getElementById('simArea').offsetWidth / document.getElementById('simArea').offsetHeight, 0.1, 1000);
scene.add(camera);
camera.position.set(-20, 75, 50);

const axesHelper = new THREE.AxesHelper(15);
scene.add(axesHelper);
axesHelper.position.set(0, 0, 0);

const gridHelper = new THREE.GridHelper(50);
scene.add(gridHelper);

const light = new THREE.PointLight(0xffffff, 2, 200);
light.position.set(0, 12, 0);
scene.add(light);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setSize(document.getElementById('simArea').offsetWidth, document.getElementById('simArea').offsetHeight);
window.addEventListener('resize', onResize, false);

document.getElementById('simArea').appendChild(renderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const assetUrl = new URL('../models/airplane.gltf', import.meta.url);
const assetLoader = new GLTFLoader();
var airplane = new THREE.Mesh();
assetLoader.load(assetUrl.href, function(gltf) {
    airplane = gltf.scene;
    scene.add(airplane);
    airplane.position.set(0, 0, 0);
}, undefined, function(error) {
    console.error(error);
});

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    front,
    back,
    top,
    bottom,
    left,
    right,
]);

animate();

function animate(){
    requestAnimationFrame(animate);

    socket.on('test', function(arg1, arg2, arg3){
        document.getElementById('x-axis').innerHTML = "X - " + arg1;
        document.getElementById('y-axis').innerHTML = "Y - " + arg2;
        document.getElementById('z-axis').innerHTML = "Z - " + arg3;
    })

    renderer.render(scene, camera);
}

function onResize() {
    camera.aspect = document.getElementById('simArea').offsetWidth / document.getElementById('simArea').offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(document.getElementById('simArea').offsetWidth, document.getElementById('simArea').offsetHeight);
}