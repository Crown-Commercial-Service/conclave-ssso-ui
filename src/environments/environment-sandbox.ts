export const environment = {
  production: true,
  idam_client_id:'IDAM_ID',
  uri: {
    api: {
      isApiGateWayEnabled: false,
      security: 'https://sand-api-security.london.cloudapps.digital',
      postgres: 'https://sand-api-core.london.cloudapps.digital',
      cii: 'https://conclave-cii-testing-talkative-oryx-hh.london.cloudapps.digital',
      wrapper: {
        apiGatewayEnabled: {
          user: 'https://sand-api-wrapper.london.cloudapps.digital/user-profiles',
          organisation: 'https://sand-api-wrapper.london.cloudapps.digital/organisation-profiles',
          contact: 'https://sand-api-wrapper.london.cloudapps.digital/contacts',
          configuration: 'https://sand-api-wrapper.london.cloudapps.digital/configurations',
          dataMigration: 'https://sand-api-wrapper.london.cloudapps.digital/datamigration',
        },
        apiGatewayDisabled: {
          user: 'https://sand-api-wrapper.london.cloudapps.digital/users',
          organisation: 'https://sand-api-wrapper.london.cloudapps.digital/organisations',
          contact: 'https://sand-api-wrapper.london.cloudapps.digital/contacts',
          configuration: 'https://sand-api-wrapper.london.cloudapps.digital/configurations',
          dataMigration: 'https://sand-api-wrapper.london.cloudapps.digital/datamigration',
        }
      }
    },
    web: {
      dashboard: 'https://sand-ccs-sso.london.cloudapps.digital',
      name: "Sandbox"
    },
    ccsContactUrl: "https://webdev.crowncommercial.gov.uk/contact",
    ccsDashboardUrl: "https://webdev.crowncommercial.gov.uk"
  },
  googleTagMangerId: 'GTM',
  cookieExpirationTimeInMinutes: 525600,
  bulkUploadPollingFrequencyInSeconds: 5,
  bulkUploadMaxFileSizeInBytes:1048576,
  bulkUploadTemplateFileUrl: 'BUCKET_URL',
  usedPasswordThreshold: 5, //This value should be changed when Auth0 password history policy changed,
  listPageSize: 10,
  mailDecryptKey:'conclavesimpleemailencrypt',  
  rollbar: {
    key: 'ROLLBAR',
    enable : false,
    security_log: false,
    environment: 'sand-ccs-sso'
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
   hideIDP:false,
   hideDelegation:false,
   hideBulkupload:false,
   hideAutoValidation:true,
   hideSimplifyRole:false,
   blockedScheme: ["GB-PPG"],
  },
};
