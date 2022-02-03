export const environment = {
  production: true,
  idam_client_id:'IDAM',
  uri: {
    api: {
      isApiGateWayEnabled: true,
      //security: 'https://dev.security.conclave.crowncommercial.gov.uk',
      security: 'https://api.crowncommercial.gov.uk',
      //postgres: 'https://dev.core.conclave.crowncommercial.gov.uk',
      postgres: 'https://api.crowncommercial.gov.uk/core',
      //cii: 'https://conclave-cii-integration-brash-shark-mk.london.cloudapps.digital',
      wrapper: {
        apiGatewayEnabled: {
          user: 'https://api.crowncommercial.gov.uk/user-profiles',
          organisation: 'https://api.crowncommercial.gov.uk/organisation-profiles',
          contact: 'https://api.crowncommercial.gov.uk/contacts',
          configuration: 'https://api.crowncommercial.gov.uk/configurations',
        },
        apiGatewayDisabled: {
          user: 'https://prod-api-wrapper.london.cloudapps.digital/users',
          organisation: 'https://prod-api-wrapper.london.cloudapps.digital/organisations',
          contact: 'https://prod-api-wrapper.london.cloudapps.digital/contacts',
          configuration: 'https://prod-api-wrapper.london.cloudapps.digital/configurations',
        }
      }
    },
    web: {
      //dashboard: 'https://dev.sso.conclave.crowncommercial.gov.uk'
      dashboard: 'https://identify.crowncommercial.gov.uk'
    },
    ccsContactUrl: "https://www.crowncommercial.gov.uk/contact"
  },
  googleTagMangerId: 'GTM',
  bulkUploadPollingFrequencyInSeconds: 5,
  bulkUploadMaxFileSizeInBytes:1048576,
  bulkUploadTemplateFileUrl: 'https://paas-s3-broker-prod-lon-9422de6a-c312-4407-87ae-119e5a09db78.s3.amazonaws.com/Templates/DataMigrationTemplate.csv', // Put the publicly accessible url of the template file
  usedPasswordThreshold: 5, //This value should be changed when Auth0 password history policy changed,
  listPageSize: 10,  
  rollbar: {
    key: 'ROLLBAR',
    enable : false
  }
};