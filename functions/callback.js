const fetch = require('node-fetch');

exports.handler = async (event) => {
    const code = event.queryStringParameters.code;
    const state = event.queryStringParameters.state;
    const redirectTo = decodeURIComponent(state.split('some_random_string_')[1]) || '/';
    const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
    const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

    const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code: code,
        }),
    });

    const data = await response.json();
    const accessToken = data.access_token;

    return {
        statusCode: 302,
        headers: {
            Location: `${redirectTo}#token=${accessToken}`,
        },
    };
};