// Role management utilities for Lovtiti Agro Mart

export type UserRole = 'BUYER' | 'FARMER' | 'DISTRIBUTOR' | 'TRANSPORTER' | 'AGROEXPERT' | 'AGROEXPERT' | 'ADMIN';

export interface RolePermissions {
  canAccessDashboard: (role: UserRole, dashboard: string) => boolean;
  canCreateListings: (role: UserRole) => boolean;
  canManageOrders: (role: UserRole) => boolean;
  canAccessAnalytics: (role: UserRole) => boolean;
  canManageUsers: (role: UserRole) => boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  BUYER: {
    canAccessDashboard: (role, dashboard) => dashboard === 'buyer' || dashboard === 'admin',
    canCreateListings: () => false,
    canManageOrders: () => true,
    canAccessAnalytics: () => true,
    canManageUsers: () => false,
  },
  FARMER: {
    canAccessDashboard: (role, dashboard) => dashboard === 'farmer' || dashboard === 'admin',
    canCreateListings: () => true,
    canManageOrders: () => true,
    canAccessAnalytics: () => true,
    canManageUsers: () => false,
  },
  DISTRIBUTOR: {
    canAccessDashboard: (role, dashboard) => dashboard === 'distributor' || dashboard === 'admin',
    canCreateListings: () => true,
    canManageOrders: () => true,
    canAccessAnalytics: () => true,
    canManageUsers: () => false,
  },
  TRANSPORTER: {
    canAccessDashboard: (role, dashboard) => dashboard === 'transporter' || dashboard === 'admin',
    canCreateListings: () => false,
    canManageOrders: () => true,
    canAccessAnalytics: () => true,
    canManageUsers: () => false,
  },
  AGROEXPERT: {
    canAccessDashboard: (role, dashboard) => dashboard === 'AGROEXPERT' || dashboard === 'admin',
    canCreateListings: () => true,
    canManageOrders: () => true,
    canAccessAnalytics: () => true,
    canManageUsers: () => false,
  },
  ADMIN: {
    canAccessDashboard: () => true,
    canCreateListings: () => true,
    canManageOrders: () => true,
    canAccessAnalytics: () => true,
    canManageUsers: () => true,
  },
};

export const getRolePermissions = (role: UserRole): RolePermissions => {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.FARMER;
};

export const canAccessDashboard = (userRole: UserRole, dashboardPath: string): boolean => {
  const permissions = getRolePermissions(userRole);
  const dashboard = dashboardPath.replace('/dashboard/', '');
  return permissions.canAccessDashboard(userRole, dashboard);
};

export const getAvailableDashboards = (userRole: UserRole) => {
  const dashboards = [
    { name: 'Buyer Dashboard', path: '/dashboard/buyer', roles: ['BUYER', 'ADMIN'] },
    { name: 'Farmer Dashboard', path: '/dashboard/farmer', roles: ['FARMER', 'ADMIN'] },
    { name: 'Distributor Dashboard', path: '/dashboard/distributor', roles: ['DISTRIBUTOR', 'ADMIN'] },
    { name: 'Transporter Dashboard', path: '/dashboard/transporter', roles: ['TRANSPORTER', 'ADMIN'] },
    { name: 'Agro Expert Dashboard', path: '/dashboard/agro-vet', roles: ['AGROEXPERT', 'ADMIN'] },
    { name: 'AGROEXPERT Dashboard', path: '/dashboard/AGROEXPERT', roles: ['AGROEXPERT', 'ADMIN'] },
  ];

  return dashboards.filter(dashboard => dashboard.roles.includes(userRole));
};

export const getRoleDisplayName = (role: UserRole): string => {
  const displayNames: Record<UserRole, string> = {
    BUYER: 'Buyer',
    FARMER: 'Farmer',
    DISTRIBUTOR: 'Distributor',
    TRANSPORTER: 'Transporter',
    AGROEXPERT: 'Agro Expert',
    ADMIN: 'Administrator',
  };

  return displayNames[role] || 'User';
};

export const getRoleDescription = (role: UserRole): string => {
  const descriptions: Record<UserRole, string> = {
    BUYER: 'Individual or business that purchases agricultural products from farmers and distributors',
    FARMER: 'Agricultural producer who grows and sells crops, livestock, and other farm products',
    DISTRIBUTOR: 'Supply chain intermediary who manages inventory and connects farmers with buyers',
    TRANSPORTER: 'Logistics provider who handles transportation and delivery of agricultural products',
    AGROEXPERT: 'Agricultural expert who sells products, leases equipment, and provides expert advice',
    ADMIN: 'Platform administrator with full access to all features and user management',
  };

  return descriptions[role] || 'Platform user';
};

export const getRoleColor = (role: UserRole): { text: string; bg: string } => {
  const colors: Record<UserRole, { text: string; bg: string }> = {
    BUYER: { text: 'text-blue-600', bg: 'bg-blue-100' },
    FARMER: { text: 'text-green-600', bg: 'bg-green-100' },
    DISTRIBUTOR: { text: 'text-purple-600', bg: 'bg-purple-100' },
    TRANSPORTER: { text: 'text-orange-600', bg: 'bg-orange-100' },
    AGROEXPERT: { text: 'text-red-600', bg: 'bg-red-100' },
    ADMIN: { text: 'text-gray-600', bg: 'bg-gray-100' },
  };

  return colors[role] || colors.FARMER;
};

export const getRoleIcon = (role: UserRole): string => {
  const icons: Record<UserRole, string> = {
    BUYER: 'ShoppingCart',
    FARMER: 'Package',
    DISTRIBUTOR: 'Package',
    TRANSPORTER: 'Truck',
    AGROEXPERT: 'Stethoscope',
    ADMIN: 'Shield',
  };

  return icons[role] || 'User';
};
