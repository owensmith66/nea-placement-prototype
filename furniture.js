import { SceneObject } from "./sceneobject.js";
import { MeshLoader } from "./meshLoader.js";
import { Vector3 } from "three"


let loader = new MeshLoader();

export class Furniture extends SceneObject {
    constructor(parent, id, name, position, orientation, test = false) {
        super(parent, id)
        this.__furnitureName = name
        this.__position = position
        this.__orientation = orientation

        this.__linkedMesh = null


    }


    async load() {
        try {
            this.__linkedMesh = await loader.loadMesh(this.__furnitureName)

            let height = loader.getMeshHeight(this.__linkedMesh)

            let position = new Vector3(this.__position.x, height / 2, this.__position.z)



            this.setPosition(position)
            //this.setOrientation(orientation)
            //parent.add(this.__linkedMesh)       
        }
        catch (err) {
            console.error("Failed to load mesh:", err)


        }
    }
    //set both this object's position and the linked mesh's position to the new position
    setPosition(newPos) {
        this.__position = newPos
        this.__linkedMesh.position.copy(newPos)
    }


    setSize(x, y, z) {
        this.__linkedMesh.scale.set(x, y, z)
    }

    setOrientation(newOri) {
        this.__orientation = newOri
        this.__linkedMesh.orientation = newOri
    }


    serialise() {
        return JSON.stringify({
            id: this.getId(),
            name: this.__furnitureName,
            position: {
                x: this.__position.x,
                y: this.__position.y,
                z: this.__position.z
            }
        })
    }
}
