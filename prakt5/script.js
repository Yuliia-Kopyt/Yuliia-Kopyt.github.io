const input = document.getElementById("todoInput");
const list = document.getElementById("todoList");
const allBtn = document.getElementById("allBtn");
const activeBtn = document.getElementById("activeBtn");
const completedBtn = document.getElementById("completedBtn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "all";

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function formatDate(date) {
    return date.toLocaleDateString("uk-UA") + ", " + date.toLocaleTimeString("uk-UA", { hour: '2-digit', minute: '2-digit' });
}

function renderTodos() {
    list.innerHTML = "";

    todos
        .filter(todo => {
            if (filter === "active") return !todo.completed;
            if (filter === "completed") return todo.completed;
            return true;
        })
        .forEach((todo, index) => {
            const li = document.createElement("li");

            if (!todo.completed) {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.addEventListener("change", () => {
                    todo.completed = true;
                    saveTodos();
                    renderTodos();
                });
                li.appendChild(checkbox);
            }

            const span = document.createElement("span");
            span.className = "todo-text" + (todo.completed ? " completed" : "");
            span.textContent = `${todo.text} (${todo.date})`;

            span.addEventListener("dblclick", () => editTodo(span, index));
            li.appendChild(span);

            const del = document.createElement("span");
            del.className = "delete";
            del.textContent = "✖";
            del.addEventListener("click", () => {
                todos.splice(index, 1);
                saveTodos();
                renderTodos();
            });

            li.appendChild(del);
            list.appendChild(li);
        });
}

function editTodo(span, index) {
    const inputEdit = document.createElement("input");
    inputEdit.type = "text";
    inputEdit.value = todos[index].text;

    inputEdit.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            todos[index].text = inputEdit.value;
            saveTodos();
            renderTodos();
        }
    });

    span.replaceWith(inputEdit);
    inputEdit.focus();
}

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim() !== "") {
        todos.push({
            text: input.value,
            completed: false,
            date: formatDate(new Date())
        });
        input.value = "";
        saveTodos();
        renderTodos();
    }
});

allBtn.onclick = () => { filter = "all"; renderTodos(); };
activeBtn.onclick = () => { filter = "active"; renderTodos(); };
completedBtn.onclick = () => { filter = "completed"; renderTodos(); };

renderTodos();
