document.addEventListener('DOMContentLoaded', function() {
    // --- DYNAMIC CONTENT ---
    // This part grabs information from the URL to personalize the page.
    const urlParams = new URLSearchParams(window.location.search);
    const userEmail = urlParams.get('email') || '[your email address]';
    const userName = urlParams.get('name') || 'Guest';

    // Update the email display on the page
    document.getElementById('user-email').textContent = userEmail;

    // --- ADD TO CALENDAR FUNCTIONALITY ---
    // Event Details (Replace with your actual event details)
    const event = {
        title: 'ULES Annual Dinner & Awards Night',
        // Dates must be in UTC format: YYYYMMDDTHHMMSSZ
        // Example: September 3, 2025, 7:00 PM (assuming GMT+1, so 18:00 UTC)
        start: '20250903T180000Z',
        end: '20250903T230000Z', // Example end time: 11:00 PM
        description: 'The Official ULES Annual Dinner & Awards Night. Dress Code: Black Tie / Formal. Bring your e-ticket for entry.',
        location: 'Eko Hotel Grand Ballroom, Victoria Island, Lagos'
    };

    // Function to create a URL-encoded string for calendar links
    const encode = str => encodeURIComponent(str).replace(/%20/g, '+');

    // 1. Google Calendar Link
    const googleLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encode(event.title)}&dates=${event.start}/${event.end}&details=${encode(event.description)}&location=${encode(event.location)}`;

    // 2. Outlook/Yahoo/Office 365 Link
    const outlookLink = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encode(event.title)}&startdt=${event.start}&enddt=${event.end}&body=${encode(event.description)}&location=${encode(event.location)}`;

    // 3. Apple Calendar (.ics file)
    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `URL:${document.URL}`,
        `DTSTART:${event.start}`,
        `DTEND:${event.end}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description}`,
        `LOCATION:${event.location}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\n');
    const icsLink = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;

    // Populate the dropdown with the generated links
    const calendarLinksContainer = document.getElementById('calendar-links');
    calendarLinksContainer.innerHTML = `
      <a href="${googleLink}" target="_blank" rel="noopener noreferrer">Google Calendar</a>
      <a href="${outlookLink}" target="_blank" rel="noopener noreferrer">Outlook / Office 365</a>
      <a href="${icsLink}" download="ULES-Dinner-Event.ics">Apple Calendar (.ics)</a>
  `;
});