import { Vector2 , BoxGeometry, MeshStandardMaterial, Mesh}  from 'three';
import { Camera } from './camera.js'; 

let mouse = new Vector2(0,0);
let objects = [];

function onMouseClick(event) {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (intersects.length > 0) {
        let point = intersects[0].point;
        addCube(point.x, point.y, point.z);
    }
}

function addCube(scene, finalPosition) {
    let geometry = new BoxGeometry(2, 2, 2);
    let material = new MeshStandardMaterial({ color: Math.random() * 0xffffff });
    let cube = new Mesh(geometry, material);
    
    cube.position.set(Math.round(finalPosition.x / 2) * 2, 1, Math.round(finalPosition.z / 2) * 2);
    scene.add(cube);
    objects.push(cube);
}