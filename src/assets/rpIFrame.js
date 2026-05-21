var stat = "unchanged";

window.onload = onLoad();

function onLoad() {
    setTimer();
    window.addEventListener("message", receiveMessage, false);
}

function check_session() {
    let opIframe = window.parent.document.getElementById("opIFrame");
    if (!opIframe || !opIframe.contentWindow) {
        return;
    }

    let win = opIframe.contentWindow;
    let client_id = decrypt('client_id');
    let session_state = this.localStorage.getItem('session_state');
    let mes = client_id + ' ' + session_state;
    let securityApiOrigin = getSecurityApiOrigin();
    if (!securityApiOrigin) {
        return;
    }

    // Post only to the expected Security API origin.
    win.postMessage(mes, securityApiOrigin);
}

function setTimer() {
    check_session();
    timerID = setInterval(check_session, 10 * 1000);
}


function receiveMessage(e) {
    if (e.origin !== getSecurityApiOrigin()) { return; }
    stat = e.data;
    noticeToParentWindow(stat);
}

function getSecurityApiOrigin() {
    const securityApiUrl = this.localStorage.getItem('securityapiurl') || '';

    if (!securityApiUrl) {
        return '';
    }

    try {
        return new URL(securityApiUrl).origin;
    } catch (e) {
        return securityApiUrl;
    }
}

function getDashboardOrigin() {
    if (window.location && window.location.origin) {
        return window.location.origin;
    }

    const storedRedirectUri = this.localStorage.getItem('redirect_uri');
    if (storedRedirectUri) {
        try {
            return new URL(storedRedirectUri).origin;
        } catch (e) {
            // Ignore invalid URL values and use configured fallback.
        }
    }

    return '';
}

function noticeToParentWindow(stat) {
    if (stat == "changed" || stat == "error") {
        
        let secApiURl = this.localStorage.getItem('securityapiurl');
        let redirect_uri = getDashboardOrigin() + '/authsuccess';
        let client_id = decrypt('client_id');
        let secApi = secApiURl + '/security/authorize?client_id=' + client_id
            + '&redirect_uri=' + redirect_uri + '&response_type=code' +
            '&scope=email profile openid offline_access&prompt=none';
        window.parent.location.href = secApi;
        return false;
    } else {
        
    }
}

function decrypt(key) {
    const shift = 3;
    var encryptedText = localStorage.getItem(key) || '';
    var decryptedText = '';
    for (var i = 0; i < encryptedText.length; i++) {
        var charCode = encryptedText.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
            decryptedText += String.fromCharCode.apply(null,[((charCode - 65 - shift + 26) % 26) + 65]);
        }
        else if (charCode >= 97 && charCode <= 122) {
            decryptedText += String.fromCharCode.apply(null,[((charCode - 97 - shift + 26) % 26) + 97]);
        }
        else {
            decryptedText += encryptedText[i];
        }
    }

    return decryptedText;
}
