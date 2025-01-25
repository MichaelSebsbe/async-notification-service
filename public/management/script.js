function sendNotification() {
  const apikey = document.getElementById('apikey').value;
  const title = document.getElementById('title').value;
  const body = document.getElementById('body').value;
  const messageDiv = document.getElementById('message');

  fetch('/api/notifications/broadcast', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ns-api-key': apikey
    },
    body: JSON.stringify({ title, body })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      messageDiv.textContent = 'Notification sent successfully!';
      messageDiv.className = 'message success';
    } else {
      messageDiv.textContent = 'Failed to send notification: ' + (data.errors ? data.errors.join(', ') : 'Unknown error');
      messageDiv.className = 'message error';
    }
    messageDiv.style.display = 'block';
  })
  .catch(error => {
    messageDiv.textContent = 'An error occurred: ' + error.message;
    messageDiv.className = 'message error';
    messageDiv.style.display = 'block';
  });
}