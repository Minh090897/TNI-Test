import os
import numpy as np
import cv2
import insightface

detector = insightface.model_zoo.get_model(os.path.join(os.path.dirname(__file__), 'scrfd_person_2.5g.onnx'))
detector.prepare(0, nms_thresh=0.5, input_size=(640, 640))

def detect_person(img):
    bboxes, kpss = detector.detect(img)
    bboxes = np.round(bboxes[:,:4]).astype(int)
    kpss = np.round(kpss).astype(int)
    kpss[:,:,0] = np.clip(kpss[:,:,0], 0, img.shape[1])
    kpss[:,:,1] = np.clip(kpss[:,:,1], 0, img.shape[0])
    vbboxes = bboxes.copy()
    vbboxes[:,0] = kpss[:, 0, 0]
    vbboxes[:,1] = kpss[:, 0, 1]
    vbboxes[:,2] = kpss[:, 4, 0]
    vbboxes[:,3] = kpss[:, 4, 1]
    return bboxes, vbboxes

def visualize_and_save(img, bboxes, vbboxes, output_path, filename):
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    for i in range(bboxes.shape[0]):
        bbox = bboxes[i]
        vbbox = vbboxes[i]
        x1,y1,x2,y2 = bbox
        vx1,vy1,vx2,vy2 = vbbox
    
        cv2.rectangle(img, (x1,y1)  , (x2,y2) , (0,255,0) , 1)
        alpha = 0.8
        color = (255, 0, 0)
        for c in range(3):
            img[vy1:vy2,vx1:vx2,c] = img[vy1:vy2, vx1:vx2, c]*alpha + color[c]*(1.0-alpha)
        cv2.circle(img, (vx1,vy1) , 1, color , 2)
        cv2.circle(img, (vx1,vy2) , 1, color , 2)
        cv2.circle(img, (vx2,vy1) , 1, color , 2)
        cv2.circle(img, (vx2,vy2) , 1, color , 2)
    
    output_path = os.path.join(output_path, filename)
    cv2.imwrite(output_path, img)
    return output_path

if __name__ == '__main__':
    import glob
    
    image_path = "pexels-allan-mas-5368927.jpg"
    img = cv2.imread(image_path)
    bboxes, vbboxes = detect_person(img)
    output_path = "./outputs"
    filename = image_path.split('/')[-1]
    visualize_and_save(img, bboxes, vbboxes, output_path, filename)
