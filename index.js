
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Employee = require("./models/Employee");

const app = express();

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/employeeAuthDB")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });

app.post("/employees/register", async (req, res) => {
    try {
        const { employeeName, designation, email, password } = req.body;
        if (!employeeName || !designation || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }


        const existingEmployee = await Employee.findOne({ email });

        if (existingEmployee) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const employee = await Employee.create({
            employeeName,
            designation,
            email,
            password: hashedPassword
        });

        const employeeResponse = {
            _id: employee._id,
            employeeName: employee.employeeName,
            designation: employee.designation,
            email: employee.email
        };

        return res.status(201).json({
            success: true,
            message: "Employee registered successfully",
            data: employeeResponse
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
