import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { Property, Agent } from '../types';
import { useRealEstate } from '../context/RealEstateContext';

interface ViewingModalProps {
  property: Property;
  agent?: Agent;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewingModal: React.FC<ViewingModalProps> = ({
  property,
  agent,
  isOpen,
  onClose
}) => {
  const { scheduleViewing, currentUser } = useRealEstate();

  const [date, setDate] = useState<string>('2026-10-05');
  const [timeSlot, setTimeSlot] = useState<string>('11:00 AM - 12:00 PM');
  const [customerName, setCustomerName] = useState<string>(currentUser.name || '');
  const [customerEmail, setCustomerEmail] = useState<string>(currentUser.email || '');
  const [customerPhone, setCustomerPhone] = useState<string>(currentUser.phone || '+92 300 1234567');
  const [notes, setNotes] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await scheduleViewing({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyImage: property.images?.[0],
      customerName,
      customerEmail,
      customerPhone,
      agentId: agent?.id || property.agentId || 'agent-1',
      agentName: agent?.name || 'Assigned Real Estate Specialist',
      date,
      timeSlot,
      notes
    });
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  const slots = [
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '05:00 PM - 06:00 PM'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-display font-bold text-slate-900 text-lg">Request Property Viewing</h3>
            <p className="text-xs text-slate-500 line-clamp-1">{property.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-slate-900 text-lg">Viewing Tour Requested!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your viewing appointment for <span className="font-semibold text-slate-900">{date} ({timeSlot})</span> has been submitted. Our agent will call you to confirm.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Date & Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Preferred Date</span>
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Preferred Time Slot</span>
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white"
                >
                  {slots.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  placeholder="e.g. Dr. Zulfiqar Ali"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                    placeholder="name@example.com"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                    placeholder="+92 300 1234567"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Special Requirements or Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  placeholder="e.g. Visiting with family, interested in private parking & solar..."
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Confirm Viewing Appointment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
