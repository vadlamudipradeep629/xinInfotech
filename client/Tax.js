// Tax.js
async function loadInvoiceData() {
    try {
        const response = await axios.get('http://localhost:3000/data/get');
        console.log(response)
        const invoices = response.data; // Assuming the response is an array of invoices

        // If you want to display all invoices, you might loop through them
        invoices.forEach(invoiceData => {
            // Fill company information
            document.querySelector('.company-info').innerHTML = `
                <p>Company Name: ${invoiceData.companyName}</p>
                <p>Phone Number: ${invoiceData.phoneNumber}</p>
            `;

            // Fill billing information
            document.querySelector('.billing-info').innerHTML = `
                <p>Billing Address: ${invoiceData.billingAddress}</p>
                <p>Contact Person: ${invoiceData.contactPerson}</p>
                <p>Contact Number: ${invoiceData.contactNumber}</p>
            `;

            // Display invoice details
            let invoiceHtml = `<p>Invoice Number: ${invoiceData.invoiceNumber}</p>
                               <p>Invoice Date: ${invoiceData.invoiceDate}</p>
                               <h2>Items:</h2>
                               <table>
                                   <thead>
                                       <tr>
                                           <th>Item Name</th>
                                           <th>Quantity</th>
                                           <th>Unit Price</th>
                                           <th>Discount</th>
                                           <th>Tax</th>
                                           <th>Amount Before Tax</th>
                                           <th>Amount After Tax</th>
                                       </tr>
                                   </thead>
                                   <tbody>`;

            // Populate items
            invoiceData.items.forEach(item => {
                invoiceHtml += `<tr>
                                   <td>${item.itemName}</td>
                                   <td>${item.quantity}</td>
                                   <td>${item.unitPrice.toFixed(2)}</td>
                                   <td>${item.discount}</td>
                                   <td>${item.tax}</td>
                                   <td>${item.amountBeforeTax.toFixed(2)}</td>
                                   <td>${item.amountAfterTax.toFixed(2)}</td>
                               </tr>`;
            });

            invoiceHtml += `</tbody></table>`;
            document.getElementById('invoiceDetails').innerHTML += invoiceHtml; // Append to prevent overwriting

            // Fill invoice summary
            document.getElementById('invoiceSummary').innerHTML += `
                <h2>Invoice Summary</h2>
                <p>Total Without Tax: ${invoiceData.totalWithoutTax.toFixed(2)}</p>
                <p>Total Tax Amount: ${invoiceData.totalTaxAmount.toFixed(2)}</p>
                <p>Total With Tax: ${invoiceData.totalWithTax.toFixed(2)}</p>
                <p>Round Off Amount: ${invoiceData.roundOffAmount.toFixed(2)}</p>
                <p>Final Total Amount: ${invoiceData.finalTotalAmount.toFixed(2)}</p>
            `;
        });
    } catch (error) {
        console.error('Error fetching invoice data:', error.response ? error.response.data : error.message);

    }

}

// Load the invoice data when the page loads
window.onload = loadInvoiceData;
