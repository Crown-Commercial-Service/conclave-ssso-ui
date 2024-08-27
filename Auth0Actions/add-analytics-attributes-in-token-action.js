/**
* This PostLogin action is used to add custom claims to the ID token for analytics purposes.
* Specifically, it includes the session ID and state parameter, which can be used to track
* user sessions and maintain state between the authorization request and callback.
* This action only applies to authentication flows using the 'oidc-basic-profile' protocol.

* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {

  if (event.transaction?.protocol !== 'oidc-basic-profile') {
    return;
  }
  const namespace = 'https://identify.crowncommercial.gov.uk';
  api.idToken.setCustomClaim(`${namespace}/analytics-sessionID`, event.session?.id);
  api.idToken.setCustomClaim(`${namespace}/analytics-state`, event.request.query.state);
  console.log('sessionid', event.session?.id);
  console.log('state', event.request.query.state);
  return;
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
