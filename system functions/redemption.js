document.addEventListener('DOMContentLoaded', function() {

    // //use temporary id and points for testing
    // let points = 6100; 
    // const id = 1;

    //get points and id from session storage
    let points = Number(sessionStorage.getItem('Points'));
    id = sessionStorage.getItem('User');

    //check if id is null and reroute
    if (id == null) {
        alert('Session expired. Please login again.');
        window.location.href = 'login.html';
    }
    
    //server funciton call
    fetch('http://localhost:3000/store')

    // Process response
    .then(response => response.json())
    .then(data => {
        if (data.results) {
            const content = document.getElementById('VoucherCards');

            data.results.forEach(row => {
                const div = document.createElement('div');
                div.classList.add('voucher-card');

                div.innerHTML = `
                    <h2>${row.voucher_name}</h2>
                    <p>${row.voucher_desc}</p>
                    <div class="cost">${row.cost} Points</div>
                    <button class="redeem-button">Redeem</button>
                `;

                // Redeem validation and processing
                div.querySelector('.redeem-button').addEventListener('click', function() {
                    if (points < row.cost) {
                        alert('Not enough points to redeem this voucher.');
                        return;
                    }
                    if (confirm(`Are you sure you want to redeem ${row.voucher_name} for ${row.cost} points? Your balance points after redemption will be ${points - row.cost}.`)) {

                        fetch('http://localhost:3000/redeem', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ cost: row.cost, id: id, voucherId: row.voucher_Id })
                        })

                        .then(response => {
                            if (response.ok)
                                return response.json();
                            else
                                throw new Error('Server response not ok');
                        })
                        .then(result => {

                            points = points - row.cost; 
                            sessionStorage.setItem('Points', points );
                            alert( result.message + 'Your new points balance is ' + points );

                        })
                        .catch(error => {
                            alert('Error redeeming voucher.');
                            console.error(error.message || 'Error redeeming voucher.');
                        });
                    }
                });
                content.appendChild(div);
            });
        } else {
            document.getElementById("voucherCards").innerHTML = 'No vouchers available for redemption.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById("voucherTable").innerHTML = 'Error connecting to the server.';
    });
});
