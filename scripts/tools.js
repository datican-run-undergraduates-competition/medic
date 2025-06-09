// Health Analysis Tools functionality

let currentTool = null
let uploadedFile = null
let analysisResult = null

// Tool configurations
const toolsConfig = {
  // Notebook-based tools
  "posture-notebook": {
    id: "posture-notebook",
    title: "Posture Analysis (Notebook)",
    description: "Advanced posture analysis using Jupyter notebook implementation",
    icon: "📊",
    notebookPath: "Jupyter Notebooks/Postureanalysis.ipynb",
    type: "notebook"
  },
  "squats-notebook": {
    id: "squats-notebook",
    title: "Squat Analysis (Notebook)",
    description: "Detailed squat form analysis with Jupyter notebook",
    icon: "🏋️‍♂️",
    notebookPath: "Jupyter Notebooks/Squats.ipynb",
    type: "notebook"
  },
  "pushups-notebook": {
    id: "pushups-notebook",
    title: "Push-up Analysis (Notebook)",
    description: "Advanced push-up form analysis using Jupyter notebook",
    icon: "💪",
    notebookPath: "Jupyter Notebooks/PushUp Analysis.ipynb",
    type: "notebook"
  },
  "rehabilitation-notebook": {
    id: "rehabilitation-notebook",
    title: "Movement Rehabilitation (Notebook)",
    description: "Movement pattern analysis with Jupyter notebook",
    icon: "🏥",
    notebookPath: "Jupyter Notebooks/Movehabilitation.ipynb",
    type: "notebook"
  },
  // Original tools
  posture: {
    id: "posture",
    title: "Posture Analysis",
    description: "AI-powered spine and posture assessment with real-time feedback",
    icon: "🧘‍♂️",
    fileTypes: ["video/mp4", "video/webm"],
    acceptAttribute: "video/*",
    analysisType: "real-time",
    requiresCamera: true
  },
  squats: {
    id: "squats",
    title: "Squat Analysis",
    description: "Form and technique analysis for squats with correction guidance",
    icon: "🏋️‍♂️",
    fileTypes: ["video/mp4", "video/webm"],
    acceptAttribute: "video/*",
    analysisType: "real-time",
    requiresCamera: true
  },
  pushups: {
    id: "pushups",
    title: "Push-up Analysis",
    description: "Push-up form assessment and technique improvement",
    icon: "💪",
    fileTypes: ["video/mp4", "video/webm"],
    acceptAttribute: "video/*",
    analysisType: "real-time",
    requiresCamera: true
  },
  rehabilitation: {
    id: "rehabilitation",
    title: "Movement Rehabilitation",
    description: "Movement pattern analysis and rehabilitation guidance",
    icon: "🏥",
    fileTypes: ["video/mp4", "video/webm"],
    acceptAttribute: "video/*",
    analysisType: "real-time",
    requiresCamera: true
  },
  stroke: {
    id: "stroke",
    title: "Stroke Assessment",
    description: "Hand-eye coordination and motor function analysis",
    icon: "🧠",
    fileTypes: ["video/mp4", "video/webm"],
    acceptAttribute: "video/*",
  },
  skin: {
    id: "skin",
    title: "Skin Condition Analysis",
    description: "Dermatological assessment and lesion detection",
    icon: "🔬",
    fileTypes: ["image/jpeg", "image/png"],
    acceptAttribute: "image/*",
  },
  gait: {
    id: "gait",
    title: "Gait Analysis",
    description: "Walking pattern and mobility assessment",
    icon: "👣",
    fileTypes: ["video/mp4", "video/webm"],
    acceptAttribute: "video/*",
  },
  respiratory: {
    id: "respiratory",
    title: "Respiratory Analysis",
    description: "Breathing pattern and lung function assessment",
    icon: "🫁",
    fileTypes: ["audio/wav", "audio/mp3"],
    acceptAttribute: "audio/*",
  },
  cardiac: {
    id: "cardiac",
    title: "Cardiac Rhythm Analysis",
    description: "Heart rate variability and rhythm assessment",
    icon: "❤️",
    fileTypes: ["audio/wav", "audio/mp3"],
    acceptAttribute: "audio/*",
  },
}

// DOM Elements
const toolsDashboard = document.getElementById("tools-dashboard")
const toolInterface = document.getElementById("tool-interface")
const toolCards = document.querySelectorAll(".tool-card")
const backBtn = document.getElementById("back-btn")
const fileInput = document.getElementById("file-input")
const browseBtn = document.getElementById("browse-btn")
const uploadArea = document.getElementById("upload-area")
const filePreview = document.getElementById("file-preview")
const analyzeBtn = document.getElementById("analyze-btn")
const uploadSection = document.getElementById("upload-section")
const processingSection = document.getElementById("processing-section")
const resultsSection = document.getElementById("results-section")
const newAnalysisBtn = document.getElementById("new-analysis-btn")
const downloadReportBtn = document.getElementById("download-report-btn")

// Initialize tools functionality
function initTools() {
  setupEventListeners()
  console.log("Health Analysis Tools initialized")
}

// Setup event listeners
function setupEventListeners() {
  // Tool card clicks
  toolCards.forEach((card) => {
    card.addEventListener("click", () => {
      const toolId = card.getAttribute("data-tool")
      openTool(toolId)
    })
  })

  // Back button
  if (backBtn) {
    backBtn.addEventListener("click", closeTool)
  }

  // File upload
  if (browseBtn) {
    browseBtn.addEventListener("click", () => fileInput.click())
  }

  if (uploadArea) {
    uploadArea.addEventListener("click", () => fileInput.click())
    uploadArea.addEventListener("dragover", handleDragOver)
    uploadArea.addEventListener("drop", handleDrop)
  }

  if (fileInput) {
    fileInput.addEventListener("change", handleFileSelect)
  }

  // Analysis button
  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", startAnalysis)
  }

  // Results actions
  if (newAnalysisBtn) {
    newAnalysisBtn.addEventListener("click", resetTool)
  }

  if (downloadReportBtn) {
    downloadReportBtn.addEventListener("click", downloadReport)
  }
}

// Open specific tool
function openTool(toolId) {
  currentTool = toolsConfig[toolId]
  if (!currentTool) return

  // Handle notebook-based tools
  if (currentTool.type === "notebook") {
    openNotebookTool(currentTool)
    return
  }

  // Update tool interface for regular tools
  document.getElementById("current-tool-icon").textContent = currentTool.icon
  document.getElementById("current-tool-name").textContent = currentTool.title
  document.getElementById("current-tool-desc").textContent = currentTool.description
  document.getElementById("upload-formats").textContent = `Supported formats: ${currentTool.fileTypes.join(", ")}`

  // Update file input accept attribute
  fileInput.setAttribute("accept", currentTool.acceptAttribute)

  // Show tool interface
  toolsDashboard.style.display = "none"
  toolInterface.style.display = "block"

  // Reset state
  resetToolState()
}

// Handle notebook-based tools
function openNotebookTool(tool) {
  // Create notebook interface
  const notebookInterface = document.createElement("div")
  notebookInterface.className = "notebook-interface"
  notebookInterface.innerHTML = `
    <div class="notebook-header">
      <button class="back-btn" id="notebook-back-btn">← Back</button>
      <div class="notebook-info">
        <div class="notebook-icon">${tool.icon}</div>
        <div class="notebook-details">
          <h1>${tool.title}</h1>
          <p>${tool.description}</p>
        </div>
      </div>
    </div>
    <div class="notebook-content">
      <div class="notebook-actions">
        <button class="btn btn-primary" id="run-notebook-btn">Run Notebook</button>
        <button class="btn btn-secondary" id="download-notebook-btn">Download Notebook</button>
      </div>
      <div class="notebook-preview">
        <iframe id="notebook-preview-frame" src="about:blank"></iframe>
      </div>
    </div>
  `

  // Replace dashboard with notebook interface
  toolsDashboard.style.display = "none"
  document.querySelector(".tools-main").appendChild(notebookInterface)

  // Setup event listeners
  document.getElementById("notebook-back-btn").addEventListener("click", () => {
    notebookInterface.remove()
    toolsDashboard.style.display = "block"
  })

  document.getElementById("run-notebook-btn").addEventListener("click", () => {
    runNotebook(tool.notebookPath)
  })

  document.getElementById("download-notebook-btn").addEventListener("click", () => {
    downloadNotebook(tool.notebookPath)
  })
}

// Run notebook
function runNotebook(notebookPath) {
  // Here you would implement the logic to run the notebook
  // This could involve:
  // 1. Starting a Jupyter server
  // 2. Opening the notebook in a new window/tab
  // 3. Or integrating with a notebook viewer
  window.open(`http://localhost:8888/notebooks/${notebookPath}`, "_blank")
}

// Download notebook
function downloadNotebook(notebookPath) {
  const link = document.createElement("a")
  link.href = notebookPath
  link.download = notebookPath.split("/").pop()
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Close tool and return to dashboard
function closeTool() {
  toolsDashboard.style.display = "block"
  toolInterface.style.display = "none"
  currentTool = null
  resetToolState()
}

// Reset tool state
function resetToolState() {
  uploadedFile = null
  analysisResult = null

  // Show upload section, hide others
  uploadSection.style.display = "block"
  processingSection.style.display = "none"
  resultsSection.style.display = "none"

  // Reset file preview
  filePreview.style.display = "none"
  fileInput.value = ""
}

// Handle drag over
function handleDragOver(e) {
  e.preventDefault()
  uploadArea.style.borderColor = "var(--primary-color)"
  uploadArea.style.backgroundColor = "var(--gray-50)"
}

// Handle file drop
function handleDrop(e) {
  e.preventDefault()
  uploadArea.style.borderColor = "var(--gray-300)"
  uploadArea.style.backgroundColor = "transparent"

  const files = e.dataTransfer.files
  if (files.length > 0) {
    handleFile(files[0])
  }
}

// Handle file selection
function handleFileSelect(e) {
  const file = e.target.files[0]
  if (file) {
    handleFile(file)
  }
}

// Handle file processing
function handleFile(file) {
  // Validate file type
  if (!isValidFileType(file)) {
    window.MedAI.showNotification("Invalid file type. Please select a supported format.", "error")
    return
  }

  // Validate file size (max 50MB)
  if (file.size > 50 * 1024 * 1024) {
    window.MedAI.showNotification("File too large. Maximum size is 50MB.", "error")
    return
  }

  uploadedFile = file
  showFilePreview(file)
}

// Validate file type
function isValidFileType(file) {
  if (!currentTool) return false

  const fileExtension = file.name.split(".").pop().toLowerCase()
  const validExtensions = currentTool.fileTypes.map((type) => type.split("/")[1])

  return validExtensions.some((ext) => ext === fileExtension || (ext === "jpeg" && fileExtension === "jpg"))
}

// Show file preview
function showFilePreview(file) {
  document.getElementById("file-name").textContent = file.name
  document.getElementById("file-size").textContent = formatFileSize(file.size)
  filePreview.style.display = "block"
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Start analysis
function startAnalysis() {
  if (!uploadedFile || !currentTool) return

  // Hide upload section, show processing
  uploadSection.style.display = "none"
  processingSection.style.display = "block"

  // Simulate analysis progress
  simulateAnalysis()
}

// Simulate analysis process
function simulateAnalysis() {
  const progressFill = document.getElementById("progress-fill")
  let progress = 0

  const updateProgress = () => {
    progress += Math.random() * 15
    if (progress > 100) progress = 100

    progressFill.style.width = progress + "%"

    if (progress < 100) {
      setTimeout(updateProgress, 200 + Math.random() * 300)
    } else {
      setTimeout(showResults, 500)
    }
  }

  updateProgress()
}

// Show analysis results
function showResults() {
  analysisResult = generateAnalysisResult()

  // Hide processing, show results
  processingSection.style.display = "none"
  resultsSection.style.display = "block"

  // Populate results
  populateResults(analysisResult)
}

// Generate mock analysis results
function generateAnalysisResult() {
  const findings = {
    posture: [
      "Mild forward head posture detected",
      "Slight right shoulder elevation observed",
      "Normal spinal curvature maintained",
      "Recommended postural correction exercises",
    ],
    stroke: [
      "Normal hand-eye coordination observed",
      "Slight tremor detected in left hand",
      "Reaction time within normal range",
      "Motor function appears stable",
    ],
    skin: [
      "No suspicious lesions detected",
      "Mild inflammation in analyzed area",
      "Skin texture appears normal",
      "Recommend dermatologist consultation for follow-up",
    ],
    gait: [
      "Stable gait pattern observed",
      "Slight favoring of right leg detected",
      "Normal stride length maintained",
      "Balance appears adequate",
    ],
    respiratory: [
      "Regular breathing pattern detected",
      "Slight wheeze noted during inspiration",
      "Respiratory rate: 16 breaths per minute",
      "Lung sounds appear clear",
    ],
    cardiac: [
      "Regular heart rhythm detected",
      "Heart rate: 72 beats per minute",
      "No arrhythmias detected",
      "Heart rate variability within normal range",
    ],
  }

  const recommendations = {
    posture: [
      "Consider ergonomic workplace assessment",
      "Recommend physical therapy consultation",
      "Implement daily posture exercises",
      "Monitor for progression over time",
    ],
    stroke: [
      "Continue current rehabilitation therapy",
      "Consider occupational therapy evaluation",
      "Schedule follow-up in 3 months",
      "Monitor for any changes in symptoms",
    ],
    skin: [
      "Apply moisturizer daily to affected area",
      "Avoid prolonged sun exposure",
      "Schedule dermatology appointment",
      "Monitor for any changes in appearance",
    ],
    gait: [
      "Consider physical therapy evaluation",
      "Use assistive device if needed",
      "Monitor for changes in mobility",
      "Implement balance training exercises",
    ],
    respiratory: [
      "Consider pulmonary function testing",
      "Monitor symptoms closely",
      "Avoid known respiratory triggers",
      "Follow up with pulmonologist if symptoms persist",
    ],
    cardiac: [
      "Continue current cardiac medications",
      "Maintain regular exercise routine",
      "Monitor blood pressure regularly",
      "Schedule routine cardiac follow-up",
    ],
  }

  return {
    confidence: Math.floor(Math.random() * 15) + 85, // 85-99%
    findings: findings[currentTool.id] || ["Analysis completed successfully"],
    recommendations: recommendations[currentTool.id] || ["Follow standard medical protocols"],
  }
}

// Populate results in the UI
function populateResults(result) {
  const findingsList = document.getElementById("findings-list")
  const recommendationsList = document.getElementById("recommendations-list")
  const confidenceValue = document.getElementById("confidence-value")

  // Clear existing content
  findingsList.innerHTML = ""
  recommendationsList.innerHTML = ""

  // Populate findings
  result.findings.forEach((finding) => {
    const li = document.createElement("li")
    li.textContent = finding
    findingsList.appendChild(li)
  })

  // Populate recommendations
  result.recommendations.forEach((recommendation) => {
    const li = document.createElement("li")
    li.textContent = recommendation
    recommendationsList.appendChild(li)
  })

  // Set confidence score
  confidenceValue.textContent = result.confidence + "%"
}

// Reset tool for new analysis
function resetTool() {
  resetToolState()
  window.MedAI.showNotification("Ready for new analysis", "success")
}

// Download report (placeholder)
function downloadReport() {
  if (!analysisResult || !currentTool) return

  // Create a simple text report
  const report = `
MedAI Pro - ${currentTool.title} Report
Generated: ${new Date().toLocaleString()}
Confidence Score: ${analysisResult.confidence}%

Key Findings:
${analysisResult.findings.map((finding) => `• ${finding}`).join("\n")}

Recommendations:
${analysisResult.recommendations.map((rec) => `• ${rec}`).join("\n")}

Note: This report is generated by AI and should not replace professional medical consultation.
    `

  // Create and download file
  const blob = new Blob([report], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${currentTool.id}_analysis_report.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  window.MedAI.showNotification("Report downloaded successfully", "success")
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTools)
} else {
  initTools()
}
