let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let editId = null;

const form = document.getElementById("transactionForm");

const description = document.getElementById("description");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const category = document.getElementById("category");
const date = document.getElementById("date");

const transactionList = document.getElementById("transactionList");

const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const balance = document.getElementById("balance");

const filterCategory = document.getElementById("filterCategory");

const submitButton = document.getElementById("submitButton");


// Set today's date automatically

const today = new Date().toISOString().split("T")[0];

date.value = today;


// Add or Edit Transaction

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const transactionDescription = description.value.trim();
    const transactionAmount = Number(amount.value);
    const transactionType = type.value;
    const transactionCategory = category.value;
    const transactionDate = date.value;

    if (transactionDescription === "") {
        alert("Please enter a description.");
        return;
    }

    if (transactionAmount <= 0) {
        alert("Amount must be greater than 0.");
        return;
    }

    if (transactionDate === "") {
        alert("Please select a date.");
        return;
    }


    if (editId !== null) {

        const index = transactions.findIndex(
            transaction => transaction.id === editId
        );

        transactions[index] = {
            id: editId,
            description: transactionDescription,
            amount: transactionAmount,
            type: transactionType,
            category: transactionCategory,
            date: transactionDate
        };

        editId = null;

        submitButton.textContent = "Add Transaction";

    } else {

        const newTransaction = {
            id: Date.now(),
            description: transactionDescription,
            amount: transactionAmount,
            type: transactionType,
            category: transactionCategory,
            date: transactionDate
        };

        transactions.push(newTransaction);
    }

    saveTransactions();

    form.reset();

    date.value = today;

    displayTransactions();

    updateSummary();
});


// Save transactions to Local Storage

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}


// Display transactions

function displayTransactions() {

    transactionList.innerHTML = "";

    const selectedCategory = filterCategory.value;

    let filteredTransactions = transactions;

    if (selectedCategory !== "All") {

        filteredTransactions = transactions.filter(
            transaction => transaction.category === selectedCategory
        );
    }

    // Show latest transactions first

    filteredTransactions.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );


    if (filteredTransactions.length === 0) {

        transactionList.innerHTML = `
            <div class="no-transactions">
                No transactions found.
            </div>
        `;

        return;
    }


    filteredTransactions.forEach(transaction => {

        const transactionElement = document.createElement("div");

        transactionElement.className = "transaction";


        const sign = transaction.type === "income" ? "+" : "-";

        const amountClass =
            transaction.type === "income" ? "income" : "expense";


        transactionElement.innerHTML = `

            <div class="transaction-info">
                <h3>${transaction.description}</h3>
                <p>${transaction.type.toUpperCase()}</p>
            </div>

            <div class="transaction-category">
                ${transaction.category}
            </div>

            <div class="transaction-date">
                ${transaction.date}
            </div>

            <div class="transaction-amount ${amountClass}">
                ${sign} ₹${transaction.amount.toFixed(2)}
            </div>

            <div class="actions">

                <button
                    class="edit-btn"
                    onclick="editTransaction(${transaction.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})">
                    Delete
                </button>

            </div>
        `;


        transactionList.appendChild(transactionElement);
    });
}


// Update summary cards

function updateSummary() {

    let income = 0;
    let expense = 0;


    transactions.forEach(transaction => {

        if (transaction.type === "income") {

            income += transaction.amount;

        } else {

            expense += transaction.amount;
        }
    });


    const currentBalance = income - expense;


    totalIncome.textContent =
        "₹" + income.toFixed(2);

    totalExpense.textContent =
        "₹" + expense.toFixed(2);

    balance.textContent =
        "₹" + currentBalance.toFixed(2);
}


// Edit transaction

function editTransaction(id) {

    const transaction = transactions.find(
        transaction => transaction.id === id
    );

    if (!transaction) {
        return;
    }


    description.value = transaction.description;

    amount.value = transaction.amount;

    type.value = transaction.type;

    category.value = transaction.category;

    date.value = transaction.date;


    editId = id;

    submitButton.textContent = "Update Transaction";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// Delete transaction

function deleteTransaction(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this transaction?");

    if (!confirmDelete) {
        return;
    }


    transactions = transactions.filter(
        transaction => transaction.id !== id
    );


    saveTransactions();

    displayTransactions();

    updateSummary();
}


// Category filtering

filterCategory.addEventListener("change", function() {

    displayTransactions();

});


// Initial display

displayTransactions();

updateSummary();