import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ContactDetail, ContactGridInfo, ContactGridInfoWithLink, ContactPoint, VirtualContactType, SiteContactInfoListWithLink } from 'src/app/models/contactInfo';
import { SessionStorageKey } from "src/app/constants/constant"

@Injectable({
    providedIn: 'root'
})
export class ContactHelper {

    getContactValueFromContactList(contactType: string, contacts: ContactDetail[], returnNull?: boolean) {
        let contactObject = contacts.find(c => c.contactType == contactType);
        if (contactObject) {
            return contactObject.contactValue;
        }
        else {
            return returnNull ? null : '';
        }
    }

    getContactListFromForm(form: FormGroup) {
        let contactList: ContactDetail[] = [];
        let email = form.get('email')?.value;
        let phoneNumber = form.get('phone')?.value;
        let fax = form.get('fax')?.value;
        let mobileNumber = form.get('mobile')?.value;
        let webUrl = form.get('webUrl')?.value;
        
        if (email != '' && email != null) {
            contactList.push({ contactType: VirtualContactType.EMAIL, contactValue: email });
        }
        if (phoneNumber != '' && phoneNumber != null) {
            contactList.push({ contactType: VirtualContactType.PHONE, contactValue: phoneNumber?.e164Number });
        }
        if (fax != '' && fax != null) {
            contactList.push({ contactType: VirtualContactType.FAX, contactValue: fax?.e164Number });
        }
        if (mobileNumber != '' && mobileNumber != null) {
            contactList.push({ contactType: VirtualContactType.MOBILE, contactValue: mobileNumber?.e164Number });
        }
        if (webUrl != '' && webUrl != null) {
            contactList.push({ contactType: VirtualContactType.URL, contactValue: webUrl });
        }
        return contactList;
    }

    getContactGridInfoList(contactPoints: ContactPoint[]) {
        let contactGridInfoList: ContactGridInfo[] = [];

        contactPoints.forEach(contactPoint => {
            let contactGridInfo: ContactGridInfo = {
                contactId: contactPoint.contactPointId,
                contactReason: contactPoint.contactPointReason,
                name: contactPoint.contactPointName,
                email: this.getContactValueFromContactList(VirtualContactType.EMAIL, contactPoint.contacts) ?? '',
                phoneNumber: this.getContactValueFromContactList(VirtualContactType.PHONE, contactPoint.contacts) ?? '',
                fax: this.getContactValueFromContactList(VirtualContactType.FAX, contactPoint.contacts) ?? '',
                webUrl: this.getContactValueFromContactList(VirtualContactType.URL, contactPoint.contacts) ?? '',
                mobileNumber: this.getContactValueFromContactList(VirtualContactType.MOBILE, contactPoint.contacts) ?? '',

            };

            contactGridInfoList.push(contactGridInfo);
        });

        return contactGridInfoList;
    }

    getContactGridInfoListWithLink(contactPoints: ContactPoint[]) {
        let contactGridInfoList: ContactGridInfoWithLink[] = [];
    
        contactPoints.forEach(contactPoint => {
            let data = {
                'isEdit': true,
                'contactId': contactPoint.contactPointId
            };
    
            let queryParams = { data: JSON.stringify(data) };
    
            let contactGridInfo: ContactGridInfoWithLink = {
                contactId: contactPoint.contactPointId,
                contactReason: contactPoint.contactPointReason,
                name: contactPoint.contactPointName,
                email: this.getContactValueFromContactList(VirtualContactType.EMAIL, contactPoint.contacts) ?? '',
                phoneNumber: this.getContactValueFromContactList(VirtualContactType.PHONE, contactPoint.contacts) ?? '',
                fax: this.getContactValueFromContactList(VirtualContactType.FAX, contactPoint.contacts) ?? '',
                webUrl: this.getContactValueFromContactList(VirtualContactType.URL, contactPoint.contacts) ?? '',
                mobileNumber: this.getContactValueFromContactList(VirtualContactType.MOBILE, contactPoint.contacts) ?? '',
                routeLink: `/manage-org/profile/contact-edit`,
                routeData: queryParams
            };
    
            contactGridInfoList.push(contactGridInfo);
        });
    
        return contactGridInfoList;
    }
    
    parseRouteData(data: any): { assigningSiteId: number, assigningOrgId: string, contactUserName: string, contactSiteId: number, siteCreate: any } {
        let routeData = JSON.parse(data);
        return {
          assigningSiteId: routeData['assigningSiteId'] || 0,
          assigningOrgId: routeData['assigningOrgId'] || "",
          contactUserName: sessionStorage.getItem(SessionStorageKey.ContactAssignUsername) ?? "",
          contactSiteId: routeData['contactSiteId'] || 0,
          siteCreate: routeData['siteCreate'] || false
        };
      }
}