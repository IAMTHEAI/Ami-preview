const messagesDiv = document.getElementById('messages');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');

// Initial Ami greeting
addMessage('Hi! I\'m Ami, your AI assistant. How can I help you today?', 'ami');

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const question = userInput.value.trim();
    if (!question) return;
    addMessage(question, 'user');
    userInput.value = '';
    addMessage('...', 'ami');
    const response = await getAIResponse(question);
    // Replace last '...' with answer
    messagesDiv.removeChild(messagesDiv.lastChild);
    addMessage(response, 'ami');
});

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;
    div.appendChild(bubble);
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function getAIResponse(userMessage) {
    // Call your Vercel backend instead of OpenAI directly!
    const endpoint = "https://YOUR-VERCEL-URL/api/ami-chat"; // <-- Replace with your actual backend URL
    const messages = [
        {role: "system", content: "You are Ami, a helpful, creative, and friendly AI assistant on this website. Answer questions and assist users conversationally."},
        ...Array.from(messagesDiv.children).map(div => {
            const text = div.querySelector('.bubble').textContent;
            return div.classList.contains('user')
                ? {role: "user", content: text}
                : {role: "assistant", content: text};
        }),
        {role: "user", content: userMessage}
    ];

    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ messages: messages.slice(-10) }) // send messages as JSON
        });
        const data = await res.json();
        return data.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't understand that.";
    } catch (err) {
        console.error(err);
        return "Sorry, there was a problem reaching my brain!";
    }
}
