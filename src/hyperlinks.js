import window from './window';

export function transformTextNode(node) {
    const t = window.document.createElement('a');
    const text = node.data;
    
    const result = text.match(/\[(.*)\]\((.*)\)/);

    // No Markdown links, don't need to replace node.
    if (result === null) {
        return null;
    }

    const [markdown, anchorText, anchorUrl] = result;

    // Create the anchor.
    const anchorTag = window.document.createElement('a');
    const anchorTextNode = window.document.createTextNode(anchorText);
    anchorTag.appendChild(anchorTextNode);    
    anchorTag.setAttribute('href', anchorUrl);

    const mdStart = text.indexOf(markdown, 0);

    const left = text.slice(0, mdStart);
    const right = text.slice(mdStart + markdown.length, text.length);

    if (mdStart !== 0) {
        const ln = window.document.createTextNode(left);
        const rn = window.document.createTextNode(right);
        const df = window.document.createDocumentFragment();
        df.appendChild(ln);
        df.appendChild(anchorTag);
        df.appendChild(rn);
        return df;
    }

    return anchorTag;
}
