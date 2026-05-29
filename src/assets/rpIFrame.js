var stat = "unchanged";

window.onload = onLoad();

function onLoad() {
    setTimer();
    window.addEventListener("message", receiveMessage, false);
}

function check_session() {
    if (isTransientAuthRoute()) {
        return;
    }

    if (!shouldRunSessionCheck()) {
        return;
    }

    let opIframe = window.parent.document.getElementById("opIFrame");
    if (!opIframe || !opIframe.contentWindow) {
        return;
    }

    let win = opIframe.contentWindow;
    let client_id = decrypt('client_id');
    let session_state = this.localStorage.getItem('session_state');
    if (!client_id || !session_state) {
        return;
    }

    let mes = client_id + ' ' + session_state;
    let securityApiOrigin = getSecurityApiOrigin();
    if (!securityApiOrigin) {
        return;
    }

    if (!isOpIframeReady(opIframe, securityApiOrigin)) {
        return;
    }

    // Post only to the expected Security API origin.
    try {
        win.postMessage(mes, securityApiOrigin);
    } catch (e) {
        // Ignore transient frame navigation windows; next interval will retry.
    }
}

function setTimer() {
    check_session();
    timerID = setInterval(check_session, 10 * 1000);
}


function receiveMessage(e) {
    const expectedOrigin = getSecurityApiOrigin();
    if (e.origin !== expectedOrigin) {
        return;
    }
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

function shouldRunSessionCheck() {
    const dashboardOrigin = getDashboardOrigin();
    const securityApiOrigin = getSecurityApiOrigin();

    if (!dashboardOrigin || !securityApiOrigin) {
        return false;
    }

    try {
        const dashboardHost = new URL(dashboardOrigin).hostname;
        const securityApiHost = new URL(securityApiOrigin).hostname;
        return getSiteFromHost(dashboardHost) === getSiteFromHost(securityApiHost);
    } catch (e) {
        return false;
    }
}

function getSiteFromHost(hostname) {
    if (!hostname) {
        return '';
    }

    const parts = hostname.split('.');
    if (parts.length <= 2) {
        return hostname;
    }

    // Handle common UK public suffixes used by this service (for example, crowncommercial.gov.uk).
    if (hostname.endsWith('.gov.uk') || hostname.endsWith('.co.uk') || hostname.endsWith('.org.uk')) {
        return parts.slice(-3).join('.');
    }

    return parts.slice(-2).join('.');
}

function isOpIframeReady(opIframe, securityApiOrigin) {
    if (!opIframe) {
        return false;
    }

    const opIframeSrc = opIframe.getAttribute('src') || '';
    if (!opIframeSrc) {
        return false;
    }

    try {
        const opIframeOrigin = new URL(opIframeSrc, window.parent.location.href).origin;
        if (opIframeOrigin !== securityApiOrigin) {
            return false;
        }
    } catch (e) {
        return false;
    }

    try {
        // Access succeeds only while same-origin with the parent (typically before the cross-origin OP iframe loads).
        const currentOrigin = opIframe.contentWindow.location.origin;
        return currentOrigin === securityApiOrigin;
    } catch (e) {
        // Cross-origin access throws once OP iframe is on Security API origin; that's the expected ready state.
        return true;
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
    if (stat == "changed") {
        if (isTransientAuthRoute()) {
            return false;
        }
        
        let secApiURl = this.localStorage.getItem('securityapiurl');
        let redirect_uri = getDashboardOrigin() + '/authsuccess';
        let client_id = decrypt('client_id');
        let secApi = secApiURl + '/security/authorize?client_id=' + client_id
            + '&redirect_uri=' + redirect_uri + '&response_type=code' +
            '&scope=email profile openid offline_access&prompt=none';
        window.parent.location.href = secApi;
        return false;
    } else {
        // Ignore transient session-check errors to avoid auth redirect loops.
        return false;
    }
}

function isTransientAuthRoute() {
    try {
        let path = (window.parent && window.parent.location && window.parent.location.pathname) || '';
        return path.indexOf('/authsuccess') === 0 || path.indexOf('/mfa-selection') === 0;
    } catch (e) {
        return false;
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
