//imports
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

//function constants
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

app.use(cors()); // Enable CORS for all routes

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'it_project_management',
    port: 3306
});

// Endpoints
app.post('/claim-voucher', (req, res) => {
    const { serialNo } = req.body;

    const query = `
        SELECT Voucher.voucher_name, Voucher.voucher_desc, Redeem.completed
        FROM Redeem
        INNER JOIN Voucher ON Redeem.voucher_Id = Voucher.voucher_Id
        WHERE Redeem.completed=FALSE && Redeem.serial_No = ?`;

    connection.query(query, [serialNo], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ title: 'Database error', desc: '' });
        }

        if (results.length > 0) {

            return res.json({
                title: results[0].voucher_name,
                desc: results[0].voucher_desc
            });

        } else {
            return res.json({ title: 'No unclaimed voucher found with the given serial number.', desc: '' });
        }
    });
    
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});