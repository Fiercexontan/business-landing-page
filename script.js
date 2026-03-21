async function submitForm() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const status = document.getElementById('form-status');

  if (!name || !email || !message) {
    status.style.color = 'red';
    status.textContent = '⚠️ Please fill in all fields before sending.';
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    status.style.color = 'red';
    status.textContent = '⚠️ Please enter a valid email address.';
    return;
  }

  status.style.color = '#00b4d8';
  status.textContent = '⏳ Sending your message...';

  try {
    // Send to Formspree
    const formspreeResponse = await fetch('https://formspree.io/f/mkoqgdlg', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });

    // Send to n8n webhook — non blocking
    try {
      await fetch('https://lincolnadura.app.n8n.cloud/webhook/contact-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
    } catch (e) {
      console.log('n8n webhook error:', e);
    }

    if (formspreeResponse.ok) {
      status.style.color = 'green';
      status.textContent = '✅ Message sent! I will get back to you within 24 hours.';
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('message').value = '';
    } else {
      status.style.color = 'red';
      status.textContent = '❌ Something went wrong. Please try again.';
    }
  } catch (error) {
    status.style.color = 'red';
    status.textContent = '❌ Could not send message. Check your connection and try again.';
  }
}