async function loadEmails() {
  const response = await fetch("email_messages.json");
  const emails = await response.json();

  const list = document.getElementById("emailList");
  const content = document.getElementById("emailContent");
  const base_paraph = document.getElementById("base-paraph");

  emails.forEach((email, index) => {
    const item = document.createElement("div");
    item.classList.add('bold');
    item.classList.add("email-item");
    item.textContent = email.title;

    item.addEventListener("click", () => {
      document
        .querySelectorAll(".email-item")
        .forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
      item.classList.remove('bold')
      base_paraph.innerHTML = ''
      content.classList.remove('hidden')
      content.innerHTML = `
                <h2>${email.title}</h2>
                <p><strong>From:</strong> ${email.sender_name} (${email.sender_email})</p>
                <p><strong>Message:</strong></p>
                <p>${email.message}</p>
            `;
    });

    list.appendChild(item);
  });
}

loadEmails();
