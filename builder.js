import { Vector2 , BoxGeometry, Mesh, Vector3}  from 'three';
import { Furniture } from './furniture.js';
import { Wall } from './wall.js';

export class Builder {
   
    constructor(scene, linkedCamera) {
        this.__scene = scene;
        this.__linkedCamera = linkedCamera;
        this.__objects = [];
        this.__mouse = new Vector2(0, 0);

        this.__wallNode = null

        this.__currentPlacementMode = "f"
        this.__currentFurniture = "misc/cube";

        // bind the onmouseclick function to the mouse being clicked
        window.addEventListener('click', this.__onMouseClick.bind(this)); //need to use .bind so this still refers to Builder
        this.__initialiseFurnitureButtons();
    }

    __onMouseClick(event) {

        

    // Convert mouse position to normalized device coordinates (-1 to +1)
    this.__mouse = new Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    )
    

    let rayCastResult = this.__linkedCamera.castRay(this.__mouse);
    console.log(this.__currentPlacementMode, (this.__currentPlacementMode == "w"))
    if (this.__currentPlacementMode == "f") { //if we are placing furniture
        if (rayCastResult) {
            let newFurniture = new Furniture(this.__scene, "placeholderID", this.__currentFurniture, rayCastResult)
        }
    }

    else if (this.__currentPlacementMode == "w") { //placing wall
            if (rayCastResult) {
                if (this.__wallNode != null) { //if this is the second click of this wall mode
                    let newWall = new Wall(rayCastResult, this.__wallNode, 1, 5, this.__scene)    
                    this.__wallNode = null   //reset for next wall
                }
                else {
                    this.__wallNode = rayCastResult //store first click position
                }
                
            }
        }
    
    
    
}

    __initialiseFurnitureButtons() {

        //get all buttons tagged as a furniture-button
        let buttons = document.querySelectorAll('.furniture-button');
        for (let button of buttons) {

            // wait for a click on any of them
            button.addEventListener('click', (event) => {

                this.__currentPlacementMode = "f"

                // set the current furniture type to the name of the button
                this.__currentFurniture = event.currentTarget.dataset.parentfolder+"/"+event.currentTarget.name;

            })};

            let wallButton = document.querySelector(".wall-button")
            wallButton.addEventListener("click", (event) => {
                this.__currentPlacementMode = "w"

            })
            
    }

}