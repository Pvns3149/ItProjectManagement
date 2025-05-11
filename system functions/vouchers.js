document.addEventListener('DOMContentLoaded', function() {

    // //use temporary id for testing
    // const id = 1; 

    //get id from session storage
    const id = sessionStorage.getItem('Token');
    
    //server funciton call
    fetch('http://localhost:3000/history', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id }) 
    })

    // Process response
    .then(response => response.json())
    .then(data => {
        if (data.results) {
            const content = document.getElementById('voucherTable');

            data.results.forEach(row => {
                const tr = document.createElement('tr');

                //Format the date
                const newDate = new Date(row.trans_Date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                tr.innerHTML = `
                    <td>${row.voucher_name}</td>
                    <td class="${row.completed ? 'status-complete' : 'status-pending'}">
                        ${row.completed ? 'Complete' : 'Pending'}
                    </td>
                    <td>${row.serial_No}</td>
                    <td>${newDate}</td>
                `;
                content.appendChild(tr);
            });
        } else {
            document.getElementById("voucherTable").innerHTML = 'No voucher history found.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById("voucherTable").innerHTML = 'Error connecting to the server.';
    });
});
