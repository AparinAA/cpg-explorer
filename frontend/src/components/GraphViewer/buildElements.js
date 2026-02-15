export function buildElements(data) {
  if (!data) return [];

  const elements = [];
  const nodeIds = new Set(data.nodes.map(n => n.id));

  data.nodes.forEach(node => {
    const isExternal = node.id?.startsWith('ext::');
    const isRoot = node.id === data.rootId;

    elements.push({
      data: {
        id: node.id,
        label: node.name || node.id.split('::').pop(),
        package: node.package,
        file: node.file,
        line: node.line,
        kind: node.kind,
        isRoot,
        isExternal,
      },
      classes: [isRoot ? 'root' : '', isExternal ? 'external' : ''].filter(Boolean).join(' '),
    });
  });

  data.edges.forEach(edge => {
    if (nodeIds.has(edge.source) && nodeIds.has(edge.target)) {
      elements.push({
        data: {
          id: `${edge.source}->${edge.target}`,
          source: edge.source,
          target: edge.target,
          kind: edge.kind,
        },
      });
    }
  });

  return elements;
}
