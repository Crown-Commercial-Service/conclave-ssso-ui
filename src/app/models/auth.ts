export interface TokenInfo
{
    challengeRequired: boolean;
    challengeName: string;
    sessionId : string;
    id_token : string;
    access_token : string;
    refresh_token : string;
    session_state:string,
    auth0_access_token: string;  
    auth0_refresh_token : string;
}
