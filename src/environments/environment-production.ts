export const environment = {

  production: true,

  idam_client_id: '%IDAM%',

  uri: {

    api: {

      isApiGateWayEnabled: true,

      security: 'https://api.crowncommercial.gov.uk',

      postgres: 'https://api.crowncommercial.gov.uk/dashboard-wrapper',

      //cii: 'https://conclave-cii-integration-brash-shark-mk.london.cloudapps.digital',

      wrapper: {
        apiGatewayEnabled: {
          user: 'https://api.crowncommercial.gov.uk/user-profile',
          organisation: 'https://api.crowncommercial.gov.uk/organisation-profile',
          contact: 'https://api.crowncommercial.gov.uk/contact-service',
          configuration: 'https://api.crowncommercial.gov.uk/configuration-service',
          dataMigration: 'https://api.crowncommercial.gov.uk/organisation-profile/datamigration',
        },
        apiGatewayDisabled: {
          user: 'https://prod.ppg-sso-service.crowncommercial.gov.uk/user-profile',
          organisation: 'https://prod.ppg-sso-service.crowncommercial.gov.uk/organisation-profile',
          contact: 'https://prod.ppg-sso-service.crowncommercial.gov.uk/contact-service',
          configuration: 'https://prod.ppg-sso-service.crowncommercial.gov.uk/configuration-service',
          dataMigration: 'https://prod.ppg-sso-service.crowncommercial.gov.uk/organisation-profile/datamigration',
        }
      }

    },

    web: {

      dashboard: 'https://identify.crowncommercial.gov.uk',
      name: ""

    },

    ccsContactUrl: "https://www.crowncommercial.gov.uk/contact",
    ccsDashboardUrl: "https://identify.crowncommercial.gov.uk"

  },

  googleTagMangerId: 'GTM-TZCX5VP',

  cookieExpirationTimeInMinutes: 525600,

  bulkUploadPollingFrequencyInSeconds: 5,

  bulkUploadMaxFileSizeInBytes:1048576,

  bulkUploadTemplateFileUrl: 'https://api.crowncommercial.gov.uk/templates/DataMigrationTemplate.csv',

  usedPasswordThreshold: 5, //This value should be changed when Auth0 password history policy changed,

  listPageSize: 10,

  mailDecryptKey:'conclavesimpleemailencrypt',

  rollbar: {

    key: '%ROLLBAR%',

    enable: true,

    security_log: false,
    
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
    hideSimplifyRole: false,
    blockedScheme: ["GB-PPG"],
    customMfaEnabled: true,
    isMaintenance: false,
    excludedForDelegation: ['ORG_ADMINISTRATOR', 'ORG_DEFAULT_USER', 'ORG_USER_SUPPORT', 'MANAGE_SUBSCRIPTIONS', 'DATA_MIGRATION', 'CAT_ADMIN'],
   },
};
