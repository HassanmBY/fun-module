const channels = [];
const messages = [];

function sendMessage({ title, time, text, channelid = 0 }) {
  // 1. Select the container (Using the class from CSS or ID)
  const messagebox = document.querySelector(".messages");

  // 2. Create the main wrapper div
  const messageDiv = document.createElement("div");
  messageDiv.className = "message";

  // Optional: Add channel ID as data attribute if strictly needed logic-wise
  if (channelid) messageDiv.dataset.channelId = channelid;

  // 3. Populate inner HTML using Template Literals
  // Note: We sanitize 'text' minimally by using textContent if we were building nodes manually,
  // but for this 'dirty' effect, innerHTML is fine as long as you don't input scripts.
  messageDiv.innerHTML = `
            <div 
                class="message-avatar" 
                style="background-image: url('${getRandomAvatar()}'); background-size: cover;"
            ></div>
            <div class="message-content">
                <h4>
                    ${title}
                    <span class="message-timestamp">${time}</span>
                </h4>
                <p class="message-text">${text}</p>
            </div>
        `;

  // 4. Append to container
  messagebox.appendChild(messageDiv);

  // 5. Auto-scroll to bottom
  messagebox.scrollTop = messagebox.scrollHeight;
}

sendMessage({
  title: "Test User",
  time: "Yesterday at 10:50am",
  text: "How do I send messages",
});

function getRandomAvatar() {
  const maxAvatars = 8; // Change this to the total number of images you have
  const x = Math.floor(Math.random() * maxAvatars) + 1;
  return `avatars/avatar${x}.png`;
}

// Handle switching channels
