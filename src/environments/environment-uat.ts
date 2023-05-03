export const environment = {
  production: true,
  idam_client_id: 'IDAM_ID',
  uri: {
    api: {
      isApiGateWayEnabled: true,
      //security: 'https://uat-api-security.london.cloudapps.digital',
      security: 'https://uat.api.crowncommercial.gov.uk',
      //postgres: 'https://uat-api-core.london.cloudapps.digital',
      postgres: 'https://uat.api.crowncommercial.gov.uk/core',
      //cii: 'https://conclave-cii-integration-brash-shark-mk.london.cloudapps.digital',
      wrapper: {
        apiGatewayEnabled: {
          user: 'https://uat.api.crowncommercial.gov.uk/user-profiles',
          organisation: 'https://uat.api.crowncommercial.gov.uk/organisation-profiles',
          contact: 'https://uat.api.crowncommercial.gov.uk/contacts',
          configuration: 'https://uat.api.crowncommercial.gov.uk/configurations',
          dataMigration: 'https://uat.api.crowncommercial.gov.uk//datamigration',
        },
        apiGatewayDisabled: {
          user: 'https://uat-api-wrapper.london.cloudapps.digital/users',
          organisation: 'https://uat-api-wrapper.london.cloudapps.digital/organisations',
          contact: 'https://uat-api-wrapper.london.cloudapps.digital/contacts',
          configuration: 'https://uat-api-wrapper.london.cloudapps.digital/configurations',
          dataMigration: 'https://uat-api-wrapper.london.cloudapps.digitaldatamigration',

        }
      }
    },
    web: {
      //dashboard: 'https://uat-ccs-sso.london.cloudapps.digital'
      dashboard: 'https://uat.identify.crowncommercial.gov.uk'
    },
    ccsContactUrl: "https://www.crowncommercial.gov.uk/contact"
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
    enable: false,
    security_log:false,
    environment: 'uat'
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
   hideAutoValidation:false,
  },
};