export const environment = {
  production: false,
  idam_client_id: '5G2pNShwaBQzjJNx6fCSqt9ZIAU9sEur',
  uri: {
    api: {
      isApiGateWayEnabled: false,
      security: 'https://localhost:44352',
      postgres: 'https://localhost:44330',
      wrapper: {
        apiGatewayEnabled: {
          user: 'https://localhost:44309/user-profiles',
          organisation: 'https://localhost:44309/organisation-profiles',
          contact: 'https://localhost:44309/contacts',
          configuration: 'https://localhost:44309/configurations',
        },
        apiGatewayDisabled: {
          user: 'https://localhost:44309/users',
          organisation: 'https://localhost:44309/organisations',
          contact: 'https://localhost:44309/contacts',
          configuration: 'https://localhost:44309/configurations',
        }
      }
    },
    web: {
      dashboard: 'http://localhost:4200'
    },
    ccsContactUrl: "https://www.crowncommercial.gov.uk/contact"
  },
  googleTagMangerId: 'GTM-1',
  bulkUploadPollingFrequencyInSeconds: 60,
  bulkUploadTemplateFileUrl: 'https://userbulkupload.s3.us-east-2.amazonaws.com/Templates/DataMigrationTemplate.csv',
  bulkUploadMaxFileSizeInBytes:1048576,//default value
  usedPasswordThreshold: 5, //This value should be changed when Auth0 password history policy changed,
  listPageSize: 10,
  rollbar: {
    key: '',
    enable: false
  } 
};
