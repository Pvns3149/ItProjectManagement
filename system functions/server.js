//imports
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

app.use(cors()); 

// Create a connection to the db 
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'it_project_management',
    port: 3306
});

// Fetch Endpoints

//Vendor claim
app.post('/claim-voucher', (req, res) => {
    const { serialNo } = req.body;

    const query = `
        SELECT Voucher.voucher_name, Voucher.voucher_desc, Redeem.completed
        FROM Redeem
        INNER JOIN Voucher ON Redeem.voucher_Id = Voucher.voucher_Id
        WHERE Redeem.completed=FALSE && Redeem.serial_No = ?`;

    connection.query(query, [serialNo], (err, results) => {
        // Db error check
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ title: 'Database error', desc: '' });
        }

        if (results.length > 0) {
            // Update the 'completed' field to TRUE if found
            const updateQuery = `UPDATE Redeem SET completed = TRUE WHERE serial_No = ?`;

            connection.query(updateQuery, [serialNo], (updateErr) => {
                //update error check
                if (updateErr) {
                    console.error('Error updating the database:', updateErr);
                    return res.status(500).json({ title: 'Database update error', desc: '' });
                }

                // Send the voucher details as a response
                return res.json({
                    title: results[0].voucher_name,
                    desc: results[0].voucher_desc
                });
            });
        } else {
            return res.json({ title: 'No unclaimed voucher found with the given serial number.', desc: '' });
        }
    });
    
});

//Customer Claim
app.post('/redeem', (req, res) => {
    const { cost, id, voucherId } = req.body;

    const pointsQuery = `
        UPDATE Customer
        SET points = points - ?
        WHERE cust_Id = ?`;

    const redeemQuery = `
        INSERT INTO Redeem (cust_Id, voucher_Id, serial_No)
        VALUES (?, ?, ?)`;
                
    connection.query(pointsQuery, [ cost, id ], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ message: 'Database update points error' });
        }
        if (results.affectedRows > 0) {

            connection.query(redeemQuery, [ id, voucherId, uuidv4() ], (err, results) => {
                if (err) {
                    console.error('Error querying the database:', err);
                    return res.status(500).json({ message: 'Database create redeemed voucher error' });
                }
                if (results.affectedRows > 0) {
                    return res.status(200).json({ message: 'Voucher redeemed successfully!' });
                } else {
                    return res.status(500).json({ message: 'Error creating redeemed voucher' });
                }
            });
        }
        else 
            return res.status(400).json({ message: 'Error updating points.' });
    });
});

//Customer login
app.post('/auth', (req, res) => {
    const { phoneNum, password } = req.body;

    const query = ` 
    SELECT cust_Id 
    FROM Customer 
    WHERE phone_number = ? AND password = ? `;

    connection.query(query, [phoneNum, password], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({id: null });
        }

        if (results.length > 0) {
            return res.status(200).json({ id: results[0] });
        } else {
            return res.status(401).json({id: null });
        }
    });
});

//Customer voucher history
app.post('/history', (req, res) => {

    const { id } = req.body;

    const query = `
    SELECT Voucher.voucher_name, Voucher.voucher_desc, Redeem.completed, Redeem.serial_No, Redeem.trans_Date
    FROM Redeem 
    INNER JOIN Voucher ON Redeem.voucher_Id = Voucher.voucher_Id
    WHERE Redeem.cust_Id = ?`

    connection.query(query, [ id ], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ results: null });
        }

        if (results.length > 0) {
            return res.status(200).json({ results });
        } else {
            return res.status(200).json({ results: null });
        }
    });
});

//Store
app.get('/store', (req, res) => {

    const query = `
    SELECT * FROM Voucher`;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ results: null });
        }

        if (results.length > 0) {
            return res.status(200).json({ results });
        } else {
            return res.status(200).json({ results: null });
        }
    });
});

//Dashboard
app.post('/dashboard', (req, res) => {
    const { id } = req.body;

    const query = `
    SELECT name, points
    FROM Customer
    WHERE cust_Id = ?`;

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ results: "Server error" });
        }

        if (results.length > 0) {
            return res.status(200).json({ results });
        } else {
            return res.status(500).json({ results: "Customer ID not found" });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});