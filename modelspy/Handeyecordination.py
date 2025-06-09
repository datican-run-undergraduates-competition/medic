import cv2
import time
import random
import mediapipe as mp
import numpy as np

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils

difficulty = input("Choose a level- Easy(E), medium(M), Hard(H): ").lower()
if difficulty == "e":
    radius = 100
    change_interval = 5
elif difficulty == "m":
    radius = 60
    change_interval = 3
elif difficulty == "h":
    radius = 35
    change_interval = 1.5
else:
    radius = 60
    change_interval = 3

point_color = (0, 255, 0)
score = 0
last_position = None
positions = [(160, 300), (320, 300), (480, 300), (160, 100), (320, 100), (480, 100)]
total_attempt = 0
game_over = False
max_score = 20

reaction_times = []
current_stability_distances = []
stability_scores = []
current_streak = 0
max_streak = 0

def new_round():
    global last_position
    available_positions = [p for p in positions if p != last_position]
    new_position = random.choice(available_positions)
    last_position = new_position
    return new_position

def draw_rounded_rect(img, top_left, bottom_right, color, thickness, radius=10):
    # Draw rectangle with rounded corners
    x1, y1 = top_left
    x2, y2 = bottom_right
    if thickness < 0:  # filled rectangle
        cv2.rectangle(img, (x1+radius, y1), (x2-radius, y2), color, thickness)
        cv2.rectangle(img, (x1, y1+radius), (x2, y2-radius), color, thickness)
        cv2.circle(img, (x1+radius, y1+radius), radius, color, thickness)
        cv2.circle(img, (x2-radius, y1+radius), radius, color, thickness)
        cv2.circle(img, (x1+radius, y2-radius), radius, color, thickness)
        cv2.circle(img, (x2-radius, y2-radius), radius, color, thickness)
    else:
        cv2.line(img, (x1+radius, y1), (x2-radius, y1), color, thickness)
        cv2.line(img, (x1+radius, y2), (x2-radius, y2), color, thickness)
        cv2.line(img, (x1, y1+radius), (x1, y2-radius), color, thickness)
        cv2.line(img, (x2, y1+radius), (x2, y2-radius), color, thickness)
        cv2.ellipse(img, (x1+radius, y1+radius), (radius, radius), 180, 0, 90, color, thickness)
        cv2.ellipse(img, (x2-radius, y1+radius), (radius, radius), 270, 0, 90, color, thickness)
        cv2.ellipse(img, (x1+radius, y2-radius), (radius, radius), 90, 0, 90, color, thickness)
        cv2.ellipse(img, (x2-radius, y2-radius), (radius, radius), 0, 0, 90, color, thickness)

cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Camera not accessible")
    exit()

r_position = new_round()
round_start_time = time.time()
finger_over_target = False

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    frame = cv2.flip(frame, 1)
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(image)

    # Dark semi-transparent overlay for UI elements
    overlay = frame.copy()
    cv2.rectangle(overlay, (10, 5), (630, 60), (0, 0, 0), -1)
    alpha = 0.5
    cv2.addWeighted(overlay, alpha, frame, 1 - alpha, 0, frame)

    if time.time() - round_start_time > change_interval and not game_over:
        r_position = new_round()
        round_start_time = time.time()
        total_attempt += 1
        current_stability_distances = []
        finger_over_target = False
        current_streak = 0

    # Draw glowing effect around the circle
    for glow_radius in range(radius + 5, radius + 20, 3):
        alpha_glow = int(50 - (glow_radius - radius) * 5)
        if alpha_glow < 0: alpha_glow = 0
        color_glow = (0, alpha_glow, 0)
        cv2.circle(frame, r_position, glow_radius, color_glow, 2)

    # Draw the target circle (solid)
    cv2.circle(frame, r_position, radius, point_color, -1)

    try:
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                index_tip = hand_landmarks.landmark[8]
                h, w, _ = frame.shape
                idx = int(index_tip.x * w)
                idy = int(index_tip.y * h)

                # Fingertip circle
                cv2.circle(frame, (idx, idy), 10, (0, 255, 0), -1)

                cx, cy = r_position
                distance = np.sqrt((idx - cx) ** 2 + (idy - cy) ** 2)

                if distance < radius and not game_over:
                    if not finger_over_target:
                        reaction_time = time.time() - round_start_time
                        reaction_times.append(reaction_time)

                        if current_stability_distances:
                            avg_distance = np.mean(current_stability_distances)
                            stability_score = max(0, 1 - (avg_distance / radius))
                            stability_scores.append(stability_score)

                        score += 1
                        r_position = new_round()
                        round_start_time = time.time()
                        total_attempt += 1
                        finger_over_target = True
                        current_stability_distances = []
                        current_streak += 1
                        if current_streak > max_streak:
                            max_streak = current_streak

                    else:
                        current_stability_distances.append(distance)

                else:
                    finger_over_target = False
                    current_stability_distances = []

                if score >= max_score:
                    game_over = True
                    if current_stability_distances:
                        avg_distance = np.mean(current_stability_distances)
                        stability_score = max(0, 1 - (avg_distance / radius))
                        stability_scores.append(stability_score)

                    accuracy = (score / total_attempt) * 100 if total_attempt > 0 else 0
                    avg_reaction = np.mean(reaction_times) if reaction_times else 0
                    avg_stability = np.mean(stability_scores) if stability_scores else 0

            if game_over:
                # Background box
                draw_rounded_rect(frame, (80, 180), (560, 420), (0, 0, 0), -1, radius=20)
                cv2.putText(frame, "Game Over!", (200, 230),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.8, (0, 165, 255), 3)
                cv2.putText(frame, f"Accuracy: {accuracy:.2f}%", (180, 280),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (255, 255, 255), 2)
                cv2.putText(frame, f"Avg Reaction Time: {avg_reaction:.2f}s", (140, 330),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (255, 255, 255), 2)
                cv2.putText(frame, f"Avg Stability: {avg_stability:.2f}", (200, 380),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (255, 255, 255), 2)
                cv2.putText(frame, f"Max Streak: {max_streak}", (210, 430),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (255, 255, 255), 2)

            else:
                # Show score with background box
                draw_rounded_rect(frame, (10, 5), (210, 60), (0, 0, 0), -1, radius=15)
                cv2.putText(frame, f"Score: {score}/{max_score}", (20, 50),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
                # Subtitle / instruction
                cv2.putText(frame, "Touch the green circle as fast as you can!", (230, 40),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1, cv2.LINE_AA)

                # Draw progress bar with rounded edges
                bar_x, bar_y = 20, 70
                bar_width, bar_height = 600, 25
                progress = int((score / max_score) * bar_width)
                draw_rounded_rect(frame, (bar_x, bar_y), (bar_x + bar_width, bar_y + bar_height), (50, 50, 50), -1, radius=12)
                draw_rounded_rect(frame, (bar_x, bar_y), (bar_x + progress, bar_y + bar_height), (0, 200, 0), -1, radius=12)
                draw_rounded_rect(frame, (bar_x, bar_y), (bar_x + bar_width, bar_y + bar_height), (255, 255, 255), 2, radius=12)

    except Exception as e:
        print("Error:", e)
        pass

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

    cv2.imshow('Colorgame', frame)

    if cv2.waitKey(10) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
