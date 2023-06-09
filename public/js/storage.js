const apiKey = document.getElementById('api-key');
apiKey.value = localStorage.getItem("gpt3Key") || "";

export async function fetchGPTResponse(conversation, attitude, model) {
    const prompt = `Me: ${conversation}\nAI:`;
    let storedApiKey = localStorage.getItem("gpt3Key");

    if (storedApiKey !== apiKey.value.trim()) {
        localStorage.setItem("gpt3Key", apiKey.value.trim());
        storedApiKey = apiKey.value.trim();
    }

    if (!localStorage.getItem("gpt-attitude") || localStorage.getItem("gpt-attitude") !==  attitude) {
        localStorage.setItem("gpt-attitude", attitude);
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${storedApiKey || 'Missing API Key'}`,
            },
            body: JSON.stringify({
                model: model,
                messages: conversation,
                temperature: attitude * 0.01
            }),
        });

        const result = await response.json();

        if (result.choices && result.choices.length > 0) {
            return result.choices[0].message.content;
        } else {
            return "I'm sorry, I couldn't generate a response.";
        }
    } catch (error) {
        console.error("Error fetching GPT response:", error);
        return "An error occurred while fetching a response.";
    }
}

export function loadMessagesFromLocalStorage() {
    const storedMessages = localStorage.getItem("gpt-conversations");
    let parsedConversations = storedMessages ? JSON.parse(storedMessages) : [];

    return parsedConversations.length ? parsedConversations[parsedConversations.length - 1].messageHistory : [];
}

export function loadConversationTitles() {
    const storedConversations = localStorage.getItem('gpt-conversations');
    let parsedConversations = storedConversations ? JSON.parse(storedConversations) : [];
    let defaultOption = { title: 'Choose an existing conversation', messageHistory: [] };
    parsedConversations.unshift(defaultOption);
    return parsedConversations;
}

export function loadStoredConversations() {
    const storedConversations = localStorage.getItem("gpt-conversations");
    return storedConversations ? JSON.parse(storedConversations) : [];
}