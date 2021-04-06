//get express library
const express = require("express")

//define router obj from express
const router = express.Router()

//import the job model
const ListItemModel = require("../models/listItem.js")

//validator
const { check, validationResult } = require('express-validator')

//emailer
const nodemailer = require('nodemailer')

const { config } = require('dotenv');
config();

const email = process.env.EMAIL  
const password = process.env.EMAIL_PASSWORD

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass: password
  }
})

//gets the list of emails and names
router.get("/", (request, response) => {
    ListItemModel.find()
        .then(list => response.send(list))
        .catch(error => response.send(error))
})

router.post("/", 
//validate email is actually a valid email like a@b.c
[check('name').isLength({ min: 1 }), check('email').isEmail()],
(request, response) => {
    //get errors from validation check
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        // console.log(errors.errors)
        if (errors.errors[0].param === "name"){
            console.log("The name field was not valid, must enter a name that is more than 0 characters")
            return response.status(400).send({error: "The name field was not valid, must enter a name that is more than 0 characters"})
        }
        else if (errors.errors[0].param === "email"){
            console.log("The email field was not valid, must enter a valid email string")
            return response.status(400).send({error: "The email field was not valid, must enter a valid email string"})
        }
    }
    
    ListItemModel.create(request.body)
        .then(item => {
            let mailOptions = {
                from: 'mailinglistmailer@gmail.com',
                to: item.email,
                subject: 'You have been added to the Mailing List!',
                text: "Congratulations, now you'll get loads of marketing from us!"
            }
              
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                    response.status(400).send({"error": "Confirmation email failed to send"})
                } else {
                    console.log('Email sent: ' + info.response)
                    response.send(item)
                }
            })
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({"error": "This email is already registered"})
        })
})

router.post("/send",
[check('subject').isLength({ min: 1 }), check('body').isLength({ min: 1 })],
(request, response) => {
    //get errors from validation check
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        // console.log(errors.errors)
        if (errors.errors[0].param === "subject"){
            console.log("The subject field was not valid, must enter a subject that is more than 0 characters")
            return response.status(400).send({error: "The subject field was not valid, must enter a subject that is more than 0 characters"})
        }
        else if (errors.errors[0].param === "body"){
            console.log("The body field was not valid, must enter a body that is more than 0 characters")
            return response.status(400).send({error: "The body field was not valid, must enter a body that is more than 0 characters"})
        }
    }
    ListItemModel.find()
        .then(list => {
            list.forEach(item => {
                let mailOptions = {
                    from: 'mailinglistmailer@gmail.com',
                    to: item.email,
                    subject: request.body.subject,
                    text: request.body.body
                }
                    
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error)
                        response.status(400).send({"error": "Confirmation email failed to send"})
                    } else {
                        console.log('Email sent: ' + info.response)
                        response.send(item)
                    }
                })
            })
        })
        .catch(error => {
            console.log({"error": "There was an unexpected Error"})
            response.status(400).send({"error": "There was an unexpected Error"})
        })
})

module.exports = router