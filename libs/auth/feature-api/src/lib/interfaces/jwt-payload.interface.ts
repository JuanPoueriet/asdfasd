export interface JwtPayload {
    id: string;
    email: string;
    organizationId: string;
    roles: string[];
    permissions?: string[];
    tokenVersion?: number;

    // --- AÑADIDO ---
    mfaPurpose?: string;
    // --- FIN ---

    isImpersonating?: boolean;
    originalUserId?: string;

}