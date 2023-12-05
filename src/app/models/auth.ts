export interface TokenInfo
{
    challengeRequired: boolean;
    challengeName: string;
    sessionId : string;
    id_token : string;
    access_token : string;
    refresh_token : string;
    session_state:string
}
