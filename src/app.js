import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { init, gl, scene, camera, controls } from './init/init';

import vertexShader from './shaders/vertex.js';
import fragmentShader from './shaders/fragment.js';
import { GUI } from './init/lil-gui.module.min';
import './style.css';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

init();

let gui = new GUI();

const torus = new THREE.Mesh(
  new THREE.SphereGeometry(1, 100, 100),
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uDisplace: { value: 2 },
      uSpread: { value: 1.2 },
      uNoise: { value: 16 },
    },
  })
);

scene.add(torus);

let composer = new EffectComposer(gl);
composer.addPass(new RenderPass(scene, camera));

gui
  .add(torus.material.uniforms.uDisplace, 'value', 0, 2, 0.1)
  .name('displacemnt');
gui.add(torus.material.uniforms.uSpread, 'value', 0, 2, 0.1).name('spread');
gui.add(torus.material.uniforms.uNoise, 'value', 10, 25, 0.1).name('noise');


const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.4,
  0.0001,
  0.01
);

composer.addPass(bloomPass);

const clock = new THREE.Clock();

// var sphere_geometry = new THREE.SphereGeometry(1, 10, 10);
// var material = new THREE.MeshBasicMaterial();
// var sphere = new THREE.Mesh(sphere_geometry, material);
// scene.add(sphere);

let animate = () => {
  const elapsedTime = clock.getElapsedTime();
  torus.material.uniforms.uTime.value = elapsedTime;
  torus.rotation.z = Math.sin(elapsedTime) / 4 + elapsedTime / 20 + 5;
  composer.render();
  controls.update();
  // torus.x = x + 0.1;
  requestAnimationFrame(animate);
};
animate();
