import { Mesh } from "three"

export class SceneObject {
    constructor(parent, id) {
        this.__parentScene = parent
        this.__id = id
        this.__linkedMesh = null
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

    getLinkedMesh() {
        return this.__linkedMesh
    }

    getId() {
        return this.__id
    }

}