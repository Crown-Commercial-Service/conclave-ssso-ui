export const environment = {

    production: true,
  
    idam_client_id: 'IDAM_ID',
  
    uri: {
  
      api: {
  
        isApiGateWayEnabled: true,
  
        security: 'https://nft.api.crowncommercial.gov.uk',
  
        postgres: 'https://nft.api.crowncommercial.gov.uk/core',
  
        //cii: 'https://conclave-cii-integration-brash-shark-mk.london.cloudapps.digital',
  
        wrapper: {
  
          apiGatewayEnabled: {
  
            user: 'https://nft.api.crowncommercial.gov.uk/user-profiles',
  
            organisation: 'https://nft.api.crowncommercial.gov.uk/organisation-profiles',
  
            contact: 'https://nft.api.crowncommercial.gov.uk/contacts',
  
            configuration: 'https://nft.api.crowncommercial.gov.uk/configurations',
  
          },
  
          apiGatewayDisabled: {
  
            user: 'https://NFT-api-wrapper.london.cloudapps.digital/users',
  
            organisation: 'https://NFT-api-wrapper.london.cloudapps.digital/organisations',
  
            contact: 'https://NFT-api-wrapper.london.cloudapps.digital/contacts',
  
            configuration: 'https://NFT-api-wrapper.london.cloudapps.digital/configurations',
  
          }
  
        }
  
      },
  
      web: {
  
        dashboard: 'https://nft.identify.crowncommercial.gov.uk'
  
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
  
    rollbar: {
  
      key: 'ROLLBAR',
  
      enable: false,

      security_log: false,
      
      environment: 'nft-ccs-sso'
  
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
    hideBulkupload:true
   },
  };
