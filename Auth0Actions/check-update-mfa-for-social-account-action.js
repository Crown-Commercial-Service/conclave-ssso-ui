/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {
  const axios = require('axios');

  let authMethods = [];
  if (event.authentication && Array.isArray(event.authentication.methods)) {
    authMethods = event.authentication.methods;
    console.log("Inside social login check.");
    console.log(event.authentication.methods);
  }

  const isFederatedLogin = !!authMethods.find((method) => method.name === 'federated');

  console.log('1. Social MFA > isFederatedLogin -', isFederatedLogin);

  if (!isFederatedLogin) {
    return;
  }

  console.log('2. Social MFA > isFederatedLogin - Inside mfa true condition');

  let loginAttempt = event.stats.logins_count;
  console.log('3. Social MFA > context.stats.loginsCount -', loginAttempt);

  event.user.user_metadata = event.user.user_metadata || {};


  if (event.user.user_metadata && event.user.user_metadata.hasOwnProperty('use_mfa')) {
    console.log('4. Social MFA > user meta data ');
    return;
  }


  if (!event.user.user_metadata || !event.user.user_metadata.hasOwnProperty('use_mfa')) {
    console.log('4. Social MFA > first login or user mfa undefined');

    console.log('5. Social MFA > No meta data-', event.user.user_metadata);
    console.log('api call-', `${event.secrets.USER_API_URL}?user-id=${event.user.email}`);

    const options = {
      method: 'GET',
      url: `${event.secrets.USER_API_URL}?user-id=${event.user.email}`,
      headers: { 'content-type': 'application/json', 'x-api-key': `${event.secrets.USER_API_KEY}` }
    };

    axios(options)
      .then(res => {
        console.log('6. Social MFA > API call return data -', res.data);

        const result = res.data;
        event.user.user_metadata.use_mfa = result.mfaEnabled ? result.mfaEnabled : false;

        let userExistsForCurrentSocialLogin = false;

        console.log('event.connection', `${event.connection.name}`);

        userExistsForCurrentSocialLogin = !!result.detail.identityProviders.find(x => x.identityProvider === event.connection);
        console.log('7. Social MFA > logged in Identity Provider availability in PPG  -', userExistsForCurrentSocialLogin);

        if (!userExistsForCurrentSocialLogin) {
          return;
        }

        event.user.updateUserMetadata(event.user.user_id, event.user.user_metadata)
          .then(() => {
            console.log('8. Social MFA > meta data update success -', event.user.user_metadata);

            if (event.user.user_metadata.use_mfa) {
              api.multifactor.enable("any", { allowRememberBrowser: false });
              console.log('9. Social MFA > Inside use_mfa true');
            }
            return;
          })
          .catch(err => {
            console.log('10. Social MFA > meta data update has failed -', err);

            return (err);
          });

      })
      .catch(err => {
        console.log("ERROR");
        console.log('11. Social MFA > API call failed  -', err.response.status);
        if (err.response.status === 404) {
          return;
        }
        return (err);
        // return callback(new UnauthorizedError('NOT ALLOWED02'));
      });
  }

};

/**
* Handler that will be invoked when this action is resuming after an external redirect. If your
* onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
// exports.onContinuePostLogin = async (event, api) => {
// };
