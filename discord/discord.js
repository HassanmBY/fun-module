// --- STATE MANAGEMENT ---

const channels = [
  { id: "general", name: "general" },
  { id: "helpit", name: "Help-IT" },
];

let currentChannelId = "general";

const messages = [
  {
    channelId: "general",
    user: "CoolUser",
    time: "Yesterday at 10:30 AM",
    text: "Does anyone know how to center a div? 😭",
    avatar: getRandomAvatar(),
  },
  {
    channelId: "helpit",
    user: "Jester",
    time: "Today at 9:00 AM",
    text: "Send help, the printer is broken.",
    avatar: getRandomAvatar(),
  },
];

// --- DOM ELEMENTS ---
const messageBox = document.querySelector(".messages");
const channelListEl = document.querySelector(".channel-list");
const chatHeaderEl = document.querySelector(".chat-header");
const input = document.querySelector(".input-box");

// --- HELPER FUNCTIONS ---

function getRandomAvatar() {
  const maxAvatars = 8;
  const x = Math.floor(Math.random() * maxAvatars) + 1;
  return `avatars/avatar${x}.png`;
}

// --- CORE FUNCTIONS ---

function switchChannel(channelId) {
  currentChannelId = channelId;

  // Update Header
  const currentChannel = channels.find((c) => c.id === channelId);
  chatHeaderEl.innerHTML = `<span class="hashtag">#</span> ${currentChannel.name}`;
  input.placeholder = `Message #${currentChannel.name}`;

  // Re-render UI
  renderChannels();
  renderMessages();
}

function renderChannels() {
  channelListEl.innerHTML = "";
  channels.forEach((channel) => {
    const div = document.createElement("div");
    div.className = `channel-item ${
      channel.id === currentChannelId ? "active" : ""
    }`;
    div.innerHTML = `<span class="hashtag">#</span> ${channel.name}`;
    div.onclick = () => switchChannel(channel.id);
    channelListEl.appendChild(div);
  });
}

/**
 * Creates a new channel and re-renders the list
 */
function createChannel(channelName) {
  if (!channelName) return;

  // 1. Create a simple ID from the name (e.g., "Voice Chat" -> "voice-chat")
  const newId = channelName.toLowerCase().trim().replace(/\s+/g, "-");

  // 2. Add to our state array
  channels.push({
    id: newId,
    name: channelName,
  });

  // 3. Update the DOM
  renderChannels();
}

function renderMessages() {
  messageBox.innerHTML = "";

  // Filter messages for current channel
  const channelMessages = messages.filter(
    (m) => m.channelId === currentChannelId
  );

  channelMessages.forEach((msg) => {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message";
    messageDiv.innerHTML = `
                <div 
                    class="message-avatar" 
                    style="background-image: url('${msg.avatar}'); background-size: cover;"
                ></div>
                <div class="message-content">
                    <h4>
                        ${msg.user}
                        <span class="message-timestamp">${msg.time}</span>
                    </h4>
                    <p class="message-text">${msg.text}</p>
                </div>
            `;
    messageBox.appendChild(messageDiv);
  });

  messageBox.scrollTop = messageBox.scrollHeight;
}

function sendMessage({ title, time, text, channelid }) {
  // 1. Add to State
  messages.push({
    channelId: channelid || currentChannelId,
    user: title,
    time: time,
    text: text,
    avatar: getRandomAvatar(),
  });

  // 2. Update View
  renderMessages();
}

// --- INITIALIZATION & EVENTS ---

// Initial Render
renderChannels();
renderMessages();

setTimeout(() => {
  createChannel("helpicanttypemessages");
}, 5000);
