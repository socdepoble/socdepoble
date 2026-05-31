const fs = require('fs');

let indexContent = fs.readFileSync('src/components/ui/FloatingIndex.jsx', 'utf-8');

// Update FloatingIndex to accept controlled state
indexContent = indexContent.replace(
    `const FloatingIndex = ({ scrollRef, contentSelector = '.app-cms-content' }) => {`,
    `const FloatingIndex = ({ scrollRef, contentSelector = '.app-cms-content', isOpen, onToggle }) => {`
);

// Replace the internal state usage
indexContent = indexContent.replace(
    `const [showIndex, setShowIndex] = useState(false);`,
    `const [internalShowIndex, setInternalShowIndex] = useState(false);
    const showIndex = isOpen !== undefined ? isOpen : internalShowIndex;
    const setShowIndex = onToggle !== undefined ? onToggle : setInternalShowIndex;`
);

fs.writeFileSync('src/components/ui/FloatingIndex.jsx', indexContent, 'utf-8');

let uniContent = fs.readFileSync('src/pages/public/UniversalPage.jsx', 'utf-8');

// Add the missing states to UniversalPage
if (!uniContent.includes('const [showIndex, setShowIndex] = useState(false);')) {
    uniContent = uniContent.replace(
        `const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);`,
        `const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);\n    const [showIndex, setShowIndex] = useState(false);`
    );
}

// Ensure FloatingIndex receives the props
uniContent = uniContent.replace(
    `<FloatingIndex scrollRef={scrollContainerRef} />`,
    `<FloatingIndex scrollRef={scrollContainerRef} isOpen={showIndex} onToggle={setShowIndex} />`
);

fs.writeFileSync('src/pages/public/UniversalPage.jsx', uniContent, 'utf-8');

console.log('Fixed FloatingIndex and UniversalPage states');
