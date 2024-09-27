var inputElement = document.getElementById("input");
const button = document.getElementById("add");
let priority = document.getElementById("to-do");
let completed = document.getElementById("completed");
const progressBar = document.getElementById("progressBar");

const dueDateInput = document.getElementById("due-date");
const today = new Date().toISOString().split("T")[0];


function createItem() {
    var newElement = document.createElement("li");
    newElement.className = "todo-item"
    newElement.id = "priority";
    if (inputElement.value === "") {
        pass;
    } else {
        var inputValue = document.createTextNode(inputElement.value);
        newElement.appendChild(inputValue);
        var delButton = document.createElement('button');
        delButton.innerText = "🗑️";
        delButton.className = "del-button";
        var editButton = document.createElement('button');
        editButton.innerText = "✎"
        editButton.className = "edit-button";
        var completeButton = document.createElement('button');
        completeButton.innerText = "✔";
        completeButton.className = "move-button";
        newElement.appendChild(delButton);
        newElement.appendChild(editButton);
        newElement.appendChild(completeButton);
        
        const dueDate = document.getElementById("due-date").value;
        if (dueDate) {
            const dateElement = document.createElement('span');
            dateElement.textContent = `${dueDate}`
            newElement.appendChild(dateElement);

            // check whether the date is overdue (Should add a tag or something)
            if (dueDate < today) {
                const overDueTag = document.createElement('p');
                overDueTag.textContent = 'overdue';
                newElement.appendChild(overDueTag);
                newElement.classList.add('overdue');
            }
        }

        newElement.className = "todo-item";
        priority.appendChild(newElement);
        inputElement.value = "";
    }
    
    updateProgress();
}

function updateProgress() {
    const totalTasks = document.querySelectorAll('.todo-item').length;
    const completedTasks = document.querySelectorAll('#complete').length;

    if (totalTasks > 0) {
        const progress = (completedTasks / totalTasks) * 100;
        const progPer = progress + '%';
        progressBar.style.width = progPer;
        progressPercentage.textContent = Math.floor(progress) + "%";
    } else {
        progressBar.value = 0;
        progressPercentage.textContent = "0%";
    }
}

function editToDoItem(todoItem) {
    const textElement = todoItem.childNodes[0];
    const input = document.createElement('input');
    input.type = 'type';
    input.value = textElement.textContent;
    todoItem.replaceChild(input, textElement);

    input.focus();
    input.select();

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    todoItem.appendChild(saveButton);

    saveButton.addEventListener('click', () => {
        const newText = document.createTextNode(input.value);
        todoItem.replaceChild(newText, input);
        saveButton.remove();
        saveToDoItems();
    });
}

function moveToDoItem(todoItem, currentArticle, moveButton) {
    if (currentArticle.id === 'to-do') {
        completed.appendChild(todoItem);
        todoItem.id = "complete";
        moveButton.innerText = "✗";
    } else {
        priority.appendChild(todoItem);
        todoItem.id = "priority";
        moveButton.innerText = "✔";
    }
    saveToDoItems();
    updateProgress();
}

function saveToDoItems() {
    const items = [];
    document.querySelectorAll('.todo-item').forEach(item => {
        items.push({
            text: item.childNodes[0].textContent,
            completed: item.closest('article').id === "completed"
        });
    });
    localStorage.setItem('todos', JSON.stringify(items));
}

function loadToDoItems() {
    const items = JSON.parse(localStorage.getItem('todos') || '[]');
    items.forEach(item => {
        inputElement.value = item.text;
        createItem();
        if (item.completed) {
            const newItem = priority.querySelector('.todo-item:last-child');
            completed.appendChild(newItem);
            newItem.id = "complete";
            newItem.querySelector('.move-button').innerText = '✗';
        }
    });
    updateProgress();
}

window.addEventListener('load', () => {
    dueDateInput.min = today;
    loadToDoItems();
});

button.addEventListener('click', () => {
    createItem();
    saveToDoItems();
});
inputElement.addEventListener('keydown', function(event) {
    if (event.key == 'Enter') {
        createItem();
        saveToDoItems();
    }
});

document.querySelector('.container').addEventListener('click', function(event) {
    if (event.target.classList.contains('del-button')) {
        const todoItem = event.target.closest('.todo-item');
        todoItem.remove();
        saveToDoItems();
        updateProgress();
    }
    if (event.target.classList.contains('move-button')) {
        const todoItem = event.target.closest('.todo-item');
        const currentArticle = todoItem.closest('article');
        let moveButton = event.target;
        moveToDoItem(todoItem, currentArticle, moveButton);
    }
    if (event.target.classList.contains('edit-button')) {
        const todoItem = event.target.closest(".todo-item");
        editToDoItem(todoItem);
    }
});



