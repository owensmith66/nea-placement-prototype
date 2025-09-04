import {Vector2, Scene, WebGLRenderer, PlaneGeometry} from "three";
import {Camera} from "./camera";

let keysDown = []
let mouseDelta = new Vector2(0,0)

testCamera = new Camera()
scene = new Scene()

function keyDown(event) {
    keysDown[event.key] = true
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



renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

planeGeometry = new THREE.PlaneGeometry(50, 50)
plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = -Math.PI / 2
scene.add(plane)


function animate() {
    renderer.render(scene, camera.getCameraObject());
    requestAnimationFrame(animate);
}

animate()
