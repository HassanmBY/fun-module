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

    // Determine classes
    let className = "channel-item";
    if (channel.id === currentChannelId) {
      className += " active";
    } else if (channel.unread) {
      className += " unread";
    }

    div.className = className;
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
  const targetId = channelid || currentChannelId;

  // 1. Add to State
  messages.push({
    channelId: targetId,
    user: title,
    time: time,
    text: text,
    avatar: getRandomAvatar(),
  });

  // 2. Handle Unread Status & View Update
  if (targetId !== currentChannelId) {
    // If sending to a different channel, mark it as unread
    const channel = channels.find((c) => c.id === targetId);
    if (channel) {
      channel.unread = true;
      renderChannels(); // Rerender sidebar to show bold
    }
  } else {
    // Only render messages if we are looking at the current channel
    renderMessages();
  }
}

// --- INITIALIZATION & EVENTS ---

// Initial Render
renderChannels();
renderMessages();
// send two messages with a random interval (30s - 2min) between them
// const MIN_DELAY = 30 * 1000; // 30 seconds
// const MAX_DELAY = 2 * 60 * 1000; // 2 minutes

const MIN_DELAY = 5 * 1000; // 30 seconds
const MAX_DELAY = 10 * 1000; // 2 minutes

function randomDelay(min = MIN_DELAY, max = MAX_DELAY) {
  return Math.floor(Math.random() * (max - min) + min);
}

const firstDelay = randomDelay(); // delay before the first message
const gapBetweenMessages = randomDelay(); // delay between first and second

// schedule a bunch of simulated messages (flexible, many entries)
const simulatedMessages = [
  {
    title: "TechGuru",
    time: "Today at 10:15 AM",
    text: "My pc won't turn on, can someone help?",
    channelid: "helpit",
  },
  {
    title: "knowitall",
    time: "Today at 10:17 AM",
    text: "Have you tried holding the power button for 10s?",
    channelid: "helpit",
  },
  {
    title: "Alexa",
    time: "Today at 10:18 AM",
    text: "Hey siri, how do I change my password?",
    channelid: "general",
  },
  {
    title: "Mark",
    time: "Today at 10:19 AM",
    text: "UR SENDING THAT ON DISCORD",
    channelid: "general",
  },
  {
    title: "George",
    time: "Today at 10:20 AM",
    text: "I broke the toilet on the fourth floor, can someone come and fix it?",
    channelid: "helpit",
  },
  {
    title: "Jester",
    time: "Today at 10:22 AM",
    text: "I could reply to that, but I'd rather not waste my brain cells.",
    channelid: "helpit",
  },
  {
    title: "whatdoIputhere",
    time: "Today at 10:23 AM",
    text: "My screen isn't turning on",
    channelid: "general",
  },
  {
    title: "Bot",
    time: "Today at 10:24 AM",
    text: "Reminder: Meeting in 15 minutes. ",
    channelid: "general",
  },
];

// schedule them with variable gaps (uses firstDelay & randomDelay)
let cumulative = firstDelay;
simulatedMessages.forEach((m) => {
  setTimeout(() => sendMessage(m), cumulative);

  cumulative += randomDelay();
});

// preserve existing delayed action
setTimeout(() => {
  createChannel("helpicanttypemessages");
}, 40000);
