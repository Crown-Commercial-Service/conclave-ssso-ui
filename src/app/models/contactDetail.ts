export interface Address {
    streetAddress?: string;
    locality?: string;
    region?: string;
    postalCode?: string;
    countryCode?: string;
    uprn?: string;
}

export interface ContactReason{
    key: string;
    value: string;
}