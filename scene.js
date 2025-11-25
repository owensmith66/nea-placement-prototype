import { Scene  as threeScene } from "three"

export class Scene {
    constructor() {

        this.__threeScene = new threeScene()

        this.__furniture = []
        this.__walls = []
        this.__floors = []
    }

    add(object) {
        let type = object.constructor.name
        //console.log(type)
        if (type === "Furniture" || type === "Wall" || type === "Floor") {
             if (type === "Furniture") {
            this.__furniture.push(object)
        }
        else if (type === "Wall") {
            this.__walls.push(object)
        }
        else if (type === "Floor") {
            this.__floors.push(object)
        }
        
        this.__threeScene.add(object.getLinkedMesh())
        }
        else {
            this.__threeScene.add(object)
        }
       

       
    }

    remove(object) {
        let type = object.constructor.name
        //remove from array

        this.__threeScene.remove(object.__linkedMesh)
    }

    serialise() {
        let serialisedFurniture = []
        for (let furn of this.__furniture) {
            console.log(furn)
            let serialised = furn.serialise()
            console.log(serialised)
            serialisedFurniture.push(furn.serialise())
        }
        return serialisedFurniture
    }

    getThreeScene() {
        return this.__threeScene
    }

    
}