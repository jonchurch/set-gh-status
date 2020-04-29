const { Octokit } = require('@octokit/rest');
const { graphql } = require('@octokit/graphql');
const { SET_STATUS_TOKEN } = require('./config');

if (!SET_STATUS_TOKEN) {
  throw new Error('Token must be provided!');
}

const rest = new Octokit({
  auth: SET_STATUS_TOKEN,
});
const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${SET_STATUS_TOKEN}`,
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

async function setStatus({ message, emoji, limitedAvailability, expiresAt }) {
  try {
    // this request is only necessary if you're using the {#} template
    const notifications = await rest.paginate('GET /notifications');

    const _message = interpolateMessage(
      message || DEFAULT_TEMPLATE,
      notifications.length
    );

    await graphqlWithAuth(changeStatus, {
      input: {
        message: _message,
        emoji,
        limitedAvailability,
      },
    });

    console.log(`Status set: "${_message}"`);
  } catch (err) {
    if (err.status && err.status === 401) {
      console.error('Could not set status, bad credentials');
    } else {
      console.log('Could not set status');
    }
  }
}

module.exports.setStatus = setStatus;
