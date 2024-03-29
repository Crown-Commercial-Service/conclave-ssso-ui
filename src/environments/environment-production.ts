export const environment = {
  production: true,
  idam_client_id:'IDAM_ID',
  uri: {
    api: {
      isApiGateWayEnabled: true,
      //security: 'https://dev.security.conclave.crowncommercial.gov.uk',
      security: 'https://api.crowncommercial.gov.uk',
      //postgres: 'https://dev.core.conclave.crowncommercial.gov.uk',
      postgres: 'https://api.crowncommercial.gov.uk/dashboard-wrapper',
      //cii: 'https://conclave-cii-integration-brash-shark-mk.london.cloudapps.digital',
      wrapper: {
        apiGatewayEnabled: {
          user: 'https://api.crowncommercial.gov.uk/user-profiles',
          organisation: 'https://api.crowncommercial.gov.uk/organisation-profiles',
          contact: 'https://api.crowncommercial.gov.uk/contacts',
          configuration: 'https://api.crowncommercial.gov.uk/configurations',
        },
        apiGatewayDisabled: {
          user: 'https://prod-api-wrapper.london.cloudapps.digital/users',
          organisation: 'https://prod-api-wrapper.london.cloudapps.digital/organisations',
          contact: 'https://prod-api-wrapper.london.cloudapps.digital/contacts',
          configuration: 'https://prod-api-wrapper.london.cloudapps.digital/configurations',
        }
      }
    },
    web: {
      //dashboard: 'https://dev.sso.conclave.crowncommercial.gov.uk'
      dashboard: 'https://identify.crowncommercial.gov.uk',
      name: "",   // <= name should not be any value in production
    },
    ccsContactUrl: "https://www.crowncommercial.gov.uk/contact",
    ccsDashboardUrl: "https://www.crowncommercial.gov.uk"
  },
  googleTagMangerId: 'GTM',
  cookieExpirationTimeInMinutes: 525600,
  bulkUploadPollingFrequencyInSeconds: 5,
  bulkUploadMaxFileSizeInBytes:1048576,
  bulkUploadTemplateFileUrl: 'BUCKET_URL', // Put the publicly accessible url of the template file
  usedPasswordThreshold: 5, //This value should be changed when Auth0 password history policy changed,
  listPageSize: 10,
  mailDecryptKey:'conclavesimpleemailencrypt',  
  rollbar: {
    key: 'ROLLBAR',
    enable : false,
    security_log:false,
    environment: 'prod-ccs-sso'
  },
  cookies_policy: {
    essentialcookies: {
        notify_admin_session: 20,
        cookie_policy: 1,
        ccs_sso_visitedsites: 60,
        opbs: 60,
        ccs_sso: 60,
        conclave: 60,
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
   hideIDP:true,
   hideDelegation:true,
   hideBulkupload:true,
   hideAutoValidation:false,
   hideSimplifyRole:false,
   blockedScheme: ["GB-PPG"],
  },
};
