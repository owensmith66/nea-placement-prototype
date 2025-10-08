import { Vector2 , BoxGeometry, Mesh}  from 'three';
import { Furniture } from './furniture.js';

export class Builder {
   
    constructor(scene, linkedCamera) {
        this.__scene = scene;
        this.__linkedCamera = linkedCamera;
        this.__objects = [];
        this.__mouse = new Vector2(0, 0);

        this.__currentFurniture = "./models/misc/cube.glb";

        // bind the onmouseclick function to the mouse being clicked
        window.addEventListener('click', this.__onMouseClick.bind(this));
        this.__initialiseFurnitureButtons();
    }

    __onMouseClick(event) {

    // Convert mouse position to normalized device coordinates (-1 to +1)
    this.__mouse = new Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    )
    

    let rayCastResult = this.__linkedCamera.castRay(this.__mouse);
    if (rayCastResult) {
        let newFurniture = new Furniture(this.__scene, "placeholderID", this.__currentFurniture, rayCastResult)
    }
    
}


    __initialiseFurnitureButtons() {

        //get all buttons tagged as a furniture-button
        let buttons = document.querySelectorAll('.furniture-button');
        for (let button of buttons) {

            // wait for a click on any of them
            button.addEventListener('click', (event) => {

                // set the current furniture type to the name of the button
                this.__currentFurniture = event.currentTarget.dataset.parentfolder+"/"+event.currentTarget.name;

            })};
    }

    

}