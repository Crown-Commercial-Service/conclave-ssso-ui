function guardianMultifactor(user, context, callback) {
    //const CLIENTS_WITH_MFA = ['REPLACE_WITH_YOUR_CLIENT_ID'];

    if (context.protocol === 'oauth2-refresh-token')
        return callback(null, user, context);

    // Disable MFA for the SAML app requests only initiated by dashboard tiles not dierctly types and login to saml apps
    // When directly typed the url to login to SAML app it has context.request.query.redirect_uri value
    // But it is not included when navigating from dashboard
    if (context.protocol === 'samlp' && context.request.query.redirect_uri === undefined) {
        return callback(null, user, context);
    }


    // run only for the specified clients
    //if (CLIENTS_WITH_MFA.indexOf(context.clientID) !== -1) {

    // uncomment the following if clause in case you want to request a second factor only from user's that have user_metadata.use_mfa === true
    if (user.user_metadata && user.user_metadata.use_mfa === true) {
        context.multifactor = {
            // required
            provider: 'any',

            // optional, defaults to true. Set to false to force Guardian authentication every time.
            // See https://auth0.com/docs/multifactor-authentication/custom#change-the-frequency-of-authentication-requests for details
            allowRememberBrowser: true
        };
        //}
    }

    callback(null, user, context);
}