const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Employee = require("./models/Employee");

const app = express();


app.use(express.json());


app.get("/", (req, res) => {
    res.send("Employee API is running");
});


mongoose
    .connect("mongodb://127.0.0.1:27017/employeeAuthDB")
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

        res.status(201).json({
            success: true,
            message: "Employee registered successfully",
            data: {
                _id: employee._id,
                employeeName: employee.employeeName,
                designation: employee.designation,
                email: employee.email
            }
        });

    } catch (error) {
        console.log("Registration error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

app.listen(5001, () => {
    console.log("Server running on port 5001");
});
