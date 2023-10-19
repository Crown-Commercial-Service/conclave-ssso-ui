export const environment = {
  production: false,
  idam_client_id: '',
  uri: {
    api: {
      isApiGateWayEnabled: false,
      security: 'https://localhost:44352',
      postgres: 'https://localhost:5000/dashboard-wrapper',
      wrapper: {
        apiGatewayEnabled: {
          user: 'https://localhost:5014/user-profiles',
          organisation: 'https://localhost:7021/organisation-profiles',
          contact: 'http://localhost:11674/contact-service',
          configuration: 'https://localhost:7022/configuration-service',
        },
        apiGatewayDisabled: {
          user: 'https://localhost:5014/users',
          organisation: 'https://localhost:7021/organisations',
          contact: 'http://localhost:11674/contact-service',
          configuration: 'https://localhost:7022/configuration-service',
        }
      }
    },
    web: {
      dashboard: 'http://localhost:4200',
      name: "DEV"
    },
      ccsContactUrl: "https://webdev.crowncommercial.gov.uk/contact",
      ccsDashboardUrl: "https://webdev.crowncommercial.gov.uk"
  },
  googleTagMangerId: 'GTM-1',
  cookieExpirationTimeInMinutes: 10,// 525600 => 365 Days
  bulkUploadPollingFrequencyInSeconds: 60,
  bulkUploadTemplateFileUrl: '',
  bulkUploadMaxFileSizeInBytes: 1048576,//default value
  usedPasswordThreshold: 5, //This value should be changed when Auth0 password history policy changed,
  listPageSize: 10,
  mailDecryptKey: '',
  rollbar: {
    key: '',
    enable: false,
    security_log: false,
    environment: 'dev-ccs-sso'
  },
  cookies_policy: {
    essentialcookies: {
      notify_admin_session: 20,
      cookie_policy: 1,
      ccs_sso_visitedsites: 30,
      opbs: 30,
      ccs_sso: 30,
      conclave: 30,
      XSRF_TOKEN: 30,
      XSRF_TOKEN_SVR: 30,
      AspNetCore_Antiforgery_GWNWkbbyKbw: 30
    },
    Auth0cookies: {
      auth0_compat: 3,
      did_compat: 6,
      did: 6,
      auth0: 3,
      __cf_bm: 30
    },
  },
  appSetting: {
    hideIDP: false,
    hideDelegation: false,
    hideBulkupload: false,
    hideAutoValidation: false,
    hideSimplifyRole: false,
    blockedScheme: ['GB-EDU',"GB-PPG"],
    customMfaEnabled : false,
  },
};
