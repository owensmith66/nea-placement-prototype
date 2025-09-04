// Import Vector3, and the PerspectiveCamera from three.js which is responsible for actually rendering the scenes
import {Vector3, PerspectiveCamera} from "three";

export class Camera {
	
    constructor() {
	// Creates a camera object with these attributes
        this.__renderer = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.__cameraPosition = new Vector3(0,10,20)
        this.__cameraOrientation = new Vector3(0,0,0)
        this.__movementSpeed = 1

	// Tells the renderer where to render from
        this.__renderer.position.setFromVector3(this.__cameraPosition)
    }


// Private method to update the position of the camera and renderer
    __setCameraPosition(newPos) {
        this.__cameraPosition = newPos

        this.__renderer.position.setFromVector3(this.__cameraPosition)
    }
// Private method to update the orientation of the caemra and the renderer
    __setCameraOrientation(newOri) {
        this.__cameraOrientation = newOri

        this.__renderer.rotation.setFromVector3(cameraRotation)
    }
	
// Public method to move the camera
    moveCamera(keysDown) {
	    // Default Vector3 with 0 in all directions - if no buttons are pressed, no movement should happen
        let movementDirection = new Vector3(0,0,0)

	    // Defines all the directions which each key should cause the camera to move in
        let directions = {
	        W: new Vector3(0,0,1),
	        S: new Vector3(0,0,-1),
	        A: new Vector3(-1,0,0),
	        D: new Vector3(1,0,0),
	        Q: new Vector3(0,-1,0),
	        E: new Vector3(0,1,0),
        }

	    // Loop through all keys in the dictionary - if there is a key present in both this and keysDown, add the corresponding Vector3 onto the movementDirection
        for (let key in directions) {
            if (keysDown[key]) {
                movementDirection = movementDirection + directions[key]
            }
        }

	    // Add this new direction to where the camera already was
        let newPosition = this.__cameraPosition + movementDirection

	    // Call the private method to update position
        this.__setCameraPosition(newPosition)

    }

// Public method to rotate the camera
    rotateCamera(mouseDelta) {
        let rotationDelta = new Vector3(
            - (mouseDelta.y), // Moving the mouse along the screen's x-axis should change the y-orientation (which acts in the plane perpendicular to the y axis)
            mouseDelta.x, // Same applies for x-axis
            0 // We don't want any z-rotation as this could cause the camera to flip upside down
        )

        newOrientation = this.__cameraOrientation + rotationDelta

        this.__setCameraOrientation(newOrientation)
    }
}
