import React from 'react'

function CartDeliveryInfo() {
  return (
    <div className="mb-4 flex-grow flex flex-col bg-white border border-grey-lighter overflow-hidden">
      <div className="px-6 mb-2">
        <p className="text-black py-4 font-bold text-2xl">
          Temps de livraison estimée
        </p>
      </div>
      <div className="px-6 pb-4">
        <div className="text-left font-normal text-sm text-black">
          Livraisons effectuées dans les 5 à 10 jours suivant la commande.
        </div>
      </div>
    </div>
  )
}

export default CartDeliveryInfo
