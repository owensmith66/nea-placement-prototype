import { SceneObject } from "./sceneobject.js"

//three's basic material class
import { MeshStandardMaterial , Mesh} from "three"


export class Structure extends SceneObject {
    constructor(parent, id, geometry, colour = 0x00ff00) {
        //call the sceneobject constructor
        super(parent, id)

        //default colour
        this.__colour = colour
        this.__material = new MeshStandardMaterial({ color: this.__colour, side: 2 })

        //create the mesh from the geometry
        this.__linkedMesh = new Mesh(geometry, this.__material)
        parent.add(this.__linkedMesh)

    }

    //change the material's colour
    setColour(newColour) {  
        console.log("setting colour to ", newColour)
        this.__colour = newColour
        this.__material.color.set(newColour)
    }
    
    //change the material entirely
    setMaterial(newMaterial) {
        this.__material = newMaterial
        this.__linkedMesh.material = this.__material
    }

}