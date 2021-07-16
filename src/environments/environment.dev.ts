export const environment = {
  production: true,
  idam_client_id:'5G2pNShwaBQzjJNx6fCSqt9ZIAU9sEur',
  uri: {
    api: {
      isApiGateWayEnabled: false,
      security: 'https://dev-api-security.london.cloudapps.digital',
      //security: 'https://dev.api.crowncommercial.gov.uk',
      postgres: 'https://dev-api-core.london.cloudapps.digital',
      //postgres: 'https://dev.api.crowncommercial.gov.uk/core',
      cii: 'https://conclave-cii-integration-brash-shark-mk.london.cloudapps.digital',
      wrapper: {
        apiGatewayEnabled: {
          user: 'https://dev.api.crowncommercial.gov.uk/user-profiles',
          organisation: 'https://dev.api.crowncommercial.gov.uk/organisation-profiles',
          contact: 'https://dev.api.crowncommercial.gov.uk/contacts',
          configuration: 'https://dev-api-wrapper.london.cloudapps.digital/configurations',
        },
        apiGatewayDisabled: {
          user: 'https://dev-api-wrapper.london.cloudapps.digital/users',
          organisation: 'https://dev-api-wrapper.london.cloudapps.digital/organisations',
          contact: 'https://dev-api-wrapper.london.cloudapps.digital/contacts',
          configuration: 'https://dev-api-wrapper.london.cloudapps.digital/configurations',
        }
      }
    },
    web: {
      dashboard: 'https://dev1-ccs-sso.london.cloudapps.digital'
      //dashboard: 'https://dev.identify.crowncommercial.gov.uk'
    },
    ccsContactUrl: "https://www.crowncommercial.gov.uk/contact"
  },
  securityApiKey: 'ff60479b004b4424916e062228e600eb',
  usedPasswordThreshold: 5, //This value should be changed when Auth0 password history policy changed,
  listPageSize: 10,
  rollbar: {
    key: '39bb38f087ee4a6781b9d76a73200dd8',
    enable : true
  }
};
