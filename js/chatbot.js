import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

    // FIREBASE AUTHENTICATION
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const userAvatar = document.getElementById("userAvatar");
    const logoutBtn = document.getElementById("logoutBtn");

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const name = user.displayName || "User";

            userName.textContent = name;
            userEmail.textContent = user.email || "";
            userAvatar.textContent = name.charAt(0).toUpperCase();
        } else {
            window.location.href = "login.html";
        }
    });

    logoutBtn.addEventListener("click", async () => {
        if (!confirm("Are you sure you want to logout?")) return;

        try {
            await signOut(auth);
            window.location.href = "login.html";
        } catch (error) {
            console.error("Logout Error:", error);
            alert("Unable to logout. Please try again.");
        }
    });

    // CHAT ELEMENTS
    const chatMessages = document.getElementById("chatMessages");
    const chatInput = document.getElementById("chatInput");
    const sendMessageBtn = document.getElementById("sendMessageBtn");

    const newChatBtn = document.getElementById("newChatBtn");
    const clearChatBtn = document.getElementById("clearChatBtn");

    const welcomeMessage = document.getElementById("welcomeMessage");
    const suggestionCards = document.querySelectorAll(".suggestion-card");

    // ADD MESSAGE TO CHAT
    function addMessage(message, sender) {

        const messageWrapper = document.createElement("div");

        messageWrapper.className =
            sender === "user"
                ? "chat-message user-message"
                : "chat-message bot-message";

        const avatar = document.createElement("div");
        avatar.className = "message-avatar";
        avatar.textContent = sender === "user" ? "U" : "✦";

        const content = document.createElement("div");
        content.className = "message-content";
        content.textContent = message;

        messageWrapper.append(avatar, content);
        chatMessages.appendChild(messageWrapper);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // LOADING INDICATOR
    function showLoading() {
        const loading = document.createElement("div");

        loading.className = "chat-message bot-message";
        loading.id = "chatLoading";

        const avatar = document.createElement("div");
        avatar.className = "message-avatar";
        avatar.textContent = "✦";

        const content = document.createElement("div");
        content.className = "message-content";
        content.textContent = "Preparing your response...";

        loading.append(avatar, content);
        chatMessages.appendChild(loading);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeLoading() {
        const loading = document.getElementById("chatLoading");

        if (loading) {
            loading.remove();
        }
    }

    // TEMPORARY RESPONSE
    // Actual AI API connection will be added through a secure backend.
    function getDemoResponse(message) {

        const topic = message.trim();

        return `Here is a starting point for your request:

Topic: ${topic}

1. Introduction
Introduce the topic and explain why it is important.

2. Main Points
Divide your topic into three or four important sections.

3. Examples
Include relevant examples, facts or real-world applications.

4. Conclusion
Summarize the main ideas and finish with a clear takeaway.

This is a sample response. Connect the secure AI backend to receive real AI-generated answers.`;
    }

    // SEND MESSAGE
    async function sendMessage(message) {

        const text = message.trim();

        if (!text) return;

        welcomeMessage.style.display = "none";

        addMessage(text, "user");

        chatInput.value = "";
        chatInput.style.height = "auto";

        sendMessageBtn.disabled = true;
        showLoading();

        try {
            // Temporary demo response
            await new Promise(resolve => setTimeout(resolve, 800));

            const response = getDemoResponse(text);

            removeLoading();
            addMessage(response, "bot");

        } catch (error) {
            removeLoading();

            addMessage(
                "Sorry, something went wrong. Please try again.",
                "bot"
            );

            console.error("Chat Error:", error);

        } finally {
            sendMessageBtn.disabled = false;
            chatInput.focus();
        }
    }

    // SEND BUTTON
    sendMessageBtn.addEventListener("click", () => {
        sendMessage(chatInput.value);
    });

    // ENTER TO SEND
    chatInput.addEventListener("keydown", (event) => {

        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage(chatInput.value);
        }
    });

    // AUTO RESIZE INPUT
    chatInput.addEventListener("input", () => {
        chatInput.style.height = "auto";
        chatInput.style.height =
            Math.min(chatInput.scrollHeight, 120) + "px";
    });

    // SUGGESTION CARDS
    suggestionCards.forEach(card => {

        card.addEventListener("click", () => {

            const prompt = card.dataset.prompt;

            sendMessage(prompt);
        });
    });

    // CLEAR CHAT
    function clearChat() {

        chatMessages.innerHTML = "";
        chatMessages.appendChild(welcomeMessage);

        welcomeMessage.style.display = "block";
        chatInput.value = "";

        chatMessages.scrollTop = 0;
    }

    clearChatBtn.addEventListener("click", clearChat);

    // NEW CHAT
    newChatBtn.addEventListener("click", () => {
        clearChat();
        chatInput.focus();
    });

    console.log("PitchCraft AI Chatbot Loaded Successfully!");

});
