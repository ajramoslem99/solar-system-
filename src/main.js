import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

class App {
  #scene;
  #camera;
  #renderer;
  #orbits;
  #clock = new THREE.Clock(true);

  constructor() {
    window.addEventListener("resize", () => {
      this.#onWidowsResize();
    });
  }

  setUp() {
    this.#scene = new THREE.Scene();
    this.#renderer = new THREE.WebGLRenderer();
    this.#renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.#renderer.domElement);

    const aspect = window.innerWidth / window.innerHeight;
    this.#camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
    this.#camera.position.set(0, 0, 100);

    this.#orbits = new OrbitControls(
      this.#camera,
      this.#renderer.domElement,
    );
    this.#orbits.enableDamping = true;
    this.#orbits.target.set(0, 0, 0);
    this.#orbits.update();
    this.createCube();
    this.#RAF();
  }

  createCube() {
    const cubeGeo = new THREE.BoxGeometry(32, 32, 32);
    const cubeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xffff00),
      wireframe: true,
    });

    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    this.#scene.add(cube);
  }

  #RAF() {
    requestAnimationFrame(() => {
      const deltaTime = this.#clock.getDelta();
      this.#update(deltaTime);
      this.#render();
      this.#RAF();
    });
  }

  #update(deltaTime) {
    this.#orbits.update();
  }
  #render() {
    this.#renderer.render(this.#scene, this.#camera);
  }

  #onWidowsResize() {}
}

const app = new App();
console.log(app);
app.setUp();
