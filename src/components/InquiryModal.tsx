import React, { useState } from 'react';
import { X, Send, User, Mail, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Property } from '../types';
import { useRealEstate } from '../context/RealEstateContext';

interface InquiryModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ property, isOpen, onClose }) => {
  const { submitInquiry, currentUser } = useRealEstate();

  const [customerName, setCustomerName] = useState(currentUser.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '+92 300 1234567');
  const [preferredContact, setPreferredContact] = useState<'phone' | 'email' | 'whatsapp'>('whatsapp');
  const [message, setMessage] = useState(
    `Hello, I would like to inquire about "${property.title}" (Ref #${property.id}). Please provide pricing details and payment schedule.`
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await submitInquiry({
      propertyId: property.id,
      propertyTitle: property.title,
      customerName,
      customerEmail,
      customerPhone,
      preferredContact,
      message
    });
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-display font-bold text-slate-900 text-base">Send Property Inquiry</h3>
            <p className="text-xs text-slate-500 line-clamp-1">{property.title}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-slate-900 text-base">Inquiry Submitted!</h4>
            <p className="text-xs text-slate-600">The property advisor has received your request and will contact you via {preferredContact}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" /> Full Name
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Email
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Preferred Contact Method</label>
              <div className="grid grid-cols-3 gap-2">
                {(['whatsapp', 'phone', 'email'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPreferredContact(method)}
                    className={`py-1.5 px-2 rounded-lg capitalize border font-medium text-center ${
                      preferredContact === method
                        ? 'border-amber-500 bg-amber-50 text-amber-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Message
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium inline-flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3 h-3" />
                <span>{submitting ? 'Sending...' : 'Send Inquiry'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
