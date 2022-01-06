function samlAuthorization(user, context, callback) {
    const axios = require('axios@0.22.0');

    if (context.protocol !== 'samlp') {
        return callback(null, user, context);
    }
    
    
  console.log("SAML_API_REQUETS");
    const options = {
        method: 'GET',
        url: `${configuration.SEC_API_URL}/security/users/saml?email=${user.email}&client-id=${context.clientID}`,
        headers: { 'content-type': 'application/json', 'x-api-key':`${configuration.SEC_API_KEY}`}
    };

    axios(options)
        .then(res => {
            const result = res.data;
            if (result.isAccessible === true) {
                return callback(null, user, context);
            }
            else {
                return callback(
                    new UnauthorizedError('NOT ALLOWED')
                );
            }
        })
        .catch(err => {
            return callback(
                new UnauthorizedError('NOT ALLOWED')
            );
        });
}

// function changeSamlConfiguration(user, context, callback) {
//     if (context.protocol !== 'samlp')
//         return callback(null, user, context);


//     if (user.user_metadata && user.user_metadata.clientIds && !user.user_metadata.clientIds.includes(context.clientID)) {
//         return callback(
//             new UnauthorizedError('NOT ALLOWED')
//         );
//     }

//     //context.samlConfiguration.mappings = {
//     //   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier":     "user_id",
//     //   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress":       "email",
//     //   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name":        "name",
//     //   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname":  "given_name",
//     //   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname": "family_name",
//     //   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn":         "upn",
//     //   "http://schemas.xmlsoap.org/claims/Group":      "groups"
//     // };
//     //context.samlConfiguration.nameIdentifierFormat = "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified";
//     //context.samlConfiguration.nameIdentifierProbes = [
//     //   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
//     //   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
//     //   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
//     // ];
//     //context.samlConfiguration.signatureAlgorithm = "rsa-sha1";
//     //context.samlConfiguration.digestAlgorithm = "sha1";
//     //context.samlConfiguration.signResponse = false;
//     //context.samlConfiguration.authnContextClassRef = "urn:oasis:names:tc:SAML:2.0:ac:classes:unspecified";
//     //context.samlConfiguration.mapIdentities = false;
//     //context.samlConfiguration.mapUnknownClaimsAsIs = false;
//     //context.samlConfiguration.passthroughClaimsWithNoMapping = true;
//     //context.samlConfiguration.createUpnClaim = true;
//     //context.samlConfiguration.logout = {
//     //   "callback": "http://foo/logout"
//     // }

//     //context.samlConfiguration.RelayState = "foo=bar"; // SAMLP protocol only
//     //context.samlConfiguration.wctx = "foo=bar"; // WS-Fed protocol only

//     callback(null, user, context);
// }