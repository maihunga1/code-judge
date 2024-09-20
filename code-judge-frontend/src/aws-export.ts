export const awsExports: any = {
  Auth: {
    region: 'ap-southeast-2', // Your AWS region
    userPoolId: 'ap-southeast-2_u8UpWcOQk', // Your Cognito User Pool ID
    userPoolWebClientId: '4l0pj53l1d7d3na2bger4g2gbe', // Your Cognito App Client ID
    mandatorySignIn: true, // Force users to be signed in
    authenticationFlowType: 'USER_SRP_AUTH', // Secure Remote Password authentication

    oauth: {
      domain: 'n11744260-leetcode.auth.ap-southeast-2.amazoncognito.com', // Cognito domain (no https://)
      scope: ['email', 'openid', 'profile'], // OAuth scopes for Google login
      redirectSignIn: 'http://localhost:5173/', // Redirect URL after sign-in (local development)
      redirectSignOut: 'http://localhost:5173/', // Redirect URL after sign-out (local development)
      responseType: 'code', // Authorization Code Flow (required for OAuth)
    },
  },
};

export default awsExports;
