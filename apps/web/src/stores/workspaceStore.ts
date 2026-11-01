import { create } from 'zustand';
import { Business, UserRole } from '@synergy/types';

interface WorkspaceState {
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
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setTopbarLoading: (loading: boolean) => void;
  switchBusiness: (businessId: string) => void;
  addBusiness: (business: Business) => void;
  setCreateBusinessModalOpen: (open: boolean) => void;
  getCurrentBusiness: () => Business | undefined;
}

const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'biz-1',
    organizationId: 'org-1',
    name: 'Aura Apparel',
    slug: 'aura-apparel',
    description: 'Direct-to-consumer sustainable luxury streetwear & lifestyle brand.',
    industry: 'Fashion & E-Commerce',
    timezone: 'America/New_York',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'biz-2',
    organizationId: 'org-1',
    name: 'Novacode SaaS',
    slug: 'novacode-saas',
    description: 'Developer productivity tool for high-velocity software engineering teams.',
    industry: 'B2B Software',
    timezone: 'America/San_Francisco',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'biz-3',
    organizationId: 'org-1',
    name: 'Artisan Bistro',
    slug: 'artisan-bistro',
    description: 'Farm-to-table organic artisanal restaurant and specialty bakery.',
    industry: 'Hospitality & Dining',
    timezone: 'Europe/London',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  currentOrganization: {
    id: 'org-1',
    name: 'CrossTech Holdings',
    slug: 'crosstech-holdings',
  },
  currentUser: {
    id: 'user-1',
    fullName: 'Alex Vance',
    email: 'alex@crosstech.io',
    role: 'super_admin',
  },
  businesses: INITIAL_BUSINESSES,
  currentBusinessId: 'biz-1',
  isSidebarCollapsed: false,
  isCommandPaletteOpen: false,
  isTopbarLoading: false,
  isCreateBusinessModalOpen: false,

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

