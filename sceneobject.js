import { Mesh } from "three";

export class SceneObject {
    constructor(parent, id, position, orientation) {
        this.__parentScene = parent
        this.__id = id;
        this.__position = position;
        this.__orientation = orientation;
        this.__linkedMesh = null
    }

    //set both this object's position and the linked mesh's position to the new position
    setPosition(newPos) {
        this.__position = newPos
        this.__linkedMesh.position.copy(newPos)
    }

    setOrientation(newOri) {
        this.__orientation = newOri
        this.__linkedMesh.orientation = newOri
    }

    remove() {
        let mesh = this.__linkedMesh
        //stop rendering the mesh
        this.__parentScene.remove(mesh)

        //remove mesh
        if (mesh.geometry) {
            mesh.geometry.dispose();
          }


    }

}