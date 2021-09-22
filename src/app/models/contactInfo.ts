import { AssignedContactType } from "../constants/enum";

export interface ContactPoint {
    contactPointId?: number;
    contactPointReason?: string;
    contactPointName?: string;
    assignedContactType?: AssignedContactType;
    originalContactPointId?: number;
    contacts: ContactDetail[];
}

export interface ContactDetail {
    contactId?: number;
    contactType: string;
    contactValue: string;
}

export interface UserDetailInfo {
    userId: string;
    organisationId: string;
}

export interface UserContactInfo extends ContactPoint {
    detail: UserDetailInfo;
}

export interface UserContactInfoList {
    userId: string;
    organisationId: string;
    contactPoints: ContactPoint[]
}

export interface OrganisationDetailInfo {
    organisationId: string;
}

export interface OrganisationContactInfo extends ContactPoint {
    detail: OrganisationDetailInfo;
}

export interface OrganisationContactInfoList {
    organisationId: string;
    contactPoints: ContactPoint[]
}

export interface SiteDetailInfo {
    organisationId: string;
    siteId: number;
}

export interface SiteContactInfo extends ContactPoint {
    detail: SiteDetailInfo;
}

export interface SiteContactInfoList {
    organisationId: string;
    siteId: number;
    contactPoints: ContactPoint[]
}

export const VirtualContactType = {
    EMAIL: "EMAIL",
    PHONE: "PHONE",
    FAX: "FAX",
    URL: "WEB_ADDRESS",
}

export interface ContactGridInfo {
    contactId?: number;
    contactReason?: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
    fax?: string;
    webUrl?: string;
    isChecked?: boolean;
}

export interface ContactAssignmentInfo {
    assigningContactType: AssignedContactType,
    assigningContactPointIds: number[];
    assigningContactsUserId?: string;
    assigningContactsSiteId?: number;
}