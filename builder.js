import { Vector2 , BoxGeometry, Mesh}  from 'three';

export class Builder {
   
    constructor(scene, linkedCamera) {
        this.__scene = scene;
        this.__linkedCamera = linkedCamera;
        this.__objects = [];
        this.__mouse = new Vector2(0, 0);

        this.__currentFurniture = "cube";

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
        console.log("Raycast hit at: ", rayCastResult);
        this.__addCube(this.__scene, rayCastResult);
    }
    
}

    __addCube(scene, finalPosition) {
        let geometry = new BoxGeometry(2, 2, 2);
        let cube = new Mesh(geometry);
    
    //cube.position.set(Math.round(finalPosition.x / 2) * 2, 1, Math.round(finalPosition.z / 2) * 2);
        cube.position.copy(finalPosition);
        this.__scene.add(cube);
        this.__objects.push(cube);
    }

    __initialiseFurnitureButtons() {

        //get all buttons tagged as a furniture-button
        let buttons = document.querySelectorAll('.furniture-button');
        for (let button of buttons) {

            // wait for a click on any of them
            button.addEventListener('click', (event) => {

                // set the current furniture type to the name of the button
                this.__currentFurniture = event.target.name;
            })};
    }
    
    

}