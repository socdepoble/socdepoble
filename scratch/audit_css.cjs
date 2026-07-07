const fs = require('fs');

const css = fs.readFileSync('src/app/index.css', 'utf-8');

const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
let csvContent = 'Selector;FontSize;Color;TextAlign;MarginTop;MarginBottom;FontWeight\n';

headings.forEach(h => {
  const regex = new RegExp(`\\.app-cms-content ${h}\\s*\\{([^}]+)\\}`, 'g');
  let match;
  let props = { FontSize: '', Color: '', TextAlign: '', MarginTop: '', MarginBottom: '', FontWeight: '' };
  
  while ((match = regex.exec(css)) !== null) {
    const rules = match[1].split(';').map(r => r.trim()).filter(r => r.length > 0);
    rules.forEach(rule => {
      const parts = rule.split(':');
      if (parts.length === 2) {
        const key = parts[0].trim();
        const value = parts[1].trim();
        if (key === 'font-size') props.FontSize = value;
        if (key === 'color') props.Color = value;
        if (key === 'text-align') props.TextAlign = value;
        if (key === 'margin-top') props.MarginTop = value;
        if (key === 'margin-bottom') props.MarginBottom = value;
        if (key === 'font-weight') props.FontWeight = value;
      }
    });
  }
  
  // Checking global overrides
  const globalRegex = new RegExp(`h\\d,\\s*\\.app-cms-content ${h}[^\\{]*\\{([^}]+)\\}`, 'g');
  while ((match = globalRegex.exec(css)) !== null) {
    const rules = match[1].split(';').map(r => r.trim()).filter(r => r.length > 0);
    rules.forEach(rule => {
      const parts = rule.split(':');
      if (parts.length === 2) {
        const key = parts[0].trim();
        const value = parts[1].trim();
        if (key === 'color' && !props.Color) props.Color = value;
      }
    });
  }
  
  csvContent += `.app-cms-content ${h};${props.FontSize};${props.Color};${props.TextAlign};${props.MarginTop};${props.MarginBottom};${props.FontWeight}\n`;
});

fs.writeFileSync('dom_analysis.csv', csvContent);
console.log('CSV creat a dom_analysis.csv');
