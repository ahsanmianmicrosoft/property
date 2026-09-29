import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Property,
  RealEstateProject,
  Agent,
  Lead,
  PropertyInquiry,
  ViewingAppointment,
  BlogPost,
  PlatformSettings,
  FilterState,
  User,
  UserRole,
  AuditLogItem
} from '../types';
import {
  MOCK_PROPERTIES,
  MOCK_PROJECTS,
  MOCK_AGENTS,
  MOCK_LEADS,
  MOCK_INQUIRIES,
  MOCK_APPOINTMENTS,
  MOCK_BLOG_POSTS,
  DEFAULT_SETTINGS,
  MOCK_USERS,
  MOCK_AUDIT_LOGS
} from '../data/mockData';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface RealEstateContextType {
  currentUser: User;
  isAuthenticated: boolean;
  isStaff: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  switchUserRole: (role: UserRole) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  formatPrice: (amount: number, overrideCurrency?: string) => string;
  properties: Property[];
  featuredProperties: Property[];
  projects: RealEstateProject[];
  agents: Agent[];
  leads: Lead[];
  inquiries: PropertyInquiry[];
  appointments: ViewingAppointment[];
  blogPosts: BlogPost[];
  settings: PlatformSettings;
  auditLogs: AuditLogItem[];
  favorites: string[];
  toggleFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  comparedProperties: Property[];
  toggleCompare: (property: Property) => void;
  clearCompare: () => void;
  isCompared: (propertyId: string) => boolean;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  // Actions
  fetchProperties: (customFilters?: Partial<FilterState>) => Promise<Property[]>;
  submitProperty: (data: Partial<Property>) => Promise<Property>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<Property>;
  deleteProperty: (id: string) => Promise<boolean>;
  submitInquiry: (data: Omit<PropertyInquiry, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  scheduleViewing: (data: Omit<ViewingAppointment, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  createLead: (data: Partial<Lead>) => Promise<Lead>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<Lead>;
  addLeadActivity: (leadId: string, activityType: 'call' | 'email' | 'meeting' | 'note', details: string) => Promise<void>;
  updateAppointmentStatus: (id: string, status: ViewingAppointment['status']) => Promise<void>;
  updateSettings: (newSettings: Partial<PlatformSettings>) => Promise<void>;
  toasts: ToastNotification[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const initialFilters: FilterState = {
  keyword: '',
  purpose: 'all',
  propertyType: 'all',
  city: 'all',
  area: 'all',
  minPrice: 0,
  maxPrice: 0,
  bedrooms: 'all',
  bathrooms: 'all',
  furnishing: 'all',
  isVerifiedOnly: false,
  isFeaturedOnly: false,
  amenities: [],
  sortBy: 'newest'
};

const RealEstateContext = createContext<RealEstateContextType | undefined>(undefined);

// Exchange rates against PKR baseline
const CURRENCY_RATES: Record<string, { symbol: string; rate: number; position: 'prefix' | 'suffix' }> = {
  PKR: { symbol: 'Rs. ', rate: 1, position: 'prefix' },
  USD: { symbol: '$', rate: 0.0036, position: 'prefix' },
  AED: { symbol: 'AED ', rate: 0.0132, position: 'prefix' },
  GBP: { symbol: '£', rate: 0.0028, position: 'prefix' },
  EUR: { symbol: '€', rate: 0.0033, position: 'prefix' }
};

const GUEST_USER: User = {
  id: 'guest',
  name: 'Visitor',
  email: '',
  role: 'GUEST',
  createdAt: new Date().toISOString()
};

export const RealEstateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('primehaven_auth_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return GUEST_USER;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currency, setCurrency] = useState<string>('PKR');
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [projects] = useState<RealEstateProject[]>(MOCK_PROJECTS);
  const [agents] = useState<Agent[]>(MOCK_AGENTS);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [inquiries, setInquiries] = useState<PropertyInquiry[]>(MOCK_INQUIRIES);
  const [appointments, setAppointments] = useState<ViewingAppointment[]>(MOCK_APPOINTMENTS);
  const [blogPosts] = useState<BlogPost[]>(MOCK_BLOG_POSTS);
  const [settings, setSettingsState] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(MOCK_AUDIT_LOGS);
  const [favorites, setFavorites] = useState<string[]>(['prop-101', 'prop-102', 'prop-104']);
  const [comparedProperties, setComparedProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const isAuthenticated = currentUser.role !== 'GUEST';
  const isStaff =
    currentUser.role === 'SUPER_ADMIN' ||
    currentUser.role === 'ADMIN' ||
    currentUser.role === 'AGENT';

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = async (
    email: string,
    _password?: string
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    const trimmed = email.trim().toLowerCase();
    const foundUser = MOCK_USERS.find((u) => u.email.toLowerCase() === trimmed);
    if (!foundUser) {
      return { success: false, error: 'No account found matching this email address.' };
    }
    setCurrentUser(foundUser);
    try {
      localStorage.setItem('primehaven_auth_user', JSON.stringify(foundUser));
    } catch (e) {
      console.error(e);
    }
    return { success: true, user: foundUser };
  };

  const logout = () => {
    setCurrentUser(GUEST_USER);
    try {
      localStorage.removeItem('primehaven_auth_user');
    } catch (e) {
      console.error(e);
    }
    addToast('You have been signed out successfully.', 'info');
  };

  const switchUserRole = (role: UserRole) => {
    const match = MOCK_USERS.find((u) => u.role === role);
    if (match) {
      setCurrentUser(match);
      try {
        localStorage.setItem('primehaven_auth_user', JSON.stringify(match));
      } catch (e) {}
      addToast(`Switched active profile to ${match.name} (${role})`, 'info');
    }
  };

  // Currency Formatter
  const formatPrice = useCallback((amount: number, overrideCurrency?: string): string => {
    const activeCurr = overrideCurrency || currency;
    const config = CURRENCY_RATES[activeCurr] || CURRENCY_RATES['PKR'];
    const converted = amount * config.rate;

    if (activeCurr === 'PKR') {
      // Pakistani Crores and Lakhs representation for elegant readability
      if (converted >= 10000000) {
        return `Rs. ${(converted / 10000000).toFixed(2).replace(/\.00$/, '')} Crore`;
      }
      if (converted >= 100000) {
        return `Rs. ${(converted / 100000).toFixed(2).replace(/\.00$/, '')} Lac`;
      }
      return `Rs. ${converted.toLocaleString('en-US')}`;
    }

    const formattedNum = Math.round(converted).toLocaleString('en-US');
    return config.position === 'prefix' ? `${config.symbol}${formattedNum}` : `${formattedNum} ${config.symbol}`;
  }, [currency]);

  // Initial fetch from backend API if available, gracefully keeping mock data fallback
  useEffect(() => {
    fetch('/api/properties?status=all')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.properties) {
          setProperties(data.properties);
        }
      })
      .catch(() => {
        // Dev offline fallback already set
      });

    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setSettingsState(data);
      })
      .catch(() => {});
  }, []);

  const fetchProperties = async (customFilters?: Partial<FilterState>): Promise<Property[]> => {
    const active = { ...filters, ...(customFilters || {}) };
    const params = new URLSearchParams();
    if (active.keyword) params.append('keyword', active.keyword);
    if (active.purpose !== 'all') params.append('purpose', active.purpose);
    if (active.propertyType !== 'all') params.append('propertyType', active.propertyType);
    if (active.city !== 'all') params.append('city', active.city);
    if (active.area !== 'all') params.append('area', active.area);
    if (active.minPrice > 0) params.append('minPrice', active.minPrice.toString());
    if (active.maxPrice > 0) params.append('maxPrice', active.maxPrice.toString());
    if (active.bedrooms !== 'all') params.append('bedrooms', active.bedrooms);
    if (active.bathrooms !== 'all') params.append('bathrooms', active.bathrooms);
    if (active.isVerifiedOnly) params.append('isVerified', 'true');
    if (active.isFeaturedOnly) params.append('isFeatured', 'true');
    if (active.sortBy) params.append('sortBy', active.sortBy);

    try {
      const res = await fetch(`/api/properties?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data.properties || [];
      }
    } catch {
      // Local fallback
    }

    return properties.filter((p) => {
      if (active.purpose !== 'all' && p.purpose !== active.purpose) return false;
      if (active.propertyType !== 'all' && p.propertyType.toLowerCase() !== active.propertyType.toLowerCase()) return false;
      if (active.city !== 'all' && p.location.city.toLowerCase() !== active.city.toLowerCase()) return false;
      if (active.minPrice > 0 && p.price < active.minPrice) return false;
      if (active.maxPrice > 0 && p.price > active.maxPrice) return false;
      return true;
    });
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(propertyId);
      const updated = exists ? prev.filter((id) => id !== propertyId) : [...prev, propertyId];
      addToast(exists ? 'Removed from saved properties' : 'Added to saved properties', 'info');
      // Fire and forget backend sync
      fetch(`/api/favorites`, {
        method: exists ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId, userId: currentUser.id })
      }).catch(() => {});
      return updated;
    });
  };

  const isFavorite = (propertyId: string) => favorites.includes(propertyId);

  const toggleCompare = (property: Property) => {
    setComparedProperties((prev) => {
      const exists = prev.some((p) => p.id === property.id);
      if (exists) {
        addToast(`Removed "${property.title}" from comparison`, 'info');
        return prev.filter((p) => p.id !== property.id);
      }
      if (prev.length >= 4) {
        addToast('You can compare a maximum of 4 properties side-by-side', 'error');
        return prev;
      }
      addToast(`Added "${property.title}" to comparison`, 'success');
      return [...prev, property];
    });
  };

  const clearCompare = () => {
    setComparedProperties([]);
  };

  const isCompared = (propertyId: string) => comparedProperties.some((p) => p.id === propertyId);

  const resetFilters = () => setFilters(initialFilters);

  const submitProperty = async (data: Partial<Property>): Promise<Property> => {
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          ownerId: currentUser.id,
          ownerName: currentUser.name
        })
      });
      if (res.ok) {
        const created: Property = await res.json();
        setProperties((prev) => [created, ...prev]);
        addToast(
          created.status === 'pending_approval'
            ? 'Property submitted successfully! It is now pending administrative verification.'
            : 'Property published successfully!',
          'success'
        );
        return created;
      }
    } catch {
      // Local fallback
    }

    const fallbackProp: Property = {
      id: `prop-${Date.now()}`,
      slug: (data.title || 'property').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: data.title || 'Submitted Property',
      purpose: data.purpose || 'sale',
      propertyType: data.propertyType || 'House',
      price: data.price || 0,
      currency: 'PKR',
      bedrooms: data.bedrooms || 3,
      bathrooms: data.bathrooms || 3,
      areaSqFt: data.areaSqFt || 2250,
      furnishing: data.furnishing || 'unfurnished',
      parkingSpaces: data.parkingSpaces || 1,
      description: data.description || '',
      highlights: data.highlights || ['Verified Property Listing'],
      features: data.features || [],
      amenities: data.amenities || [],
      images: data.images?.length ? data.images : [MOCK_PROPERTIES[0].images[0]],
      location: data.location || MOCK_PROPERTIES[0].location,
      status: settings.requireApproval ? 'pending_approval' : 'published',
      isFeatured: false,
      isVerified: false,
      agentId: 'agent-1',
      viewsCount: 0,
      inquiryCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProperties((prev) => [fallbackProp, ...prev]);
    addToast('Property submitted successfully (Pending Approval)', 'success');
    return fallbackProp;
  };

  const updateProperty = async (id: string, updates: Partial<Property>): Promise<Property> => {
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setProperties((prev) => prev.map((p) => (p.id === id ? updated : p)));
        addToast('Property updated successfully', 'success');
        return updated;
      }
    } catch {}

    let updatedProp: Property = properties[0];
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          updatedProp = { ...p, ...updates, updatedAt: new Date().toISOString() };
          return updatedProp;
        }
        return p;
      })
    );
    addToast('Property updated successfully', 'success');
    return updatedProp;
  };

  const deleteProperty = async (id: string): Promise<boolean> => {
    try {
      await fetch(`/api/properties/${id}`, { method: 'DELETE' });
    } catch {}
    setProperties((prev) => prev.filter((p) => p.id !== id));
    addToast('Property removed', 'info');
    return true;
  };

  const submitInquiry = async (data: Omit<PropertyInquiry, 'id' | 'createdAt' | 'status'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const json = await res.json();
        setInquiries((prev) => [json.inquiry, ...prev]);
        addToast('Inquiry sent successfully! An agent will contact you shortly.', 'success');
        return true;
      }
    } catch {}

    const localInq: PropertyInquiry = {
      ...data,
      id: `inq-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    setInquiries((prev) => [localInq, ...prev]);
    addToast('Inquiry sent successfully! An agent will contact you shortly.', 'success');
    return true;
  };

  const scheduleViewing = async (data: Omit<ViewingAppointment, 'id' | 'createdAt' | 'status'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const newApp = await res.json();
        setAppointments((prev) => [newApp, ...prev]);
        addToast('Viewing request submitted! Your assigned agent will confirm the schedule.', 'success');
        return true;
      }
    } catch {}

    const localApp: ViewingAppointment = {
      ...data,
      id: `app-${Date.now()}`,
      agentName: agents.find((a) => a.id === data.agentId)?.name || 'Tariq Mehmood',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setAppointments((prev) => [localApp, ...prev]);
    addToast('Viewing request submitted!', 'success');
    return true;
  };

  const createLead = async (data: Partial<Lead>): Promise<Lead> => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const lead = await res.json();
        setLeads((prev) => [lead, ...prev]);
        addToast('New CRM lead created', 'success');
        return lead;
      }
    } catch {}

    const localLead: Lead = {
      id: `lead-${Date.now()}`,
      name: data.name || 'New Lead',
      phone: data.phone || '',
      email: data.email || '',
      source: data.source || 'website',
      budget: data.budget || 50000000,
      preferredLocation: data.preferredLocation || 'Lahore',
      purpose: data.purpose || 'sale',
      notes: data.notes || '',
      status: data.status || 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activities: []
    };
    setLeads((prev) => [localLead, ...prev]);
    addToast('New CRM lead created', 'success');
    return localLead;
  };

  const updateLead = async (id: string, updates: Partial<Lead>): Promise<Lead> => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
        return updated;
      }
    } catch {}

    let resLead = leads[0];
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          resLead = { ...l, ...updates, updatedAt: new Date().toISOString() };
          return resLead;
        }
        return l;
      })
    );
    return resLead;
  };

  const addLeadActivity = async (leadId: string, activityType: 'call' | 'email' | 'meeting' | 'note', details: string) => {
    try {
      await fetch(`/api/leads/${leadId}/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityType, details, agentName: currentUser.name })
      });
    } catch {}

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          const act = {
            id: `act-${Date.now()}`,
            date: new Date().toISOString(),
            agentName: currentUser.name,
            activityType,
            details
          };
          return {
            ...l,
            activities: [act, ...(l.activities || [])]
          };
        }
        return l;
      })
    );
    addToast('Activity logged for lead', 'info');
  };

  const updateAppointmentStatus = async (id: string, status: ViewingAppointment['status']) => {
    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch {}
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    addToast(`Appointment status updated to ${status}`, 'info');
  };

  const updateSettings = async (newSettings: Partial<PlatformSettings>) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        const updated = await res.json();
        setSettingsState(updated);
        addToast('Platform settings saved successfully', 'success');
        return;
      }
    } catch {}
    setSettingsState((prev) => ({ ...prev, ...newSettings }));
    addToast('Platform settings saved', 'success');
  };

  const featuredProperties = properties.filter((p) => p.isFeatured && (p.status === 'published' || p.status === 'featured'));

  return (
    <RealEstateContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isStaff,
        login,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        switchUserRole,
        currency,
        setCurrency,
        formatPrice,
        properties,
        featuredProperties,
        projects,
        agents,
        leads,
        inquiries,
        appointments,
        blogPosts,
        settings,
        auditLogs,
        favorites,
        toggleFavorite,
        isFavorite,
        comparedProperties,
        toggleCompare,
        clearCompare,
        isCompared,
        filters,
        setFilters,
        resetFilters,
        fetchProperties,
        submitProperty,
        updateProperty,
        deleteProperty,
        submitInquiry,
        scheduleViewing,
        createLead,
        updateLead,
        addLeadActivity,
        updateAppointmentStatus,
        updateSettings,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </RealEstateContext.Provider>
  );
};

export const useRealEstate = () => {
  const context = useContext(RealEstateContext);
  if (!context) throw new Error('useRealEstate must be used within RealEstateProvider');
  return context;
};
