import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { WrapperOrganisationGroupService } from "../services/wrapper/wrapper-org--group-service";
import { Role } from 'src/app/models/organisationGroup';
import { WrapperUserService } from "../services/wrapper/wrapper-user.service";
import { SessionService } from "../shared/session.service";

@Injectable({
    providedIn: 'root',
})
export class UserProfileResolver  {

    private adminRoleKey: string = 'ORG_ADMINISTRATOR';
    private isAdminUser = false;
        
    private userService = inject(WrapperUserService);
    private orgGroupService = inject(WrapperOrganisationGroupService);
    private sessionService = inject(SessionService);

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        // const userName =  this.sessionService.decrypt('user_name')
        // const organisationId = localStorage.getItem('cii_organisation_id') || '';
        // let user = await this.userService.getUser(userName).toPromise();
        // await this.orgGroupService.getOrganisationRoles(organisationId)
        //     .toPromise()
        //     .then((orgRoles: Role[]) => {
        //         orgRoles.forEach((r: Role) => {
        //             let userRole = user.detail.rolePermissionInfo && user.detail.rolePermissionInfo.some((rp: Role) => rp.roleId == r.roleId);
        //             if (userRole) {
        //                 if (r.roleKey == this.adminRoleKey && this.isAdminUser == false) {
        //                     this.isAdminUser = true;
        //                 }
        //             }
        //         });
        //         var adminRoleId = orgRoles.find((r: Role) => r.roleKey === this.adminRoleKey)?.roleId;
        //         if (user.detail.userGroups?.find((x: any) => x.accessServiceRoleGroupId === adminRoleId)) {
        //             this.isAdminUser = true;
        //         }
        //     });
        // return this.isAdminUser;
        return localStorage.getItem("isOrgAdmin") === "true";
    }

}
