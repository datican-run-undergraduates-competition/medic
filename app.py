from flask import Flask, render_template, request, jsonify, Response
from flask_socketio import SocketIO, emit
import cv2
import numpy as np
import mediapipe as mp
import json
import os
from werkzeug.utils import secure_filename
import threading
import queue
import time
import base64
from datetime import datetime

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Global variables for video processing
current_tool = None
processing_queue = queue.Queue()
result_queue = queue.Queue()
active_sessions = {}

# Initialize MediaPipe
mp_pose = mp.solutions.pose
mp_hands = mp.solutions.hands
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)
hands = mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'mp4', 'webm', 'jpg', 'jpeg', 'png'}

def cleanup_old_files():
    """Remove files older than 1 hour"""
    current_time = time.time()
    for filename in os.listdir(app.config['UPLOAD_FOLDER']):
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.getmtime(filepath) < current_time - 3600:
            try:
                os.remove(filepath)
            except Exception as e:
                print(f"Error removing file {filepath}: {e}")

@app.route('/')
def index():
    return render_template('tools.html')

@app.route('/api/tools', methods=['GET'])
def get_tools():
    tools = {
        'posture': {
            'id': 'posture',
            'title': 'Posture Analysis',
            'description': 'AI-powered spine and posture assessment with real-time feedback',
            'icon': '🧘‍♂️',
            'fileTypes': ['video/mp4', 'video/webm'],
            'requiresCamera': True
        },
        'squats': {
            'id': 'squats',
            'title': 'Squat Analysis',
            'description': 'Form and technique analysis for squats with correction guidance',
            'icon': '🏋️‍♂️',
            'fileTypes': ['video/mp4', 'video/webm'],
            'requiresCamera': True
        },
        'pushups': {
            'id': 'pushups',
            'title': 'Push-up Analysis',
            'description': 'Push-up form assessment and technique improvement',
            'icon': '💪',
            'fileTypes': ['video/mp4', 'video/webm'],
            'requiresCamera': True
        },
        'handeye': {
            'id': 'handeye',
            'title': 'Hand-Eye Coordination',
            'description': 'Test and improve hand-eye coordination through interactive game',
            'icon': '🎯',
            'fileTypes': ['video/mp4', 'video/webm'],
            'requiresCamera': True
        }
    }
    return jsonify(tools)

@socketio.on('connect')
def handle_connect():
    session_id = request.sid
    active_sessions[session_id] = {
        'start_time': datetime.now(),
        'tool_id': None,
        'status': 'connected'
    }
    emit('connection_status', {'status': 'connected', 'session_id': session_id})

@socketio.on('disconnect')
def handle_disconnect():
    session_id = request.sid
    if session_id in active_sessions:
        del active_sessions[session_id]

@socketio.on('start_analysis')
def handle_start_analysis(data):
    session_id = request.sid
    tool_id = data.get('tool_id')
    
    if not tool_id:
        emit('error', {'message': 'No tool specified'})
        return
    
    active_sessions[session_id]['tool_id'] = tool_id
    active_sessions[session_id]['status'] = 'processing'
    
    emit('analysis_status', {
        'status': 'started',
        'tool_id': tool_id,
        'message': 'Analysis started'
    })

@socketio.on('frame')
def handle_frame(data):
    try:
        session_id = request.sid
        if session_id not in active_sessions:
            emit('error', {'message': 'Invalid session'})
            return

        tool_id = active_sessions[session_id]['tool_id']
        if not tool_id:
            emit('error', {'message': 'No tool selected'})
            return

        # Decode base64 frame
        frame_data = data['frame'].split(',')[1]
        frame_bytes = base64.b64decode(frame_data)
        nparr = np.frombuffer(frame_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Process frame based on tool_id
        result = process_frame(frame, tool_id)
        
        # Add confidence score
        result['confidence'] = calculate_confidence(result)
        
        emit('analysis_result', result)
        
    except Exception as e:
        emit('error', {'message': f'Processing error: {str(e)}'})

def process_frame(frame, tool_id):
    if tool_id == 'posture':
        return process_posture(frame)
    elif tool_id == 'squats':
        return process_squats(frame)
    elif tool_id == 'pushups':
        return process_pushups(frame)
    elif tool_id == 'handeye':
        return process_handeye(frame)
    else:
        return {'error': 'Invalid tool ID'}

def calculate_confidence(result):
    """Calculate confidence score based on detection quality"""
    if 'error' in result:
        return 0
    
    confidence = 100
    if 'posture_status' in result:
        confidence -= 20 if result['posture_status'] == 'bad' else 0
    if 'form_status' in result:
        confidence -= 20 if result['form_status'] == 'bad' else 0
    
    return max(confidence, 0)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        tool_id = request.form.get('tool_id')
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type'}), 400
        
        if not tool_id:
            return jsonify({'error': 'No tool specified'}), 400
        
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Start processing in a separate thread
        processing_thread = threading.Thread(
            target=process_video,
            args=(filepath, tool_id)
        )
        processing_thread.start()
        
        return jsonify({
            'message': 'Analysis started',
            'status': 'processing',
            'file_id': filename
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def process_video(filepath, tool_id):
    try:
        cap = cv2.VideoCapture(filepath)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        processed_frames = 0
        results = []
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            result = process_frame(frame, tool_id)
            results.append(result)
            
            processed_frames += 1
            progress = (processed_frames / total_frames) * 100
            
            result_queue.put({
                'tool_id': tool_id,
                'progress': progress,
                'status': 'processing',
                'current_result': result
            })
        
        cap.release()
        
        # Final results
        result_queue.put({
            'tool_id': tool_id,
            'results': results,
            'status': 'completed',
            'progress': 100
        })
        
    except Exception as e:
        result_queue.put({
            'tool_id': tool_id,
            'error': str(e),
            'status': 'error'
        })
    finally:
        # Cleanup
        try:
            os.remove(filepath)
        except:
            pass

def process_posture(frame):
    # Convert to RGB
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(image)
    
    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark
        
        # Get key points
        left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
        right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
        left_ear = landmarks[mp_pose.PoseLandmark.LEFT_EAR.value]
        
        # Calculate angles
        neck_incline = calculate_angle(
            (left_shoulder.x, left_shoulder.y),
            (left_ear.x, left_ear.y),
            (left_shoulder.x, left_shoulder.y - 1)
        )
        
        shoulder_offset = abs(left_shoulder.x - right_shoulder.x)
        
        return {
            'neck_incline': neck_incline,
            'shoulder_offset': shoulder_offset,
            'posture_status': 'good' if neck_incline < 40 and shoulder_offset < 0.1 else 'bad'
        }
    
    return {'error': 'No pose detected'}

def process_squats(frame):
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(image)
    
    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark
        
        # Get key points
        left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
        left_knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value]
        left_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value]
        
        # Calculate angle
        squat_angle = calculate_angle(
            (left_hip.x, left_hip.y),
            (left_knee.x, left_knee.y),
            (left_ankle.x, left_ankle.y)
        )
        
        return {
            'squat_angle': squat_angle,
            'form_status': 'good' if 90 <= squat_angle <= 120 else 'bad'
        }
    
    return {'error': 'No pose detected'}

def process_pushups(frame):
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(image)
    
    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark
        
        # Get key points
        left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
        left_elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value]
        left_wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value]
        
        # Calculate angle
        pushup_angle = calculate_angle(
            (left_shoulder.x, left_shoulder.y),
            (left_elbow.x, left_elbow.y),
            (left_wrist.x, left_wrist.y)
        )
        
        return {
            'pushup_angle': pushup_angle,
            'form_status': 'good' if 90 <= pushup_angle <= 120 else 'bad'
        }
    
    return {'error': 'No pose detected'}

def process_handeye(frame):
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(image)
    
    if results.multi_hand_landmarks:
        hand_landmarks = results.multi_hand_landmarks[0]
        index_tip = hand_landmarks.landmark[8]
        
        return {
            'hand_position': (index_tip.x, index_tip.y),
            'hand_detected': True
        }
    
    return {'error': 'No hand detected'}

def calculate_angle(a, b, c):
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)
    
    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians*180.0/np.pi)
    
    if angle > 180.0:
        angle = 360-angle
        
    return angle

@app.route('/api/results/<tool_id>', methods=['GET'])
def get_results(tool_id):
    try:
        result = result_queue.get_nowait()
        if result['tool_id'] == tool_id:
            return jsonify(result)
        return jsonify({'status': 'processing'})
    except queue.Empty:
        return jsonify({'status': 'processing'})

# Start cleanup thread
def start_cleanup_thread():
    while True:
        cleanup_old_files()
        time.sleep(3600)  # Run every hour

cleanup_thread = threading.Thread(target=start_cleanup_thread, daemon=True)
cleanup_thread.start()

if __name__ == '__main__':
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True) 