import io
import os
import random
from flask import Flask, request, jsonify
from PIL import Image
import torch
import torch.nn as nn
import torchvision.transforms as transforms
import firebase_admin
from firebase_admin import credentials, firestore
import numpy as np

# ---------------------------
# Firebase Init
# ---------------------------
# Replace with the path to your Firebase service account key JSON file.
# firebase_cred = credentials.Certificate("./apikey.json")
# firebase_admin.initialize_app(firebase_cred)
# db = firestore.client()

# ---------------------------
# Flask App Setup
# ---------------------------
app = Flask(__name__)

# ---------------------------
# Advanced Preprocessing
# ---------------------------
IMG_SIZE = 220

def crop_image_with_canny(pil_img, target_size=(IMG_SIZE, IMG_SIZE)):

    import cv2
    img_np = np.array(pil_img)
    gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
    edges = cv2.Canny(gray, 100, 200)
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if contours:
        largest_contour = max(contours, key=cv2.contourArea)
        x, y, w, h = cv2.boundingRect(largest_contour)
        cropped = img_np[y:y+h, x:x+w]
        cropped = cv2.resize(cropped, target_size)
        return Image.fromarray(cropped)
    else:
        return pil_img.resize(target_size)

advanced_val_transforms = transforms.Compose([
    transforms.Lambda(lambda img: crop_image_with_canny(img, target_size=(IMG_SIZE, IMG_SIZE))),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

# ---------------------------
# Load Model and Class Names
# ---------------------------

class_names = ['Alexandrite', 'Ametrine', 'Andalusite', 'Andradite', 'Aventurine Green', 'Aventurine Yellow', 'Blue Lace Agate', 'Carnelian', 'Cats Eye', 'Chalcedony', 'Chrome Diopside', 'Chrysoberyl', 'Chrysoprase', 'Danburite', 'Diamond', 'Dumortierite', 'Emerald', 'Hessonite', 'Iolite', 'Lapis Lazuli', 'Larimar', 'Morganite', 'Onyx Red', 'Peridot', 'Prehnite', 'Quartz Beer', 'Quartz Rose', 'Quartz Smoky', 'Rhodochrosite', 'Ruby', 'Sapphire Pink', 'Sapphire Yellow', 'Serpentine', 'Spinel', 'Spodumene', 'Sunstone', 'Tigers Eye', 'Topaz', 'Variscite', 'Zoisite']
num_classes = len(class_names)  

class GemstoneCNN(nn.Module):
    def __init__(self, num_classes):
        super(GemstoneCNN, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2,2),
            
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2,2),
            
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2,2),
            
            nn.Conv2d(128, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2,2),
            
            nn.Conv2d(128, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2,2)
        )
        fc_input = 128 * (IMG_SIZE // 32) * (IMG_SIZE // 32)
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(fc_input, 256),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),
            nn.Linear(256, num_classes)
        )
        
    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x

# Device selection for Mac (using MPS if available)
if torch.backends.mps.is_available():
    device = torch.device("mps")
elif torch.cuda.is_available():
    device = torch.device("cuda")
else:
    device = torch.device("cpu")

model = GemstoneCNN(num_classes=num_classes)
model.load_state_dict(torch.load("gemstone_cnn.pth", map_location=device))
model = model.to(device)
model.eval()

# ---------------------------
# API Endpoint for Prediction
# ---------------------------
@app.route('/predict', methods=['POST'])
def predict():
    # Check for image file in the request
    print('REQUEST:\n',request)
    print('\n\nREQUEST FILES:\n', request.files)
    if 'image' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        # Load image from the file stream and convert to RGB
        image = Image.open(file.stream).convert('RGB')
        import cv2
        image.show()
    except Exception as e:
        return jsonify({'error': 'Invalid image format', 'details': str(e)}), 400

    # Preprocess the image using advanced validation transforms
    input_tensor = advanced_val_transforms(image).unsqueeze(0).to(device)

    # Perform prediction
    with torch.no_grad():
        output = model(input_tensor)
        _, pred = torch.max(output, 1)
    predicted_class_index = pred.item()
    predicted_class = class_names[predicted_class_index]

    # Optionally, store prediction in Firestore
    # doc_ref = db.collection('predictions').document()
    # doc_ref.set({
    #     'predicted_class': predicted_class,
    #     'class_index': predicted_class_index,
    #     'timestamp': firestore.SERVER_TIMESTAMP
    # })

    return jsonify({
        'predicted_class': predicted_class,
        'class_index': predicted_class_index
    })

# ---------------------------
# Run the Flask App
# ---------------------------
if __name__ == '__main__':
    app.run(debug=True)