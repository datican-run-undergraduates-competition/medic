// Movement Analysis Tools functionality

let currentTool = null;
let mediaStream = null;
let analysisResult = null;

// Tool configurations
const toolsConfig = {
  posture: {
    id: "posture",
    title: "Posture Analysis",
    description: "AI-powered spine and posture assessment with real-time feedback",
    icon: "🧘‍♂️",
    analysisType: "real-time",
    requiresCamera: true,
    keyPoints: ["shoulders", "spine", "hips", "head"],
    metrics: ["alignment", "symmetry", "curvature"]
  },
  squats: {
    id: "squats",
    title: "Squat Analysis",
    description: "Form and technique analysis for squats with correction guidance",
    icon: "🏋️‍♂️",
    analysisType: "real-time",
    requiresCamera: true,
    keyPoints: ["knees", "hips", "ankles", "back"],
    metrics: ["depth", "knee_angle", "back_angle", "stance_width"]
  },
  pushups: {
    id: "pushups",
    title: "Push-up Analysis",
    description: "Push-up form assessment and technique improvement",
    icon: "💪",
    analysisType: "real-time",
    requiresCamera: true,
    keyPoints: ["shoulders", "elbows", "back", "core"],
    metrics: ["elbow_angle", "back_straightness", "core_engagement"]
  },
  rehabilitation: {
    id: "rehabilitation",
    title: "Movement Rehabilitation",
    description: "Movement pattern analysis and rehabilitation guidance",
    icon: "🏥",
    analysisType: "real-time",
    requiresCamera: true,
    keyPoints: ["joints", "muscles", "range_of_motion"],
    metrics: ["mobility", "stability", "compensation"]
  }
};

// Initialize tools functionality
function initMovementAnalysis() {
  setupEventListeners();
  setupCameraAccess();
  console.log("Movement Analysis Tools initialized");
}

// Setup event listeners
function setupEventListeners() {
  // Tool card clicks
  document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', () => {
      const toolId = card.getAttribute('data-tool');
      openTool(toolId);
    });
  });

  // Back button
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', closeTool);
  }

  // Start analysis button
  const startBtn = document.getElementById('start-analysis-btn');
  if (startBtn) {
    startBtn.addEventListener('click', startAnalysis);
  }

  // Stop analysis button
  const stopBtn = document.getElementById('stop-analysis-btn');
  if (stopBtn) {
    stopBtn.addEventListener('click', stopAnalysis);
  }
}

// Setup camera access
async function setupCameraAccess() {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "user"
      } 
    });
    const videoElement = document.getElementById('camera-feed');
    if (videoElement) {
      videoElement.srcObject = mediaStream;
    }
  } catch (error) {
    console.error('Error accessing camera:', error);
    window.MedAI.showNotification('Camera access denied. Please enable camera access to use this tool.', 'error');
  }
}

// Open specific tool
function openTool(toolId) {
  currentTool = toolsConfig[toolId];
  if (!currentTool) return;

  // Update tool interface
  document.getElementById('current-tool-icon').textContent = currentTool.icon;
  document.getElementById('current-tool-name').textContent = currentTool.title;
  document.getElementById('current-tool-desc').textContent = currentTool.description;

  // Show tool interface
  document.getElementById('tools-dashboard').style.display = 'none';
  document.getElementById('tool-interface').style.display = 'block';

  // Initialize analysis
  initializeAnalysis();
}

// Initialize analysis
function initializeAnalysis() {
  const analysisContainer = document.getElementById('analysis-container');
  if (!analysisContainer) return;

  // Create canvas for pose overlay
  const canvas = document.createElement('canvas');
  canvas.id = 'pose-canvas';
  analysisContainer.appendChild(canvas);

  // Create metrics display
  const metricsContainer = document.createElement('div');
  metricsContainer.id = 'metrics-container';
  metricsContainer.className = 'metrics-container';
  analysisContainer.appendChild(metricsContainer);

  // Initialize pose detection
  initializePoseDetection();
}

// Initialize pose detection
async function initializePoseDetection() {
  // Here we'll integrate with your ONNX models
  // This is a placeholder for the actual implementation
  console.log('Initializing pose detection for:', currentTool.id);
}

// Start analysis
function startAnalysis() {
  if (!currentTool) return;

  // Start real-time analysis
  startRealTimeAnalysis();
}

// Start real-time analysis
function startRealTimeAnalysis() {
  // Here we'll implement the real-time analysis using your ONNX models
  // This is a placeholder for the actual implementation
  console.log('Starting real-time analysis for:', currentTool.id);
}

// Stop analysis
function stopAnalysis() {
  // Stop real-time analysis
  stopRealTimeAnalysis();
}

// Stop real-time analysis
function stopRealTimeAnalysis() {
  // Here we'll implement stopping the analysis
  // This is a placeholder for the actual implementation
  console.log('Stopping real-time analysis');
}

// Close tool and return to dashboard
function closeTool() {
  // Stop any ongoing analysis
  stopAnalysis();

  // Stop camera stream
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
  }

  // Reset state
  currentTool = null;
  analysisResult = null;

  // Show dashboard, hide tool interface
  document.getElementById('tools-dashboard').style.display = 'block';
  document.getElementById('tool-interface').style.display = 'none';
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMovementAnalysis);
} else {
  initMovementAnalysis();
} 