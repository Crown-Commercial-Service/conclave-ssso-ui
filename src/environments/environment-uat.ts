export const environment = {
  production: true,
  idam_client_id: '%IDAM%',
  uri: {
    api: {
      isApiGateWayEnabled: true,
      //security: 'https://uat-api-security.london.cloudapps.digital',
      security: 'https://uat.api.crowncommercial.gov.uk',
      //postgres: 'https://uat-api-core.london.cloudapps.digital',
      postgres: 'https://uat.api.crowncommercial.gov.uk/dashboard-wrapper',
      //cii: 'https://conclave-cii-integration-brash-shark-mk.london.cloudapps.digital',
      wrapper: {
        apiGatewayEnabled: {
          user: 'https://uat.api.crowncommercial.gov.uk/user-profile',
          organisation: 'https://uat.api.crowncommercial.gov.uk/organisation-profile',
          contact: 'https://uat.api.crowncommercial.gov.uk/contact-service',
          configuration: 'https://uat.api.crowncommercial.gov.uk/configuration-service',
          dataMigration: 'https://uat.api.crowncommercial.gov.uk/organisation-profile/datamigration',
        },
        apiGatewayDisabled: {
          user: 'https://uat.ppg-sso-service.crowncommercial.gov.uk/user-profile',
          organisation: 'https://uat.ppg-sso-service.crowncommercial.gov.uk/organisation-profile',
          contact: 'https://uat.ppg-sso-service.crowncommercial.gov.uk/contact-service',
          configuration: 'https://uat.ppg-sso-service.crowncommercial.gov.uk/configuration-service',
          dataMigration: 'https://uat.ppg-sso-service.crowncommercial.gov.uk/organisation-profile/datamigration',
        }
      }
    },
    web: {
      //dashboard: 'https://uat-ccs-sso.london.cloudapps.digital'
      dashboard: 'https://uat.identify.crowncommercial.gov.uk',
      name: "UAT"
    },
    ccsContactUrl: "https://webuat.crowncommercial.gov.uk/contact",
    ccsDashboardUrl: "https://webuat.crowncommercial.gov.uk"
  },

  googleTagMangerId: 'GTM-TZCX5VP',
  cookieExpirationTimeInMinutes: 525600,
  bulkUploadPollingFrequencyInSeconds: 5,
  bulkUploadMaxFileSizeInBytes:1048576,
  bulkUploadTemplateFileUrl: 'https://uat.api.crowncommercial.gov.uk/templates/DataMigrationTemplate.csv',
  usedPasswordThreshold: 5, //This value should be changed when Auth0 password history policy changed,
  listPageSize: 10,
  mailDecryptKey:'conclavesimpleemailencrypt',
  rollbar: {
    key: '%ROLLBAR%',
    enable: false,
    security_log:false,
    environment: 'uat-ccs-sso'
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
   hideDelegation:false,
   hideBulkupload:false,
   hideAutoValidation:false,
   hideSimplifyRole: false,
   blockedScheme: ["GB-PPG"],
   customMfaEnabled: true,
   isMaintenance: false,
  },
};