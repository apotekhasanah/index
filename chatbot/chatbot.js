const form = document.getElementById("chat-form")
const input = document.getElementById("chat-input")
const messages = document.getElementById("messages")
const toggleBtn = document.getElementById("chatbot-toggle")
const closeBtn = document.getElementById("close-chat")
const panel = document.getElementById("chatbot-panel")
const typingIndicator = document.getElementById("typing-indicator")

const API_KEY = "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"

// System message
const systemMessage = {
  role: "system",
  content: `You are a pharmacy assistant for an educational pharmacy website. Your role is to guide patients who want to seek medical advice, solve problems, and understand medicals. 
If asked about topics unrelated to pharmacy or medical, politely respond with: 'Sorry, I'm designed to help with medical topics. Please ask a medical-related question instead.'

Keep your responses concise and educational. Aim to explain complex concepts in an accessible way without overwhelming patients with excessive information. For very complex questions, break down your explanation into manageable parts, focusing on the fundamental principles first before addressing advanced concepts.`
}

// Chat history array
const chatHistory = [systemMessage]

// Limit to last 10 user+bot exchanges (20 messages + system)
function trimChatHistory() {
  const MAX_MESSAGES = 11 // 1 system + 20 exchanges
  if (chatHistory.length > MAX_MESSAGES) {
    // Keep the system message and trim the rest
    chatHistory.splice(1, chatHistory.length - MAX_MESSAGES)
  }
}

// Toggle chat panel
toggleBtn.addEventListener("click", () => {
  panel.classList.add("active")
  setTimeout(() => input.focus(), 300)
})

// Close chat panel
closeBtn.addEventListener("click", () => {
  panel.classList.remove("active")
})

// Optional: click outside to close
document.addEventListener("click", (e) => {
  if (
    panel.classList.contains("active") &&
    !panel.contains(e.target) &&
    e.target !== toggleBtn &&
    !toggleBtn.contains(e.target)
  ) {
    panel.classList.remove("active")
  }
})

async function sendMessage(userInput) {
  addMessage(userInput, "user")
  typingIndicator.classList.remove("hidden")

  // Push user message to history
  chatHistory.push({ role: "user", content: userInput })
  trimChatHistory()

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: chatHistory,
        temperature: 0.7,
      }),
    })

    typingIndicator.classList.add("hidden")

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`)
    }

    const data = await res.json()
    const botReply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process your request."

    // Push assistant message to history
    chatHistory.push({ role: "assistant", content: botReply })
    trimChatHistory()

    addMessage(botReply, "bot")
  } catch (err) {
    console.error("Groq API Error:", err)
    typingIndicator.classList.add("hidden")
    addMessage("I'm having trouble connecting right now. Please try again later.", "bot")
  }
}

function addMessage(text, role) {
  const messageDiv = document.createElement("div")
  messageDiv.classList.add("message", role)

  // Try to parse JSON response if from bot
  if (role === "bot") {
    try {
      const data = JSON.parse(text)
      if (data.Type === "Chat" && data.Chat) {
        messageDiv.textContent = data.Chat
      } else if (data.Type === "Link" && data.Link) {
        messageDiv.innerHTML = `<a href="${data.Link}" target="_blank" rel="noopener noreferrer">${data.Link}</a>`
      } else if (data.Type === "Chemical Reaction" && data["Chemical Reaction"]) {
        messageDiv.textContent = data["Chemical Reaction"]
      } else {
        messageDiv.textContent = text
      }
    } catch {
      messageDiv.textContent = text // fallback if not valid JSON
    }
  } else {
    messageDiv.textContent = text
  }

  messages.appendChild(messageDiv)

  // Scroll to bottom
  setTimeout(() => {
    messages.scrollTop = messages.scrollHeight
  }, 100)
}

// Form submit
form.addEventListener("submit", (e) => {
  e.preventDefault()
  const text = input.value.trim()
  if (text) {
    sendMessage(text)
    input.value = ""
  }
})

// Allow Enter to send message
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault()
    form.dispatchEvent(new Event("submit"))
  }
})

// Optional: Welcome message
window.addEventListener("load", () => {
  // addMessage("Hi there! How can I help you today?", 'bot')
})
