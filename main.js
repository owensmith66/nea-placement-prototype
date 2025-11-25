import {Vector2, WebGLRenderer, PlaneGeometry, Mesh, MeshStandardMaterial, DoubleSide, DirectionalLight} from "three";
import {Camera} from "./camera.js";
import {Builder} from "./builder.js";
import {Scene} from "./scene.js";

let keysDown = []
let mouseDelta = new Vector2(0,0)

let scene = new Scene()
let testCamera = new Camera()
let testBuilder = new Builder(scene, testCamera)


function keyDown(event) {
    keysDown[event.key.toLowerCase()] = true
    testCamera.moveCamera(keysDown)
}

function keyUp(event) {
    keysDown[event.key] = false
    testCamera.moveCamera(keysDown)
}

function mouseMove(event) {

    if (event.buttons === 2) {
        mouseDelta.x = event.movementX;
        mouseDelta.y = event.movementY;

        testCamera.rotateCamera(mouseDelta)
      }

}

window.addEventListener("keydown", keyDown)
window.addEventListener("keyup", keyUp)
window.addEventListener("mousemove", mouseMove)





//initialising a basic three scene to test if camera movement works


let renderer = new WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

let light = new DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

let planeGeometry = new PlaneGeometry(50, 50)
let planeMaterial = new MeshStandardMaterial({ color: 0x777777, side: DoubleSide })
let plane = new Mesh(planeGeometry, planeMaterial)
plane.rotation.x = -Math.PI / 2
scene.add(plane)


function animate() {

    requestAnimationFrame(animate);

    renderer.render(scene.getThreeScene(), testCamera.getRenderer());
    
}

animate()