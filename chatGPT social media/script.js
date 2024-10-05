async function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    const chatbox = document.getElementById('chatbox');

    // Display user's message
    const userMessage = document.createElement('div');
    userMessage.textContent = userInput;
    userMessage.className = 'user-message';
    chatbox.appendChild(userMessage);

    const retryDelay = 5000; // 5 seconds delay before retrying

    async function callAPI() {
        try {
            // Call OpenAI API
            const response = await fetch('https://api.openai.com/v1/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer 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` // Replace with your actual API key
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    prompt: userInput,
                    max_tokens: 150
                })
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                if (response.status === 429) {
                    // Handle rate limit error (HTTP 429)
                    throw new Error('Rate limit exceeded. Retrying after a delay.');
                }
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorDetails.error.message}`);
            }

            const data = await response.json();
            const botMessage = document.createElement('div');
            botMessage.textContent = data.choices[0].text;
            botMessage.className = 'bot-message';
            chatbox.appendChild(botMessage);

            // Scroll chatbox to the bottom
            chatbox.scrollTop = chatbox.scrollHeight;

        } catch (error) {
            console.error('Error:', error);

            if (error.message.includes('Rate limit exceeded')) {
                // Retry after a delay if rate limit is exceeded
                setTimeout(callAPI, retryDelay);
            } else {
                // Display error message
                const errorMessage = document.createElement('div');
                errorMessage.textContent = `Sorry, something went wrong. Error: ${error.message}`;
                errorMessage.className = 'error-message';
                chatbox.appendChild(errorMessage);
            }
        }
    }

    // Call the API
    callAPI();

    // Clear input
    document.getElementById('userInput').value = '';
}
