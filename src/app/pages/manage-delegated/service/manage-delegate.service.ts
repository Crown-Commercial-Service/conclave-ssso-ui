import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ManageDelegateService {
  public delegationEventTypeTable = Object.entries({
    SetupOfDelegation: null,
    RoleAssigned: null,
    RoleUnassigned: null,
    ActivationOfDelegation: null,
    ActivationLinkExpiry: null,
    StartDateChange: null,
    EndDateChange: null,
    ResendActivationLink: null,
    ExpiryOfDelegationAccess: null,
    TerminationOfDelegatedAccess: null,
    RemoveAccess: null,
  }).map(([key, value]) => ({ key, value }));

  public DelegationEventLogTableData: any = [];
  public delegatedOrg: BehaviorSubject<any> = new BehaviorSubject(null);
  private organisationId: string;

  constructor(private AuthService: AuthService, private route: Router) {
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
  }

  public ValueChanged(data: string, box: string, form: string): void {
    if (form === 'startdate') {
      if (box == 'start-day' && data.length > 1) {
        document.getElementById('start-month')?.focus();
      } else if (box == 'start-month' && data.length > 1) {
        document.getElementById('start-year')?.focus();
      }
    } else if (form === 'enddate') {
      if (box == 'end-day' && data.length > 1) {
        document.getElementById('end-month')?.focus();
      } else if (box == 'end-month' && data.length > 1) {
        document.getElementById('end-year')?.focus();
      }
    }
  }

  public tiggerBackspace(data: any, box: string, form: string): void {
    if (form === 'startdate') {
      if (box == 'start-year' && data.length == 0) {
        document.getElementById('start-month')?.focus();
      } else if (box == 'start-month' && data.length == 0) {
        document.getElementById('start-day')?.focus();
      }
    } else if (form === 'enddate') {
      if (box == 'end-year' && data.length == 0) {
        document.getElementById('end-month')?.focus();
      } else if (box == 'end-month' && data.length == 0) {
        document.getElementById('end-day')?.focus();
      }
    }
  }

  public SetInputFocus(inputIndex: string): void {
    document.getElementById(inputIndex)?.focus();
  }

  public setDelegatedOrg(org: any, page: string): void {
    localStorage.setItem('delegatedOrg', org);
    this.delegatedOrg.next(org);
    // Redirect to home page once refresh token call completed
    localStorage.setItem('show_loading_indicator', 'true');
    this.AuthService.renewAccessToken(page);
    this.setPermissionOrgDetails();
  }

  public get getDelegatedOrg(): any {
    return localStorage.getItem('delegatedOrg');
  }

  public setPermissionOrgDetails() {
    this.delegatedOrg.subscribe((data) => {
      if (data == 0 || data == null) {
        localStorage.setItem('permission_organisation_id', this.organisationId);
      } else {
        localStorage.setItem(
          'permission_organisation_id',
          this.getDelegatedOrg
        );
      }
    });
  }

  public matchDelegatedDetailsOne(data: any[]) {
    return data.map((f: any) => {
      switch (f.eventType) {
        case this.delegationEventTypeTable[0].key:
          f.eventLog = {
            name: 'Delegation Setup',
            column: [{ name: 'Start Date',date:f.newDelegationStartDate},{name: 'End Date',date:f.newDelegationEndDate}],
          };
          return f;
          break;
        case this.delegationEventTypeTable[1].key:
          f.eventLog = {
            name: `Service ${f.name} assigned`,
          };
          return f;
          break;
        case this.delegationEventTypeTable[2].key:
          f.eventLog = {
            name: `Service ${f.name} unassigned`,
          };
          return f;
          break;
        default:
          return this.matchDelegatedDetailsTwo(f);
      }
    });
  }

  public matchDelegatedDetailsTwo(f: any) {
    switch (f.eventType) {
      case this.delegationEventTypeTable[3].key:
        f.eventLog = {
          name: 'Delegate activated',
        };
        return f;
        break;
      case this.delegationEventTypeTable[4].key:
        f.eventLog = {
          name: 'Delegate activation link expired',
        };
        return f;
        break;
      case this.delegationEventTypeTable[5].key:
        f.eventLog = {
          name: 'Start date change',
          column: [{ name: 'Previous Start Date',date:f.previousDelegationStartDate},{name: 'New Start Date',date:f.newDelegationStartDate}],
        };
        return f;
        break;
      default:
        return this.matchDelegatedDetailstThree(f);
    }
  }

  public matchDelegatedDetailstThree(f: any) {
    switch (f.eventType) {
      case this.delegationEventTypeTable[6].key:
        f.eventLog = {
          name: 'End date change',
          column: [{ name: 'Previous End Date',date:f.previousDelegationEndDate},{name: 'New End Date',date:f.newDelegationEndDate}],
        };
        return f;
        break;
      case this.delegationEventTypeTable[7].key:
        f.eventLog = {
          name: 'Activation Link Re-Sent',
        };
        return f;
        break;
      case this.delegationEventTypeTable[8].key:
        f.eventLog = {
          name: 'Delegation Automatically Expired',
        };
        return f;
        break;
      case this.delegationEventTypeTable[9].key:
        f.eventLog = {
          name: 'Delegation Terminated',
        };
        return f;
        break;
        case this.delegationEventTypeTable[10].key:
          f.eventLog = {
            name: 'Remove Access',
          };
          return f;
          break;
      default:
        return;
    }
  }
}
