
const DB_NAME = "DynamicAppDB";

let db;

const modal = document.getElementById("tableModal");

/* -----------------------------
   OPEN DATABASE
----------------------------- */

openDB();

function openDB(version) {

    const request = indexedDB.open(DB_NAME, version);

    request.onupgradeneeded = (e) => {
        db = e.target.result;
    };

    request.onsuccess = (e) => {

        db = e.target.result;

        console.log("Database Opened");

        loadTables();
    };

    request.onerror = (e) => {

        console.error(e);

        showToast("Database Error");
    };
}

/* -----------------------------
   LOAD TABLES
----------------------------- */

function loadTables() {

    const list = document.getElementById("tablesList");

    list.innerHTML = "";

    const stores = [...db.objectStoreNames];

    document.getElementById("tableCount").textContent =
        stores.length;

    if (stores.length === 0) {

        list.innerHTML =
            "<p>No tables found</p>";

        return;
    }

    stores.forEach(store => {

        const btn =
            document.createElement("button");

        btn.className = "table-btn";

        btn.textContent = store;

        btn.onclick = () => {

            document
                .querySelectorAll(".table-btn")
                .forEach(b =>
                    b.classList.remove("active")
                );

            btn.classList.add("active");

            showTable(store);
        };

        list.appendChild(btn);
    });
}

/* -----------------------------
   SHOW TABLE DATA
----------------------------- */

function showTable(storeName) {

    document.getElementById(
        "currentTableName"
    ).textContent = storeName;

    const tx =
        db.transaction(storeName, "readonly");

    const store =
        tx.objectStore(storeName);

    const request =
        store.getAll();

    request.onsuccess = () => {

        const data = request.result;

        document.getElementById(
            "recordCount"
        ).textContent =
            `Records: ${data.length}`;

        renderTable(data);
    };

    request.onerror = () => {

        showToast("Unable to load table");
    };
}

/* -----------------------------
   RENDER TABLE
----------------------------- */

function renderTable(data) {

    const thead =
        document.getElementById("tableHeader");

    const tbody =
        document.getElementById("tableBody");

    thead.innerHTML = "";
    tbody.innerHTML = "";

    if (!data || data.length === 0) {

        tbody.innerHTML = `
        <tr>
            <td colspan="100">
                No Records Found
            </td>
        </tr>
        `;

        return;
    }

    const keys =
        Object.keys(data[0]);

    const headerRow =
        document.createElement("tr");

    keys.forEach(key => {

        const th =
            document.createElement("th");

        th.textContent = key;

        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);

    data.forEach(row => {

        const tr =
            document.createElement("tr");

        keys.forEach(key => {

            const td =
                document.createElement("td");

            td.textContent =
                row[key] ?? "";

            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}

/* -----------------------------
   MODAL
----------------------------- */

document
.getElementById("btnOpenModal")
.onclick = () => {

    modal.classList.remove("hidden");
};

document
.getElementById("btnCloseModal")
.onclick = () => {

    modal.classList.add("hidden");
};

document
.getElementById("btnRefresh")
.onclick = () => {

    loadTables();
};

/* -----------------------------
   GENERATE GRID
----------------------------- */

document
.getElementById("btnGenerate")
.onclick = () => {

    const cols =
        parseInt(
            document.getElementById(
                "colCount"
            ).value
        );

    const rows =
        parseInt(
            document.getElementById(
                "rowCount"
            ).value
        );

    if (!cols || !rows) {

        showToast(
            "Enter rows and columns"
        );

        return;
    }

    let html =
        '<table class="grid-table">';

    for (let r = 0; r < rows; r++) {

        html += "<tr>";

        for (let c = 0; c < cols; c++) {

            html += `
            <td>
                <input
                    type="text"
                    class="grid-input"
                    data-row="${r}"
                    data-col="${c}"
                    placeholder="${
                        r === 0
                        ? "Header"
                        : "Value"
                    }"
                >
            </td>
            `;
        }

        html += "</tr>";
    }

    html += "</table>";

    document
        .getElementById(
            "gridContainer"
        )
        .innerHTML = html;
};

/* -----------------------------
   SAVE TABLE
----------------------------- */

document
.getElementById("btnSaveTable")
.onclick = () => {

    const tableName =
        document
        .getElementById(
            "tableName"
        )
        .value
        .trim();

    if (!tableName) {

        showToast(
            "Table name required"
        );

        return;
    }

    if (
        db.objectStoreNames.contains(
            tableName
        )
    ) {

        showToast(
            "Table already exists"
        );

        return;
    }

    const inputs =
        document.querySelectorAll(
            ".grid-input"
        );

    if (inputs.length === 0) {

        showToast(
            "Generate grid first"
        );

        return;
    }

    const rows = {};

    inputs.forEach(input => {

        const row =
            input.dataset.row;

        if (!rows[row]) {

            rows[row] = [];
        }

        rows[row].push(
            input.value.trim()
        );
    });

    const headers =
        rows[0];

    if (
        !headers ||
        headers.some(
            h => h === ""
        )
    ) {

        showToast(
            "All headers required"
        );

        return;
    }

    const keyPath =
        headers[0];

    if (!keyPath) {

        showToast(
            "First header required"
        );

        return;
    }

    const records = [];

    Object.keys(rows)
        .slice(1)
        .forEach(index => {

            const obj = {};

            headers.forEach(
                (header, i) => {

                obj[header] =
                    rows[index][i] || "";
            });

            records.push(obj);
        });

    db.close();

    const request =
        indexedDB.open(
            DB_NAME,
            db.version + 1
        );

    request.onupgradeneeded =
        (e) => {

        const newDB =
            e.target.result;

        if (
            !newDB
            .objectStoreNames
            .contains(tableName)
        ) {

            newDB.createObjectStore(
                tableName,
                {
                    keyPath
                }
            );
        }
    };

    request.onsuccess =
        (e) => {

        db = e.target.result;

        const tx =
            db.transaction(
                tableName,
                "readwrite"
            );

        const store =
            tx.objectStore(
                tableName
            );

        records.forEach(
            record => {

            store.put(record);
        });

        tx.oncomplete =
            () => {

            modal.classList.add(
                "hidden"
            );

            document
            .getElementById(
                "gridContainer"
            ).innerHTML = "";

            document
            .getElementById(
                "tableName"
            ).value = "";

            loadTables();

            showToast(
                "Table Created Successfully"
            );
        };
    };

    request.onerror =
        () => {

        showToast(
            "Table creation failed"
        );
    };
};

/* -----------------------------
   TOAST
----------------------------- */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );

    toast.textContent =
        message;

    toast.style.display =
        "block";

    setTimeout(() => {

        toast.style.display =
            "none";

    }, 3000);
}

