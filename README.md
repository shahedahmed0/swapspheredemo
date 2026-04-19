# SwapSphere

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for a hobbyist exchange page with user authentication. This project provides a modern web platform featuring services, team information, and user registration/login functionality.

## Features

- User authentication (register/login)
- Item Listing Creation: Listing new items and optional picture upload when creating a listing (stored in MongoDB + served from backend)
- Condition Tagging: Assigning a specific condition status to items
- ​Availability Toggle: Ability to mark an item as "Available for Swap" or "Private Collection" without deletion
- ​Categorical Filtering: Filtering the marketplace by hobby sub-categories
- ​Keyword Search: A search bar to find specific items by name or tags
- Wishlist Addition: Users can save items of interest to a personal wishlist
- Initiate Swap Request: Sending a formal request to another user to trade specific items
- Incoming Request Manager: A dedicated view for users to track all pending requests sent to them
- Acceptance Workflow: Logic that marks a swap as "Accepted" and automates the status change of the items involved
- Transaction History: A persistent log of all successfully completed swaps for a user
- Reputation System (Karma Points): A numerical score on user profiles that increases with successful, honest swaps to build community trust
- User Reviews & Ratings: Post-swap feedback where hobbyists can leave a star rating and a brief comment about their trade partner
- Geo-Location Tagging: Optional location-based tagging to help hobbyists find local swap meets or trade partners nearby for in-person exchanges
- In-App Negotiation Chat: Persistent negotiation chat saved in the database
- Real‑time Notifications: Socket.IO messaging with global notifications

## Tech Stack

- **Frontend:** React.js, Bootstrap CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)

## Prerequisites

Before running this application, make sure you have the following installed:

- Git
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Compass (Optional but recommended)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-link>
   cd SwapSphere
   ```

2. Install dependencies for both client and server:
   ```bash
   npm run install-all
   ```

## Environment Variables

Edit the given `.env` template file in the root directory and add the following variables:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
```

- `MONGO_URI`: Your MongoDB connection string (local or Atlas)
- `PORT`: Port for the backend server (default: 5000)
- `JWT_SECRET`: Secret key for JWT token generation (default: given value)

## Running the Application

1. Ensure MongoDB Compass is running.

2. Start the server:
   ```bash
   npm start
   ```
   This will start both the backend server and React frontend concurrently.

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

## Project Structure

```
SwapSphere/
├── backend/
│   ├── .env.example
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── messageController.js
│   │   └── swapController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Item.js
│   │   ├── Message.js
│   │   ├── Review.js
│   │   ├── SwapRequest.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── items.js
│   │   ├── messages.js
│   │   └── swapRoutes.js
│   ├── server.js
│   ├── package.json
│   └── uploads/
│       └── <uploaded-files>
├── client/
│   ├── .env.example
│   ├── patches/
│   │   └── react-scripts+5.0.1.patch
│   ├── public/
│   │   ├── index.html
│   │   └── assets/
│   │       ├── css/
│   │       │   └── main.css
│   │       └── img/
│   │           ├── apple-touch-icon.jpg
│   │           ├── favicon.jpg
│   │           ├── blog/
│   │           ├── hero-carousel/
│   │           ├── portfolio/
│   │           ├── team/
│   │           └── testimonials/
│   ├── build/
│   │   ├── index.html
│   │   ├── asset-manifest.json
│   │   └── static/
│   │       ├── css/
│   │       │   └── main.*.css
│   │       └── js/
│   │           └── main.*.js
│   ├── src/
│   │   ├── config/
│   │   │   └── api.js
│   │   ├── components/
│   │   │   ├── About.js
│   │   │   ├── CreateListing.js
│   │   │   ├── FeaturedServices.js
│   │   │   ├── Header.js
│   │   │   ├── Hero.js
│   │   │   ├── ItemGallery.js
│   │   │   ├── Login.js
│   │   │   ├── NegotiationHub.js
│   │   │   ├── Register.js
│   │   │   ├── Services.js
│   │   │   ├── Stats.js
│   │   │   ├── Wishlist.js
│   │   │   └── swaps/
│   │   │       ├── IncomingRequestManager.jsx
│   │   │       ├── ProposeSwapPage.jsx
│   │   │       ├── ReviewForm.jsx
│   │   │       ├── SwapModal.jsx
│   │   │       └── TransactionHistory.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── .env
├── package.json
├── package-lock.json
├── LICENSE
├── README.md
└── uploads/
    └── <uploaded-files>
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
