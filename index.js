const { Octokit } = require('@octokit/rest');
const { graphql } = require('@octokit/graphql');
const { GH_TOKEN } = require('./config');

if (!GH_TOKEN) {
  throw new Error('GH_TOKEN required!');
}

const rest = new Octokit({
  auth: GH_TOKEN,
});
const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${GH_TOKEN}`,
  },
});

const changeStatus = `mutation changeUserStatus ($input: ChangeUserStatusInput!) {
  changeUserStatus (input: $input) {
    status {
      emoji
      message
      indicatesLimitedAvailability
    }
  }
}`;

async function setStatus() {
  const notifications = await rest.paginate('GET /notifications');
  const message = `${notifications.length} notifications pending.`;
  const statusOpts = {
    message,
    emoji: ':bellhop_bell:',
    // expiresAt: '',
    // limitedAvailability: false
  };
  await graphqlWithAuth(changeStatus, {
    input: statusOpts,
  });

  console.log(`Message set: "${message}"`);
}

setStatus().catch(console.error);
