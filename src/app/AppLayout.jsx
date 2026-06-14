import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div
      className="sp-matrioixca"
      data-escala="pagina"
    >
      <header className="sp-matrioixca-head">
        <h1 className="sp-app-title">
          Sóc de Poble
        </h1>
      </header>

      <main className="sp-matrioixca-body">
        <Outlet />
      </main>

      <nav
        className="sp-matrioixca-foot"
        aria-label="Navegació principal"
      >
        <button className="sp-btn-primary">
          Mur
        </button>

        <button className="sp-btn-primary">
          Mercat
        </button>

        <button className="sp-btn-primary">
          Perfil
        </button>
      </nav>
    </div>
  );
}
