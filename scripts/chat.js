// Chat interface functionality

let messages = [
  {
    id: 1,
    type: "ai",
    content: "Hello! I'm your AI medical assistant. How can I help you today?",
    timestamp: new Date().toLocaleTimeString(),
  },
]

let isLoading = false

// DOM Elements
const messagesContainer = document.getElementById("messages-container")
const messageInput = document.getElementById("message-input")
const sendBtn = document.getElementById("send-btn")
const clearChatBtn = document.getElementById("clear-chat")
const voiceBtn = document.getElementById("voice-btn")
const loadingMessage = document.getElementById("loading-message")
const quickActionBtns = document.querySelectorAll(".quick-action-btn")

// Initialize chat functionality
function initChat() {
  setupEventListeners()
  renderMessages()
  console.log("Chat interface initialized")
}

// Setup event listeners
function setupEventListeners() {
  // Send message on button click
  sendBtn.addEventListener("click", handleSendMessage)

  // Send message on Enter key (but not Shift+Enter)
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  })

  // Auto-resize textarea
  messageInput.addEventListener("input", autoResizeTextarea)

  // Clear chat
  clearChatBtn.addEventListener("click", handleClearChat)

  // Voice button (placeholder)
  voiceBtn.addEventListener("click", handleVoiceInput)

  // Quick action buttons
  quickActionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-action")
      messageInput.value = action
      messageInput.focus()
    })
  })
}

// Handle sending messages
function handleSendMessage() {
  const content = messageInput.value.trim()
  if (!content || isLoading) return

  // Add user message
  const userMessage = {
    id: messages.length + 1,
    type: "user",
    content: content,
    timestamp: new Date().toLocaleTimeString(),
  }

  messages.push(userMessage)
  messageInput.value = ""
  autoResizeTextarea()
  renderMessages()

  // Show loading and generate AI response
  showLoading()
  generateAIResponse(content)
}

// Generate AI response (simulated)
function generateAIResponse(userMessage) {
  setTimeout(
    () => {
      const responses = [
        "Based on the symptoms you've described, here are some potential considerations. However, please remember that this is for informational purposes only and should not replace professional medical consultation.",
        "I'd recommend reviewing the latest clinical guidelines for this condition. Would you like me to provide some specific resources or protocols?",
        "The differential diagnosis should include several possibilities. Let me walk you through the key factors to consider in your assessment.",
        "Here's what the current medical literature suggests regarding this topic. I can also help you find relevant studies or guidelines.",
        "For this type of presentation, the standard approach would typically involve... However, individual patient factors should always be considered.",
        "This is an interesting case. Based on current evidence-based practices, here are the recommended steps for evaluation and management.",
      ]

      const aiMessage = {
        id: messages.length + 1,
        type: "ai",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString(),
      }

      messages.push(aiMessage)
      hideLoading()
      renderMessages()
    },
    1500 + Math.random() * 1000,
  ) // Random delay between 1.5-2.5 seconds
}

// Show loading indicator
function showLoading() {
  isLoading = true
  loadingMessage.style.display = "flex"
  sendBtn.disabled = true
  scrollToBottom()
}

// Hide loading indicator
function hideLoading() {
  isLoading = false
  loadingMessage.style.display = "none"
  sendBtn.disabled = false
}

// Render all messages
function renderMessages() {
  const messageElements = messages.map((message) => createMessageElement(message))
  messagesContainer.innerHTML = messageElements.join("")
  scrollToBottom()
}

// Create message element HTML
function createMessageElement(message) {
  const messageClass = message.type === "user" ? "user-message" : "ai-message"

  return `
        <div class="message ${messageClass}">
            <div class="message-content">
                <p>${message.content}</p>
                <span class="message-time">${message.timestamp}</span>
            </div>
        </div>
    `
}

// Scroll to bottom of messages
function scrollToBottom() {
  setTimeout(() => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }, 100)
}

// Auto-resize textarea
function autoResizeTextarea() {
  messageInput.style.height = "auto"
  messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + "px"
}

// Clear chat
function handleClearChat() {
  messages = [messages[0]] // Keep only the initial AI message
  renderMessages()
  window.MedAI.showNotification("Chat cleared successfully", "success")
}

// Voice input (placeholder)
function handleVoiceInput() {
  window.MedAI.showNotification("Voice input feature coming soon!", "info")
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initChat)
} else {
  initChat()
}
