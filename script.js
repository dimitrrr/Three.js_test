import {
  OrbitControls
} from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js'

//get form elements
let button = document.querySelector('.btnCreate');
button.disabled = true;

let geometryInput = document.querySelector('[name=geometry]');
let scaleInput = document.querySelector('[name=scale]');

let geometryList = document.querySelector('.geometryList');

//scene creation
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111);

//camera creation
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(20, 20, 20);

//render
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

//plane
const planeSize = 40;

const loader = new THREE.TextureLoader();
const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);

const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshPhongMaterial({
  map: texture,
  side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.x = Math.PI * -.5;
scene.add(mesh);

//light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.castShadow = true;
light.position.set(0, 5, 0);
light.target.position.set(-4, 0, -4);
scene.add(light);
scene.add(light.target);

//geometry
button.onclick = (event) => {
  event.preventDefault();
  createGeometry();
}

function createGeometry() {
  let scale = +scaleInput.value;

  let geometry;

  switch (geometryInput.value) {
    case 'cube':
      geometry = new THREE.BoxGeometry();
      break;
    case 'cone':
      geometry = new THREE.ConeGeometry();
      break;
    case 'sphere':
      geometry = new THREE.SphereGeometry();
      break;
    case 'octahedron':
      geometry = new THREE.OctahedronGeometry();
      break;
    case 'torus':
      geometry = new THREE.TorusGeometry();
      break;
    case 'torusKnot':
      geometry = new THREE.TorusKnotGeometry();
      break;
    default:
      break;
  }

  let material = new THREE.MeshPhongMaterial({
    color: '#CA8'
  });
  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...randomCoords());
  mesh.scale.set(scale, scale, scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);

  let divUuid = document.createElement('div');
  divUuid.classList.add('geometry');
  divUuid.innerHTML = `<div class='uuid'>${mesh.uuid}</div>\n
                      <div class='cross'></div>`;
  geometryList.appendChild(divUuid);

  divUuid.addEventListener('click', function (event) {
    if (!event.target.classList.contains('cross')) return;
    removeGeometry(mesh.uuid);
    geometryList.removeChild(this);
  }, false);

  function removeGeometry(id) {
    const object = scene.getObjectByProperty('uuid', id);

    object.geometry.dispose();
    object.material.dispose();
    scene.remove(object);
  }
}

//full screen scene with every screen size
window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight)
}

//rerender
animate();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

//additional
function randomCoords() {
  let res = [];
  let x = randomInteger(-planeSize / 2, planeSize / 2);
  let y = randomInteger(1, 10);
  let z = randomInteger(-planeSize / 2, planeSize / 2);
  res.push(x, y, z);
  return res;
}

function randomInteger(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

geometryInput.addEventListener('change', checkInput, false);
scaleInput.addEventListener('input', checkInput, false);

function checkInput() {
  button.disabled = geometryInput.value === '' || scaleInput.value === '';
}