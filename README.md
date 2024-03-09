# Tri-NIT - The Debuggers - ML01

This repository serves as the dedicated space for our contributions to the Tri-NIT Hackathon, where we've undertaken the project under the ML Track: ML01.

## The Problem Statement

**ML01 - Automated Road Damage Detection for Infrastructure Maintenance**

Manual inspection of road conditions is a time-consuming and labor-intensive task, leading to delays in identifying and repairing damaged roads. The goal is to develop a classification model capable of automatically detecting and categorizing road damage from images (captured through CC cameras,phone,etc.), in order to make the maintenance process efficient. The infrastructure management is enhanced by reducing the reliance on manual inspections and enabling timely and targeted repairs to ensure safe and well-maintained road networks.

**Objective:**
- The dataset has images of roads with background. The model should involve object detection to capture only roads (using YOLO or R-CNN or their combination,etc.), followed by classifying the damaged roads.

**Brownie points:**
- Deploy the model (using Firebase)
- View real-time road damage alerts generated by the model.

**Evaluation Metric:**
- Intersection over Union (IoU)

## Demo Video, Presentation and ML Model:

Drive Link - [https://drive.google.com/drive/folders/1Nj9R4sVXCf81BdJ0D3_MtWMDDPr6rnqu?usp=sharing](https://drive.google.com/drive/folders/1Nj9R4sVXCf81BdJ0D3_MtWMDDPr6rnqu?usp=sharing)

## What it does
- Types of road defects are detected from the image uploaded onto the web application. 

- Real-time detection of damaged roads can also be done.

## Architecture
![architecture](/assets/architecture.png)

## Data Flow
![data flow](/assets/data_flow.png)

## Installation Guide

### Client
In the client directory, you can run:
#### Install dependencies: 
```npm install```

#### To Start Server:
```npm run start``` 

#### To Visit App:
```localhost:3001```

### Server
In the Server directory, you can run:
#### Set up a virtual environment:
```
virtualenv -p python3 env
source ./env/bin/activate
```

#### Install dependencies: 
```
pip install -r requirements.txt
```

### Copy .env.example to .env and set the variables in environment.
```
cp .env.example .env
```

### Start the server
```
python main.py
```

Server will be started at http://0.0.0.0:5000

## How we built it

`Tri-NIT_The-Debuggers_ML01` is built with Flask, React, and YOLO v3. the following technologies were used for the application:

- React (Client-side Library)
- Flask (webserver/socket)
- YOLO v3(object detection model)

## Model

### What is yolo v3?
YOLOv3 (You Only Look Once version 3) is a deep learning model architecture used for object detection in images and videos. It is a single neural network architecture that can detect objects in real-time with high accuracy. The YOLOv3 architecture uses a series of convolutional layers to extract features from an input image and then predicts bounding boxes and class probabilities for each object in the image. The architecture uses a feature pyramid network to detect objects at different scales and a prediction module to refine object detection results. YOLOv3 is known for its speed and accuracy.

### Architecture 
YOLOv3 uses a convolutional neural network (CNN) to detect objects in images. The network is divided into three parts: a backbone, a neck, and a head. The backbone is a series of convolutional layers that extract features from the input image. The neck combines features from different scales to improve object detection. The head is a set of fully connected layers that predict the location and class of each object in the image.
YOLOv3 also uses anchor boxes, which are pre-defined bounding boxes of different sizes and aspect ratios. These anchor boxes are used to predict the location and size of objects in the image.

### YOLOv3 Algorithm Steps
- The YOLOv3 architecture is based on the architecture of feature extraction model, Darknet-53. For deducing the detection of objects, 53 layers are stacked together, therefore, resulting in a fully convolutional architecture of 106 layers.
- The objects are identified at three layers of the architecture- 82nd, 94th, and 106th.
Each layer of the 53-layered architecture is followed by batch normalization layer and the implementation of Leaky ReLU activation function.
- The basic idea of the YOLOv3 architecture is to divide the image into cells of size SxS. One grid cell per object is responsible for the object’s prediction.
- Each grid cell has five parameters that come in handy to specify the location of bounding box. These are (x,y,w,h, confidence) where x and y represent the coordinates of the box’s center, w and h are used to specify the width and height of the box, confidence denotes the absence/presence of any object. Besides that, the image also has class probabilities corresponding to each grid cell.
- Since the probabilities are evaluated for each grid cell, there are chances that the algorithm can predict multiple bounding boxes for same objects. To avoid this situation, the Non-Max Suppression method is used.
- The input to the first layer of the model is a batch of n images of the shape (n, 416, 416, 3) where (416, 416) represents the width and height of the image and 3 is for the number of channels: Red, Green, Blue.
- The architecture of YOLOv3 model is free from any type of pooling layers and for the convolutional layers, the stride is 2 for downsampling the feature maps.
- Multiple filters are convolved in a convolutional layer for generating multiple feature maps.
The YOLOv3 model makes predictions at three different positions in the network. The three different positions are at 82nd, 94th, and 106th layers. The stride for these three layers is 32, 16, and 8 respectively. 
- Thus, the output of the 82nd layer is 13x13 (416/32 = 13) and it is responsible for detecting large objects as the stride is 32. Similarly, for the 94th layer, the output is of the size 26x26 (416/16 = 26) as the stride is 16 and it is responsible for detecting medium-sized objects. For the last layer (106th), the stride is 8 and it detects large objects. So the output is of the size 52x52 (416/8 = 52).

### Evaluation 
The quality of a box prediction is measured by its IoU (Intersection over Union) with the object it tries to predict (more precisely — with its ground truth box). IoU values range from 0 (the box completely misses the object) to 1.0 (a perfect fit).
For each spatial cell, for each box prediction in centered in that cell, the loss function finds the box with the best IoU with the object centered in that cell. This distinguishing mechanism between best boxes and all the other boxes is in the heart of the YOLO loss.

## Challenges we ran into
- Teamwork
- Idea pooling
- CNN
- Creativity
- Problem-Solving

## Future Goals
- Working on improving the accuracy of the model even futher, and optimizing the run time.