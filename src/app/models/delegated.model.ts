export interface delegateduser {
  userName: string;
  detail: {
    delegatedOrgId: string;
    roleIds:any;
    startDate: Date;
    endDate: Date;
  };
}
