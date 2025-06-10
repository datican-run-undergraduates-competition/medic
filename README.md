# MedAI Pro - AI-Powered Healthcare Platform

MedAI Pro is a comprehensive healthcare platform that leverages artificial intelligence to provide advanced medical analysis tools, educational resources, and AI-powered assistance for healthcare professionals.

## Features

### 1. AI Medical Assistant
- Interactive chat interface for medical queries
- Real-time responses based on medical literature
- HIPAA-compliant communication
- Context-aware medical information

### 2. Health Analysis Tools
- Real-time Analysis Tools:
  - Posture Analysis
    - Real-time posture monitoring
    - Neck and torso angle measurements
    - Posture correction alerts
    - Confidence scoring
  - Exercise Analysis
    - Squat form analysis with angle detection
    - Push-up form analysis with technique feedback
    - Movement rehabilitation tracking
    - Real-time form correction
  - Hand-Eye Coordination
    - Interactive coordination testing
    - Performance metrics
    - Progress tracking

### 3. Medical Education
- Latest medical research articles
- Educational resources
- Interactive learning materials
- Progress tracking

### 4. Data Visualization
- Interactive charts and reports
- Patient data analysis
- Progress tracking
- Exportable analysis reports

## Project Structure

```
medic/
├── app.py              # Flask backend server
├── index.html          # Main landing page
├── chat.html          # AI chat interface
├── tools.html         # Analysis tools page
├── education.html     # Educational resources
├── styles/
│   ├── global.css     # Global styles
│   └── tools.css      # Tools page styles
├── scripts/
│   ├── global.js      # Global JavaScript functions
│   └── tools.js       # Tools page scripts
├── modelspy/          # Python analysis models
│   ├── Handeyecordination.py
│   ├── Posture_analysis.py
│   ├── Squats_analysis.py
│   └── Pushup_analysis.py
└── uploads/           # Temporary file storage
```

## Technical Stack

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- Socket.IO for real-time communication
- Google Fonts (Inter)

### Backend
- Python 3.10+
- Flask web framework
- Flask-SocketIO for WebSocket support
- MediaPipe for pose detection
- OpenCV for image processing
- NumPy for numerical computations

### AI Components
- Machine Learning models for analysis
- Natural Language Processing for chat interface
- Real-time pose estimation
- Computer vision algorithms

## Setup Instructions

1. Clone the repository:
```bash
git clone [repository-url]
cd medic
```

2. Create and activate a virtual environment (recommended):
```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On Unix or MacOS
source venv/bin/activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Install specific versions for compatibility:
```bash
pip install protobuf==3.20.0
pip install mediapipe==0.10.8
pip install flask-socketio eventlet
```

5. Start the server:
```bash
python app.py
```

6. Access the web interface:
- Open `http://localhost:5000` in a modern web browser

## Usage

### Real-time Analysis Tools
1. Navigate to the Analysis Tools page
2. Select desired analysis tool
3. Allow camera access
4. Follow on-screen instructions
5. Receive real-time feedback and analysis

### File Upload Analysis
1. Select the analysis tool
2. Upload video file (MP4/WebM)
3. Wait for processing
4. View detailed analysis results
5. Download report if needed

### AI Chat
1. Navigate to the chat interface
2. Type your medical query
3. Receive AI-powered responses
4. Save conversation history

## Development

### Running Tests
```bash
python -m pytest tests/
```

### Code Style
- Follow PEP 8 for Python code
- Use ESLint for JavaScript
- Maintain consistent HTML/CSS structure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For support or inquiries, please contact [contact information]

## Acknowledgments

- MediaPipe for pose detection capabilities
- OpenCV for computer vision tools
- Flask and Flask-SocketIO for backend framework
- Contributors and maintainers of the project 