function buildSectionMarker(label) {
  return `
    <div class="record-marker">
      <div class="sq"></div>
      <div class="label">${label}</div>
      <div class="rule"></div>
    </div>
  `;
}

function buildPageHeader(title, intro) {
  return `
    <div class="page-header">
      <div class="eyebrow">${title}</div>
      <h1 class="page-title">${title}</h1>
      <p class="intro">${intro}</p>
    </div>
  `;
}
