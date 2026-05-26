var stat = "unchanged";
var SESSION_DEBUG_KEY = 'sso_session_debug';
var SESSION_FORCE_CHECK_KEY = 'sso_force_session_check';

window.onload = onLoad();

function onLoad() {
    debugLog('onLoad', {
        dashboardOrigin: getDashboardOrigin(),
        securityApiOrigin: getSecurityApiOrigin(),
        parentPath: getParentPathSafe()
    });
    setTimer();
    window.addEventListener("message", receiveMessage, false);
}

function check_session() {
    if (isTransientAuthRoute()) {
        debugLog('check_session skipped: transient route', { path: getParentPathSafe() });
        return;
    }

    if (!shouldRunSessionCheck()) {
        debugLog('check_session skipped: session check disabled for this origin pair');
        return;
    }

    let opIframe = window.parent.document.getElementById("opIFrame");
    if (!opIframe || !opIframe.contentWindow) {
        debugLog('check_session skipped: opIFrame missing or not ready');
        return;
    }

    let win = opIframe.contentWindow;
    let client_id = decrypt('client_id');
    let session_state = this.localStorage.getItem('session_state');
    if (!client_id || !session_state) {
        debugLog('check_session skipped: missing client_id/session_state', {
            hasClientId: !!client_id,
            hasSessionState: !!session_state
        });
        return;
    }

    let mes = client_id + ' ' + session_state;
    let securityApiOrigin = getSecurityApiOrigin();
    if (!securityApiOrigin) {
        debugLog('check_session skipped: securityApiOrigin missing');
        return;
    }

    if (!isOpIframeReady(opIframe, securityApiOrigin)) {
        debugLog('check_session skipped: opIFrame not yet on security api origin', {
            opIframeSrc: opIframe.getAttribute('src') || ''
        });
        return;
    }

    // Post only to the expected Security API origin.
    try {
        debugLog('check_session postMessage', {
            targetOrigin: securityApiOrigin,
            parentPath: getParentPathSafe()
        });
        win.postMessage(mes, securityApiOrigin);
    } catch (e) {
        // Ignore transient frame navigation windows; next interval will retry.
        debugLog('check_session postMessage failed', { error: e && e.message ? e.message : 'unknown' });
    }
}

function setTimer() {
    check_session();
    timerID = setInterval(check_session, 10 * 1000);
}


function receiveMessage(e) {
    const expectedOrigin = getSecurityApiOrigin();
    if (e.origin !== expectedOrigin) {
        debugLog('receiveMessage ignored: unexpected origin', {
            actualOrigin: e.origin,
            expectedOrigin: expectedOrigin
        });
        return;
    }
    stat = e.data;
    debugLog('receiveMessage accepted', { stat: stat, origin: e.origin });
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
        debugLog('shouldRunSessionCheck=false: origin missing', {
            dashboardOrigin: dashboardOrigin,
            securityApiOrigin: securityApiOrigin
        });
        return false;
    }

    try {
        const dashboardHost = new URL(dashboardOrigin).hostname;
        const securityApiHost = new URL(securityApiOrigin).hostname;
        const sameSite = getSiteFromHost(dashboardHost) === getSiteFromHost(securityApiHost);
        const forceCheck = isForceSessionCheckEnabled();

        debugLog('shouldRunSessionCheck evaluated', {
            dashboardHost: dashboardHost,
            securityApiHost: securityApiHost,
            dashboardSite: getSiteFromHost(dashboardHost),
            securityApiSite: getSiteFromHost(securityApiHost),
            sameSite: sameSite,
            forceCheck: forceCheck
        });

        return sameSite || forceCheck;
    } catch (e) {
        debugLog('shouldRunSessionCheck=false: invalid origin format');
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
            debugLog('noticeToParentWindow skipped redirect: transient route', { stat: stat });
            return false;
        }
        
        let secApiURl = this.localStorage.getItem('securityapiurl');
        let redirect_uri = getDashboardOrigin() + '/authsuccess';
        let client_id = decrypt('client_id');
        let secApi = secApiURl + '/security/authorize?client_id=' + client_id
            + '&redirect_uri=' + redirect_uri + '&response_type=code' +
            '&scope=email profile openid offline_access&prompt=none';
        debugLog('noticeToParentWindow redirecting', {
            stat: stat,
            securityApiUrl: secApiURl,
            redirectUri: redirect_uri,
            parentPath: getParentPathSafe()
        });
        window.parent.location.href = secApi;
        return false;
    } else {
        // Ignore transient session-check errors to avoid auth redirect loops.
        debugLog('noticeToParentWindow ignored stat', { stat: stat });
        return false;
    }
}

function isSessionDebugEnabled() {
    try {
        const query = new URLSearchParams(window.location.search);
        return query.get('ssodebug') === '1' || localStorage.getItem(SESSION_DEBUG_KEY) === '1';
    } catch (e) {
        return localStorage.getItem(SESSION_DEBUG_KEY) === '1';
    }
}

function isForceSessionCheckEnabled() {
    try {
        const query = new URLSearchParams(window.location.search);
        return query.get('ssocheck') === '1' || localStorage.getItem(SESSION_FORCE_CHECK_KEY) === '1';
    } catch (e) {
        return localStorage.getItem(SESSION_FORCE_CHECK_KEY) === '1';
    }
}

function debugLog(message, data) {
    if (!isSessionDebugEnabled()) {
        return;
    }

    if (data) {
        console.info('[RP-SESSION]', message, data);
    } else {
        console.info('[RP-SESSION]', message);
    }
}

function getParentPathSafe() {
    try {
        return (window.parent && window.parent.location && window.parent.location.pathname) || '';
    } catch (e) {
        return '';
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
