import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/OBJLoader.js";
import { TextureLoader } from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { ARButton } from 'https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js';

// Create a Three.js Scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10; // Adjusted camera distance for better visibility of the scaled model

// Create a renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.getElementById("container3D").appendChild(renderer.domElement);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5); // Ambient light with increased intensity
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Brighter directional light
directionalLight.position.set(10, 10, 10).normalize();
scene.add(directionalLight);

const textureLoader = new TextureLoader();
const texture = textureLoader.load('model/texture_2.png'); // Replace with your texture file path

// Instantiate OBJLoader
const loader = new OBJLoader();

// Define the model to load
const objToRender = 'model/3D_model.obj'; // Path to your OBJ file

// Load the model
loader.load(
    objToRender, 
    function (object) { 
        object.traverse(function (child) {
            if (child.isMesh) {
                child.material.map = texture; // Apply the texture
                child.geometry.computeBoundingSphere(); // Ensure bounding sphere is computed
                child.geometry.computeBoundingBox();   // Optionally compute bounding box as well
            }
        });

        object.scale.set(3, 4, 3); // Scale adjustments
        object.position.set(0, -2, 0); // Position adjustments
        
        scene.add(object);
        console.log('Model loaded:', object);
    },
    function (xhr) { 
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) { 
      console.error('Error loading OBJ model:', error);
    }
);

document.body.appendChild(ARButton.createButton(renderer));
// Setup OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// Render function
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Update controls
  renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();
