import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Property } from '../types';
import { useRealEstate } from '../context/RealEstateContext';

interface WhatsAppButtonProps {
  property: Property;
  agentPhone?: string;
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  property,
  agentPhone = '923214455882',
  className = ''
}) => {
  const { formatPrice } = useRealEstate();

  const handleWhatsAppClick = () => {
    const cleanPhone = agentPhone.replace(/[^0-9]/g, '');
    const priceText = formatPrice(property.price);
    const text = encodeURIComponent(
      `Hello PrimeHaven Agent, I am interested in this property:\n\n*${property.title}*\nProperty ID: #${property.id}\nLocation: ${property.location.area}, ${property.location.city}\nPrice: ${priceText}\nPurpose: For ${property.purpose.toUpperCase()}\n\nPlease share more details and availability for a viewing.`
    );
    const url = `https://wa.me/${cleanPhone}?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      type="button"
      onClick={handleWhatsAppClick}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition-colors text-xs ${className}`}
    >
      <MessageSquare className="w-4 h-4 fill-current" />
      <span>Chat on WhatsApp</span>
    </button>
  );
};
