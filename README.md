# MedAI Pro - AI-Powered Healthcare Platform

MedAI Pro is a comprehensive healthcare platform that leverages artificial intelligence to provide advanced medical analysis tools, educational resources, and AI-powered assistance for healthcare professionals.

## Features

### 1. AI Medical Assistant
- Interactive chat interface for medical queries
- Real-time responses based on medical literature
- HIPAA-compliant communication

### 2. Health Analysis Tools
- Posture Analysis
  - Real-time posture monitoring
  - Neck and torso angle measurements
  - Posture correction alerts
- Exercise Analysis
  - Squat form analysis
  - Push-up form analysis
  - Movement rehabilitation tracking

### 3. Medical Education
- Latest medical research articles
- Educational resources
- Interactive learning materials

### 4. Data Visualization
- Interactive charts and reports
- Patient data analysis
- Progress tracking

## Project Structure

```
medic/
├── index.html          # Main landing page
├── chat.html          # AI chat interface
├── tools.html         # Analysis tools page
├── education.html     # Educational resources
├── styles/
│   ├── global.css     # Global styles
│   └── landing.css    # Landing page styles
├── scripts/
│   ├── global.js      # Global JavaScript functions
│   └── landing.js     # Landing page scripts
├── Jupyter Notebooks/
│   ├── Postureanalysis.ipynb    # Posture analysis implementation
│   ├── Squats.ipynb            # Squat form analysis
│   ├── Movehabilitation.ipynb  # Movement rehabilitation
│   └── PushUp Analysis.ipynb   # Push-up form analysis
```

## Technical Stack

- Frontend:
  - HTML5
  - CSS3
  - JavaScript
  - Google Fonts (Inter)
- Analysis Tools:
  - MediaPipe for pose detection
  - OpenCV for image processing
  - Python for data analysis
- AI Components:
  - Machine Learning models for analysis
  - Natural Language Processing for chat interface

## Setup Instructions

1. Clone the repository:
```bash
git clone [repository-url]
cd medic
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. For running the Jupyter notebooks:
```bash
jupyter notebook
```

4. For web interface:
- Open `index.html` in a modern web browser
- No additional setup required for the frontend

## Usage

### Posture Analysis
1. Navigate to the Analysis Tools page
2. Select "Posture Analysis"
3. Allow camera access
4. Follow on-screen instructions for posture monitoring

### Exercise Analysis
1. Choose the exercise type (Squats/Push-ups)
2. Position yourself in frame
3. Follow the exercise form guidance
4. Receive real-time feedback

### AI Chat
1. Navigate to the chat interface
2. Type your medical query
3. Receive AI-powered responses

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
- Contributors and maintainers of the project 