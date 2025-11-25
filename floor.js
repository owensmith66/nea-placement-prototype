//This is used to make new vertices/faces at runtime
import { Furniture } from "./furniture.js"
import { BufferGeometry, Vector2, Vector3, Mesh, BufferAttribute, MeshStandardMaterial } from "three"
import { Structure } from "./structure.js"


function vectorToFloatArray(vectorArray) {
    let floatArray = new Float32Array(vectorArray.length * 3) //3 floats per vector
    for (let i = 0; i < vectorArray.length; i++) {
        floatArray[i * 3] = vectorArray[i].x
        floatArray[i * 3 + 1] = vectorArray[i].y
        floatArray[i * 3 + 2] = vectorArray[i].z
    }
    return floatArray
}

function orientPath(vertices) {
    //calculate the average position of the vertices
    let totalX = 0
    let totalZ = 0
    for (let vertex of vertices) {
        totalX += vertex.x
        totalZ += vertex.z
    }

    let centerPoint = new Vector2(totalX / vertices.length, totalZ / vertices.length)

    let angles = []

    for (let vertex of vertices) {
        let direction = new Vector2(vertex.x - centerPoint.x, vertex.z - centerPoint.z)
        let angle = Math.atan2(direction.y, direction.x) //get the angle of this vertex from the center point
        angles.push(angle)
    }

    //now sort the vertices by angle, doing bubble sort since the number of vertices is likely to be small
    for (let i = 0; i < vertices.length - 1; i++) {
        for (let j = 0; j < vertices.length - i - 1; j++) {
            if (angles[j] > angles[j + 1]) {
                //swap angles
                let tempAngle = angles[j]
                angles[j] = angles[j + 1]
                angles[j + 1] = tempAngle

                //swap vertices
                let tempVertex = vertices[j]
                vertices[j] = vertices[j + 1]
                vertices[j + 1] = tempVertex
            }

        }

    }
    return vertices
}

function area(a, b, c) {
    let ab = new Vector2(b.x - a.x, b.z - a.z) //get the vector from a to b
    let ac = new Vector2(c.x - a.x, c.z - a.z)//a to c

    let crossProduct = ab.x * ac.y - ab.y * ac.x //this gives the signed area of the parallelogram formed by ab and ac

    return Math.abs(crossProduct) / 2 //the area of the triangle is half the area of the parallelogram
}

function isConvex(a, b, c) {
    let ab = new Vector2(b.x - a.x, b.z - a.z) //get the vector from a to b
    let ac = new Vector2(c.x - a.x, c.z - a.z)//a to c

    let crossProduct = ab.x * ac.y - ab.y * ac.x //this gives the signed area of the parallelogram formed by ab and ac

    return crossProduct > 0 //if the cross product is positive, the angle abc is convex 
}

function pointInTriangle(p, a, b, c) {
    //make all the possible triangles
    let areaABC = area(a, b, c)
    let areaPAB = area(p, a, b)
    let areaPBC = area(p, b, c)
    let areaPCA = area(p, c, a)

    //if the area of ABC is the same as the sum of the other three areas, then P is inside the triangle
    return Math.abs(areaABC - (areaPAB + areaPBC + areaPCA)) < 1e-6;
}

function triangulateVertices(vertices) {
    let finalIndices = [] //holds the indices for the final triangles

    vertices = orientPath(vertices) //make sure they are in an anticlockwise order so that the isConvex function works correctly

    if (vertices.length < 4) {
        return [0, 1, 2] //no need to triangulate
    }


    let remainingVertices = [] //the index of vertices which have not yet been triangulated

    for (let index = 0; index < vertices.length; index++) {
        remainingVertices.push(index) //add all the numbers from 0 to vertices.length-1
    }

    while (remainingVertices.length > 3) { //I want to keep running the ear clipping until there are only 3 vertices remaining, which will form the last triangle.
        let earThisPass = false
        for (let i = 0; i < remainingVertices.length; i++) {
            let prevIndex = remainingVertices[(i - 1 + remainingVertices.length) % remainingVertices.length] //if i=0, wrap to the last vertex
            let currentIndex = remainingVertices[i]
            let nextIndex = remainingVertices[(i + 1) % remainingVertices.length] // if i is the last one, wrap to 0

            let a = vertices[prevIndex]
            let b = vertices[currentIndex]
            let c = vertices[nextIndex]


            if (!isConvex(a, b, c)) { //if the corner is concave then this shouldn't be clipped
                continue
            }

            let earFound = true
            for (let otherVertex of remainingVertices) {
                if (!(otherVertex === prevIndex) && !(otherVertex === currentIndex) && !(otherVertex === nextIndex)) { //don't check the triangle's own vertices
                    otherVertex = vertices[otherVertex]
                    if (pointInTriangle(otherVertex, a, b, c)) { //if there is another point found inside the triangle formed by these three vertices, it is not an ear
                        earFound = false
                        break
                    }
                }
            }
            if (earFound) { //we found an ear, so we can clip it
                finalIndices.push(prevIndex) //add this triangle to the final list
                finalIndices.push(currentIndex)
                finalIndices.push(nextIndex)
                remainingVertices.splice(i, 1) //remove the current vertex from the remaining vertices
                earThisPass = true
                break
            }

        }
         if (!earThisPass) {
        //stops an infinite loop in case of a malformed polygon
        break;
    }
    }
    //add the last triangle
    finalIndices.push(remainingVertices[0])
    finalIndices.push(remainingVertices[1])
    finalIndices.push(remainingVertices[2])

    return finalIndices

}

function createFloorMesh(vertices, scene) {
    let geometry = new BufferGeometry() //create a new empty geometry

    vertices = orientPath(vertices) //get them into anticlockwise so that convex/concave checks work properly

    let indices = triangulateVertices(vertices) //get the indices for the triangles
    console.log(vertices)
    for (let vertex of vertices) {
        vertex.y += 0.01 //raise the floor slightly to avoid z-fighting with other objects at y=0
    }

    vertices = vectorToFloatArray(vertices) //turn it into a format that three.js can use

    //update the geometry with the indices and vertices
    geometry.setIndex(indices)
    geometry.setAttribute('position', new BufferAttribute(vertices, 3))
    geometry.computeVertexNormals()

    //create the mesh using the geometry
    let floorMesh = new Mesh(geometry, new MeshStandardMaterial({ color: 0x0000ff, side: 2 }))
    return floorMesh
}

export class Floor extends Structure{
    constructor(vertices,colour, scene) {
        super(scene, null)
        let newFloor = createFloorMesh(vertices, scene)
        this.__linkedMesh = newFloor

        scene.add(this.__linkedMesh)
    }
}