### Video overview URL: https://app.usebubbles.com/senvg35CUpSrMi1ucWV7K9

## Server Live URL: https://ride-booking-server-chi.vercel.app/api

# 🚖 Ride Booking Management Server

## 🎯 Project Overview
A secure, scalable, and role-based REST API for a ride booking platform (like Uber or Pathao), built with **Node.js, Express.js, and MongoDB**.  
The system supports three user roles: **Admin, Driver, and Rider**.

---

## ✅ Features

### 🔐 Authentication & Roles
- JWT-based login (stored in HTTP-only cookies)  
- Password hashing using bcrypt  
- Roles: **admin, driver, rider**

### 👥 User Management
- Register as rider or driver  
- Login and authenticate via JWT  
- Drivers include approval, block status, and vehicle info  
- Admin can approve/block drivers or riders  

### 🚘 Ride Management
- Riders can request, cancel, and view ride history  
- Drivers can accept rides, update ride status, and go online/offline  
- Admin can view/manage all rides  
- Ride status lifecycle with timestamp tracking  

### 💬 Feedback & Ratings
- Rider and driver can submit feedback after a completed ride  
- History is created automatically  

---

## 📁 Project Structure

src/
├── modules/
│   ├── auth/          # Authentication logic
│   ├── riders/          # User management
│   ├── driver/        # Driver operations
│   ├── ride/          # Ride booking system
│   ├── history/         # Riders and driver history
├── middlewares/       # Auth, validation, location tracking
├── routes/           # Route definitions
├── errorHandle/           # Handle all errors
├── utils/            # Helper functions
└── config/          # Database and app configuration

---

## 🧩 API Endpoints

### 📌 Authentication

#### 🔹 Register (Rider or Driver)
**POST** `/api/riders/register`

**Body (Rider):**
```json
{
  "role": "rider",
  "name": "Sarker",
  "email": "sarker@example.com",
  "password": "1234567"
}
```
**Body (Driver):**
```json
{
  "role": "driver",
  "name": "Faysal Driver",
  "email": "driver@gmail.com",
  "password": "123456",
  "driverProfile": {
    "vehicleInfo": {
      "model": "Toyota Prius",
      "licensePlate": "DHK-4567",
      "color": "White"
    }
  }
}
```

**🔹 Login**
**POST:** `/api/auth/login`
```json
{
  "email": "sarker@example.com",
  "password": "1234567"
}
```
---

## 🚖 Rider Features
### 🟢 Request Ride
**POST** `/api/ride/request`
```json
{
  "pickupLocation": {
    "lat": 23.8103,
    "lng": 90.4125,
    "address": "Gulshan, Dhaka"
  },
  "destinationLocation": {
    "lat": 23.7806,
    "lng": 90.2792,
    "address": "Dhanmondi, Dhaka"
  }
}
```
💰 Fare = 20 per kilometer (calculated automatically)

### ❌ Cancel Ride
**POST** `/api/ride/:rideId/cancel`
| Rider can cancel only before driver accepts

### 📜 Update Rider Feedback By Driver
**PATCH** `/api/history/rider-feedback/:historyId`
| Only driver can access this route

## 🚗 Driver Features
### 🔍 Get Available Rides
**GET** `/api/ride/available`

### ✅ Accept a Ride By Driver
**POST** `/api/driver/accept/:rideId`

### 🔄 Update Ride Status
**PATCH** `/api/driver/status/:id`
```json
{
  "status": "picked_up" // or "in_transit", "completed"
}
```
## 💸 View Total Earnings
**GET** `/api/driver/total-earnings`

## 💬 Ratings & Feedback
**Rider gave feedback to Driver** 
**PATCH** `/api/history/rider-feedback/:historyId`

```json
{
  "rating": 4,
  "feedback": "Safe journey"
}
```
**Driver gave feedback to Rider**
**PATCH** `/api/history/driver-feedback/:historyId`
```json
{
  "rating": 5,
  "feedback": "Polite and on time"
}
```
--- 

### 🛠️ Admin Features
- 👁 View All Riders and Drivers
- **GET** `/all-riders`
- **GET** `/all-drivers`
- 🧾 View Ride Summary
- **GET** `/user-summary`

### ✏️ Update User
**PATCH** `/riders/:id`

### 🗑 Delete User
**DELETE** `/riders/:id`

### 📘 Ride Lifecycle
```
requested → accepted → picked_up → in_transit → completed
```
Each status update logs a timestamp, and cancellation creates a separate state:

- cancelled_by_rider
- cancelled_by_driver

## ❓ Planning Decisions & Answers

| Question              | Answer                                                                 |
|------------------------|------------------------------------------------------------------------|
| 🧩 Ride Matching       | Drivers manually accept from available rides                           |
| ❌ Cancel Rules        | Allowed only before driver accepts                                     |
| 🧍 Multiple Rides      | One active ride per user                                               |
| 🚫 Suspended Driver    | Cannot access ride endpoints                                           |
| 🚗 Driver Already on Ride | Cannot accept another ride                                         |
| 🗺️ Location Format     | Latitude, Longitude, and Address                                       |
| 📦 User Model          | Single model with `role` field and nested `driverProfile`              |
| 🔒 Role Protection     | Route guards using JWT + role middleware                              |
| 📝 Logging             | All ride statuses logged with timestamps                              |
| 📊 Reports & Ratings   | Ratings + feedback stored per ride, history auto created               |
