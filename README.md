# Paper Trade

This application is a MERN stack website which allows its users to practice investing through trading stocks using fictional money.\
Visit here for a full write-up of the development process\
https://jun-w-huang.github.io/#/papertrademern.


# How to Run
Currently this application is not hosted and is not entirely complete. It was primarily created as a means to learn more about React and full stack web development. Running this application will require creating an IEXCloud account and MongoDB account.

## Frontend
1. Open `frontend/src/dashboard/helpers.tsx`
2. Replace `IEXCloudToken` with a valid IEXCloud token
2. `cd` into `frontend`
3. Enter `npm start`
4. Open `localhost:3000` on your browser

## Backend
1. Open `backend/config/default.json
2. Replace `ATLAS_URI` value with a valid MongoDB Atlas URI
3. Replace `jwtSecret` value with a valid jwt secret key
4. `cd` into backend
5. Enter `node server.js`
6. Backend is now running and hosted on `localhost:5000`
