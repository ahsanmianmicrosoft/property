import 'dotenv/config';
import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import {
  MOCK_PROPERTIES,
  MOCK_PROJECTS,
  MOCK_AGENTS,
  MOCK_LEADS,
  MOCK_INQUIRIES,
  MOCK_APPOINTMENTS,
  MOCK_BLOG_POSTS,
  DEFAULT_SETTINGS,
  MOCK_AUDIT_LOGS,
  MOCK_USERS,
  MOCK_AMENITIES,
  CITIES_AND_AREAS,
  PROPERTY_TYPES
} from './src/data/mockData';
import { Property, Lead, PropertyInquiry, ViewingAppointment, PlatformSettings, AuditLogItem, BlogPost, User } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-Memory Database Store initialized from seed
let properties: Property[] = [...MOCK_PROPERTIES];
let projects = [...MOCK_PROJECTS];
let agents = [...MOCK_AGENTS];
let leads: Lead[] = [...MOCK_LEADS];
let inquiries: PropertyInquiry[] = [...MOCK_INQUIRIES];
let appointments: ViewingAppointment[] = [...MOCK_APPOINTMENTS];
let blogPosts = [...MOCK_BLOG_POSTS];
let settings: PlatformSettings = { ...DEFAULT_SETTINGS };
let auditLogs: AuditLogItem[] = [...MOCK_AUDIT_LOGS];
let users = [...MOCK_USERS];
let favorites: { userId: string; propertyId: string }[] = [];

// Helper to log audit event
const logAudit = (userId: string, userName: string, action: string, entity: string, entityId: string, details: string) => {
  const newLog: AuditLogItem = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId,
    userName,
    action,
    entity,
    entityId,
    details,
    ipAddress: '127.0.0.1',
    timestamp: new Date().toISOString()
  };
  auditLogs.unshift(newLog);
  if (auditLogs.length > 200) auditLogs.pop();
};

// ==================== API ROUTES ====================

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'PrimeHaven Real Estate API', time: new Date().toISOString() });
});

// Taxonomy Endpoints
app.get('/api/taxonomy', (_req: Request, res: Response) => {
  res.json({
    propertyTypes: PROPERTY_TYPES,
    amenities: MOCK_AMENITIES,
    locations: CITIES_AND_AREAS
  });
});

// Settings Endpoints
app.get('/api/settings', (_req: Request, res: Response) => {
  res.json(settings);
});

app.patch('/api/settings', (req: Request, res: Response) => {
  settings = { ...settings, ...req.body };
  logAudit('usr-admin-1', 'Admin', 'UPDATE_SETTINGS', 'Settings', 'general', 'Updated platform configuration');
  res.json(settings);
});

// Properties Endpoints
app.get('/api/properties', (req: Request, res: Response) => {
  let list = [...properties];

  const {
    keyword,
    purpose,
    propertyType,
    city,
    area,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    status,
    isFeatured,
    isVerified,
    agentId,
    sortBy,
    page = '1',
    limit = '50'
  } = req.query as Record<string, string>;

  // Filter by status if provided; by default public sees only published or featured
  if (status) {
    if (status !== 'all') {
      list = list.filter((p) => p.status === status);
    }
  } else {
    // default public view: exclude drafts and archived unless requested
    list = list.filter((p) => p.status === 'published' || p.status === 'featured' || p.status === 'sold' || p.status === 'rented');
  }

  if (keyword) {
    const q = keyword.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.location.city.toLowerCase().includes(q) ||
        p.location.area.toLowerCase().includes(q) ||
        (p.location.society && p.location.society.toLowerCase().includes(q))
    );
  }

  if (purpose && purpose !== 'all') {
    list = list.filter((p) => p.purpose === purpose);
  }

  if (propertyType && propertyType !== 'all') {
    list = list.filter((p) => p.propertyType.toLowerCase() === propertyType.toLowerCase());
  }

  if (city && city !== 'all') {
    list = list.filter((p) => p.location.city.toLowerCase() === city.toLowerCase());
  }

  if (area && area !== 'all') {
    list = list.filter((p) => p.location.area.toLowerCase().includes(area.toLowerCase()));
  }

  if (minPrice) {
    const min = parseFloat(minPrice);
    if (!isNaN(min)) list = list.filter((p) => p.price >= min);
  }

  if (maxPrice) {
    const max = parseFloat(maxPrice);
    if (!isNaN(max)) list = list.filter((p) => p.price <= max);
  }

  if (bedrooms && bedrooms !== 'all') {
    const beds = parseInt(bedrooms, 10);
    if (!isNaN(beds)) {
      list = list.filter((p) => (bedrooms.includes('+') ? p.bedrooms >= beds : p.bedrooms === beds));
    }
  }

  if (bathrooms && bathrooms !== 'all') {
    const baths = parseInt(bathrooms, 10);
    if (!isNaN(baths)) {
      list = list.filter((p) => p.bathrooms >= baths);
    }
  }

  if (isFeatured === 'true') {
    list = list.filter((p) => p.isFeatured);
  }

  if (isVerified === 'true') {
    list = list.filter((p) => p.isVerified);
  }

  if (agentId) {
    list = list.filter((p) => p.agentId === agentId);
  }

  // Sorting
  if (sortBy === 'price_asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'oldest') {
    list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else if (sortBy === 'most_viewed') {
    list.sort((a, b) => b.viewsCount - a.viewsCount);
  } else {
    // Newest default
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = list.slice(startIndex, startIndex + limitNum);

  res.json({
    total: list.length,
    page: pageNum,
    totalPages: Math.ceil(list.length / limitNum),
    properties: paginated
  });
});

app.get('/api/properties/:slugOrId', (req: Request, res: Response) => {
  const { slugOrId } = req.params;
  const property = properties.find((p) => p.slug === slugOrId || p.id === slugOrId);
  if (!property) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }
  // increment view count
  property.viewsCount += 1;
  res.json(property);
});

app.post('/api/properties', (req: Request, res: Response) => {
  const data = req.body;
  const slug = (data.title || 'property')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') + `-${Date.now().toString().slice(-4)}`;

  const newProperty: Property = {
    ...data,
    id: `prop-${Date.now()}`,
    slug,
    viewsCount: 0,
    inquiryCount: 0,
    status: settings.requireApproval ? 'pending_approval' : (data.status || 'published'),
    isFeatured: data.isFeatured || false,
    isVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  properties.unshift(newProperty);
  logAudit(
    data.ownerId || 'usr-customer-1',
    data.ownerName || 'User',
    'SUBMIT_PROPERTY',
    'Property',
    newProperty.id,
    `Submitted property: "${newProperty.title}" (${newProperty.status})`
  );

  res.status(201).json(newProperty);
});

app.patch('/api/properties/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = properties.findIndex((p) => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }

  const updated: Property = {
    ...properties[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  properties[index] = updated;
  logAudit('usr-admin-1', 'Admin', 'UPDATE_PROPERTY', 'Property', id, `Updated property: ${updated.title}`);

  res.json(updated);
});

app.delete('/api/properties/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const target = properties.find((p) => p.id === id);
  properties = properties.filter((p) => p.id !== id);
  logAudit('usr-admin-1', 'Admin', 'DELETE_PROPERTY', 'Property', id, `Deleted property ${target?.title || id}`);
  res.json({ success: true, message: 'Property deleted' });
});

// Projects Endpoints
app.get('/api/projects', (_req: Request, res: Response) => {
  res.json(projects);
});

app.get('/api/projects/:slug', (req: Request, res: Response) => {
  const project = projects.find((p) => p.slug === req.params.slug || p.id === req.params.slug);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json(project);
});

app.post('/api/projects', (req: Request, res: Response) => {
  const newProject = {
    ...req.body,
    id: `proj-${Date.now()}`,
    slug: req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    createdAt: new Date().toISOString()
  };
  projects.unshift(newProject);
  res.status(201).json(newProject);
});

// Agents Endpoints
app.get('/api/agents', (_req: Request, res: Response) => {
  res.json(agents);
});

app.get('/api/agents/:slugOrId', (req: Request, res: Response) => {
  const agent = agents.find((a) => a.slug === req.params.slugOrId || a.id === req.params.slugOrId);
  if (!agent) {
    res.status(404).json({ error: 'Agent not found' });
    return;
  }
  const agentProperties = properties.filter((p) => p.agentId === agent.id);
  res.json({ ...agent, properties: agentProperties });
});

app.post('/api/agents', (req: Request, res: Response) => {
  const newAgent = {
    ...req.body,
    id: `agent-${Date.now()}`,
    slug: req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    activeListingsCount: 0,
    rating: 5.0,
    reviewsCount: 1
  };
  agents.push(newAgent);
  res.status(201).json(newAgent);
});

// Leads & CRM Endpoints
app.get('/api/leads', (_req: Request, res: Response) => {
  res.json(leads);
});

app.post('/api/leads', (req: Request, res: Response) => {
  const newLead: Lead = {
    ...req.body,
    id: `lead-${Date.now()}`,
    status: req.body.status || 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    activities: [
      {
        id: `act-${Date.now()}`,
        date: new Date().toISOString(),
        agentName: 'System CRM',
        activityType: 'note',
        details: 'Lead created in CRM'
      }
    ]
  };
  leads.unshift(newLead);
  logAudit('usr-admin-1', 'Admin', 'CREATE_LEAD', 'Lead', newLead.id, `Created lead for ${newLead.name}`);
  res.status(201).json(newLead);
});

app.patch('/api/leads/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Lead not found' });
    return;
  }

  const updated: Lead = {
    ...leads[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  leads[index] = updated;
  res.json(updated);
});

app.post('/api/leads/:id/activity', (req: Request, res: Response) => {
  const { id } = req.params;
  const lead = leads.find((l) => l.id === id);
  if (!lead) {
    res.status(404).json({ error: 'Lead not found' });
    return;
  }
  const activity = {
    id: `act-${Date.now()}`,
    date: new Date().toISOString(),
    agentName: req.body.agentName || 'Agent',
    activityType: req.body.activityType || 'note',
    details: req.body.details
  };
  lead.activities = lead.activities || [];
  lead.activities.unshift(activity);
  res.status(201).json(activity);
});

// Inquiries Endpoints
app.get('/api/inquiries', (_req: Request, res: Response) => {
  res.json(inquiries);
});

app.post('/api/inquiries', (req: Request, res: Response) => {
  const newInq: PropertyInquiry = {
    ...req.body,
    id: `inq-${Date.now()}`,
    status: 'new',
    createdAt: new Date().toISOString()
  };
  inquiries.unshift(newInq);

  // Increment property inquiry count
  const prop = properties.find((p) => p.id === newInq.propertyId);
  if (prop) {
    prop.inquiryCount += 1;
  }

  // Automatically create a corresponding lead in the CRM!
  const newLead: Lead = {
    id: `lead-inq-${Date.now()}`,
    name: newInq.customerName,
    phone: newInq.customerPhone,
    email: newInq.customerEmail,
    source: 'website',
    propertyId: newInq.propertyId,
    agentId: prop?.agentId || 'agent-1',
    budget: prop?.price || 0,
    preferredLocation: prop ? `${prop.location.area}, ${prop.location.city}` : '',
    purpose: prop?.purpose || 'sale',
    notes: `Inquiry message: "${newInq.message}"`,
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    activities: [
      {
        id: `act-${Date.now()}`,
        date: new Date().toISOString(),
        agentName: 'Website Engine',
        activityType: 'note',
        details: `Customer submitted inquiry on ${prop?.title || 'property'}`
      }
    ]
  };
  leads.unshift(newLead);

  logAudit(
    'system',
    'Website Visitor',
    'SUBMIT_INQUIRY',
    'Inquiry',
    newInq.id,
    `New inquiry received from ${newInq.customerName} on ${newInq.propertyTitle}`
  );

  res.status(201).json({ inquiry: newInq, leadCreated: true });
});

app.patch('/api/inquiries/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const inq = inquiries.find((i) => i.id === id);
  if (!inq) {
    res.status(404).json({ error: 'Inquiry not found' });
    return;
  }
  Object.assign(inq, req.body);
  res.json(inq);
});

// Appointments / Viewing Requests
app.get('/api/appointments', (_req: Request, res: Response) => {
  res.json(appointments);
});

app.post('/api/appointments', (req: Request, res: Response) => {
  const prop = properties.find((p) => p.id === req.body.propertyId);
  const agent = agents.find((a) => a.id === req.body.agentId) || agents[0];

  const newApp: ViewingAppointment = {
    ...req.body,
    id: `app-${Date.now()}`,
    propertyTitle: prop?.title || req.body.propertyTitle || 'Property',
    agentName: agent.name,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  appointments.unshift(newApp);

  // Also register in CRM Leads as viewing scheduled
  const matchingLead = leads.find((l) => l.email === newApp.customerEmail || l.phone === newApp.customerPhone);
  if (matchingLead) {
    matchingLead.status = 'viewing_scheduled';
    matchingLead.followUpDate = newApp.date;
    matchingLead.activities?.unshift({
      id: `act-${Date.now()}`,
      date: new Date().toISOString(),
      agentName: agent.name,
      activityType: 'meeting',
      details: `Viewing appointment requested for ${newApp.date} (${newApp.timeSlot})`
    });
  }

  logAudit(
    'system',
    newApp.customerName,
    'REQUEST_VIEWING',
    'Appointment',
    newApp.id,
    `Viewing requested for ${newApp.propertyTitle} on ${newApp.date}`
  );

  res.status(201).json(newApp);
});

app.patch('/api/appointments/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const appItem = appointments.find((a) => a.id === id);
  if (!appItem) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }
  Object.assign(appItem, req.body);
  logAudit('usr-admin-1', 'Admin', 'UPDATE_APPOINTMENT', 'Appointment', id, `Updated status to ${appItem.status}`);
  res.json(appItem);
});

// Favorites Endpoints
app.get('/api/favorites', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'usr-customer-1';
  const userFavorites = favorites.filter((f) => f.userId === userId).map((f) => f.propertyId);
  res.json(userFavorites);
});

app.post('/api/favorites', (req: Request, res: Response) => {
  const { userId = 'usr-customer-1', propertyId } = req.body;
  if (!favorites.some((f) => f.userId === userId && f.propertyId === propertyId)) {
    favorites.push({ userId, propertyId });
  }
  res.json({ success: true, favorites: favorites.filter((f) => f.userId === userId).map((f) => f.propertyId) });
});

app.delete('/api/favorites/:propertyId', (req: Request, res: Response) => {
  const { propertyId } = req.params;
  const userId = (req.query.userId as string) || 'usr-customer-1';
  favorites = favorites.filter((f) => !(f.userId === userId && f.propertyId === propertyId));
  res.json({ success: true, favorites: favorites.filter((f) => f.userId === userId).map((f) => f.propertyId) });
});

// Blog Endpoints
app.get('/api/blog', (_req: Request, res: Response) => {
  res.json(blogPosts);
});

app.get('/api/blog/:slug', (req: Request, res: Response) => {
  const post = blogPosts.find((b) => b.slug === req.params.slug || b.id === req.params.slug);
  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }
  res.json(post);
});

app.post('/api/blog', (req: Request, res: Response) => {
  const newPost: BlogPost = {
    ...req.body,
    id: `post-${Date.now()}`,
    slug: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    publishedAt: new Date().toISOString()
  };
  blogPosts.unshift(newPost);
  res.status(201).json(newPost);
});

// Analytics & Reports
app.get('/api/analytics', (_req: Request, res: Response) => {
  const totalProperties = properties.length;
  const activeProperties = properties.filter((p) => p.status === 'published' || p.status === 'featured').length;
  const pendingProperties = properties.filter((p) => p.status === 'pending_approval').length;
  const soldProperties = properties.filter((p) => p.status === 'sold').length;
  const rentedProperties = properties.filter((p) => p.status === 'rented').length;

  const leadsByStatus = {
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    interested: leads.filter((l) => l.status === 'interested').length,
    viewing_scheduled: leads.filter((l) => l.status === 'viewing_scheduled').length,
    negotiation: leads.filter((l) => l.status === 'negotiation').length,
    converted: leads.filter((l) => l.status === 'converted').length,
    lost: leads.filter((l) => l.status === 'lost').length
  };

  const leadsBySource = leads.reduce((acc, curr) => {
    acc[curr.source] = (acc[curr.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalViews = properties.reduce((sum, p) => sum + p.viewsCount, 0);
  const totalInquiries = inquiries.length;
  const totalAppointments = appointments.length;

  res.json({
    metrics: {
      totalProperties,
      activeProperties,
      pendingProperties,
      soldProperties,
      rentedProperties,
      totalLeads: leads.length,
      totalAgents: agents.length,
      totalViews,
      totalInquiries,
      totalAppointments
    },
    leadsByStatus,
    leadsBySource,
    recentInquiries: inquiries.slice(0, 5),
    recentAppointments: appointments.slice(0, 5)
  });
});

// Audit Logs
app.get('/api/audit-logs', (_req: Request, res: Response) => {
  res.json(auditLogs);
});

// Authentication Simulator (JWT / Token structure)
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase()) || users[0];
  res.json({
    token: `jwt-bearer-${user.id}-${Date.now()}`,
    user
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, phone, role = 'CUSTOMER' } = req.body;
  const newUser: User = {
    id: `usr-${Date.now()}`,
    name,
    email,
    phone,
    role,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  res.status(201).json({
    token: `jwt-bearer-${newUser.id}-${Date.now()}`,
    user: newUser
  });
});

app.get('/api/auth/users', (_req: Request, res: Response) => {
  res.json(users);
});

// Vite Middleware for SPA Development & Production
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PrimeHaven Full-Stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
