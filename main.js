var inputElement = document.getElementById("input");
const button = document.getElementById("add");
let priority = document.getElementById("to-do");
let completed = document.getElementById("completed")

function createItem() {
    var newElement = document.createElement("ul");
    newElement.className = "todo-item"
    var inputValue = document.createTextNode(inputElement.value);
    newElement.appendChild(inputValue);
    var delButton = document.createElement('button');
    delButton.innerText = "🗑️";
    delButton.className = "del-button";
    var completeButton = document.createElement('button');
    completeButton.innerText = "✔";
    completeButton.className = "move-button";
    newElement.appendChild(delButton);
    newElement.appendChild(completeButton);
    newElement.className = "todo-item";

    priority.appendChild(newElement);
    inputElement.value = "";
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
            newItem.querySelector('.move-button').innerText = '✗';
        }
    });
}

window.addEventListener('load', loadToDoItems);

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
    }
    if (event.target.classList.contains('move-button')) {
        const todoItem = event.target.closest('.todo-item');
        const currentArticle = todoItem.closest('article');
        let moveButton = event.target;
        if (currentArticle.id === 'to-do') {
            completed.appendChild(todoItem);
            moveButton.innerText = "✗";
        } else {
            priority.appendChild(todoItem);
            moveButton.innerText = "✔";
        }
        saveToDoItems();
    }
});



