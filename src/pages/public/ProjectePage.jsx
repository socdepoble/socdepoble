import React from 'react';
import UniversalPage from './UniversalPage';
import { marked } from 'marked';
import projecteMd from '../../../_wiki_de_poble/01_identitat_iaia/soc_de_poble.md?raw';
import { useSeoTrellat } from '../../hooks/useSeoTrellat';

export default function ProjectePage() {
  const imageUrl = '/assets/uploads/brain/hero_panoramic_rural_view_1774720664221.png';

  useSeoTrellat({
    titol: 'El Projecte',
    descripcio: "L'arxiu fundacional principal per entendre què és aquest projecte i la visió de Sóc de Poble.",
    urlCanonica: '/projecte',
    ogImatge: imageUrl
  });
  // Llevat del frontmatter de YAML d'Obsidian
  const contentWithoutFrontmatter = projecteMd.replace(/^---[\s\S]+?---\n/, '');
  
  // Neteja dels enllaços interns d'Obsidian (ex: [[link|Text]] -> Text)
  let cleanContent = contentWithoutFrontmatter.replace(/\[\[.*?\|(.*?)\]\]/g, '$1'); 
  cleanContent = cleanContent.replace(/\[\[(.*?)\]\]/g, '$1');

  // El Mestre vol que l'H1 es quede al fitxer d'Obsidian, però a la Web l'H1 el pinta l'UniversalPage (Decorador).
  // Per tant, ocultem la primera línia si és un H1 per no duplicar-lo.
  cleanContent = cleanContent.replace(/^#\s+.*?\n/, '');

  // Convertim el Markdown en HTML net
  const htmlContent = marked.parse(cleanContent);

  return (
    <UniversalPage 
      title="El Projecte" 
      icon="⚙️"
      htmlContent={htmlContent}
      heroImage={imageUrl}
    />
  );
}
