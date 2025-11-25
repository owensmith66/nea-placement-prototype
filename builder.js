import { Vector2, BoxGeometry, Mesh, Vector3 } from 'three';
import { Furniture } from './furniture.js';
import { Wall } from './wall.js';
import { Floor } from './floor.js';

import { NodeList, Node } from './NodeList.js';

export class Builder {

    constructor(scene, linkedCamera) {
        this.__scene = scene;
        this.__linkedCamera = linkedCamera;
        this.__objects = [];
        this.__mouse = new Vector2(0, 0);

        this.__wallNode = null
        this.__wallNodeList = new NodeList()

        this.__currentPlacementMode = "f"
        this.__currentFurniture = "misc/cube";
        this.__currentWallColour = 0xffffff
        this.__currentFloorColour = 0x000000


        // bind the onmouseclick function to the mouse being clicked
        window.addEventListener('click', this.__onMouseClick.bind(this)); //need to use .bind so this still refers to Builder
        this.__initialiseFurnitureButtons();
    }

    async __onMouseClick(event) {

        // Convert mouse position to normalized device coordinates (-1 to +1)
        this.__mouse = new Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        )


        let rayCastResult = this.__linkedCamera.castRay(this.__mouse);
        if (rayCastResult) {
            if (this.__currentPlacementMode == "f") { //if we are placing furniture

                let newFurniture = new Furniture(this.__scene, "placeholderID", this.__currentFurniture, rayCastResult)

                await newFurniture.load()

                this.__scene.add(newFurniture)
            }

            else if (this.__currentPlacementMode == "w") { //placing wall

                let { closestDistance, currentClosestNode } = getClosestNode(rayCastResult, this.__wallNodeList)

                if (closestDistance < 2) {
                    rayCastResult = currentClosestNode
                }


                if (this.__wallNode != null) { //if this is the second click of this wall mode
                    let newWall = new Wall(rayCastResult, this.__wallNode, 1, 5, this.__currentWallColour, this.__scene)

                    let startNode = this.__wallNodeList.checkForNode(this.__wallNode)
                    if (!startNode) {
                        startNode = new Node(this.__wallNode, this.__wallNodeList.nodes.length)
                        this.__wallNodeList.addNode(startNode)
                    }

                    let endNode = this.__wallNodeList.checkForNode(rayCastResult)
                    if (!endNode) {
                        endNode = new Node(rayCastResult, this.__wallNodeList.nodes.length)
                        this.__wallNodeList.addNode(endNode)
                    }


                    let wallConnections = this.__wallNodeList.breadthFirstSearch(startNode, endNode)

                    if (wallConnections != null) {
                        new Floor(wallConnections.map(node => node.position),this.__currentFloorColour, this.__scene)
                    }

                    startNode.addConnection(endNode)
                    endNode.addConnection(startNode)

                    this.__wallNode = null  //reset for next wall



                }

                else {
                    this.__wallNode = rayCastResult //store first click position
                }


            }
        }

    }

    __initialiseFurnitureButtons() {

        //get all buttons tagged as a furniture-button
        let buttons = document.querySelectorAll('.furniture-button');
        for (let button of buttons) {

            // wait for a click on any of them
            button.addEventListener('click', (event) => {

                this.__currentPlacementMode = "f"

                // set the current furniture type to the name of the button
                this.__currentFurniture = event.currentTarget.dataset.parentfolder + "/" + event.currentTarget.name;

            })
        };

        let wallButton = document.querySelector(".wall-button")
        wallButton.addEventListener("click", (event) => {
            this.__currentPlacementMode = "w"
        })

        let updateColourButton = document.getElementById("update-colour-button")
        updateColourButton.addEventListener("click", (event) => {
            this.__currentWallColour = document.getElementById("wall-colour").value
            this.__currentFloorColour = document.getElementById("floor-colour").value
        })

        let saveButton = document.getElementById("save")
        saveButton.addEventListener("click", (event) => {
            console.log("saving")
            console.log(this.__scene.serialise())
        })
        

    }

}

function getClosestNode(newNode, existingNodes) {

    let currentClosestNode = null //the closest node found so far
    let closestDistance = Infinity //the distance to the closest node found so far

    for (let existingNode of existingNodes.getNodes()) {

        existingNode = existingNode.position //get the position of the existing node

        let betweenNodes = new Vector3(
            newNode.x - existingNode.x,
            newNode.y - existingNode.y,
            newNode.z - existingNode.z
        ) //make a vector from one node to the other

        let distance = Math.sqrt((betweenNodes.x) ** 2 + (betweenNodes.y) ** 2 + (betweenNodes.z) ** 2) //pythagoras
        if (distance < closestDistance) { //if the calculated distance is the closest so far
            closestDistance = distance
            currentClosestNode = existingNode
        }


    }

    return { closestDistance, currentClosestNode } //return them both

}