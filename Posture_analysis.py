import mediapipe as mp
import cv2
import math as m

cam= cv2.VideoCapture(0)
good_frames=0
bad_frames= 0
font = cv2.FONT_HERSHEY_SIMPLEX
font2 = cv2.FONT_HERSHEY_DUPLEX
fps = cam.get(cv2.CAP_PROP_FPS)
# Colors.
blue = (255, 127, 0)
red = (50, 50, 255)
green = (127, 255, 0)
dark_blue = (127, 20, 0)
light_green = (127, 233, 100)
yellow = (0, 255, 255)
pink = (255, 0, 255)
mp_pose= mp.solutions.pose
mp_holistic= mp.solutions.holistic
pose = mp_pose.Pose()
def calcangle(x1, y1, x2, y2):
    theta = m.acos((y2 -y1)*(-y1) / (m.sqrt((x2 - x1)**2 + (y2 - y1)**2) * y1))
    degree = int(180/m.pi)*theta
    return degree
#find distance between points
def calcdistance(x1, y1, x2, y2):
    dist = m.sqrt((x2-x1)**2+(y2-y1)**2)
    return dist
while cam.isOpened():
    ret, frame= cam.read()

    h,w = frame.shape[:2]
    #convert color
    image=  cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results= pose.process(image)
    image = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)

    
    if results.pose_landmarks:
        lm = results.pose_landmarks
        lmPose = mp_pose.PoseLandmark
        #Get the points values * frame height and width to get cordinates
    #left shoulder
        l_shldr_x = int(lm.landmark[lmPose.LEFT_SHOULDER].x * w)
        l_shldr_y = int(lm.landmark[lmPose.LEFT_SHOULDER].y * h)
    # Right shoulder
        r_shldr_x = int(lm.landmark[lmPose.RIGHT_SHOULDER].x * w)
        r_shldr_y = int(lm.landmark[lmPose.RIGHT_SHOULDER].y * h)
    # Left ear.
        l_ear_x = int(lm.landmark[lmPose.LEFT_EAR].x * w)
        l_ear_y = int(lm.landmark[lmPose.LEFT_EAR].y * h)
    # Left hip.
        l_hip_x = int(lm.landmark[lmPose.LEFT_HIP].x * w)
        l_hip_y = int(lm.landmark[lmPose.LEFT_HIP].y * h)

    #offset between the left and right shoulder
        offset= calcdistance(l_shldr_x, l_shldr_y, r_shldr_x, r_shldr_y)
        if offset<100:
            cv2.putText(frame, str(int(offset)) + ' Shoulder aligned', ((10, 60)), font, 0.9, green, 2)
        else:
            cv2.putText(frame, str(int(offset)) + ' Shoulder not aligned', ((10, 60)), font, 0.9, red, 2)
    
    #calculate angle between ear and shoulder(Inclination)
        neck_incline= calcangle( l_shldr_x, l_shldr_y, l_ear_x, l_ear_y)
        torso_incline= calcangle( l_shldr_x, l_shldr_y, l_ear_x, l_ear_y)
        angle_text_string = 'Neck : ' + str(int(neck_incline)) + '  Torso : ' + str(int(torso_incline))
    # Draw landmarks.
        cv2.circle(frame, (l_shldr_x, l_shldr_y), 7, yellow, -1)
        cv2.circle(frame, (l_ear_x, l_ear_y), 7, yellow, -1)

        cv2.circle(frame, (l_shldr_x, l_shldr_y - 100), 7, yellow, -1)
        cv2.circle(frame, (r_shldr_x, r_shldr_y), 7, pink, -1)
        cv2.circle(frame, (l_hip_x, l_hip_y), 7, yellow, -1)
        cv2.circle(frame, (l_hip_x, l_hip_y - 100), 7, yellow, -1)

        if neck_incline < 40 and torso_incline < 10:
            bad_frames = 0
            good_frames += 1

            cv2.putText(frame, angle_text_string, (10, 30), font, 0.9, light_green, 2)
            cv2.putText(frame, str(int(neck_incline)), (l_shldr_x + 10, l_shldr_y), font, 0.9, light_green, 2)
            cv2.putText(frame, str(int(torso_incline)), (l_hip_x + 10, l_hip_y), font, 0.9, light_green, 2)

        # Join landmarks.
            cv2.line(frame, (l_shldr_x, l_shldr_y), (l_ear_x, l_ear_y), green, 4)
            cv2.line(frame, (l_shldr_x, l_shldr_y), (l_shldr_x, l_shldr_y - 100), green, 4)
            cv2.line(frame, (l_hip_x, l_hip_y), (l_shldr_x, l_shldr_y), green, 4)
            cv2.line(frame, (l_hip_x, l_hip_y), (l_hip_x, l_hip_y - 100), green, 4)

        else:
            good_frames = 0
            bad_frames += 1

            cv2.putText(frame, angle_text_string, (10, 30), font, 0.9, red, 2)
            cv2.putText(frame, str(int(neck_incline)), (l_shldr_x + 10, l_shldr_y), font, 0.9, red, 2)
            cv2.putText(frame, str(int(torso_incline)), (l_hip_x + 10, l_hip_y), font, 0.9, red, 2)

        # Join landmarks.
            cv2.line(frame, (l_shldr_x, l_shldr_y), (l_ear_x, l_ear_y), red, 4)
            cv2.line(frame, (l_shldr_x, l_shldr_y), (l_shldr_x, l_shldr_y - 100), red, 4)
            cv2.line(frame, (l_hip_x, l_hip_y), (l_shldr_x, l_shldr_y), red, 4)
            cv2.line(frame, (l_hip_x, l_hip_y), (l_hip_x, l_hip_y - 100), red, 4)
        # Calculate the time of remaining in a particular posture.
            good_time = (1 / fps) * good_frames
            bad_time =  (1 / fps) * bad_frames

    # Pose time.
            if good_time > 0:
                time_string_good = 'Good Posture Time : ' + str(round(good_time, 1)) + 's'
                cv2.putText(frame, time_string_good, (10, h - 20), font, 0.9, green, 2)
            else:
                time_string_bad = 'Bad Posture Time : ' + str(round(bad_time, 1)) + 's'
                cv2.putText(frame, time_string_bad, (10, h - 20), font, 0.9, red, 2)

    # If you stay in bad posture for more than 3 minutes (180s) send an alert.
            if bad_time > 5 and torso_incline>10:
                cv2.putText(frame, "Straigthen your back", (10, h - 50), font2, 0.9, (255,255,255), 2)
            if bad_time > 5 and neck_incline>40:
                cv2.putText(frame, "Raise your head", (10, h - 80), font2, 0.9, (255,255,255), 2)
   
    # Display frame
    cv2.imshow('Posture analysis', frame)

    # Press 'q' to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cam.release()
cv2.destroyAllWindows()