import React from "react";

const BarterOfferCard = ({ offer, onAccept }) => {
  return (
    <article className="bg-[#1A1A1A] rounded-xl p-4 shadow border border-white/5">
      <h3 className="font-bold text-white">{offer.title}</h3>
      <p className="text-sm text-white/70 mt-1">{offer.description}</p>

      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-orange-400 font-medium">Reputación: {offer.trust || 0}</span>

        <button
          onClick={() => onAccept(offer.id)}
          className="bg-soc-active text-white px-4 py-2 rounded-xl text-sm font-bold"
        >
          Aceptar
        </button>
      </div>
    </article>
  );
};

export default React.memo(BarterOfferCard);
