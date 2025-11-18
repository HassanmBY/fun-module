async function loadEmails() {
  const response = await fetch("email_messages.json");
  const emails = await response.json();

  const list = document.getElementById("emailList");
  const content = document.getElementById("emailContent");
  const base_paraph = document.getElementById("base-paraph");

  let index = 0;

  // Load your sound file (put it in your project folder)
  const notificationSound = new Audio("./assets/notification_sound.mp3");

  function showNextEmail() {
    if (index >= emails.length) return; // Stop when all emails are loaded

    const email = emails[index];
    index++;

    const shortTitle =
      email.title.length > 20 ? email.title.slice(0, 20) + "…" : email.title;

    const shortMessage =
      email.message.length > 50
        ? email.message.slice(0, 50) + "…"
        : email.message;

    const item = document.createElement("div");
    item.classList.add("bold", "email-item");

    item.innerHTML = `
      <p>${email.sender_name}</p>
      <p>${email.date}</p>
      <p class="wrapped-title">${shortTitle}</p>
      <p class="wrapped-message">${shortMessage}</p>
    `;

    item.addEventListener("click", () => {
      document
        .querySelectorAll(".email-item")
        .forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
      item.classList.remove("bold");
      base_paraph.innerHTML = "";
      content.classList.remove("hidden");
      content.innerHTML = `
        <h2>${email.title}</h2>
        <p><strong>From:</strong> ${email.sender_name} (${email.sender_email})</p>
        <p><strong>Message:</strong></p>
        <p>${email.message}</p>
      `;
    });

    list.appendChild(item);

    // Play notification sound
    notificationSound.currentTime = 0; // restart sound
    notificationSound.play();

    // Schedule the next email in 2–5 minutes (120000–300000 ms)
    const randomDelay = 120000 + Math.random() * 180000;
    setTimeout(showNextEmail, randomDelay);
  }

  // Start showing emails
  showNextEmail();
}

loadEmails();
