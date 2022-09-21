document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();
};

async function renderApp() {
  try {
    let _client = await app.initialized();
    window['client'] = _client;
    client.events.on('app.activated', renderSidebar);
    return;
  } catch (error) {
    console.error(error);
    await showNotification('danger', 'Unable to load the app');
  }
}

async function renderSidebar() {
  let viewIssBtn = document.querySelector('.issue-details');
  let createIssBtn = document.querySelector('.create-issue');

  createIssBtn.addEventListener('fwClick', createIssue)
  viewIssBtn.addEventListener('fwClick', async function showDetails() {

      await client.interface.trigger('showModal', {
        title: 'GitHub Issue Details',
        template: './views/modal.html'
      });

  })
}

async function createIssue() {
  var {
    ticket: { id: ticketID, subject, description }
  } = await client.data.get('ticket');

  console.log(ticketID, subject, description);

  try {
    let dbKey = String(ticketID);
    let dbResponse = await client.db.get(dbKey);
    console.log('dbResponse', dbResponse);
    await showNotification('warning', `An github issue is already created for ticket number ${dbResponse.ticketID}`);
   } catch (error) {
    console.log('error occurs when db key is not found - issue is not alreayd created so creating it. but error', error)

    if (error.status && error.message) {
      let { status, message } = error;
      let options = {
        headers: {
          Authorization: 'token <%= access_token %>',
          'user-agent': 'freshworks app'
        },
        body: JSON.stringify({
          title: subject,
          body: description
        }),
        isOAuth: true
      };
<<<<<<< Updated upstream
      let issuesEnpoint = `https://api.github.com/repos/<%= iparam.github_repo %>/issues`;
      let { response } = await client.request.post(issuesEnpoint, options);

      console.log('response', response);

      let { id: issueID, number: issueNumber } = JSON.parse(response);
=======

      let issuesEnpoint = `https://api.github.com/repos/<%= iparam.github_repo %>/issues`;
      let { response } = await client.request.post(issuesEnpoint, options);
      let { id: issueID, number: issueNumber } = JSON.parse(response);

>>>>>>> Stashed changes
      let data = {
        ticketID,
        issueID,
        issueNumber
      };

<<<<<<< Updated upstream
      console.log('data', data);
      await Promise.all([client.db.set(String(issueID), { ...data }), client.db.set(String(ticketID), { ...data })]);
      await showNotification('success', 'Github Issue has been created successfully');
=======
      await Promise.all([client.db.set(String(issueID), { ...data }), client.db.set(String(ticketID), { ...data })]);
      await showNotification('success', 'GitHub Issue has been created successfully');
>>>>>>> Stashed changes
    } else {
      console.error('Here is what we know:', error);
    }
  }
}

<<<<<<< Updated upstream
function renderSidebar() {
  const pick = document.querySelector.bind(document);

  let createIssBtn = pick('.create-issue');
  let viewIssBtn = pick('.issue-details');

  createIssBtn.addEventListener('fwClick', createIssue);
  viewIssBtn.addEventListener('fwClick', async function showDetails() {
    try {
      await client.interface.trigger('showModal', {
        title: 'Github Issue Details',
        template: './views/modal.html'
      });
    } catch (error) {
      console.error('Saw following error:', error);
    }
  });
}

=======
>>>>>>> Stashed changes
async function showNotification(status, message) {
  const details = {
    type: `${status}`,
    message: `${message}`
  };
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
  await client.interface.trigger('showNotify', details);
}
