export const environment = {
  production: true,
  idam_client_id:'aAK9HFtNSDigjSVlGO2t9cfXVRKcBsXc',
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
  
  usedPasswordThreshold: 5, //This value should be changed when Auth0 password history policy changed,
  listPageSize: 10,  
  rollbar: {
        key: '39bb38f087ee4a6781b9d76a73200dd8',
        enable : true
  }
};
