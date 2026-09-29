import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  Target,
  Calendar,
  MessageSquare,
  FolderGit2,
  MapPin,
  Tag,
  BookOpen,
  Image as ImageIcon,
  BarChart3,
  Settings as SettingsIcon,
  ShieldAlert,
  Plus,
  CheckCircle2,
  XCircle,
  Sparkles,
  Download,
  Filter,
  Check,
  Search,
  Eye,
  Trash2,
  Edit,
  ArrowRight,
  LogOut,
  Globe
} from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';
import { Property, Lead, LeadStatus, PropertyStatus, UserRole } from '../types';
import { PROPERTY_TYPES, CITIES_AND_AREAS, MOCK_AMENITIES } from '../data/mockData';

interface AdminDashboardProps {
  navigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate }) => {
  const {
    currentUser,
    properties,
    updateProperty,
    deleteProperty,
    leads,
    updateLead,
    addLeadActivity,
    appointments,
    updateAppointmentStatus,
    inquiries,
    projects,
    agents,
    blogPosts,
    settings,
    updateSettings,
    auditLogs,
    formatPrice,
    addToast,
    logout
  } = useRealEstate();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'properties'
    | 'leads'
    | 'appointments'
    | 'inquiries'
    | 'projects'
    | 'agents'
    | 'locations'
    | 'taxonomies'
    | 'blog'
    | 'reports'
    | 'settings'
    | 'audit'
  >('overview');

  // Filters for Property Management Table
  const [propertyFilterStatus, setPropertyFilterStatus] = useState<string>('all');
  const [propertySearch, setPropertySearch] = useState('');

  // Filters for Leads
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newLeadNote, setNewLeadNote] = useState('');

  // Rejection Reason Modal State
  const [rejectionModalProperty, setRejectionModalProperty] = useState<Property | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Incomplete title deed documentation submitted.');

  // Statistics
  const totalProps = properties.length;
  const activeProps = properties.filter((p) => p.status === 'published' || p.status === 'featured').length;
  const pendingProps = properties.filter((p) => p.status === 'pending_approval').length;
  const soldProps = properties.filter((p) => p.status === 'sold').length;
  const rentedProps = properties.filter((p) => p.status === 'rented').length;
  const totalLeadsCount = leads.length;
  const newLeadsCount = leads.filter((l) => l.status === 'new').length;

  // Property Handlers
  const handleApproveProperty = async (prop: Property) => {
    await updateProperty(prop.id, {
      status: 'published',
      isVerified: true,
      rejectionReason: undefined
    });
    addToast(`Approved & published "${prop.title}"`, 'success');
  };

  const handleOpenReject = (prop: Property) => {
    setRejectionModalProperty(prop);
  };

  const handleConfirmReject = async () => {
    if (!rejectionModalProperty) return;
    await updateProperty(rejectionModalProperty.id, {
      status: 'draft',
      isVerified: false,
      rejectionReason
    });
    addToast(`Listing rejected with feedback`, 'info');
    setRejectionModalProperty(null);
  };

  const handleToggleFeature = async (prop: Property) => {
    await updateProperty(prop.id, {
      isFeatured: !prop.isFeatured
    });
  };

  const handleExportCSV = () => {
    const headers = 'ID,Title,Purpose,Type,Price,City,Area,Status\n';
    const rows = properties
      .map(
        (p) =>
          `"${p.id}","${p.title.replace(/"/g, '""')}","${p.purpose}","${p.propertyType}",${p.price},"${p.location.city}","${p.location.area}","${p.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `primehaven-properties-${Date.now()}.csv`;
    a.click();
    addToast('Properties exported to CSV successfully', 'success');
  };

  const filteredAdminProperties = properties.filter((p) => {
    if (propertyFilterStatus !== 'all' && p.status !== propertyFilterStatus) return false;
    if (propertySearch) {
      const q = propertySearch.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.location.city.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredLeads = leads.filter((l) => {
    if (leadStatusFilter !== 'all' && l.status !== leadStatusFilter) return false;
    return true;
  });

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties', count: pendingProps > 0 ? pendingProps : undefined, icon: Building2 },
    { id: 'leads', label: 'Leads CRM', count: newLeadsCount > 0 ? newLeadsCount : undefined, icon: Target },
    { id: 'appointments', label: 'Appointments', count: appointments.filter((a) => a.status === 'pending').length || undefined, icon: Calendar },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'taxonomies', label: 'Types & Amenities', icon: Tag },
    { id: 'blog', label: 'Blog CMS', icon: BookOpen },
    { id: 'reports', label: 'Reports & Export', icon: BarChart3 },
    { id: 'settings', label: 'Platform Settings', icon: SettingsIcon },
    { id: 'audit', label: 'Audit Log', icon: ShieldAlert }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-4 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="px-3 py-2 flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-white text-base">Admin Portal</span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-[11px] text-slate-400 hover:text-white"
              title="Return to Public Site"
            >
              Public Site
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-slate-900 text-white' : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Current Admin Identity & Session Actions */}
        <div className="pt-4 border-t border-slate-800 text-xs space-y-3">
          <div>
            <p className="text-slate-400">Authenticated as:</p>
            <p className="font-bold text-white truncate">{currentUser.name}</p>
            <span className="text-[10px] text-amber-400 font-semibold">{currentUser.role.replace('_', ' ')}</span>
          </div>

          <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-850">
            <button
              onClick={() => navigate('/')}
              className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>View Public Website</span>
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Sign Out of Portal</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
        {/* ================= 1. OVERVIEW TAB ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-display font-bold text-slate-900">Dashboard Intelligence</h2>
                <p className="text-xs text-slate-500">Live operational snapshot of properties, CRM inquiries, and revenue metrics</p>
              </div>
              <button
                onClick={() => navigate('/post-property')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Add Property</span>
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Properties</span>
                <p className="text-2xl font-display font-bold text-slate-900 tabular-nums">{totalProps}</p>
                <p className="text-[11px] text-emerald-600 font-medium">● {activeProps} Published Live</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pending Review</span>
                <p className="text-2xl font-display font-bold text-amber-600 tabular-nums">{pendingProps}</p>
                <button
                  onClick={() => {
                    setPropertyFilterStatus('pending_approval');
                    setActiveTab('properties');
                  }}
                  className="text-[11px] text-amber-700 font-semibold underline"
                >
                  Review Submissions →
                </button>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active CRM Leads</span>
                <p className="text-2xl font-display font-bold text-slate-900 tabular-nums">{totalLeadsCount}</p>
                <p className="text-[11px] text-blue-600 font-medium">{newLeadsCount} New This Week</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Viewing Tours</span>
                <p className="text-2xl font-display font-bold text-slate-900 tabular-nums">{appointments.length}</p>
                <p className="text-[11px] text-slate-500 font-medium">Scheduled Tours</p>
              </div>
            </div>

            {/* Recent Leads & Inquiries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Leads */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-slate-900 text-sm">Recent CRM Leads</h3>
                  <button onClick={() => setActiveTab('leads')} className="text-xs font-semibold text-amber-600">
                    View Pipeline →
                  </button>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {leads.slice(0, 4).map((l) => (
                    <div key={l.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{l.name}</p>
                        <p className="text-slate-500">{l.preferredLocation || 'Any'} · Budget: {formatPrice(l.budget)}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {l.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Approvals */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-slate-900 text-sm">Listing Approvals Required</h3>
                  <span className="text-xs font-semibold text-amber-600">{pendingProps} Pending</span>
                </div>

                {pendingProps === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">All submitted listings have been reviewed and approved.</p>
                ) : (
                  <div className="space-y-3">
                    {properties
                      .filter((p) => p.status === 'pending_approval')
                      .map((prop) => (
                        <div key={prop.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-900">{prop.title}</p>
                            <p className="text-slate-500">{prop.location.area}, {prop.location.city} · {formatPrice(prop.price)}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleApproveProperty(prop)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleOpenReject(prop)}
                              className="px-2.5 py-1 bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 rounded font-medium"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. PROPERTIES TAB ================= */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-display font-bold text-slate-900">Property Listings Management</h2>
                <p className="text-xs text-slate-500">Manage statuses, approve incoming submissions, and assign agency listings</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => navigate('/post-property')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Post Listing</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by title, ID, or city..."
                  value={propertySearch}
                  onChange={(e) => setPropertySearch(e.target.value)}
                  className="w-full sm:w-64 p-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                {['all', 'published', 'pending_approval', 'featured', 'sold', 'rented'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setPropertyFilterStatus(st)}
                    className={`px-3 py-1 rounded-lg capitalize whitespace-nowrap font-medium transition-colors ${
                      propertyFilterStatus === st
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Properties Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Ref ID</th>
                    <th className="p-3">Title & Location</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Featured</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAdminProperties.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="p-3 font-mono font-semibold text-slate-500">#{p.id.slice(-6)}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt={p.title} referrerPolicy="no-referrer" className="w-12 h-10 object-cover rounded-md" />
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">{p.title}</p>
                            <p className="text-slate-400 text-[11px]">{p.location.area}, {p.location.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 uppercase font-semibold text-slate-700">{p.purpose}</td>
                      <td className="p-3 font-bold text-slate-900 tabular-nums">{formatPrice(p.price)}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            p.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700'
                              : p.status === 'pending_approval'
                              ? 'bg-amber-50 text-amber-700'
                              : p.status === 'sold'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {p.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleFeature(p)}
                          className={`p-1 rounded ${p.isFeatured ? 'text-amber-500 font-bold' : 'text-slate-300 hover:text-slate-600'}`}
                          title="Toggle Featured"
                        >
                          <Sparkles className="w-4 h-4 fill-current" />
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {p.status === 'pending_approval' && (
                            <>
                              <button
                                onClick={() => handleApproveProperty(p)}
                                className="px-2 py-1 bg-emerald-600 text-white rounded font-medium hover:bg-emerald-700"
                                title="Approve"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleOpenReject(p)}
                                className="px-2 py-1 bg-rose-100 text-rose-700 rounded font-medium hover:bg-rose-200"
                                title="Reject"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => navigate(`/properties/${p.slug}`)}
                            className="p-1.5 text-slate-500 hover:text-slate-900"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProperty(p.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= 3. LEADS CRM TAB ================= */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-display font-bold text-slate-900">Leads CRM Pipeline</h2>
                <p className="text-xs text-slate-500">Track client inquiries, follow-up milestones, and sales conversions</p>
              </div>

              <div className="flex items-center gap-2">
                {['all', 'new', 'interested', 'viewing_scheduled', 'negotiation', 'converted'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setLeadStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs capitalize font-medium ${
                      leadStatusFilter === st
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Leads Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Leads List */}
              <div className="lg:col-span-2 space-y-3">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`p-4 bg-white rounded-xl border transition-all cursor-pointer ${
                      selectedLead?.id === lead.id ? 'border-amber-500 ring-2 ring-amber-100 shadow-md' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{lead.name}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                            {lead.source}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{lead.phone} · {lead.email}</p>
                      </div>

                      <select
                        value={lead.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateLead(lead.id, { status: e.target.value as LeadStatus })}
                        className="text-xs font-semibold p-1.5 border border-slate-200 rounded-lg bg-slate-50"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="interested">Interested</option>
                        <option value="viewing_scheduled">Viewing Scheduled</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                    </div>

                    <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded">
                      <p className="line-clamp-2">{lead.notes || 'No notes added yet.'}</p>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Target: {lead.preferredLocation || 'General'} (Budget: {formatPrice(lead.budget)})</span>
                      <span>Follow-up: {lead.followUpDate || 'None'}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Lead Details & Activity Log Panel */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs sticky top-8">
                {selectedLead ? (
                  <div className="space-y-4 text-xs">
                    <div>
                      <h3 className="font-display font-bold text-slate-900 text-base">{selectedLead.name}</h3>
                      <p className="text-slate-500">{selectedLead.email} · {selectedLead.phone}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div>
                        <span className="font-semibold text-slate-700 block">Lead Status:</span>
                        <select
                          value={selectedLead.status}
                          onChange={(e) => {
                            const newSt = e.target.value as LeadStatus;
                            updateLead(selectedLead.id, { status: newSt });
                            setSelectedLead({ ...selectedLead, status: newSt });
                          }}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs font-semibold capitalize mt-1"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="interested">Interested</option>
                          <option value="viewing_scheduled">Viewing Scheduled</option>
                          <option value="negotiation">Negotiation</option>
                          <option value="converted">Converted</option>
                          <option value="lost">Lost</option>
                        </select>
                      </div>

                      <div>
                        <span className="font-semibold text-slate-700 block">Next Follow-up Date:</span>
                        <input
                          type="date"
                          value={selectedLead.followUpDate || ''}
                          onChange={(e) => {
                            const dateVal = e.target.value;
                            updateLead(selectedLead.id, { followUpDate: dateVal });
                            setSelectedLead({ ...selectedLead, followUpDate: dateVal });
                          }}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs mt-1"
                        />
                      </div>
                    </div>

                    {/* Add Activity Note */}
                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      <label className="font-semibold text-slate-700 block">Log Interaction Activity:</label>
                      <textarea
                        rows={2}
                        value={newLeadNote}
                        onChange={(e) => setNewLeadNote(e.target.value)}
                        placeholder="Log phone call result, viewing notes, client offers..."
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                      />
                      <button
                        onClick={async () => {
                          if (!newLeadNote.trim()) return;
                          await addLeadActivity(selectedLead.id, 'call', newLeadNote);
                          setNewLeadNote('');
                          // refresh selectedLead activities locally
                          setSelectedLead({
                            ...selectedLead,
                            activities: [
                              {
                                id: `act-${Date.now()}`,
                                date: new Date().toISOString(),
                                agentName: currentUser.name,
                                activityType: 'call',
                                details: newLeadNote
                              },
                              ...(selectedLead.activities || [])
                            ]
                          });
                        }}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold"
                      >
                        Log Activity Note
                      </button>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      <span className="font-semibold text-slate-700 block">Activity History:</span>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedLead.activities?.map((act) => (
                          <div key={act.id} className="p-2 bg-slate-50 rounded border border-slate-100 text-[11px]">
                            <div className="flex items-center justify-between text-slate-400">
                              <span>{act.agentName} ({act.activityType})</span>
                              <span>{new Date(act.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-slate-800 mt-1">{act.details}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    Select a lead from the pipeline to review contact activities, schedule follow-ups, and update stage status.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. APPOINTMENTS TAB ================= */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-900">Viewing Appointments</h2>
              <p className="text-xs text-slate-500">Confirmed and pending in-person and video property walkthroughs</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Property</th>
                    <th className="p-3">Date & Slot</th>
                    <th className="p-3">Assigned Agent</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70">
                      <td className="p-3">
                        <p className="font-bold text-slate-900">{app.customerName}</p>
                        <p className="text-slate-400 text-[11px]">{app.customerPhone} · {app.customerEmail}</p>
                      </td>
                      <td className="p-3 font-semibold text-slate-800 max-w-xs truncate">{app.propertyTitle}</td>
                      <td className="p-3 tabular-nums font-semibold text-slate-700">{app.date} ({app.timeSlot})</td>
                      <td className="p-3 text-slate-700">{app.agentName}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            app.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : app.status === 'completed'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <select
                          value={app.status}
                          onChange={(e) => updateAppointmentStatus(app.id, e.target.value as any)}
                          className="p-1 border border-slate-200 rounded text-xs bg-slate-50"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirm</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancel</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= 5. INQUIRIES TAB ================= */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-900">Direct Property Inquiries</h2>
              <p className="text-xs text-slate-500">Inbound customer requests submitted via listing detail pages</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Property</th>
                    <th className="p-3">Message</th>
                    <th className="p-3">Channel</th>
                    <th className="p-3">Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-slate-50/70">
                      <td className="p-3">
                        <p className="font-bold text-slate-900">{inq.customerName}</p>
                        <p className="text-slate-400 text-[11px]">{inq.customerPhone} · {inq.customerEmail}</p>
                      </td>
                      <td className="p-3 font-semibold text-slate-800">{inq.propertyTitle}</td>
                      <td className="p-3 text-slate-600 max-w-sm">{inq.message}</td>
                      <td className="p-3 uppercase font-semibold text-amber-700">{inq.preferredContact}</td>
                      <td className="p-3 text-slate-400 tabular-nums">{new Date(inq.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= 6. PROJECTS TAB ================= */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold text-slate-900">Projects Management</h2>
                <p className="text-xs text-slate-500">Master-planned real estate schemes and residential towers</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-base">{proj.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-800">
                      {proj.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-slate-600">{proj.description}</p>
                  <div className="flex justify-between text-slate-500 pt-2 border-t border-slate-100">
                    <span>Developer: {proj.developer}</span>
                    <span className="font-bold text-slate-900">{formatPrice(proj.startingPrice)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 7. AGENTS TAB ================= */}
        {activeTab === 'agents' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-900">Agent Roster & Performance</h2>
              <p className="text-xs text-slate-500">Agency advisors, territory specializations, and commission assignments</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {agents.map((ag) => (
                <div key={ag.id} className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={ag.avatar} alt={ag.name} referrerPolicy="no-referrer" className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{ag.name}</h4>
                      <p className="text-amber-700 font-medium text-[11px]">{ag.designation}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-slate-600">
                    <p>Phone: {ag.phone}</p>
                    <p>WhatsApp: +{ag.whatsapp}</p>
                    <p>Active Listings: {ag.activeListingsCount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 8. LOCATIONS TAB ================= */}
        {activeTab === 'locations' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-900">Hierarchy: Cities, Areas & Societies</h2>
              <p className="text-xs text-slate-500">Dynamic real estate geographic hierarchy powering search and filters</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CITIES_AND_AREAS.map((c) => (
                <div key={c.city} className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span>{c.city}</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {c.areas.map((a, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-100 rounded text-slate-700 font-medium">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 9. TAXONOMIES TAB ================= */}
        {activeTab === 'taxonomies' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-900">Property Types & Amenities Taxonomy</h2>
              <p className="text-xs text-slate-500">Dynamic category parameters configured on the platform</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
                <h3 className="font-bold text-slate-900 text-sm">Registered Property Types</h3>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_TYPES.map((t) => (
                    <span key={t} className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
                <h3 className="font-bold text-slate-900 text-sm">Configured Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {MOCK_AMENITIES.map((am) => (
                    <div key={am.id} className="p-2 bg-slate-50 rounded border border-slate-100 text-slate-700">
                      {am.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 10. BLOG CMS TAB ================= */}
        {activeTab === 'blog' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold text-slate-900">Blog & Market Intelligence CMS</h2>
                <p className="text-xs text-slate-500">Manage real estate legal guides, society reviews, and tax outlooks</p>
              </div>
            </div>

            <div className="space-y-4">
              {blogPosts.map((post) => (
                <div key={post.id} className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{post.title}</h3>
                    <p className="text-slate-500">{post.category} · {post.authorName} · {post.readingTime}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold"
                  >
                    Preview
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 11. REPORTS TAB ================= */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold text-slate-900">Reports & Analytics Export</h2>
                <p className="text-xs text-slate-500">Download formatted CSV reports for accounting and marketing audit</p>
              </div>
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Export Listings CSV</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-900 text-sm block">Lead Source Distribution</span>
                <p className="text-slate-500">Website organic: 62%</p>
                <p className="text-slate-500">Direct Referral: 21%</p>
                <p className="text-slate-500">Social Ads: 17%</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-900 text-sm block">Inventory Breakdown</span>
                <p className="text-slate-500">Villas & Houses: 55%</p>
                <p className="text-slate-500">Commercial Floors: 25%</p>
                <p className="text-slate-500">Penthouses & Apts: 20%</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-900 text-sm block">Average Listing Velocity</span>
                <p className="text-slate-500">Average Days to Sell: 42 Days</p>
                <p className="text-slate-500">Inquiry to Viewing: 28%</p>
                <p className="text-slate-500">Viewing to Offer: 18%</p>
              </div>
            </div>
          </div>
        )}

        {/* ================= 12. SETTINGS TAB ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-900">Platform Settings</h2>
              <p className="text-xs text-slate-500">Global currency, company branding, and listing approval governance</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 text-xs shadow-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Company Trade Name</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => updateSettings({ companyName: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Support Phone</label>
                  <input
                    type="text"
                    value={settings.supportPhone}
                    onChange={(e) => updateSettings({ supportPhone: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Support Email</label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => updateSettings({ supportEmail: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Official Address</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => updateSettings({ address: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Listing Approval Governance</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requireApproval}
                    onChange={(e) => updateSettings({ requireApproval: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 block">Require Admin Approval Before Publishing</span>
                    <span className="text-slate-500 text-[11px]">
                      When enabled, newly submitted properties default to PENDING_APPROVAL status.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ================= 13. AUDIT LOG TAB ================= */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-900">System Audit Trail</h2>
              <p className="text-xs text-slate-500">Immutable ledger of administrative actions, status updates, and user modifications</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">User</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Entity</th>
                    <th className="p-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="p-3 font-semibold text-slate-800">{log.userName}</td>
                      <td className="p-3 text-amber-700 font-bold">{log.action}</td>
                      <td className="p-3 text-slate-600">{log.entity} #{log.entityId.slice(-6)}</td>
                      <td className="p-3 text-slate-700 font-sans">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Rejection Modal */}
      {rejectionModalProperty && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-display font-bold text-slate-900 text-base">Reject Listing Submission</h3>
            <p className="text-slate-600">
              Provide specific feedback for <span className="font-semibold text-slate-900">"{rejectionModalProperty.title}"</span> so the submitting owner or agent can rectify issues.
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectionModalProperty(null)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
