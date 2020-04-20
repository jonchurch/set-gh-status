const { Octokit } = require('@octokit/rest');
const { graphql } = require('@octokit/graphql');
require('dotenv').config();

const rest = new Octokit({
  auth: process.env.GH_TOKEN,
});
const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${process.env.GH_TOKEN}`,
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

async function run() {
  const notifications = await rest.paginate('GET /notifications');

  const statusOpts = {
    message: `${notifications.length} notifications pending.`,
    emoji: ':bellhop_bell:',
    // expiresAt: '',
    // limitedAvailability: false
  };
  await graphqlWithAuth(changeStatus, {
    input: statusOpts,
  });
}

run().catch(console.log);
