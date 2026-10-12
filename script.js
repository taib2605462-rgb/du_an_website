// Lấy các phần tử từ giao diện
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// Khi mở trang web lên, tải lại danh sách công việc đã lưu
document.addEventListener('DOMContentLoaded', loadTasks);

// Lắng nghe sự kiện click nút Thêm
addBtn.addEventListener('click', addTask);

function addTask() {
    const text = taskInput.value.trim();
    if (text === '') {
        alert('Vui lòng nhập tên công việc!');
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    createTaskElement(task);
    saveTaskToStorage(task);
    taskInput.value = '';
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    if (task.completed) li.classList.add('completed');

    const span = document.createElement('span');
    span.textContent = task.text;
    span.addEventListener('click', () => toggleTask(task.id, li));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Xóa';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => deleteTask(task.id, li));

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function toggleTask(id, element) {
    element.classList.toggle('completed');
    let tasks = getTasksFromStorage();
    tasks = tasks.map(task => {
        if (task.id === id) task.completed = !task.completed;
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTask(id, element) {
    element.remove();
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function saveTaskToStorage(task) {
    const tasks = getTasksFromStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function loadTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach(task => createTaskElement(task));
}