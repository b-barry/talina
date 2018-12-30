import React from 'react';
import { AppContext } from '../app-context';

import Layout from '../components/layout';
import SEO from '../components/seo';

function Stepper() {
  return (
    <section className="font-sans flex justify-between mt-6 mx-auto max-w-xl">
      <a
        href="#"
        className="w-1/4 flex flex-col items-center text-center text-xs text-black no-underline"
      >
        <div className="bg-black text-white rounded-full h-8 w-8 flex items-center justify-center mb-2 z-10">
          <i className="fas fa-check" />
        </div>
        <label className="font-bold uppercase tracking-wide">
          Se connecter
        </label>
      </a>
      <a
        href="#"
        className="w-1/4 relative flex flex-col items-center text-center text-xs text-black no-underline"
      >
        <div className="bg-black text-white rounded-full h-8 w-8 flex items-center justify-center mb-2 z-10">
          <i className="fas fa-check" />
        </div>
        <div className="absolute h-1 mt-4 bg-black pin-x -translate-50-50" />
        <label className="font-bold uppercase tracking-wide">Adresse</label>
      </a>
      <a
        href="#"
        className="w-1/4 relative flex flex-col items-center text-center text-xs text-black no-underline"
      >
        <div className="bg-black text-white rounded-full h-8 w-8 flex items-center justify-center mb-2 z-10">
          <i className="fas fa-check" />
        </div>
        <div className="absolute h-1 mt-4 bg-black pin-x -translate-50-50" />
        <label className="font-bold uppercase tracking-wide">Paiement</label>
      </a>
      <a
        href="#"
        className="w-1/4 relative flex flex-col items-center text-center text-xs text-black no-underline"
      >
        <div className="bg-grey-dark text-white rounded-full h-8 w-8 flex items-center justify-center mb-2 z-10">
          <i className="fas fa-check" />
        </div>
        <div className="absolute h-1 mt-4 bg-grey-dark pin-x -translate-50-50" />
        <label className="font-bold uppercase tracking-wide text-grey-dark">
          Validation
        </label>
      </a>
      <a
        href="#"
        className="w-1/4 relative flex flex-col items-center text-center text-xs text-black no-underline"
      >
        <div className="bg-grey-dark text-white rounded-full h-8 w-8 flex items-center justify-center mb-2 z-10">
          <i className="fas fa-check" />
        </div>
        <div className="absolute h-1 mt-4 bg-grey-dark pin-x -translate-50-50" />
        <label className="font-bold uppercase tracking-wide text-grey-dark">
          C'est fait
        </label>
      </a>
    </section>
  );
}

export default Stepper;
