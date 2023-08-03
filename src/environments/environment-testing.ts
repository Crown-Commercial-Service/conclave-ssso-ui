export const environment = {
  production: true,
  idam_client_id:'%IDAM%',
  uri: {
    api: {
      isApiGateWayEnabled: false,
      security: 'https://tst.api.crowncommercial.gov.uk/aws',
      postgres: 'https://tst.api.crowncommercial.gov.uk/aws/dashboard-wrapper',
      cii: 'https://conclave-cii-integration-brash-shark-mk.london.cloudapps.digital',
      wrapper: {
        apiGatewayEnabled: {
          user: 'http://test-alb-backend-1815036124.eu-west-2.elb.amazonaws.com:5000/user-profiles',
          organisation: 'http://test-alb-backend-1815036124.eu-west-2.elb.amazonaws.com:5000/organisation-profiles',
          contact: 'http://test-alb-backend-1815036124.eu-west-2.elb.amazonaws.com:5000/contacts',
          configuration: 'http://test-alb-backend-1815036124.eu-west-2.elb.amazonaws.com:5000/configurations',
          dataMigration: 'http://test-alb-backend-1815036124.eu-west-2.elb.amazonaws.com:5000/datamigration',
        },
        apiGatewayDisabled: {
          user: 'https://tst.api.crowncommercial.gov.uk/aws/wrapper/users',
          organisation: 'https://tst.api.crowncommercial.gov.uk/aws/wrapper/organisations',
          contact: 'https://tst.api.crowncommercial.gov.uk/aws/wrapper/contacts',
          configuration: 'https://tst.api.crowncommercial.gov.uk/aws/wrapper/configurations',
          dataMigration: 'https://tst.api.crowncommercial.gov.uk/aws/wrapper/datamigration',
          
        }
      }
    },
    web: {
      dashboard: 'http://test-alb-frontend-527952456.eu-west-2.elb.amazonaws.com'
    },
    ccsContactUrl: "https://www.crowncommercial.gov.uk/contact"
  },
  
  googleTagMangerId: 'GTM',
  cookieExpirationTimeInMinutes: 525600,
  bulkUploadPollingFrequencyInSeconds: 5,
  bulkUploadMaxFileSizeInBytes:1048576,
  bulkUploadTemplateFileUrl: 'https://tst.api.crowncommercial.gov.uk/templates/DataMigrationTemplate.csv', // Put the publicly accessible url of the template file
  usedPasswordThreshold: 5, //This value should be changed when Auth0 password history policy changed,
  listPageSize: 10,
  mailDecryptKey:'conclavesimpleemailencrypt',
  rollbar: {
        key: '%ROLLBAR%',
        enable : false,
        security_log:false,
        environment: 'test-ccs-sso'
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
  },
};
