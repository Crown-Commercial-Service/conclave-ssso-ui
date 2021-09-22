export const environment = {
  production: true,
  idam_client_id:'',
  uri: {
    api: {
      isApiGateWayEnabled: false,
      security: 'https://ccs-sso-api-agile-ratel-ix.london.cloudapps.digital',
      postgres: 'https://api-org-22jan-proud-crane-wu.london.cloudapps.digital',
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
      dashboard: 'http://localhost:4200'
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
