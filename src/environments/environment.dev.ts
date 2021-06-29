export const environment = {
  production: true,
  idam_client_id:'',
  uri: {
    api: {
      isApiGateWayEnabled: false,
      security: 'https://dev-api-security.london.cloudapps.digital',
      postgres: 'https://dev-api-core.london.cloudapps.digital',
      cii: 'https://conclave-cii-integration-brash-shark-mk.london.cloudapps.digital',
      wrapper: {
        apiGatewayEnabled: {
          user: 'https://dev-api-wrapper.london.cloudapps.digital/user-profiles',
          organisation: 'https://dev-api-wrapper.london.cloudapps.digital/organisation-profiles',
          contact: 'https://dev-api-wrapper.london.cloudapps.digital/contacts',
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
      dashboard: 'https://dev-ccs-sso.london.cloudapps.digital'
    }
  },
  securityApiKey: '',
  usedPasswordThreshold: 5, //This value should be changed when Auth0 password history policy changed,
  listPageSize: 10,  
  rollbar: {
    key: '',
    enable : false
  }
};
