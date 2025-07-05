async function getAIResponse(userMessage) {
    // Call your Vercel backend instead of OpenAI directly!
    const endpoint = "https://ami-backend.vercel.app/api/ami-chat"; // <-- Replace with your actual backend URL
   
    const messages = [
        { role: "system", content: "You are Ami, a friendly and casual AI who uses emojis and simple language" },
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
