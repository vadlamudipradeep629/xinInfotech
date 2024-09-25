// Function to calculate amounts for each item row
function calculateAmounts(row) {
  const quantity = parseFloat(row.querySelector('input[name="quantity[]"]').value);
  const unitPrice = parseFloat(row.querySelector('input[name="unitPrice[]"]').value);
  const discount = parseFloat(row.querySelector('input[name="discount[]"]').value) || 0;
  const tax = parseFloat(row.querySelector('input[name="tax[]"]').value) || 0;

  const amountBeforeTax = (quantity * unitPrice) - (quantity * unitPrice * discount / 100);
  const amountAfterTax = amountBeforeTax + (amountBeforeTax * tax / 100);

  row.querySelector('input[name="amountBeforeTax[]"]').value = amountBeforeTax.toFixed(2);
  row.querySelector('input[name="amountAfterTax[]"]').value = amountAfterTax.toFixed(2);

  updateInvoiceSummary();
}

// Function to update the invoice summary totals
function updateInvoiceSummary() {
  let totalWithoutTax = 0;
  let totalTaxAmount = 0;

  document.querySelectorAll('#items-table tbody tr').forEach(row => {
    const amountBeforeTax = parseFloat(row.querySelector('input[name="amountBeforeTax[]"]').value) || 0;
    const amountAfterTax = parseFloat(row.querySelector('input[name="amountAfterTax[]"]').value) || 0;

    totalWithoutTax += amountBeforeTax;
    totalTaxAmount += (amountAfterTax - amountBeforeTax);
  });

  document.getElementById('totalWithoutTax').value = totalWithoutTax.toFixed(2);
  document.getElementById('totalTaxAmount').value = totalTaxAmount.toFixed(2);
  document.getElementById('totalWithTax').value = (totalWithoutTax + totalTaxAmount).toFixed(2);

  const roundOff = parseFloat(document.getElementById('roundOffAmount').value) || 0;
  document.getElementById('finalTotalAmount').value = (totalWithoutTax + totalTaxAmount + roundOff).toFixed(2);
}

// Function to add a new item row
function addItem() {
  const table = document.getElementById('items-table').getElementsByTagName('tbody')[0];
  const newRow = table.insertRow();

  newRow.innerHTML = `
    <td><input type="text" name="itemName[]" class="form-control" required></td>
    <td><input type="number" name="quantity[]" class="form-control" required></td>
    <td><input type="number" name="unitPrice[]" class="form-control" required></td>
    <td><input type="number" name="discount[]" class="form-control"></td>
    <td><input type="number" name="tax[]" class="form-control"></td>
    <td><input type="number" name="amountBeforeTax[]" class="form-control" readonly></td>
    <td><input type="number" name="amountAfterTax[]" class="form-control" readonly></td>
    <td><button type="button" class="btn btn-danger remove-item">Remove</button></td>
  `;

  newRow.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => calculateAmounts(newRow));
  });

  newRow.querySelector('.remove-item').addEventListener('click', () => {
    newRow.remove();
    updateInvoiceSummary();
  });
}

document.getElementById('add-item').addEventListener('click', addItem);

// Add event listeners to existing input fields
document.querySelectorAll('#items-table tbody tr').forEach(row => {
  row.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => calculateAmounts(row));
  });

  row.querySelector('.remove-item').addEventListener('click', () => {
    row.remove();
    updateInvoiceSummary();
  });
});

// Auto-generate Invoice Number
document.getElementById('invoice-number').value = `INV-${Math.floor(Math.random() * 1000000)}`;

// Recalculate total when round-off amount is changed
document.getElementById('roundOffAmount').addEventListener('input', updateInvoiceSummary);

// Function to save invoice to localStorage and send to backend
function saveInvoiceToBackend() {
  const form = document.getElementById('invoice-form');
  const formData = new FormData(form);

  // Convert formData to an object
  let invoiceData = {};
  formData.forEach((value, key) => {
    if (!invoiceData[key]) {
      invoiceData[key] = value;
    } else {
      if (!Array.isArray(invoiceData[key])) {
        invoiceData[key] = [invoiceData[key]];
      }
      invoiceData[key].push(value);
    }
  });

  // Extract items from the table
  const items = [];
  document.querySelectorAll('#items-table tbody tr').forEach(row => {
    const item = {
      itemName: row.querySelector('input[name="itemName[]"]').value,
      quantity: parseFloat(row.querySelector('input[name="quantity[]"]').value),
      unitPrice: parseFloat(row.querySelector('input[name="unitPrice[]"]').value),
      discount: parseFloat(row.querySelector('input[name="discount[]"]').value) || 0,
      tax: parseFloat(row.querySelector('input[name="tax[]"]').value) || 0,
      amountBeforeTax: parseFloat(row.querySelector('input[name="amountBeforeTax[]"]').value) || 0,
      amountAfterTax: parseFloat(row.querySelector('input[name="amountAfterTax[]"]').value) || 0
    };
    items.push(item);
  });

  // Add items array to invoiceData
  invoiceData.items = items;

  // Store in localStorage
  localStorage.setItem('invoiceData', JSON.stringify(invoiceData));

  // Send to backend using Axios
  axios.post('http://localhost:3000/invoice/send', invoiceData)
    .then(response => {
      console.log('Invoice sent to backend:', response.data);
      alert('Invoice saved and sent successfully!');
      window.location ='./TaxInvoice.html'
    })
    .catch(error => {
      console.error('Error sending invoice to backend:', error);
      alert('Failed to send invoice to backend.');
    });
}

// Function to load invoice from localStorage
function loadInvoiceFromLocalStorage() {
  const storedData = localStorage.getItem('invoiceData');
  if (storedData) {
    const invoiceData = JSON.parse(storedData);

    for (const [key, value] of Object.entries(invoiceData)) {
      const field = document.querySelector(`[name="${key}"]`);

      if (Array.isArray(value)) {
        const itemsTable = document.getElementById('items-table').getElementsByTagName('tbody')[0];
        value.forEach((itemValue, index) => {
          if (index > 0) {
            addItem(); // Add a new row for subsequent items
          }
          const lastRow = itemsTable.rows[itemsTable.rows.length - 1];
          const inputField = lastRow.querySelector(`[name="${key}[]"]`);
          if (inputField) inputField.value = itemValue;
        });
      } else if (field) {
        field.value = value;
      }
    }

    updateInvoiceSummary();
    alert('Invoice loaded successfully!');
  } else {
    alert('No invoice data found in localStorage.');
  }
}

// Save the invoice on form submission
document.getElementById('invoice-form').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent form from submitting
  saveInvoiceToBackend(); // Save to backend and localStorage
});

// Load the invoice when the page loads
window.addEventListener('load', loadInvoiceFromLocalStorage);
