function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendMessage() {
    // Wait for 1 second before making the API call
    await delay(1000);

    const userInput = document.getElementById('userInput').value;
    const chatbox = document.getElementById('chatbox');

    // Display user's message
    const userMessage = document.createElement('div');
    userMessage.textContent = userInput;
    userMessage.className = 'user-message';
    chatbox.appendChild(userMessage);

    document.getElementById('userInput').value = '';

    // Scroll to the bottom of the chat
    chatbox.scrollTop = chatbox.scrollHeight;

    const apiKey = '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';

    try {
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                prompt: userInput,
                max_tokens: 150
            })
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorDetails.error.message}`);
        }
        if (response.status === 429) {
            console.log("Rate limit exceeded. Retrying in 1 second...");
            await delay(1000);  // Retry after 1 second
            // Retry the request here
        }
        

        const data = await response.json();

        const botMessage = document.createElement('div');
        botMessage.textContent = data.choices[0].text;
        botMessage.className = 'bot-message';
        chatbox.appendChild(botMessage);

        chatbox.scrollTop = chatbox.scrollHeight;

    } catch (error) {
        console.error('Error:', error);
        const errorMessage = document.createElement('div');
        errorMessage.textContent = `Sorry, something went wrong. Error: ${error.message}`;
        errorMessage.className = 'bot-message';
        chatbox.appendChild(errorMessage);
    }
}
