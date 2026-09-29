// =====================================================
// BLOOD BANK INVENTORY & DONOR ELIGIBILITY TRACKER
// Frontend JavaScript
// =====================================================


// =====================================================
// LOAD DASHBOARD DATA
// =====================================================

async function loadDashboard() {

    try {

        // ---------------------------------------------
        // 1. LOAD TOTAL DONORS
        // ---------------------------------------------

        const donorsResponse =
            await fetch("/api/donors");

        const donors =
            await donorsResponse.json();

        document.getElementById("totalDonors").textContent =
            donors.length;

        // Display donors in donor table
        displayDonors(donors);


        // ---------------------------------------------
        // 2. LOAD ALL BLOOD UNITS
        // ---------------------------------------------

        const unitsResponse =
            await fetch("/api/blood-units");

        const units =
            await unitsResponse.json();


        const availableUnits =
            units.filter(
                unit => unit.status === "AVAILABLE"
            );


        document.getElementById("totalUnits").textContent =
            availableUnits.length;


        // ---------------------------------------------
        // 3. LOAD EXPIRING UNITS
        // ---------------------------------------------

        const expiringResponse =
            await fetch("/api/blood-units/expiring-soon");


        const expiringUnits =
            await expiringResponse.json();


        document.getElementById("expiringUnits").textContent =
            expiringUnits.length;


        // ---------------------------------------------
        // 4. LOAD CURRENT BLOOD STOCK
        // ---------------------------------------------

        const stockResponse =
            await fetch("/api/blood-units/stock");


        const stock =
            await stockResponse.json();


        displayBloodStock(stock);


        // ---------------------------------------------
        // 5. LOAD INVENTORY TABLE
        // ---------------------------------------------

        displayInventory(units);


    } catch (error) {

        console.error(
            "Error loading dashboard:",
            error
        );

    }

}



// =====================================================
// DISPLAY DONORS
// =====================================================

function displayDonors(donors) {

    const table =
        document.getElementById("donorTable");


    if (!table) {
        return;
    }


    table.innerHTML = "";


    if (donors.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7">
                    No donors registered
                </td>
            </tr>
        `;

        return;
    }


    donors.forEach(
        donor => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${donor.id}
                </td>

                <td>
                    ${donor.name}
                </td>

                <td>
                    ${donor.age}
                </td>

                <td>
                    ${donor.bloodGroup}
                </td>

                <td>
                    ${donor.phone}
                </td>

                <td>
                    ${donor.lastDonationDate || "No donation"}
                </td>

                <td>

                    <button
                        class="delete-button"
                        onclick="deleteDonor(${donor.id})"
                    >
                        Delete
                    </button>

                </td>

            `;


            table.appendChild(row);

        }
    );

}



// =====================================================
// DELETE DONOR
// =====================================================

async function deleteDonor(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this donor?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/donors/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            const data =
                await response.json();

            alert(
                data.message ||
                "Failed to delete donor."
            );

            return;
        }


        alert(
            "Donor deleted successfully!"
        );


        // Refresh dashboard and donor table
        loadDashboard();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server."
        );

    }

}



// =====================================================
// DISPLAY BLOOD STOCK
// =====================================================

function displayBloodStock(stock) {

    const container =
        document.getElementById("stockContainer");


    // Clear existing cards

    container.innerHTML = "";


    // All supported blood groups

    const bloodGroups = [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-"
    ];


    bloodGroups.forEach(
        bloodGroup => {

            const units =
                stock[bloodGroup] || 0;


            const card =
                document.createElement("div");


            card.className =
                "blood-card";


            card.innerHTML = `

                <div class="blood-group">
                    ${bloodGroup}
                </div>

                <div class="blood-count">
                    ${units}
                </div>

                <span>
                    Units Available
                </span>

            `;


            container.appendChild(card);

        }
    );

}



// =====================================================
// DISPLAY INVENTORY
// =====================================================

function displayInventory(units) {

    const table =
        document.getElementById("inventoryTable");


    table.innerHTML = "";


    if (units.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No inventory data available
                </td>
            </tr>
        `;

        return;
    }


    units.forEach(
        unit => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${unit.id}
                </td>

                <td>
                    ${unit.bloodGroup}
                </td>

                <td>
                    ${unit.collectionDate}
                </td>

                <td>
                    ${unit.expiryDate}
                </td>

                <td>
                    ${unit.status}
                </td>

            `;


            table.appendChild(row);

        }
    );

}



// =====================================================
// ADD DONOR
// =====================================================

async function addDonor() {

    const name =
        document.getElementById("donorName").value;


    const age =
        document.getElementById("donorAge").value;


    const bloodGroup =
        document.getElementById("donorBloodGroup").value;


    const phone =
        document.getElementById("donorPhone").value;


    // Basic validation

    if (
        name === "" ||
        age === "" ||
        bloodGroup === "" ||
        phone === ""
    ) {

        alert(
            "Please fill all donor details."
        );

        return;
    }


    const donor = {

        name: name,

        age: Number(age),

        bloodGroup: bloodGroup,

        phone: phone

    };


    try {

        const response =
            await fetch(
                "/api/donors",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(donor)

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to add donor."
            );

            return;
        }


        alert(
            "Donor added successfully!"
        );


        // Clear form

        document.getElementById("donorName").value = "";

        document.getElementById("donorAge").value = "";

        document.getElementById("donorBloodGroup").value = "";

        document.getElementById("donorPhone").value = "";


        // Refresh dashboard
        // This also refreshes donor table

        loadDashboard();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server."
        );

    }

}



// =====================================================
// RECORD DONATION
// =====================================================

async function recordDonation() {

    const donorId =
        document.getElementById("donorId").value;


    const collectionDate =
        document.getElementById("collectionDate").value;


    const units =
        document.getElementById("donationUnits").value;


    const expiryDate =
        document.getElementById("expiryDate").value;


    // Validation

    if (
        donorId === "" ||
        collectionDate === "" ||
        units === "" ||
        expiryDate === ""
    ) {

        alert(
            "Please fill all donation details."
        );

        return;
    }


    const donation = {

        donor: {
            id: Number(donorId)
        },

        collectionDate:
            collectionDate,

        units:
            Number(units),

        expiryDate:
            expiryDate

    };


    try {

        const response =
            await fetch(
                "/api/donations",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(donation)

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Donation could not be accepted."
            );

            return;
        }


        alert(
            "Donation recorded successfully!"
        );


        // Clear fields

        document.getElementById("donorId").value = "";

        document.getElementById("collectionDate").value = "";

        document.getElementById("donationUnits").value = "";

        document.getElementById("expiryDate").value = "";


        // Refresh dashboard

        loadDashboard();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server."
        );

    }

}



// =====================================================
// ISSUE BLOOD
// =====================================================

async function issueBlood() {

    const bloodGroup =
        document.getElementById("issueBloodGroup").value;


    const units =
        document.getElementById("issueUnits").value;


    // Validation

    if (
        bloodGroup === "" ||
        units === ""
    ) {

        alert(
            "Please select blood group and enter units."
        );

        return;
    }


    const issueRecord = {

        bloodGroup:
            bloodGroup,

        unitsIssued:
            Number(units)

    };


    try {

        const response =
            await fetch(
                "/api/issues",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(issueRecord)

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Blood could not be issued."
            );

            return;
        }


        alert(
            "Blood issued successfully!"
        );


        // Clear fields

        document.getElementById("issueBloodGroup").value = "";

        document.getElementById("issueUnits").value = "";


        // Refresh dashboard

        loadDashboard();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server."
        );

    }

}



// =====================================================
// QUICK ACTION BUTTONS
// =====================================================

function setupQuickActions() {

    const buttons =
        document.querySelectorAll(
            ".action-button"
        );


    if (buttons.length >= 4) {

        // Add Donor

        buttons[0].addEventListener(
            "click",
            function () {

                document
                    .getElementById("donors")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );


        // Record Donation

        buttons[1].addEventListener(
            "click",
            function () {

                document
                    .getElementById("donations")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );


        // View Inventory

        buttons[2].addEventListener(
            "click",
            function () {

                document
                    .getElementById("inventory")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );


        // Issue Blood

        buttons[3].addEventListener(
            "click",
            function () {

                document
                    .getElementById("issue")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    }

}



// =====================================================
// FORM BUTTONS
// =====================================================

function setupFormButtons() {

    const primaryButtons =
        document.querySelectorAll(
            ".primary-button"
        );


    if (primaryButtons.length >= 3) {

        // Add Donor

        primaryButtons[0].addEventListener(
            "click",
            addDonor
        );


        // Record Donation

        primaryButtons[1].addEventListener(
            "click",
            recordDonation
        );


        // Issue Blood

        primaryButtons[2].addEventListener(
            "click",
            issueBlood
        );

    }

}



// =====================================================
// INITIALIZE APPLICATION
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDashboard();

        setupQuickActions();

        setupFormButtons();

    }
);