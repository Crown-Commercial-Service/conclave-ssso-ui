import { UserTitleEnum } from "../constants/enum";
import { Address } from "./contactDetail";
import { PaginationInfo } from "./paginationInfo";

export interface OrganisationRegisterDto {
    ciiDetails: CiiOrganisationDto;
    rightToBuy: boolean;
    businessType: string;
    supplierBuyerType: number;
    adminUserName: string;
    adminUserFirstName: string;
    adminUserLastName: string;
    adminUserTitle: string;
}

export interface OrganisationRegBasicInfo {
    orgName : string;
    adminEmail: string;
    adminUserFirstName: string;
    adminUserLastName: string;
    ciiOrgId: string;
}

export interface CiiOrganisationDto {
    name?: string;
    contactPoint?: CiiContactPointDto;
    identifier?: CiiIdentifier;
    additionalIdentifiers?: CiiIdentifier[];
    address?: CiiAddress;
}

export interface CiiContactPointDto {
    name?: string;
    email?: string;
    telephone?: string;
    faxNumber?: string;
    uri?: string;
}

export interface CiiIdentifier {
    id?: string;
    legalName?: string;
    scheme?: string;
    uri?: string;
}

export interface CiiAddress {
    streetAddress?: string;
    locality?: string;
    region?: string;
    postalCode?: string;
    countryName?: string;
}

export interface OrganisationDto {
    identifier?: CiiIdentifier;
    additionalIdentifiers?: CiiIdentifier[];
    address?: Address;
    detail?: OrganisationDetails;
}

export interface OrganisationDetails{
    organisationId: string;
    rightToBuy: boolean;
    businessType: string;
    supplierBuyerType: number;
}

export interface OrganisationSearchDto{
    organisationId: string;
    ciiOrganisationId: string;
    organisationUri: string;
    legalName: string;
}

export interface OrganisationAuditList
{
    organisationName: string;
    organisationType: number;
    organisationTypeName: string;
    dateOfRegistration: Date;
}

export interface OrganisationAuditListResponse extends PaginationInfo {
    organisationAuditList: OrganisationAuditList[];
}