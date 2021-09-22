export const environment = {
  production: true,
  idam_client_id:'',
  uri: {
    api: {
      isApiGateWayEnabled: false,
      security: 'https://sand-api-security.london.cloudapps.digital',
      postgres: 'https://sand-api-core.london.cloudapps.digital',
      cii: 'https://conclave-cii-testing-talkative-oryx-hh.london.cloudapps.digital',
      wrapper: {
        apiGatewayEnabled: {
          user: '',
          organisation: '',
          contact: '',
          configuration: '',
        },
        apiGatewayDisabled: {
          user: '',
          organisation: '',
          contact: '',
          configuration: '',
        }
      }
    },
    web: {
      dashboard: 'https://demo-ccs-sso.london.cloudapps.digital'
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