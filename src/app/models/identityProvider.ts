export interface IdentityProvider {
    id: number;
    connectionName: string,
    name: string;
    enabled?: boolean;
}

export interface IdentityProviderSummary {
    changedOrgIdentityProviders : IdentityProvider[];
    ciiOrganisationId : string;
}