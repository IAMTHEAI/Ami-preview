async function getAIResponse(userMessage) {
    /*const endpoint = "https://ami-backend.vercel.app/api/ami-chat";*/ // ✅ keep this as your deployed backend URL
const endpoint = "https://ami-backend.vercel.app/api/ami-chat";
    const messages = [
        { role: "system", content: "You are Ami, a friendly and casual AI who uses emojis and simple language" },
        ...Array.from(messagesDiv.children).map(div => {
            const text = div.querySelector('.bubble').textContent;
            return div.classList.contains('user')
                ? { role: "user", content: text }
                : { role: "assistant", content: text };
        }),
        { role: "user", content: userMessage }
    ];

    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ messages: messages.slice(-10) }) // ✅ no change
        });

        const data = await res.json();

        // ✅ NEW: Groq may need logging for debugging
        console.log("Full API response:", data);

        // ✅ SAME line works unless Groq changes the format
        return data.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't understand that.";
    } catch (err) {
        console.error("Fetch error:", err);
        return "Sorry, there was a problem reaching my brain!";
    }
}
