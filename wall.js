//This is used to make new vertices/faces at runtime
import { BufferGeometry, Vector2, Vector3, Mesh, BufferAttribute } from "three"
import { Furniture } from './furniture.js';



function vectorToFloatArray(vectorArray) {
    let floatArray = new Float32Array(vectorArray.length * 3) //3 floats per vector
    for (let i = 0; i < vectorArray.length; i++) {
        floatArray[i * 3] = vectorArray[i].x
        floatArray[i * 3 + 1] = vectorArray[i].y
        floatArray[i * 3 + 2] = vectorArray[i].z
    }
    return floatArray
}

function createGeometry(vertices) {
    let geometry = new BufferGeometry() 

    let indices = [ //this says which vertices make up each triangle
       // front face
        0, 2, 4,
        4, 2, 6,
        // back face
        1, 5, 3,
        3, 5, 7,
        // left face
        0, 4, 1,
        1, 4, 5,
        // right face
        2, 3, 6,
        3, 7, 6,
        // top face
        4, 6, 5,
        5, 6, 7,
        // bottom face
        0, 1, 2,
        2, 1, 3,
    ]

    vertices = vectorToFloatArray(vertices)

    geometry.setIndex(indices)
    geometry.setAttribute('position', new BufferAttribute(vertices, 3))
    geometry.computeVertexNormals()

    console.log(geometry)

    let wallGeometry = new Mesh(geometry)
    return wallGeometry
}

export class Wall {
    constructor(node1, node2, thickness, height, scene) {
        
        // cuboids have 8 unique vertices 

        let xzDirection = new Vector2(
            node1.x - node2.x,
            node1.z - node2.z,
        )

        xzDirection.normalize() //give it a magnitude 1 to make dealing with thickness of the wall easier

        let perpendicularDirection = new Vector2(
            xzDirection.y,
            -xzDirection.x
        )

       let perpendicularVector3 = new Vector3(
            perpendicularDirection.x * thickness * 0.5,
            0,
            perpendicularDirection.y * thickness * 0.5
        )        

        let vertices = [ //vertices on the bottom
	        node1.clone().add(perpendicularVector3),
	        node1.clone().sub(perpendicularVector3),
	        node2.clone().add(perpendicularVector3),
	        node2.clone().sub(perpendicularVector3)
        ]


       
            let topVertices = []


            //need to clone the vector before adding to it

        for (let vertex of vertices) {
            topVertices.push(vertex.clone().add(new Vector3(0,height,0))) //recreate the bottom vertices, shifted a certain number of units up
        }

        vertices = vertices.concat(topVertices) //combine bottom and top vertices

        let wallGeometry = createGeometry(vertices)

        scene.add(wallGeometry)

    }
}
