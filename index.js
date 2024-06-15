require("dotenv").config();
const express = require("express");
const app = express();
const startDb = require("./db/connectDb");
const appNotFound = require("./middleware/notFound");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const reviewRoute = require("./routes/reviewRoute");
const transactionRoute = require("./routes/transactionRoute");
const investmentRoute = require('./routes/investmentRoute');
const transferRoute = require('./routes/transferRoute')
const withdrawalRoute = require('./routes/withdrawalRoute')
const profileImageRoute = require('./routes/profileImageRoute')
const ticketRoute = require('./routes/ticketRoute')
const cookieParser = require("cookie-parser");
const cors = require('cors')
const cloudinary = require('cloudinary').v2
const fileUpload = require('express-fileupload')

// middlewares
app.use(cors())
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
app.use(fileUpload({ useTempFiles: true}))

app.use(authRoute);
app.use(userRoute);
app.use("/review", reviewRoute);
app.use("/transaction", transactionRoute);
app.use("/investment", investmentRoute)
app.use("/transfer",transferRoute)
app.use('/withdrawal', withdrawalRoute)
app.use(profileImageRoute)
app.use('/ticket', ticketRoute)

app.get('/', (req, res) => res.send('hello world from cOdE mAnIa'))

app.use(appNotFound);

// db connection

startDb(process.env.MONGO_URI);

const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log("listening to port 3000");
});
