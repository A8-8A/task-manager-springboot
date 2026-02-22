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

// FIX: Added missing getTaskById() — was called in HTML but never defined
function getTaskById() {
    const id = document.getElementById("taskId").value.trim();
    if (!id) {
        alert("Please enter a Task ID");
        return;
    }
    getTaskByIdFromTable(id);
}

// FIX: Removed the duplicate definition below that had a syntax error (stray "f" before fetch)
function getTaskByIdFromTable(id) {
    fetch(`${baseUrl}/${id}`)
        .then(async response => {
            const text = await response.text();
            if (!response.ok) throw new Error(text || "Not found");
            return text ? JSON.parse(text) : {};
        })
        .then(task => {
            document.getElementById("output").textContent = JSON.stringify(task, null, 2);
            renderTable([task]); // show ONLY this task in table
        })
        .catch(error => {
            document.getElementById("output").textContent = "Error: " + error.message;
        });
}

function saveTask() {
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

    const editId = document.getElementById("edit_id").value;

    const url = editId ? `${baseUrl}/${editId}` : baseUrl;
    const method = editId ? "PUT" : "POST";

    fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(async response => {
        const text = await response.text();
        if (!response.ok) throw new Error(text || "Save failed");
        return text ? JSON.parse(text) : {};
    })
    .then(data => {
        document.getElementById("output").textContent = JSON.stringify(data, null, 2);
        cancelEdit();
        // Show only the newly created/updated task so the user can confirm it and see its ID
        renderTable([data]);
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
                <button class="btnSmall" onclick="startEdit(${t.id})">Edit</button>
                <button class="btnSmall btnDanger" onclick="deleteTask(${t.id})">Delete</button>
            </td>
        </tr>
    `).join("");
}

function safe(v) {
    return (v === null || v === undefined || v === "") ? "-" : String(v);
}

function startEdit(id) {
    fetch(`${baseUrl}/${id}`)
        .then(async response => {
            const text = await response.text();
            if (!response.ok) throw new Error(text || "Not found");
            return text ? JSON.parse(text) : {};
        })
        .then(task => {
            document.getElementById("edit_id").value = task.id;
            document.getElementById("c_taskName").value = task.taskName ?? "";
            document.getElementById("c_description").value = task.description ?? "";
            document.getElementById("c_assignedUser").value = task.assignedUser ?? "";
            document.getElementById("c_dueDate").value = task.dueDate ?? "";
            document.getElementById("c_priority").value = task.priority ?? "MEDIUM";
            document.getElementById("c_status").value = task.status ?? "TODO";
            document.getElementById("saveBtn").textContent = "Update Task";
            renderTable([task]);
        })
        .catch(error => {
            document.getElementById("output").textContent = "Error: " + error.message;
        });
}

function cancelEdit() {
    document.getElementById("edit_id").value = "";
    document.getElementById("saveBtn").textContent = "Create Task";
    document.getElementById("c_taskName").value = "";
    document.getElementById("c_description").value = "";
    document.getElementById("c_assignedUser").value = "";
    document.getElementById("c_dueDate").value = "";
    document.getElementById("c_priority").value = "MEDIUM";
    document.getElementById("c_status").value = "TODO";
}

function deleteTask(id) {
    if (!confirm(`Delete task #${id}?`)) return;

    fetch(`${baseUrl}/${id}`, { method: "DELETE" })
        .then(response => {
            if (response.status !== 204) throw new Error("Delete failed");
            getAllTasks();
        })
        .catch(error => {
            document.getElementById("output").textContent = "Error: " + error.message;
        });
}