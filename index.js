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

const DEFAULT_TEMPLATE = '{#} notifications pending';

function interpolateMessage(message, numNotifications) {
  const reg = /{#}/;
  return message.replace(reg, numNotifications);
}

async function setStatus(messageTemplate) {
  const notifications = await rest.paginate('GET /notifications');

  const message = interpolateMessage(
    messageTemplate || DEFAULT_TEMPLATE,
    notifications.length
  );

  await graphqlWithAuth(changeStatus, {
    input: {
      message,
      emoji: ':bellhop_bell:',
    },
  });

  console.log(`Status set: "${message}"`);
}

setStatus().catch(console.error);

module.exports.setStatus = setStatus;
