function claimVoucher() {

    //prompt user for voucher serial number
    const serialNo = prompt('Please enter the voucher serial number:');

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
            document.getElementById("name").innerHTML = data.title;
            document.getElementById("desc").innerHTML = data.desc;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("name").innerHTML = 'Error connecting to the server.';
            document.getElementById("desc").innerHTML = '';
        });
}