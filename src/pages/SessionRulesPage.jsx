// src/pages/SessionRulesPage.jsx
import React, { useEffect, useState } from 'react';
import { marked } from 'marked';

// Importem el contingut brut de la card generada als docs (o de l'arxiu original)
import rulesMarkdown from '../../_docs/.antigravity_session_rules.md?raw';

export default function SessionRulesPage() {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    // Convertim el markdown a HTML usant marked
    const html = marked(rulesMarkdown);
    setHtmlContent(html);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white min-h-screen">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">El Genoma de la Iaia</h1>
        <p className="text-gray-500 mt-2">Targeta de Diagnòstic i Protocol Cognitiu</p>
      </header>
      
      <div 
        className="prose prose-lg prose-indigo max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
      />
    </div>
  );
}
