import { UserRole } from '../../src/generated/prisma-client';

export type Permission =
    | 'view:dashboard'
    | 'view:finance'
    | 'edit:clinic_profile'
    | 'manage:users'
    | 'buy:supplies'
    | 'create:marketing_asset';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    ADMIN: [
        'view:dashboard',
        'view:finance',
        'edit:clinic_profile',
        'manage:users',
        'buy:supplies',
        'create:marketing_asset'
    ],
    MANAGER: [
        'view:dashboard',
        'edit:clinic_profile',
        'buy:supplies',
        'create:marketing_asset'
    ],
    STAFF: [
        'view:dashboard',
        'create:marketing_asset'
    ]
};

export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
    return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

// Hook simulation for frontend usage (to be replaced with real auth context)
export const usePermission = (userRole: UserRole) => {
    return {
        can: (permission: Permission) => hasPermission(userRole, permission)
    };
};
