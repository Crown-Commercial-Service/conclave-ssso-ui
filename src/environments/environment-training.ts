export const environment = {

    production: true,
  
    idam_client_id: 'IDAM_ID',
  
    uri: {
  
      api: {
  
        isApiGateWayEnabled: false,
  
        security: 'https://training-api-security.london.cloudapps.digital',
  
        postgres: 'https://training-api-core.london.cloudapps.digital',
  
        cii: 'https://conclave-cii-integration-brash-shark-mk.london.cloudapps.digital',
  
        wrapper: {
  
          apiGatewayEnabled: {
  
            user: 'https://training-api-wrapper.london.cloudapps.digital/user-profiles',
  
            organisation: 'https://training-api-wrapper.london.cloudapps.digital/organisation-profiles',
  
            contact: 'https://training-api-wrapper.london.cloudapps.digital/contacts',
  
            configuration: 'https://training-api-wrapper.london.cloudapps.digital/configurations',
  
          },
  
          apiGatewayDisabled: {
  
            user: 'https://training-api-wrapper.london.cloudapps.digital/users',
  
            organisation: 'https://training-api-wrapper.london.cloudapps.digital/organisations',
  
            contact: 'https://training-api-wrapper.london.cloudapps.digital/contacts',
  
            configuration: 'https://training-api-wrapper.london.cloudapps.digital/configurations',
  
          }
  
        }
  
      },
  
      web: {
  
        dashboard: 'https://training-ccs-sso.london.cloudapps.digital'
  
      },
  
      ccsContactUrl: "https://www.crowncommercial.gov.uk/contact"
  
    },
  
    googleTagMangerId: 'GTM',
    
    bulkUploadPollingFrequencyInSeconds: 5,
    
    bulkUploadMaxFileSizeInBytes:1048576,
    
    bulkUploadTemplateFileUrl: 'https://paas-s3-broker-prod-lon-78ff9dde-5c67-4eb6-82f8-c9c1fbadb459.s3.amazonaws.com/Templates/DataMigrationTemplate.csv',
    
    usedPasswordThreshold: 5, //This value should be changed when Auth0 password history policy changed, 
  
    listPageSize: 10,
  
    rollbar: {
  
      key: 'ROLLBAR',
  
      enable: true
  
    }
  
  };