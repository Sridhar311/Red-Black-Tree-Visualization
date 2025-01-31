class Node {
    constructor(value, color = 'RED') {
        this.value = value;
        this.color = color;
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

class RedBlackTree {
    constructor() {
        this.nullNode = new Node(null, 'BLACK');
        this.root = this.nullNode;
    }
    findNode(value) {
        let current = this.root;
        while (current !== this.nullNode) {
            if (value === current.value) {
                return current;
            }
            current = value < current.value ? current.left : current.right;
        }
        return this.nullNode; 
    }
    replaceNode(oldNode, newNode) {
        if (oldNode.parent === null) {
            this.root = newNode;
        } else if (oldNode === oldNode.parent.left) {
            oldNode.parent.left = newNode;
        } else {
            oldNode.parent.right = newNode;
        }
        if (newNode !== this.nullNode) {
            newNode.parent = oldNode.parent;
        }
    }
    rotateLeft(node, steps) {
        let temp = node.right;
        node.right = temp.left;
        if (temp.left !== this.nullNode) temp.left.parent = node;
        temp.parent = node.parent;
    
        if (!node.parent) this.root = temp;
        else if (node === node.parent.left) node.parent.left = temp;
        else node.parent.right = temp;
    
        temp.left = node;
        node.parent = temp;
    
        steps.push(`Left rotation on node ${node.value}`);
    }
    
    rotateRight(node, steps) {
        let temp = node.left;
        node.left = temp.right;
        if (temp.right !== this.nullNode) temp.right.parent = node;
        temp.parent = node.parent;
    
        if (!node.parent) this.root = temp;
        else if (node === node.parent.right) node.parent.right = temp;
        else node.parent.left = temp;
    
        temp.right = node;
        node.parent = temp;
    
        steps.push(`Right rotation on node ${node.value}`);
    }
    
    insert(value, steps = []) {
        let newNode = new Node(value);
        let y = null;
        let x = this.root;
        while (x !== this.nullNode) {
            if (value === x.value) {
                steps.push(`Node with value ${value} already exists.`);
                return;  
            }
            y = x;
            x = value < x.value ? x.left : x.right;
        }
    
        newNode.parent = y;
        if (!y) {
            this.root = newNode;
            steps.push(`Inserted ${value} as root`);
        } else if (newNode.value < y.value) {
            y.left = newNode;
            steps.push(`Inserted ${value} as left child of ${y.value}`);
        } else {
            y.right = newNode;
            steps.push(`Inserted ${value} as right child of ${y.value}`);
        }
    
        newNode.left = this.nullNode;
        newNode.right = this.nullNode;
        newNode.color = 'RED';
    
        steps.push(`New node ${value} is RED`);
        this.fixInsert(newNode, steps);
    }
    
    
    fixInsert(node, steps) {
        while (node.parent && node.parent.color === 'RED') {
            let parent = node.parent;
            let grandparent = parent.parent;
    
            if (parent === grandparent.left) {
                let uncle = grandparent.right;
    
                if (uncle.color === 'RED') {
                    steps.push(`Uncle ${uncle.value} is RED → Recoloring`);
                    parent.color = 'BLACK';
                    uncle.color = 'BLACK';
                    grandparent.color = 'RED';
                    node = grandparent;
                } else {
                    if (node === parent.right) {
                        steps.push(`Left rotation on ${parent.value}`);
                        node = parent;
                        this.rotateLeft(node);
                    }
                    steps.push(`Right rotation on ${grandparent.value}`);
                    parent.color = 'BLACK';
                    grandparent.color = 'RED';
                    this.rotateRight(grandparent);
                }
            } else {
                let uncle = grandparent.left;
    
                if (uncle.color === 'RED') {
                    steps.push(`Uncle ${uncle.value} is RED → Recoloring`);
                    parent.color = 'BLACK';
                    uncle.color = 'BLACK';
                    grandparent.color = 'RED';
                    node = grandparent;
                } else {
                    if (node === parent.left) {
                        steps.push(`Right rotation on ${parent.value}`);
                        node = parent;
                        this.rotateRight(node);
                    }
                    steps.push(`Left rotation on ${grandparent.value}`);
                    parent.color = 'BLACK';
                    grandparent.color = 'RED';
                    this.rotateLeft(grandparent);
                }
            }
        }
        this.root.color = 'BLACK';
        steps.push(`Root is always BLACK`);
    }
    
    rotateLeft(node) {
        let temp = node.right;
        node.right = temp.left;

        if (temp.left !== this.nullNode) temp.left.parent = node;
        temp.parent = node.parent;

        if (!node.parent) this.root = temp;
        else if (node === node.parent.left) node.parent.left = temp;
        else node.parent.right = temp;

        temp.left = node;
        node.parent = temp;
    }

    rotateRight(node) {
        let temp = node.left;
        node.left = temp.right;

        if (temp.right !== this.nullNode) temp.right.parent = node;
        temp.parent = node.parent;

        if (!node.parent) this.root = temp;
        else if (node === node.parent.right) node.parent.right = temp;
        else node.parent.left = temp;

        temp.right = node;
        node.parent = temp;
    }
    delete(value, steps = []) {
        let nodeToDelete = this.findNode(value);
        if (nodeToDelete === this.nullNode) {
            steps.push(`Node ${value} not found.`);
            return;
        }
    
        let child, parent;
        if (nodeToDelete.left === this.nullNode || nodeToDelete.right === this.nullNode) {
            // Node has one or no children
            child = nodeToDelete.left === this.nullNode ? nodeToDelete.right : nodeToDelete.left;
            this.replaceNode(nodeToDelete, child);
            if (nodeToDelete.color === 'BLACK') {
                steps.push(`Node ${value} is black, fixing violations.`);
                this.fixDelete(child, nodeToDelete.parent, steps);
            }
            steps.push(`Deleted node ${value}.`);
        } else {
            // Node has two children
            let successor = this.getSuccessor(nodeToDelete);  // Find the in-order successor
            let originalColor = successor.color;
            child = successor.right;  // Successor can have at most one child (right child)
            parent = successor.parent;
            
            if (successor.parent === nodeToDelete) {
                // Successor is the direct child of the node to delete
                parent = successor;
            } else {
                this.replaceNode(successor, child);  // Replace successor with its child
                successor.right = nodeToDelete.right;
                successor.right.parent = successor;
            }
            
            this.replaceNode(nodeToDelete, successor);  // Replace node to delete with successor
            successor.left = nodeToDelete.left;
            successor.left.parent = successor;
            successor.color = nodeToDelete.color;  // Maintain the color of the successor
            
            if (originalColor === 'BLACK') {
                steps.push(`Successor node ${successor.value} is black, fixing violations.`);
                this.fixDelete(child, parent, steps);
            }
    
            steps.push(`Deleted node ${value}.`);
        }
        this.root.color = 'BLACK';
    }
    
        
    getSuccessor(node) {
        if (node.right !== this.nullNode) {
            return this.minimum(node.right);
        }
        let parent = node.parent;
        while (parent !== this.nullNode && node === parent.right) {
            node = parent;
            parent = parent.parent;
        }
        return parent;
    }
    
    minimum(node) {
        while (node.left !== this.nullNode) {
            node = node.left;
        }
        return node;
    }
    
    fixDelete(node, parent, steps) {
        while (node !== this.root && node.color === 'BLACK') {
            if (node === parent.left) {
                let sibling = parent.right;
                if (sibling.color === 'RED') {
                    sibling.color = 'BLACK';
                    parent.color = 'RED';
                    this.rotateLeft(parent, steps);
                    sibling = parent.right;
                }
    
                if (sibling.left.color === 'BLACK' && sibling.right.color === 'BLACK') {
                    sibling.color = 'RED';
                    node = parent;
                    parent = parent.parent;
                } else {
                    if (sibling.right.color === 'BLACK') {
                        sibling.left.color = 'BLACK';
                        sibling.color = 'RED';
                        this.rotateRight(sibling, steps);
                        sibling = parent.right;
                    }
                    sibling.color = parent.color;
                    parent.color = 'BLACK';
                    sibling.right.color = 'BLACK';
                    this.rotateLeft(parent, steps);
                    node = this.root;
                }
            } else {
                let sibling = parent.left;
                if (sibling.color === 'RED') {
                    sibling.color = 'BLACK';
                    parent.color = 'RED';
                    this.rotateRight(parent, steps);
                    sibling = parent.left;
                }
    
                if (sibling.right.color === 'BLACK' && sibling.left.color === 'BLACK') {
                    sibling.color = 'RED';
                    node = parent;
                    parent = parent.parent;
                } else {
                    if (sibling.left.color === 'BLACK') {
                        sibling.right.color = 'BLACK';
                        sibling.color = 'RED';
                        this.rotateLeft(sibling, steps);
                        sibling = parent.left;
                    }
                    sibling.color = parent.color;
                    parent.color = 'BLACK';
                    sibling.left.color = 'BLACK';
                    this.rotateRight(parent, steps);
                    node = this.root;
                }
            }
        }
        node.color = 'BLACK';
    }

    inorderTraversal(node, result = []) {
        if (node !== this.nullNode) {
            this.inorderTraversal(node.left, result);
            result.push({ value: node.value, color: node.color });
            this.inorderTraversal(node.right, result);
        }
        return result;
    }

    exportTree() {
        return JSON.stringify(this.inorderTraversal(this.root), null, 2);
    }
}
window.RedBlackTree = RedBlackTree;
