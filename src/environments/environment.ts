export const environment = {
  production: false,
  idam_client_id: '5G2pNShwaBQzjJNx6fCSqt9ZIAU9sEur',
  uri: {
    api: {
      isApiGateWayEnabled: false,
      security: 'https://localhost:44352',
      postgres: 'https://localhost:44330',
      wrapper: {
        apiGatewayEnabled: {
          user: 'https://localhost:44309/user-profiles',
          organisation: 'https://localhost:44309/organisation-profiles',
          contact: 'https://localhost:44309/contacts',
          configuration: 'https://localhost:44309/configurations',
        },
        apiGatewayDisabled: {
          user: 'https://localhost:44309/users',
          organisation: 'https://localhost:44309/organisations',
          contact: 'https://localhost:44309/contacts',
          configuration: 'https://localhost:44309/configurations',
        }
      }
    },
    web: {
      dashboard: 'http://localhost:4200'
    },
    ccsContactUrl: "https://www.crowncommercial.gov.uk/contact"
  },
  googleTagMangerId: 'GTM-1',
  cookieExpirationTimeInMinutes:10,// 525600 => 365 Days
  bulkUploadPollingFrequencyInSeconds: 60,
  bulkUploadTemplateFileUrl: '',
  bulkUploadMaxFileSizeInBytes:1048576,//default value
  usedPasswordThreshold: 5, //This value should be changed when Auth0 password history policy changed,
  listPageSize: 10,
  mailDecryptKey:'',
  rollbar: {
    key: '39bb38f087ee4a6781b9d76a73200dd8',
    enable: false,
    security_log:false,
    environment:'dev-ccs-sso'
  } ,
  cookies_policy: {
    essentialcookies: {
      notify_admin_session: 20,
      cookie_policy: 1,
      ccs_sso_visitedsites :30,
      opbs :30,
      ccs_sso:30,
      conclave:30,
      XSRF_TOKEN:30,
      XSRF_TOKEN_SVR:30,
      AspNetCore_Antiforgery_GWNWkbbyKbw:30
    },
    Auth0cookies: {
      auth0_compat : 3,
      did_compat  : 6,
      did  : 6,
      auth0   : 3,
      __cf_bm : 30 
    },
  },
  appSetting: {
   hideIDP:false,
   hideDelegation:false,
   hideBulkupload:false,
   hideAutoValidation:false,
  },
};