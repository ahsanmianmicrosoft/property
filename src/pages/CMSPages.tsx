import React, { useState } from 'react';
import {
  Building,
  Building2,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  Briefcase,
  FileText,
  Globe,
  Star,
  Clock,
  ArrowRight,
  BadgeCheck,
  MessageSquare
} from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';

interface CMSPageProps {
  type: 'about' | 'services' | 'contact';
  navigate: (path: string) => void;
}

export const CMSPages: React.FC<CMSPageProps> = ({ type, navigate }) => {
  const { settings, createLead, addToast } = useRealEstate();

  // Contact Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Property Purchase Inquiry');
  const [officeLocation, setOfficeLocation] = useState('Lahore');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Save as CRM Lead
    await createLead({
      name,
      email,
      phone,
      preferredLocation: officeLocation,
      source: 'website',
      notes: `Subject: ${subject}. Preferred Office: ${officeLocation}. Message: ${message}`,
      status: 'new'
    });

    setSubmitting(false);
    setSubmitted(true);
    addToast('Thank you! Your inquiry has been routed to our senior territory director.', 'success');
  };

  const branchOffices = [
    {
      city: 'Lahore',
      tag: 'Corporate Headquarters',
      address: 'Prime Tower, Level 4, Main Boulevard, Gulberg III, Lahore, Pakistan',
      phone: '+92 42 3589 1200',
      whatsapp: '923214455882',
      email: 'lahore@primehaven.estate',
      hours: 'Mon - Sat: 09:00 AM - 07:00 PM'
    },
    {
      city: 'Islamabad',
      tag: 'Capital Region Office',
      address: 'Executive Heights, Jinnah Avenue, Blue Area, Islamabad, Pakistan',
      phone: '+92 51 2891 4400',
      whatsapp: '923339128374',
      email: 'islamabad@primehaven.estate',
      hours: 'Mon - Sat: 09:00 AM - 06:30 PM'
    },
    {
      city: 'Karachi',
      tag: 'Sindh Regional Desk',
      address: 'Ocean Tower, Khayaban-e-Iqbal, Block 9, Clifton, Karachi, Pakistan',
      phone: '+92 21 3514 8820',
      whatsapp: '923008472910',
      email: 'karachi@primehaven.estate',
      hours: 'Mon - Sat: 09:30 AM - 07:00 PM'
    },
    {
      city: 'Dubai',
      tag: 'GCC & Global Expat Desk',
      address: 'Building 4, Bay Square, Business Bay, Dubai, United Arab Emirates',
      phone: '+971 4 429 8810',
      whatsapp: '971501234567',
      email: 'dubai@primehaven.estate',
      hours: 'Sun - Thu: 09:00 AM - 06:00 PM'
    }
  ];

  if (type === 'about') {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Header Hero */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Established 2011 · 15+ Years of Industry Leadership</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
            Institutional Trust & Excellence in Real Estate Advisory
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            PrimeHaven Real Estate is Pakistan’s premier property exchange and asset advisory platform. We eliminate transactional risk by enforcing rigorous title verification, zero-litigation mandates, and transparent pricing.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="space-y-1">
            <p className="text-3xl font-display font-black text-amber-400">Rs. 45+ Bn</p>
            <p className="text-xs font-semibold text-slate-200">Transactions Closed</p>
            <p className="text-[11px] text-slate-400">Across residential & commercial</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-display font-black text-white">1,450+</p>
            <p className="text-xs font-semibold text-slate-200">Verified Listings</p>
            <p className="text-[11px] text-slate-400">Direct title clearance</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-display font-black text-amber-400">18,000+</p>
            <p className="text-xs font-semibold text-slate-200">Expat & Resident Clients</p>
            <p className="text-[11px] text-slate-400">In 34 countries worldwide</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-display font-black text-emerald-400">100%</p>
            <p className="text-xs font-semibold text-slate-200">Legal Title Guarantee</p>
            <p className="text-[11px] text-slate-400">Zero litigation policy</p>
          </div>
        </div>

        {/* Three Pillars */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Our Core Commitments</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1">
              The Principles That Guide PrimeHaven
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-lg">1. Uncompromised Title Legality</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We independently verify fard, mutation (intiqal), registry records, and society transfer eligibility directly with DHA, CDA, and LDA before listing any asset.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-lg">2. Predictable Capital Growth</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We analyze rental yields, micro-market infrastructure developments, Ring Road corridors, and tax implications under Section 236C & 236K to optimize buyer returns.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-lg">3. Dedicated Senior Stewardship</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every transaction is personally managed by a certified senior property director from initial physical walkthrough to final stamp duty payment and possession handover.
              </p>
            </div>
          </div>
        </div>

        {/* Executive Leadership Team */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Executive Management</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1">
              Meet Our Senior Leadership
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Decades of cumulative real estate, legal conveyancing, and investment banking experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs text-center">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"
                alt="Ahsan Maqsood"
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-amber-100 shadow-xs"
              />
              <div>
                <h3 className="font-display font-bold text-slate-900 text-base">Ahsan Maqsood</h3>
                <p className="text-xs text-amber-600 font-semibold">Founder & Managing Director</p>
                <p className="text-[11px] text-slate-400 mt-0.5">15+ Years Private Wealth Advisory</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Specializes in prime commercial master developments and overseas expatriate institutional portfolio structuring.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs text-center">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300"
                alt="Tariq Mehmood"
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-amber-100 shadow-xs"
              />
              <div>
                <h3 className="font-display font-bold text-slate-900 text-base">Tariq Mehmood</h3>
                <p className="text-xs text-amber-600 font-semibold">Senior Partner & Director Luxury Assets</p>
                <p className="text-[11px] text-slate-400 mt-0.5">DHA Certified License #REA-PB-8841</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Over 12 years of premier luxury residential sales across DHA Lahore, Gulberg, and Cantt with 450+ verified closings.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs text-center">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300"
                alt="Ayesha Khan"
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-amber-100 shadow-xs"
              />
              <div>
                <h3 className="font-display font-bold text-slate-900 text-base">Ayesha Khan</h3>
                <p className="text-xs text-amber-600 font-semibold">Executive Director Capital Projects</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Islamabad CDA Brokerage #REA-ICT-4209</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Corporate commercial property specialist managing headquarters acquisitions in Blue Area and Diplomatic Enclave Islamabad.
              </p>
            </div>
          </div>
        </div>

        {/* Accreditations & Regulators */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Institutional Sanction</span>
            <h3 className="text-xl font-display font-bold text-slate-900 mt-1">
              Registered Authorities & Banking Affiliations
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <BadgeCheck className="w-6 h-6 text-amber-600 mx-auto mb-1.5" />
              <p className="font-bold text-slate-900 text-xs">DHA Lahore</p>
              <p className="text-[11px] text-slate-500">Registered Agency #8841</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <BadgeCheck className="w-6 h-6 text-amber-600 mx-auto mb-1.5" />
              <p className="font-bold text-slate-900 text-xs">CDA Islamabad</p>
              <p className="text-[11px] text-slate-500">Authorized Capital Broker</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <BadgeCheck className="w-6 h-6 text-amber-600 mx-auto mb-1.5" />
              <p className="font-bold text-slate-900 text-xs">SECP Corporate</p>
              <p className="text-[11px] text-slate-500">Incorporation #019284</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <BadgeCheck className="w-6 h-6 text-amber-600 mx-auto mb-1.5" />
              <p className="font-bold text-slate-900 text-xs">FBR Tax Office</p>
              <p className="text-[11px] text-slate-500">Active Taxpayer Compliant</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('/properties')}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
          >
            Browse Verified Properties
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
          >
            Speak with an Advisory Director
          </button>
        </div>
      </div>
    );
  }

  if (type === 'services') {
    const servicesList = [
      {
        icon: Building,
        title: '1. Luxury Residential Brokerage & Acquisition',
        tagline: 'Private estates, designer villas, and serviced penthouses',
        desc: 'Comprehensive buyer and seller representation across premier addresses including DHA Phase 5, 6, 7 & 9 Prism, Gulberg III, Sector E-7 & F-6 Islamabad, and Clifton Karachi. We arrange confidential family walkthroughs, negotiate pricing without hidden agent markups, and supervise society verification.',
        deliverables: ['Independent property appraisal', 'Complete physical inspection report', 'NOC & non-encumbrance audit', 'Direct seller-buyer negotiation table']
      },
      {
        icon: Briefcase,
        title: '2. Commercial Corporate Leasing & Office Spaces',
        tagline: 'Class-A office floors, corporate headquarters, and retail showrooms',
        desc: 'Assisting domestic companies, multinational IT firms, and financial institutions in acquiring compliant corporate workspaces. We verify floor blueprints, backup power generators, high-speed elevator capacities, and municipal commercial zoning permits.',
        deliverables: ['Custom workplace requirement matching', 'Lease deed vetting by legal counsel', 'Utility load capacity audit', 'Tenant improvement coordination']
      },
      {
        icon: FileText,
        title: '3. Legal Title Due Diligence, Mutation & Intiqal',
        tagline: 'Forensic property title examination and revenue records audit',
        desc: 'Pakistan’s real estate landscape requires careful verification of ownership documents. Our legal department verifies mutation registers (Intiqal), Fard-e-Malkiat from the revenue department (Patwari/Tehsildar), and checks court stay orders before any token is paid.',
        deliverables: ['Sub-Registrar record verification', 'FBR Active Taxpayer withholding tax clearance', 'Society non-encumbrance certificate (NEC)', 'Possession handover witnessing']
      },
      {
        icon: Globe,
        title: '4. Overseas Pakistani Real Estate Advisory Desk',
        tagline: 'Bespoke end-to-end management for expatriates in UK, US, Canada & GCC',
        desc: 'Managing remote real estate portfolios for overseas Pakistanis. We offer 4K video walkthroughs, digital legal documentation, Power of Attorney attestation guidance through Pakistani embassies, and capital repatriation via Roshan Digital Accounts.',
        deliverables: ['4K guided drone & interior walkthroughs', 'Embassy POA attestation workflow', 'Rental collection & tenant management', 'Roshan Digital Account remittance routing']
      },
      {
        icon: Building2,
        title: '5. Master Project Marketing & Sales Mandate',
        tagline: 'Exclusive sales agency for developers and housing societies',
        desc: 'Executing high-velocity sales campaigns for residential towers and gated communities. From architect blueprint consultation and installment pricing structures to investor roadshows in Dubai and London.',
        deliverables: ['Go-to-market pricing model', 'Architectural marketing collaterals', 'Lead generation and CRM conversion', 'Installment collection and escrow management']
      },
      {
        icon: TrendingUp,
        title: '6. Shariah-Compliant Home Financing Advisory',
        tagline: 'Islamic Diminishing Musharakah assistance with partner banks',
        desc: 'Navigating home financing options with leading financial institutions including Meezan Bank Easy Home, Bank Alfalah Islamic, and HBL GharAasan. We assist with income documentation, debt-to-burden ratios, and bank property valuations.',
        deliverables: ['Pre-approval eligibility assessment', 'Comparative bank profit rate analysis', 'Document dossier preparation', 'Expedited branch processing']
      }
    ];

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5 text-amber-600" />
            <span>Comprehensive Real Estate Advisory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
            Institutional Real Estate Services
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            From premier luxury residential acquisitions to corporate office leasing and forensic title due diligence, PrimeHaven delivers complete end-to-end execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicesList.map((srv, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-7 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <srv.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-slate-900 text-lg leading-snug">
                  {srv.title}
                </h3>
                <p className="text-xs font-semibold text-amber-700">
                  {srv.tagline}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {srv.desc}
                </p>

                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Key Deliverables & Protocols:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    {srv.deliverables.map((d, di) => (
                      <li key={di} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-[11px]">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Inquire About This Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Contact Strip */}
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-display font-bold text-slate-900">
              Need a Customized Real Estate Service?
            </h3>
            <p className="text-xs text-slate-600 max-w-lg">
              Our partners and certified directors provide bespoke advisory for high-value family estates, corporate portfolios, and joint ventures.
            </p>
          </div>
          <button
            onClick={() => navigate('/contact')}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
          >
            Contact Advisory Desk
          </button>
        </div>
      </div>
    );
  }

  // Contact Page
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Direct Advisory Access</span>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          Contact PrimeHaven Real Estate
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Visit any of our regional walk-in consultation centers or submit an inquiry to connect with a senior territory director.
        </p>
      </div>

      {/* Branch Office Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {branchOffices.map((office, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900">
                {office.tag}
              </span>
              <h3 className="text-base font-bold text-slate-900">{office.city} Office</h3>
              <p className="text-xs text-slate-500 leading-relaxed flex items-start gap-1.5 pt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{office.address}</span>
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{office.phone}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{office.email}</span>
              </p>
              <p className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{office.hours}</span>
              </p>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${office.whatsapp}?text=${encodeURIComponent(
                  `Salam, I would like to book an appointment with your ${office.city} advisory team.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Form Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm max-w-4xl mx-auto">
        <div className="mb-6 space-y-1">
          <h2 className="text-xl font-display font-bold text-slate-900">
            Submit a Direct Advisory Inquiry
          </h2>
          <p className="text-xs text-slate-500">
            Fill in your details below. A dedicated territory advisor will review your requirements and respond within 2 hours.
          </p>
        </div>

        {submitted ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-slate-900 text-xl">Inquiry Submitted Successfully</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Your inquiry has been logged in our CRM and routed to our {officeLocation} director. We will contact you at {phone} or {email}.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Submit Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tariq Farooq"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tariq@example.com"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target City / Branch</label>
                <select
                  value={officeLocation}
                  onChange={(e) => setOfficeLocation(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="Lahore">Lahore (Main Boulevard Gulberg)</option>
                  <option value="Islamabad">Islamabad (Blue Area)</option>
                  <option value="Karachi">Karachi (Clifton Block 9)</option>
                  <option value="Dubai">Dubai (Business Bay)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Inquiry Purpose</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              >
                <option value="Property Purchase Inquiry">Property Purchase Inquiry</option>
                <option value="Property Rental Inquiry">Property Rental Inquiry</option>
                <option value="Listing a Property for Sale / Rent">Listing a Property for Sale / Rent</option>
                <option value="Commercial Leasing & Office Floors">Commercial Leasing & Office Floors</option>
                <option value="Title Due Diligence & Conveyancing">Title Due Diligence & Conveyancing</option>
                <option value="Overseas Pakistani Investment Consultation">Overseas Pakistani Investment Consultation</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Requirements / Message *</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe the property type, budget, preferred sector or society, or legal verification queries..."
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Send Inquiry to Advisory'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
