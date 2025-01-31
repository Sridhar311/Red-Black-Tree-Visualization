const svg = d3.select("svg");
let tree = new RedBlackTree();  
document.getElementById("delete-btn").addEventListener("click", deleteNode);

function deleteNode() {
    let value = document.getElementById("value").value;
    if (value === "") return;

    let steps = [];
    tree.delete(parseInt(value), steps);
    document.getElementById("value").value = "";

    updateVisualization();
    updateDescription(steps);
}

function updateDescription(steps) {
    if (steps.length === 0) {
        document.getElementById("description-box").innerText = "No steps recorded.";
        return;
    }

    let formattedText = steps.map(step => `• ${step}`).join("\n\n"); 
    document.getElementById("description-box").innerText = formattedText;
}


function insertNode() {
    let value = document.getElementById("value").value;
    if (value === "") return;
    
    let steps = [];
    tree.insert(parseInt(value), steps);
    document.getElementById("value").value = "";

    updateVisualization();
    updateDescription(steps);
}

function updateDescription(steps) {
    document.getElementById("description-box").innerText = steps.join("\n");
}

function exportTree() {
    alert(tree.exportTree());
}

function updateVisualization() {
    svg.selectAll("*").remove();
    drawTree(tree.root, 500, 50, 250);
}

function drawTree(node, x, y, offset) {
    if (!node || node.value === null) return;

    if (node.parent) {
        svg.append("line")
            .attr("x1", x)
            .attr("y1", y)
            .attr("x2", node.parent.x)
            .attr("y2", node.parent.y)
            .attr("class", "line");
    }

    node.x = x;
    node.y = y;

    svg.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 20)
        .attr("class", node.color.toLowerCase());

    svg.append("text")
        .attr("x", x)
        .attr("y", y + 5)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text(node.value);

    drawTree(node.left, x - offset, y + 80, offset / 2);
    drawTree(node.right, x + offset, y + 80, offset / 2);
}
