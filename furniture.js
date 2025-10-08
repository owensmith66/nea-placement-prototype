import { SceneObject } from "./sceneobject.js";
import { MeshLoader } from "./meshLoader.js";
import { Vector3 } from "three"


let loader = new MeshLoader();

export class Furniture extends SceneObject {
    constructor(parent, id, name, position, orientation) {
        super(parent, id, position, orientation)
        this.__furnitureName = name


       
    async function load() {
        try {
            this.__linkedMesh = await loader.loadMesh(name)

            let height = loader.getMeshHeight(this.__linkedMesh)

            position = new Vector3(position.x, height/2, position.z)

            this.setPosition(position)
            //this.setOrientation(orientation)
            parent.add(this.__linkedMesh)        
        } 
        catch (err) {
            console.error("Failed to load mesh:", err)


        }
}
        
    
       load.bind(this)()
        
        //Apply to newly created mesh 
       
            

    }
}
