import cv2
import mediapipe as mp
import numpy as np
from datetime import datetime

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

cap = cv2.VideoCapture(0)

def calculate_angle(a, b, c):
    a = np.array(a)  # First
    b = np.array(b)  # Mid
    c = np.array(c)  # End

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)

    if angle > 180.0:
        angle = 360 - angle

    return angle

count = 0
stage = None
reps = int(input("How many Squats are you going for? "))
over = False
rep_times = []
rep_start = datetime.now()

green = (0, 255, 0)
red = (0, 0, 255)

with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    while cap.isOpened():
        ret, frame = cap.read()

        frame = cv2.flip(frame, 1)
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False
        results = pose.process(image)
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        squat_angle = None
        side_alignment = False

        try:
            landmarks = results.pose_landmarks.landmark

            l_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,
                     landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
            r_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,
                     landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
            l_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,
                      landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
            l_ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,
                       landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

            offset = abs(l_hip[0] - r_hip[0])
            side_alignment = offset < 0.12

            squat_angle = calculate_angle(l_hip, l_knee, l_ankle)

            if side_alignment:
                knee_coord = tuple(np.multiply(l_knee, [640, 480]).astype(int))
                cv2.putText(image, str(int(squat_angle)),
                            knee_coord,
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

                if squat_angle < 100 and not over:
                    stage = "Down"
                if squat_angle > 110 and stage == "Down" and not over:
                    stage = "Up"
                    count += 1
                    rep_times.append((datetime.now() - rep_start).total_seconds())
                    rep_start = datetime.now()

                if count >= reps:
                    over = True
                    cv2.putText(image, "Squats Completed!", (160, 240),
                                cv2.FONT_HERSHEY_SIMPLEX, 1.2, green, 3)
            else:
                stage = None

        except:
            pass

        # Feedback
        if side_alignment:
            cv2.putText(image, "Side view detected — good!", (10, 450),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, green, 2)
        else:
            cv2.putText(image, "Please face sideways to the camera", (10, 450),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, red, 2)

        # Count display
        cv2.putText(image, "Count:", (10, 470),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        cv2.putText(image, str(count), (120, 470),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)

        # Form feedback
        if not over and stage == "Down" and squat_angle > 130:
            cv2.putText(image, "Go Lower!", (230, 460),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, red, 2)
        elif not over and stage == "Up":
            cv2.putText(image, "Good Form!", (230, 460),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, green, 2)

        # Progress Bar
        progress = int((count / reps) * 640)
        cv2.rectangle(image, (0, 0), (640, 30), (50, 50, 50), -1)
        cv2.rectangle(image, (0, 0), (progress, 30), green, -1)
        cv2.putText(image, f'{count}/{reps} Reps', (260, 22),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

        # Landmark Drawing
        status_color = green if squat_angle and squat_angle < 90 else red
        if results.pose_landmarks:
            mp_drawing.draw_landmarks(
                image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                mp_drawing.DrawingSpec(color=(245, 117, 66), thickness=2, circle_radius=2),
                mp_drawing.DrawingSpec(color=status_color, thickness=2, circle_radius=2)
            )

        cv2.imshow('Squat Tracker', image)

        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
