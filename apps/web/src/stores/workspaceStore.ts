import { create } from 'zustand';
import { Business, UserRole } from '@synergy/types';

interface WorkspaceState {
  isAuthenticated: boolean;
  currentOrganization: {
    id: string;
    name: string;
    slug: string;
  };
  currentUser: {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
  };
  businesses: Business[];
  currentBusinessId: string;
  isSidebarCollapsed: boolean;
  isCommandPaletteOpen: boolean;
  isTopbarLoading: boolean;
  isCreateBusinessModalOpen: boolean;

  // Actions
  login: (emailOrUser?: string) => void;
  logout: () => void;
  createOrgAndUser: (userName: string, email: string, orgName: string, businessName: string, industry: string) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setTopbarLoading: (loading: boolean) => void;
  switchBusiness: (businessId: string) => void;
  addBusiness: (business: Business) => void;
  setCreateBusinessModalOpen: (open: boolean) => void;
  getCurrentBusiness: () => Business | undefined;
}

const DEFAULT_ORGANIZATION = {
  id: 'org-crosstech',
  name: 'CrossTech',
  slug: 'crosstech',
};

const DEFAULT_USER = {
  id: 'user-crosstech',
  fullName: 'CrossTech Admin',
  email: 'crosstech@synergy.internal',
  role: 'super_admin' as UserRole,
};

const DEFAULT_BUSINESSES: Business[] = [
  {
    id: 'biz-crosstech',
    organizationId: 'org-crosstech',
    name: 'CrossTech',
    slug: 'crosstech',
    description: 'Primary CrossTech AI marketing operations workspace.',
    industry: 'Technology & AI',
    timezone: 'UTC',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  isAuthenticated: typeof window !== 'undefined' ? localStorage.getItem('synergy_auth') === 'true' : false,
  currentOrganization: DEFAULT_ORGANIZATION,
  currentUser: DEFAULT_USER,
  businesses: DEFAULT_BUSINESSES,
  currentBusinessId: 'biz-crosstech',
  isSidebarCollapsed: false,
  isCommandPaletteOpen: false,
  isTopbarLoading: false,
  isCreateBusinessModalOpen: false,

  login: (emailOrUser?: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('synergy_auth', 'true');
    }
    set({
      isAuthenticated: true,
      currentOrganization: DEFAULT_ORGANIZATION,
      currentUser: {
        id: 'user-crosstech',
        fullName: 'CrossTech Admin',
        email: emailOrUser?.includes('@') ? emailOrUser : 'crosstech@crosstech.io',
        role: 'super_admin',
      },
      businesses: DEFAULT_BUSINESSES,
      currentBusinessId: 'biz-crosstech',
    });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('synergy_auth');
    }
    set({
      isAuthenticated: false,
    });
  },

  createOrgAndUser: (userName: string, email: string, orgName: string, businessName: string, industry: string) => {
    const orgId = `org-${Date.now()}`;
    const bizId = `biz-${Date.now()}`;
    const newOrg = {
      id: orgId,
      name: orgName.trim() || 'My Organization',
      slug: (orgName.trim() || 'my-org').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };
    const newBiz: Business = {
      id: bizId,
      organizationId: orgId,
      name: businessName.trim() || 'My Business',
      slug: (businessName.trim() || 'my-biz').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: `${businessName.trim() || 'My Business'} marketing workspace.`,
      industry: industry || 'Technology & Digital Marketing',
      timezone: 'UTC',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('synergy_auth', 'true');
    }

    set({
      isAuthenticated: true,
      currentOrganization: newOrg,
      currentUser: {
        id: `user-${Date.now()}`,
        fullName: userName.trim() || 'Admin User',
        email: email.trim() || 'admin@synergy.internal',
        role: 'org_admin',
      },
      businesses: [newBiz],
      currentBusinessId: bizId,
    });
  },

  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setTopbarLoading: (loading) => set({ isTopbarLoading: loading }),
  switchBusiness: (businessId) => set({ currentBusinessId: businessId }),
  addBusiness: (business) =>
    set((state) => ({
      businesses: [...state.businesses, business],
      currentBusinessId: business.id,
      isCreateBusinessModalOpen: false,
    })),
  setCreateBusinessModalOpen: (open) => set({ isCreateBusinessModalOpen: open }),
  getCurrentBusiness: () => {
    const { businesses, currentBusinessId } = get();
    return businesses.find((b) => b.id === currentBusinessId) || businesses[0];
  },
}));
