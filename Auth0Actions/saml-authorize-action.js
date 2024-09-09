/**
* This PostLogin action is designed to handle SAML protocol logins. It checks if the user
* is accessible based on an external security API and sets a custom user metadata attribute
* for specific clients. If the user is not allowed, the login attempt is denied.

* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {

  if (event.transaction?.protocol !== 'samlp') {
    console.log("NOT_SAML");
    return;
  }

  console.log("SAML");
  console.log(event.user.email);
  console.log(event.secrets.TRAINLINE_DIGITS_CLIENT_ID);
  // Set Trainline Custom Attribue p2sprint9
  if (event.client.client_id === event.secrets.TRAINLINE_DIGITS_CLIENT_ID) {
    api.user.setUserMetadata("corpref", "10009655");
    console.log(event.user.corpref);
  }

  const options = {
    method: 'GET',
    url: `${event.secrets.SEC_API_URL}/security/users/samlp?email=${event.user.email}&client-id=${event.client.client_id}`,
    headers: { 'content-type': 'application/json', 'x-api-key': `${event.secrets.SEC_API_KEY}` }

  };
  console.log(event.secrets.SEC_API_URL);
  console.log(event.secrets.SEC_API_KEY);
  const axios = require('axios');
  try {
    // Api call to check if the user is accessible to SAML 
    const res = await axios(options);
    const result = res.data;
    //The user will be allowed to login to SAML app only if isAccessbile is true 
    if (result.isAccessible === true) {
      console.log("TRUE");
      return;
    } else {
      console.log("FALSE");
      return api.access.deny("NOT ALLOWED#01");
    }
  } catch (err) {
    console.log("ERROR");
    console.log(err);
    return api.access.deny("NOT ALLOWED#02");
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
