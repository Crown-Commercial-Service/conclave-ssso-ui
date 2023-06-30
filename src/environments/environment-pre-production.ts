export const environment = {

  production: false,

  idam_client_id: 'IDAM_ID',

  uri: {

      api: {

          isApiGateWayEnabled: true,

          security: 'https://pre.api.crowncommercial.gov.uk',

          //security: 'https://pre.api.crowncommercial.gov.uk', 

          postgres: 'https://pre.api.crowncommercial.gov.uk/core',

          //postgres: 'https://pre.api.crowncommercial.gov.uk/core', 

          wrapper: {

              apiGatewayEnabled: {

                  user: 'https://pre.api.crowncommercial.gov.uk/user-profiles',

                  organisation: 'https://pre.api.crowncommercial.gov.uk/organisation-profiles',

                  contact: 'https://pre.api.crowncommercial.gov.uk/contacts',

                  configuration: 'https://pre.api.crowncommercial.gov.uk/configurations',

                  dataMigration: 'https://pre.api.crowncommercial.gov.uk/datamigration',

              },

              apiGatewayDisabled: {

                  user: 'https://preprod-api-wrapper.london.cloudapps.digital/users',

                  organisation: 'https://preprod-api-wrapper.london.cloudapps.digital/organisations',

                  contact: 'https://preprod-api-wrapper.london.cloudapps.digital/contacts',

                  configuration: 'https://preprod-api-wrapper.london.cloudapps.digital/configurations',

                  dataMigration: 'https://preprod-api-wrapper.london.cloudapps.digital/datamigration',

              }

          }

      },

      web: {

          //dashboard: 'https://preprod-ccs-sso.london.cloudapps.digital' 

          dashboard: 'https://preprod.identify.crowncommercial.gov.uk'

      },

      ccsContactUrl: "https://www.crowncommercial.gov.uk/contact"

  },

  googleTagMangerId: 'GTM',

  bulkUploadPollingFrequencyInSeconds: 5,

  cookieExpirationTimeInMinutes: 525600,

  bulkUploadMaxFileSizeInBytes:1048576,

  bulkUploadTemplateFileUrl: 'BUCKET_URL',

  usedPasswordThreshold: 5, //This value should be changed when Auth0 password history policy changed, 

  listPageSize: 10,

  mailDecryptKey:'conclavesimpleemailencrypt',

  rollbar: {

      key: 'ROLLBAR',

      enable: false,

      security_log:false,
    
    environment: 'preprod-ccs-sso'

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
   hideSimplifyRole:false,
   blockedScheme: ["GB-PPG"],
  },
};