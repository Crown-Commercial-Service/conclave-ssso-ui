function guardianMultifactor(user, context, callback) {
    //const CLIENTS_WITH_MFA = ['REPLACE_WITH_YOUR_CLIENT_ID'];

    if (context.protocol === 'oauth2-refresh-token')
        return callback(null, user, context);

    //Avoid prompting a user for multifactor authentication if they have successfully completed MFA in their current session
    let authMethods = [];
    if (context.authentication && Array.isArray(context.authentication.methods)) {
        authMethods = context.authentication.methods;
    }

    const completedMfa = !!authMethods.find((method) => method.name === 'mfa');

    if (completedMfa) {
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