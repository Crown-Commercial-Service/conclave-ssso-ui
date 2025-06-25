export const environment = {

    production: true,
  
    idam_client_id: '%IDAM%',
  
    uri: {
  
        api: {
  
            isApiGateWayEnabled: true,
  
            security: 'https://pre.api.crowncommercial.gov.uk',
  
            //security: 'https://pre.api.crowncommercial.gov.uk', 
  
            postgres: 'https://pre.api.crowncommercial.gov.uk/dashboard-wrapper',
  
            //postgres: 'https://pre.api.crowncommercial.gov.uk/core', 
  
            wrapper: {
  
                apiGatewayEnabled: {
  
                    user: 'https://pre.api.crowncommercial.gov.uk/user-profile',
  
                    organisation: 'https://pre.api.crowncommercial.gov.uk/organisation-profile',
  
                    contact: 'https://pre.api.crowncommercial.gov.uk/contact-service',
  
                    configuration: 'https://pre.api.crowncommercial.gov.uk/configuration-service',
  
                    dataMigration: 'https://pre.api.crowncommercial.gov.uk/organisation-profile/datamigration',
                },
  
                apiGatewayDisabled: {
  
                    user: 'https://pre.ppg-sso-service.crowncommercial.gov.uk/user-profile',
  
                    organisation: 'https://pre.ppg-sso-service.crowncommercial.gov.uk/organisation-profile',
  
                    contact: 'https://pre.ppg-sso-service.crowncommercial.gov.uk/contact-service',
  
                    configuration: 'https://pre.ppg-sso-service.crowncommercial.gov.uk/configuration-service',
  
                    dataMigration: 'https://pre.ppg-sso-service.crowncommercial.gov.uk/organisation-profile/datamigration',
  
                }
  
            }
  
        },
  
        web: {
  
            //dashboard: 'https://preprod-ccs-sso.london.cloudapps.digital' 
  
            dashboard: 'https://preprod.identify.crowncommercial.gov.uk',
            name: "PRE-PROD"
        },
  
        ccsContactUrl: "https://webuat.crowncommercial.gov.uk/contact",
        ccsDashboardUrl: "https://webuat.crowncommercial.gov.uk"
  
    },
  
    googleTagMangerId: 'GTM-TZCX5VP',
  
    bulkUploadPollingFrequencyInSeconds: 5,
  
    cookieExpirationTimeInMinutes: 525600,
  
    bulkUploadMaxFileSizeInBytes:1048576,
  
    bulkUploadTemplateFileUrl: 'https://pre.api.crowncommercial.gov.uk/templates/DataMigrationTemplate.csv',
  
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
     hideIDP:true,
     hideDelegation:false,
     hideBulkupload:false,
     hideAutoValidation:false,
     hideSimplifyRole: false,
     blockedScheme: ["GB-PPG"],
     customMfaEnabled: true,
     isMaintenance: false,
     excludedForDelegation: ['ORG_ADMINISTRATOR', 'ORG_DEFAULT_USER', 'ORG_USER_SUPPORT', 'MANAGE_SUBSCRIPTIONS', 'DATA_MIGRATION', 'CAT_ADMIN'],
    },
  };
