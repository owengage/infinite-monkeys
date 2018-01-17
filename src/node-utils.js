export const isNodeType = (node, type) => node.nodeType === type;
export const isTextNode = node => isNodeType(node, Node.TEXT_NODE);
export const isElementNode = node => isNodeType(node, Node.ELEMENT_NODE);

