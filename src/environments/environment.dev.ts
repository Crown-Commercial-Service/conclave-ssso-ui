export const environment = {
  production: true,
  idam_client_id:'',
  uri: {
    api: {
      isApiGateWayEnabled: true,
      //security: 'https://dev.security.conclave.crowncommercial.gov.uk',
      security: 'https://dev.api.crowncommercial.gov.uk',
      //postgres: 'https://dev.core.conclave.crowncommercial.gov.uk',
      postgres: 'https://dev.api.crowncommercial.gov.uk/core',
      //cii: 'https://conclave-cii-integration-brash-shark-mk.london.cloudapps.digital',
      wrapper: {
        apiGatewayEnabled: {
          user: 'https://dev.api.crowncommercial.gov.uk/user-profiles',
          organisation: 'https://dev.api.crowncommercial.gov.uk/organisation-profiles',
          contact: 'https://dev.api.crowncommercial.gov.uk/contacts',
          configuration: 'https://dev.api.crowncommercial.gov.uk/configurations',
        },
        apiGatewayDisabled: {
          user: 'https://dev.wrapper.conclave.crowncommercial.gov.uk/users',
          organisation: 'https://dev.wrapper.conclave.crowncommercial.gov.uk/organisations',
          contact: 'https://dev.wrapper.conclave.crowncommercial.gov.uk/contacts',
          configuration: 'https://dev.wrapper.conclave.crowncommercial.gov.uk/configurations',
        }
      }
    },
    web: {
      //dashboard: 'https://dev.sso.conclave.crowncommercial.gov.uk'
      dashboard: 'https://dev.identify.crowncommercial.gov.uk'
    },
    ccsContactUrl: "https://www.crowncommercial.gov.uk/contact"
  },
  
  usedPasswordThreshold: 5, //This value should be changed when Auth0 password history policy changed,
  listPageSize: 10,  
  rollbar: {
    key: '',
    enable : false
  }
};
