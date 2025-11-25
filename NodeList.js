export class Node {
    constructor(position, id) {
        this.position = position
        this.connectedNodes = []
        this.id = id
    }

    addConnection(node) {
        this.connectedNodes.push(node.id)
    }
}
export class NodeList {
    constructor() {
        this.nodes = []
    }

    addNode(node) {
        this.nodes.push(node)
    }

    checkForNode(position) {
        for (let node of this.nodes) {
            if (node.position.equals(position)) {
                return node
            }
        }
    }

    getNodes() {
        return this.nodes
    }

    getNodeFromId(id) {
        for (let node of this.nodes) {
            if (node.id === id) {
                return node
            }
        }
    }


    breadthFirstSearch(startNode, endNode) {
        let visited = new Set()
        let parents = new Map()
        let queue = []

        queue.push(startNode)
        visited.add(startNode)

        while (queue.length > 0) {
            let currentNode = queue.shift()

            if (currentNode === endNode) {
                let path = [endNode]

                while (path[path.length - 1] !== startNode) {
                    let parent = parents.get(path[path.length - 1])
                    if (!parent) return null   // no parent = path broken
                    path.push(parent)
                }

                return path.reverse()
            }
            for (let neighbor of currentNode.connectedNodes) { //issue here is that we are adding id
                neighbor = this.getNodeFromId(neighbor)
                if (!visited.has(neighbor)) {
                    visited.add(neighbor)
                    parents.set(neighbor, currentNode) // FIXED
                    queue.push(neighbor)
                }
            }
        }

        return null;
    }

}
