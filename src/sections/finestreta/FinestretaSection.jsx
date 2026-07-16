import { useState } from 'react';
import { Link } from 'react-router-dom';
import BrandMark from '../../components/BrandMark';
import { alegacionsText } from './alegacionsText';

export default function FinestretaSection() {
  const [formData, setFormData] = useState({ nom: '', dni: '', poblacio: '', domicili: '', email: '', telefon: '' });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDownload = () => {
    window.open('/alegacions-en-blanc.pdf', '_blank');
  };

  const handleAdhesio = () => {
    if (!formData.nom) {
      alert("Per favor, emplena les teues dades.");
      return;
    }
    // Enviament simple via client de correu (Mailto)
    const subject = encodeURIComponent(`Adhesió Alegació PAI Mas de la Foia - ${formData.nom}`);
    const body = encodeURIComponent(
      `Hola,\n\nVull adherir-me a l'alegació col·lectiva contra el PAI de Mas de la Foia.\n\n` +
      `Nom i Cognoms: ${formData.nom}\n` +
      `DNI/NIE: ${formData.dni}\n` +
      `Població: ${formData.poblacio}\n` +
      `Domicili: ${formData.domicili}\n` +
      `Correu electrònic: ${formData.email}\n` +
      `Telèfon: ${formData.telefon || 'No indicat'}\n\nGràcies.`
    );
    
    // S'envia als dos correus de l'associació
    window.location.href = `mailto:elcomtat@gmail.com,info@zona14.org?subject=${subject}&body=${body}`;
    
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <section className="section-shell" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      {/* Capçalera minimalista amb el logo per tornar a Sóc de Poble */}
      <header style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
        <Link to="/" aria-label="Tornar a Sóc de Poble" style={{ textDecoration: 'none' }}>
          <BrandMark variant="dark" />
        </Link>
      </header>

      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <img 
          src="/og-finestreta.png" 
          alt="Firma contra el MEV de Planes" 
          style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: '600px', borderRadius: '16px', marginBottom: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
        />
        <div style={{ color: 'var(--sp-primary)', fontWeight: 600, fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Burocràcia Fàcil
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem', color: 'var(--sp-text)' }}>
          La Finestreta
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--sp-text-muted)', marginBottom: '1.5rem' }}>
          Alegacions contra el MEV (Mas de la Foia, Planes).
        </p>
        <div style={{ backgroundColor: 'var(--sp-surface-hover)', padding: '1.25rem', borderRadius: '12px', fontSize: '1.1rem', color: 'var(--sp-text)', textAlign: 'left', maxWidth: '600px', margin: '0 auto', border: '1px solid var(--sp-border)' }}>
          <p style={{ marginBottom: '0.75rem', lineHeight: '1.5' }}>
            <strong>Què estic firmant?</strong> Açò és una iniciativa conjunta de la <a href="https://www.facebook.com/Coordinadoradestudiseolicsdelcomtat/" target="_blank" rel="noreferrer" style={{ color: 'var(--sp-primary)', textDecoration: 'none' }}>CEEC (Coordinadora d'Estudis Eòlics del Comtat)</a> i les associacions locals per presentar una al·legació col·lectiva contra l'especulació urbanística del "Modern Eco Village". Les teues dades només s'usaran per a aquesta finalitat.
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--sp-text-muted)' }}>
            <em>Aquesta Finestreta és una eina operativa del projecte <a href="/" style={{ color: 'var(--sp-text)' }}>Sóc de Poble</a> (encara en fase de desenvolupament), posada al servei de la defensa del territori.</em>
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: 600, fontSize: '1.1rem' }}>
            Nom i Cognoms
            <input 
              type="text" 
              name="nom" 
              value={formData.nom} 
              onChange={handleChange} 
              placeholder="Ex: Joan García Pérez" 
              className="surface" 
              style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--sp-border)', fontSize: '1.15rem' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: 600, fontSize: '1.1rem' }}>
            DNI / NIE
            <input 
              type="text" 
              name="dni" 
              value={formData.dni} 
              onChange={handleChange} 
              placeholder="Ex: 12345678A" 
              className="surface" 
              style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--sp-border)', fontSize: '1.15rem' }}
            />
          </label>
          
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: 600, fontSize: '1.1rem' }}>
            Població de residència
            <input 
              type="text" 
              name="poblacio" 
              value={formData.poblacio} 
              onChange={handleChange} 
              placeholder="Ex: Planes" 
              className="surface" 
              style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--sp-border)', fontSize: '1.15rem' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: 600, fontSize: '1.1rem' }}>
            Domicili complet (Carrer, número, pis)
            <input 
              type="text" 
              name="domicili" 
              value={formData.domicili} 
              onChange={handleChange} 
              placeholder="Ex: Carrer Major, 12, 1r" 
              className="surface" 
              style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--sp-border)', fontSize: '1.15rem' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: 600, fontSize: '1.1rem' }}>
            Correu electrònic (A efectes de notificacions)
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Ex: correu@exemple.com" 
              className="surface" 
              style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--sp-border)', fontSize: '1.15rem' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: 600, fontSize: '1.1rem' }}>
            Telèfon <span style={{ fontSize: '0.85rem', color: 'var(--sp-text-muted)', fontWeight: 400 }}>(Opcional)</span>
            <input 
              type="tel" 
              name="telefon" 
              value={formData.telefon} 
              onChange={handleChange} 
              placeholder="Ex: 600 123 456" 
              className="surface" 
              style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--sp-border)', fontSize: '1.15rem' }}
            />
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
              <button type="button" className="pill pill--primary" onClick={handleAdhesio} style={{ justifyContent: 'center', padding: '1.3rem 2rem', width: '100%', fontSize: '1.2rem' }}>
                ✍️ Firmar i enviar automàticament
              </button>
              <p style={{ fontSize: '0.95rem', color: 'var(--sp-text-muted)', marginTop: '0.75rem', lineHeight: '1.4' }}>
                S'obrirà la teua aplicació de correu amb les dades emplenades. Només hauràs de prémer "Enviar". L'associació rebrà les teues dades per afegir-les a l'al·legació col·lectiva.
              </p>
            </div>
            <button type="button" className="pill" onClick={handleDownload} style={{ justifyContent: 'center', padding: '1.2rem 2rem', width: '100%', maxWidth: '400px', backgroundColor: 'transparent', border: '1px solid var(--sp-border)', color: 'var(--sp-text)', fontSize: '1.1rem' }}>
              📥 Descarregar i replenar
            </button>
          </div>

          {success && (
            <div style={{ padding: '1.25rem', backgroundColor: 'var(--sp-green-100, #E8F5E9)', color: 'var(--sp-green-700, #2E7D32)', borderRadius: '12px', textAlign: 'center', marginTop: '1rem', fontWeight: 500 }}>
              Acció completada correctament. Gràcies per defensar el territori!
            </div>
          )}
        </form>
      </div>

      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--sp-border)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--sp-text)', textAlign: 'center' }}>
          Text Íntegre de l'Alegació
        </h2>
        <div style={{ 
          padding: '2.5rem', 
          backgroundColor: 'var(--sp-surface)', 
          borderRadius: '16px', 
          fontSize: '1.05rem', 
          lineHeight: '1.7', 
          color: 'var(--sp-text)',
          maxHeight: '600px',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          border: '1px solid var(--sp-border)'
        }}>
          {alegacionsText}
        </div>
      </div>

    </section>
  );
}
