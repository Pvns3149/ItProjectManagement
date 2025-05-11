function claimVoucher() {

    //prompt user for voucher serial number
    const serialNo = document.getElementById('serial_num').value;

    //server function call
    fetch('http://localhost:3000/claim-voucher', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ serialNo })
    })
    //process response
        .then(response => response.json())
        .then(data => {
            alert(`${data.title}\n${data.desc}`);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("name").innerHTML = 'Error connecting to the server.';
            document.getElementById("desc").innerHTML = '';
        });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('vendorForm').addEventListener('submit', function(e) {
        e.preventDefault();
        claimVoucher();
    });
});
