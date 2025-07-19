exports.handler = async (event) => {
    const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
    const redirectTo = event.queryStringParameters.redirect_to || '/';
    const redirect_uri = `${process.env.URL}/.netlify/functions/callback`;
    const scope = 'repo';
    const state = `some_random_string_${encodeURIComponent(redirectTo)}`; // Encode redirectTo into state

    const authorizationUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}`;

    return {
        statusCode: 302,
        headers: {
            Location: authorizationUrl,
        },
    };
};