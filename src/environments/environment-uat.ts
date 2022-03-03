export const environment = {
    production: true,
    idam_client_id: 'IDAM_ID',
    uri: {
      api: {
        isApiGateWayEnabled: true,
        //security: 'https://uat-api-security.london.cloudapps.digital',
        security: 'https://ref.api.crowncommercial.gov.uk',
        //postgres: 'https://uat-api-core.london.cloudapps.digital',
        postgres: 'https://ref.api.crowncommercial.gov.uk/core',
        //cii: 'https://conclave-cii-integration-brash-shark-mk.london.cloudapps.digital',
        wrapper: {
          apiGatewayEnabled: {
            user: 'https://ref.api.crowncommercial.gov.uk/user-profiles',
            organisation: 'https://ref.api.crowncommercial.gov.uk/organisation-profiles',
            contact: 'https://ref.api.crowncommercial.gov.uk/contacts',
            configuration: 'https://ref.api.crowncommercial.gov.uk/configurations',
          },
          apiGatewayDisabled: {
            user: 'https://uat-api-wrapper.london.cloudapps.digital/users',
            organisation: 'https://uat-api-wrapper.london.cloudapps.digital/organisations',
            contact: 'https://uat-api-wrapper.london.cloudapps.digital/contacts',
            configuration: 'https://uat-api-wrapper.london.cloudapps.digital/configurations',
          }
        }
      },
      web: {
        //dashboard: 'https://uat-ccs-sso.london.cloudapps.digital'
        dashboard: 'https://ref.identify.crowncommercial.gov.uk'
      },
      ccsContactUrl: "https://www.crowncommercial.gov.uk/contact"
    },
  
    googleTagMangerId: 'GTM',
    bulkUploadPollingFrequencyInSeconds: 5,
    bulkUploadMaxFileSizeInBytes:1048576,
    bulkUploadTemplateFileUrl: 'BUCKET_URL',
    usedPasswordThreshold: 5, //This value should be changed when Auth0 password history policy changed,
    listPageSize: 10,
    rollbar: {
      key: 'ROLLBAR',
      enable: true
    }
  };
  
  