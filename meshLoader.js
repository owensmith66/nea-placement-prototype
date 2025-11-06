//import the three.js module which can convert binary into renderable meshes
import  { GLTFLoader }  from 'three/addons/loaders/GLTFLoader.js';
import {Box3, Vector3} from "three"

//create an object for this
let fileToMesh = new GLTFLoader();


export class MeshLoader {
    constructor() {}

    //This will involve connection to an external database in real project
    __getGLBFromName(furnitureName) {

        return "./models/"+furnitureName+".glb"
    };

    loadMesh(furnitureName) {


        return new Promise((resolve, reject) => {
        fileToMesh.load(
            this.__getGLBFromName(furnitureName),
            function onLoad(gltf) {
                resolve(gltf.scene)
            },
            null,
            function onError(error) {
                reject(error)
            }
        )
    })
    }

    getMeshHeight(mesh){
        let box = new Box3().setFromObject(mesh)
        let  size = new Vector3()
        box.getSize(size)

        return(size.y)
    }

}

