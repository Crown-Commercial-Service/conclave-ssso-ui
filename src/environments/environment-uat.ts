export const environment = {
    production: true,
    idam_client_id: 'IDAM_ID',
    uri: {
      api: {
        isApiGateWayEnabled: false,
        security: 'https://uat-api-security.london.cloudapps.digital',
        postgres: 'https://uat-api-core.london.cloudapps.digital',
        cii: 'https://conclave-cii-integration-brash-shark-mk.london.cloudapps.digital',
        wrapper: {
          apiGatewayEnabled: {
            user: 'https://uat-api-wrapper.london.cloudapps.digital/user-profiles',
            organisation: 'https://uat-api-wrapper.london.cloudapps.digital/organisation-profiles',
            contact: 'https://uat-api-wrapper.london.cloudapps.digital/contacts',
            configuration: 'https://uat-api-wrapper.london.cloudapps.digital/configurations',
          },
          apiGatewayDisabled: {
            user: 'https://uat-api-wrapper.london.cloudapps.digital/users',
            organisation: 'https://uat-api-wrapper.london.cloudapps.digital/organisations',
            contact: 'https://uat-api-wrapper.london.cloudapps.digital/contacts',
            configuration: 'https://uat-api-wrapper.london.cloudapps.digital/configurations',
          }
        }
      },
      web: {
        dashboard: 'https://uat-ccs-sso.london.cloudapps.digital'
      },
      ccsContactUrl: "https://www.crowncommercial.gov.uk/contact"
    },
  
    googleTagMangerId: 'GTM',
    usedPasswordThreshold: 5, //This value should be changed when Auth0 password history policy changed,
    listPageSize: 10,
    rollbar: {
      key: 'ROLLBAR',
      enable: true
    }
  };