export const environment = {
    production: true,
    idam_client_id:'IDAM',
    uri: {
      api: {
        isApiGateWayEnabled: true,
        security: 'https://tst.api.crowncommercial.gov.uk',
        postgres: 'https://tst.api.crowncommercial.gov.uk/core',
        cii: 'https://conclave-cii-integration-brash-shark-mk.london.cloudapps.digital',
        wrapper: {
          apiGatewayEnabled: {
            user: 'https://tst.api.crowncommercial.gov.uk/user-profiles',
            organisation: 'https://tst.api.crowncommercial.gov.uk/organisation-profiles',
            contact: 'https://tst.api.crowncommercial.gov.uk/contacts',
            configuration: 'https://tst.api.crowncommercial.gov.uk/configurations',
          },
          apiGatewayDisabled: {
            user: 'https://test-api-wrapper.london.cloudapps.digital/users',
            organisation: 'https://test-api-wrapper.london.cloudapps.digital/organisations',
            contact: 'https://test-api-wrapper.london.cloudapps.digital/contacts',
            configuration: 'https://test-api-wrapper.london.cloudapps.digital/configurations',
          }
        }
      },
      web: {
        dashboard: 'https://test.identify.crowncommercial.gov.uk'
      },
      ccsContactUrl: "https://www.crowncommercial.gov.uk/contact"
    },
    
    googleTagMangerId: 'GTM',
    bulkUploadPollingFrequencyInSeconds: 5,
    bulkUploadMaxFileSizeInBytes:1048576,
    bulkUploadTemplateFileUrl: 'https://paas-s3-broker-prod-lon-e7b93dd6-7029-462a-b65f-a51edf7bd048.s3.amazonaws.com/Templates/DataMigrationTemplate.csv', // Put the publicly accessible url of the template file
    usedPasswordThreshold: 5, //This value should be changed when Auth0 password history policy changed,
    listPageSize: 10,  
    rollbar: {
          key: 'ROLLBAR',
          enable : true
    }
  };
  