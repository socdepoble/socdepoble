import React from 'react';
import { Section } from '../primitives/Section';
import { ColorSwatch } from '../primitives/ColorSwatch';

const ORANGE_SHADES = [
  'bg-orange-950', 'bg-orange-900', 'bg-orange-800',
  'bg-orange-700', 'bg-orange-600', 'bg-orange-500',
  'bg-orange-400', 'bg-orange-300', 'bg-orange-200', 'bg-orange-100'
];

const SKY_SHADES = [
  'bg-sky-950', 'bg-sky-900', 'bg-sky-800',
  'bg-sky-700', 'bg-sky-600', 'bg-sky-500',
  'bg-sky-400', 'bg-sky-300', 'bg-sky-200', 'bg-sky-100'
];

const SURFACE_SHADES = [
  'bg-gray-900', 'bg-gray-800', 'bg-gray-700',
  'bg-gray-600', 'bg-gray-500', 'bg-gray-400',
  'bg-gray-300', 'bg-gray-200', 'bg-gray-100', 'bg-white'
];

const BASE_SHADES = [
  'bg-black', 'bg-zinc-900', 'bg-zinc-800',
  'bg-zinc-700', 'bg-zinc-600', 'bg-zinc-500',
  'bg-zinc-400', 'bg-zinc-300', 'bg-zinc-200', 'bg-zinc-100'
];

const GRAYSCALE_COLORS = [
  { name: 'Negre', class: '#0C0A09', cssVar: 'bg-stone-950', hex: '#0C0A09' },
  { name: 'Carbó', class: '#1C1917', cssVar: 'bg-stone-900', hex: '#1C1917' },
  { name: 'Pissarra', class: '#292524', cssVar: 'bg-stone-800', hex: '#292524' },
  { name: 'Grafit', class: '#44403C', cssVar: 'bg-stone-700', hex: '#44403C' },
  { name: 'Pedra fosca', class: '#57534E', cssVar: 'bg-stone-600', hex: '#57534E' },
  { name: 'Pedra', class: '#78716C', cssVar: 'bg-stone-500', hex: '#78716C' },
  { name: 'Cendra', class: '#A8A29E', cssVar: 'bg-stone-400', hex: '#A8A29E', textColor: '#0C0A09' },
  { name: 'Calç', class: '#D6D3D1', cssVar: 'bg-stone-300', hex: '#D6D3D1', textColor: '#0C0A09' },
  { name: 'Arena', class: '#E7E5E4', cssVar: 'bg-stone-200', hex: '#E7E5E4', textColor: '#0C0A09' },
  { name: 'Núvol', class: '#F5F5F4', cssVar: 'bg-stone-100', hex: '#F5F5F4', textColor: '#0C0A09' },
  { name: 'Blanc trencat', class: '#FAFAF9', cssVar: 'bg-stone-50', hex: '#FAFAF9', textColor: '#0C0A09' }
];

export const ColorPalette = React.memo(() => (
  <Section id="paleta" title="1. Paleta Cromàtica">
    <h3 id="colors" className="sosp-h3">1.2. Identitat Cromàtica (Colors)</h3>
    <p className="text-sm text-stone-600 mb-4">
      Colors purs i vibrants preparats per al contrast màxim en mode fosc i clar. Calcats de la normativa oficial de disseny.
    </p>

    {/* Grid de colors primaris */}
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8 notranslate">
      <ColorSwatch
        color="#f97316"
        name="Primary"
        cssVar="var(--md-sys-color-primary)"
        shades={ORANGE_SHADES}
      />
      <ColorSwatch
        color="#0984E3"
        name="Secondary"
        cssVar="var(--md-sys-color-secondary)"
        shades={SKY_SHADES}
      />
      <ColorSwatch
        color="white"
        textColor="#0e0e10"
        name="Tertiary / Surface"
        cssVar="var(--md-sys-color-surface)"
        shades={SURFACE_SHADES}
      />
      <ColorSwatch
        color="#0e0e10"
        textColor="white"
        name="Neutral / Base"
        cssVar="var(--md-sys-color-on-surface)"
        shades={BASE_SHADES}
      />
    </section>

    {/* Colors de suport */}
    <h3 className="sosp-h3 mb-4 mt-12">Colors de Suport</h3>
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <ColorSwatch color="#87CEEB" textColor="#0e0e10" name="Cel SOSP" cssVar="--color-cel" hex="#87CEEB" />
      <ColorSwatch color="#DC2626" name="Alerta" cssVar="--color-alerta" hex="#DC2626" />
      <ColorSwatch color="#F59E0B" name="Avís" cssVar="--color-avis" hex="#F59E0B" />
      <ColorSwatch color="#16A34A" name="Èxit" cssVar="--color-exit" hex="#16A34A" />
    </section>

    {/* Escala de grisos */}
    <h3 className="sosp-h3 mb-4">Escala de Grisos</h3>
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {GRAYSCALE_COLORS.map((c) => (
        <ColorSwatch key={c.name} color={c.class} textColor={c.textColor || 'white'} cssVar={c.cssVar} name={c.name} hex={c.hex} />
      ))}
    </section>
  </Section>
));

ColorPalette.displayName = 'ColorPalette';
