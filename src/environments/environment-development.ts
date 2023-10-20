export const environment = {
    production: true,
    idam_client_id:'%IDAM%',
    uri: {
      api: {
        isApiGateWayEnabled: true,
        security: 'https://dev.api.crowncommercial.gov.uk/aws',
        postgres: 'https://dev.api.crowncommercial.gov.uk/aws/dashboard-wrapper',
        cii: 'https://conclave-cii-testing-talkative-oryx-hh.london.cloudapps.digital',
        wrapper: {
          apiGatewayEnabled: {
            user: 'https://dev.api.crowncommercial.gov.uk/aws/user-profile',
            organisation: 'https://dev.api.crowncommercial.gov.uk/aws/organisation-profile',
            contact: 'https://dev.api.crowncommercial.gov.uk/aws/contact-service',
            configuration: 'https://dev.api.crowncommercial.gov.uk/aws/configuration-service',
            dataMigration: 'https://dev.api.crowncommercial.gov.uk/aws/organisation-profile/migrations',
          },
          apiGatewayDisabled: {
            user: 'https://dev.ppg-sso-service.crowncommercial.gov.uk/user-profile',
            organisation: 'https://dev.ppg-sso-service.crowncommercial.gov.uk/organisation-profile',
            contact: 'https://dev.ppg-sso-service.crowncommercial.gov.uk/contact-service',
            configuration: 'https://dev.ppg-sso-service.crowncommercial.gov.uk/configuration-service',
            dataMigration: 'https://dev.ppg-sso-service.crowncommercial.gov.uk/organisation-profile/migrations',
          }
        }
      },
      web: {
        dashboard: 'https://dev.identify.crowncommercial.gov.uk',
        name: "DEV"
      },
      ccsContactUrl: "https://webdev.crowncommercial.gov.uk/contact",
      ccsDashboardUrl: "https://webdev.crowncommercial.gov.uk"
    },
    googleTagMangerId: 'GTM-TZCX5VP',
    cookieExpirationTimeInMinutes: 525600,
    bulkUploadPollingFrequencyInSeconds: 5,
    bulkUploadMaxFileSizeInBytes:1048576,
    bulkUploadTemplateFileUrl: 'https://dev.api.crowncommercial.gov.uk/templates/DataMigrationTemplate.csv',
    usedPasswordThreshold: 5, //This value should be changed when Auth0 password history policy changed,
    listPageSize: 10,
    mailDecryptKey:'conclavesimpleemailencrypt',
    rollbar: {
      key: '%ROLLBAR%',
      enable : false,
      security_log: false,
      environment: 'dev-ccs-sso'
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
     hideSimplifyRole:false,
     blockedScheme: ["GB-PPG"],
     isMaintenance: false,
     customMfaEnabled : false
    },
  };
