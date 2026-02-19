const baseUrl = "/api/tasks";

function getAllTasks() {
    fetch(baseUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById("output").textContent = JSON.stringify(data, null, 2);
            renderTable(data);
        })
        .catch(error => {
            document.getElementById("output").textContent = "Error: " + error;
        });
}


function getTaskById() {
    const id = document.getElementById("taskId").value;

    if (!id) {
        alert("Please enter a Task ID");
        return;
    }

    fetch(`${baseUrl}/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Task not found or server error");
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("output").textContent =
                JSON.stringify(data, null, 2);
        })
        .catch(error => {
            document.getElementById("output").textContent =
                "Error: " + error.message;
        });
}

function createTask() {
    const taskName = document.getElementById("c_taskName").value.trim();
    if (!taskName) {
        alert("Task Name is required");
        return;
    }

    const payload = {
        taskName: taskName,
        description: document.getElementById("c_description").value.trim(),
        assignedUser: document.getElementById("c_assignedUser").value.trim(),
        dueDate: document.getElementById("c_dueDate").value || null,
        priority: document.getElementById("c_priority").value,
        status: document.getElementById("c_status").value
    };

    fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(async response => {
        const text = await response.text();
        if (!response.ok) throw new Error(text || "Failed to create task");
        return text ? JSON.parse(text) : {};
    })
    .then(data => {
        document.getElementById("output").textContent = JSON.stringify(data, null, 2);
		getAllTasks();

        // optional: refresh list automatically
        // getAllTasks();

        // clear some inputs
        document.getElementById("c_taskName").value = "";
        document.getElementById("c_description").value = "";
        document.getElementById("c_assignedUser").value = "";
        document.getElementById("c_dueDate").value = "";
        document.getElementById("c_priority").value = "MEDIUM";
        document.getElementById("c_status").value = "TODO";
    })
    .catch(error => {
        document.getElementById("output").textContent = "Error: " + error.message;
    });
}
function renderTable(tasks) {
    const body = document.getElementById("tasksBody");

    if (!Array.isArray(tasks) || tasks.length === 0) {
        body.innerHTML = `<tr><td colspan="7" class="muted">No tasks found.</td></tr>`;
        return;
    }

    body.innerHTML = tasks.map(t => `
        <tr>
            <td>${safe(t.id)}</td>
            <td>${safe(t.taskName)}</td>
            <td>${safe(t.assignedUser)}</td>
            <td>${safe(t.dueDate)}</td>
            <td>${safe(t.priority)}</td>
            <td>${safe(t.status)}</td>
            <td>
                <button class="btnSmall" onclick="getTaskByIdFromTable(${t.id})">View</button>
                <button class="btnSmall btnDanger" onclick="deleteTask(${t.id})">Delete</button>
            </td>
        </tr>
    `).join("");
}

function safe(v) {
    return (v === null || v === undefined || v === "") ? "-" : String(v);
}

function getTaskByIdFromTable(id) {
    fetch(`${baseUrl}/${id}`)
        .then(async response => {
            const text = await response.text();
            if (!response.ok) throw new Error(text || "Not found");
            return text ? JSON.parse(text) : {};
        })
        .then(data => {
            document.getElementById("output").textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            document.getElementById("output").textContent = "Error: " + error.message;
        });
}

function deleteTask(id) {
    if (!confirm(`Delete task #${id}?`)) return;

    fetch(`${baseUrl}/${id}`, { method: "DELETE" })
        .then(response => {
            if (response.status !== 204) throw new Error("Delete failed");
            // Refresh list after delete
            getAllTasks();
        })
        .catch(error => {
            document.getElementById("output").textContent = "Error: " + error.message;
        });
}
window.addEventListener("load", () => getAllTasks());
