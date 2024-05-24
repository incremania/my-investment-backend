const Ticket = require('../models/ticketModel');
const cloudinary = require('cloudinary').v2;

const createTicket = async (req, res) => {
    try {
        const { subject, message, status } = req.body;
        
        if (!req.files || !req.files.attachment) {
            return res.status(400).json({ error: 'Please provide a file attachment.' });
        }

        const attachment = req.files.attachment;
        
        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(attachment.tempFilePath, {
            use_filename: true,
            folder: 'ticket_attachments'
        });

        // Create the ticket with the attachment URL
        const ticket = await Ticket.create({
            subject,
            message,
            status,
            userId: req.user.userId,
            attachmentUrl: result.secure_url // Save the URL of the uploaded file
        });



        res.status(201).json({
            status: "success",
            message: "Ticket created successfully",
            ticketDetails: ticket,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getUserTickets = async (req, res) => {
    try {
        // Retrieve the user ID from the request
        const userId = req.user.userId;
        console.log(userId);

        const userTickets = await Ticket.find({ userId: req.user.userId });
        console.log(userTickets);

     
        res.status(200).json({
            status: "success",
            message: "User tickets retrieved successfully",
            userTickets
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


const getAllTickets = async (req, res) => {
    try {
        // Find all tickets in the database
        const allTickets = await Ticket.find();

        // Return all tickets in the response
        res.status(200).json({
            status: "success",
            message: "All tickets retrieved successfully",
            allTickets: allTickets
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createTicket,
    getUserTickets,
    getAllTickets
};
