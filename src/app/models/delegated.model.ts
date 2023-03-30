export interface delegateduser {
  userName: string;
  detail: {
    delegatedOrgId: string;
    roleIds: any;
    serviceRoleGroupInfo?: rolePermissionInfo[] | any[]
    startDate: Date;
    endDate: Date;
  };
}


export interface rolePermissionInfo {
  roleId: number,
  roleName: string,
  roleKey: string,
  serviceClientId?: string,
  serviceClientName?: string
}