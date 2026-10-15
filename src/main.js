import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

class App {
  #scene = null;
  #camera = null;
  #renderer = null;
  #cameraOrbits = null;
  #orbits = [];
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
    this.#camera.position.set(0, 0, 200);

    this.#cameraOrbits = new OrbitControls(
      this.#camera,
      this.#renderer.domElement,
    );
    this.#cameraOrbits.enableDamping = true;
    this.#cameraOrbits.target.set(0, 0, 60);
    this.#cameraOrbits.update();
    //this.createCube();
    this.#createSolarSystem([
      {
        name: "earth",
        size: 5,
        color: new THREE.Color(0x0000ff),
        distance: 60,
        speed: 1,
        moons: [
          {
            name: "moon",
            size: 1,
            distance: 8,
            color: new THREE.Color(0xcccccc),
            speed: 2,
          },
        ],
      },
      {
        name: "mars",
        size: 3,
        color: new THREE.Color(0xff0000),
        distance: 100,
        speed: 0.5,
        moons: [
          {
            name: "moon",
            size: 1,
            distance: 8,
            color: new THREE.Color(0xcccccc),
            speed: 2,
          },
          {
            name: "moon",
            size: 1,
            distance: 14,
            color: new THREE.Color(0x00cc00),
            speed: 3,
          },
        ],
      },
    ]);
    this.#RAF();
  }

  #createSolarSystem(planets) {
    // create Sun Geometry
    const sunGeo = new THREE.SphereGeometry(40, 32, 32);

    // create Sun Material (just a simple color)
    const sunMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xffff00),
    });
    // create the Sun Mesh
    const sun = new THREE.Mesh(sunGeo, sunMat);

    // add sun to the scene
    this.#scene.add(sun);

    // inside this loop we will create all the planent
    // orbiting around the sun
    /*
    planets : 
    {name: "earth", 
    size: 8, 
    distance: 30, 
    color: new Color(0xFF0000),
    moons: [
    {name: "moon", size: 1, distance: 20, color: new Color(0xFFFFF)
    
    ]
    
    */
    for (let i = 0; i < planets.length; i++) {
      const planetData = planets[i];
      const planetGeo = new THREE.SphereGeometry(planetData.size, 32, 32);
      const planetMat = new THREE.MeshBasicMaterial({
        color: planetData.color,
      });
      const planet = new THREE.Mesh(planetGeo, planetMat);
      planet.position.set(planetData.distance, 0, 0);
      const planetOrbit = new THREE.Group();
      planetOrbit.add(planet);

      for (let j = 0; j < planets[i].moons.length; j++) {
        const moonData = planets[i].moons[j];
        const moonGeo = new THREE.SphereGeometry(moonData.size, 32, 32);
        const moonMat = new THREE.MeshBasicMaterial({
          color: moonData.color,
        });

        const moon = new THREE.Mesh(moonGeo, moonMat);
        moon.position.set(moonData.distance, 0, 0);
        const moonOrbit = new THREE.Group();
        planet.add(moonOrbit)
        moonOrbit.add(moon);
        this.#orbits.push({
          target: moonOrbit,
          speed: moonData.speed,
        });
      }


      this.#orbits.push({
        target: planetOrbit,
        speed: planetData.speed,
      });

      sun.add(planetOrbit);
    }
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
    this.#cameraOrbits.update();

    for (let i = 0; i < this.#orbits.length; i++) {
      this.#orbits[i].target.rotateY(deltaTime * this.#orbits[i].speed);
    }
  }
  #render() {
    this.#renderer.render(this.#scene, this.#camera);
  }

  #onWidowsResize() {
    const canvas = this.#renderer.domElement;
    const dpr = window.devicePixelRatio;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const aspect = w / h;

    canvas.width = w + "px";
    canvas.height = h + "px";

    this.#renderer.setSize(w * dpr, h * dpr);
    this.#camera.aspect = aspect;
    this.#camera.updateProjectionMatrix();
  }
}

const app = new App();
app.setUp();
