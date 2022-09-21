document.onreadystatechange = async function () {
  if (document.readyState === 'interactive') {
    var pick = document.querySelector.bind(document);
    var body = pick('.app-body');

    try {
      let client = await app.initialized();

      let options = {
        headers: {
          Authorization: 'token <%= access_token %>',
          'user-agent': 'freshworks app'
        },
        isOAuth: true
      };

      let {
        ticket: { id: ticketID }
      } = await client.data.get('ticket');

      console.log('Ticket ID', ticketID);

      let { issueNumber } = await client.db.get(ticketID);

      let issuesEnpoint = `https://api.github.com/repos/<%= iparam.github_repo %>/issues/${issueNumber}`;

      let { response: issueDetails } = await client.request.get(issuesEnpoint, options);
      let { url, number, title, body: desc } = JSON.parse(issueDetails);

      const modalContent = `
      <h2>${title}</h2>
      <fw-label color="blue" value="Issue Number: ${number}"></fw-label>
      <br>
      <code>URL: ${url}</code>
      <h3>Description</h3>
      <p>${desc}</p>
      `;
      body.insertAdjacentHTML('afterbegin', modalContent);
    } catch (error) {
      body.insertAdjacentHTML('afterbegin', '<p>No Github issue details associated to this ticket found</p>');
    }
  }
};
