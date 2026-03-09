const AIRTABLE_TOKEN = 'patnU7n4rTedxdDvf.2d8a1807d8e25d9e73ae2b761c6defa135ac21063fce6d8cb59a683e1ec38af3';
const AIRTABLE_BASE_ID = 'app53UDjhCEgouV1E';
const AIRTABLE_TABLE_ID = 'tblYMM9741ZLye9x8';

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
    const airtableResponse = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          Name: name,
          Email: email,
          Message: message,
          Date: new Date().toISOString().split('T')[0]
        }
      })
    });

    const airtableData = await airtableResponse.json();
    console.log('Airtable response:', airtableData);

    if (formspreeResponse.ok && airtableResponse.ok) {
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