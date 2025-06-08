function updateDigit(digitId, newNumber) {
  const digit = document.getElementById(digitId);
  const card = digit.querySelector('.card');
  const front = card.querySelector('.card-front');
  const back = card.querySelector('.card-back');

  if (front.textContent === newNumber.toString()) return;

  back.textContent = newNumber;
  card.style.transform = 'rotateX(-180deg)';

  setTimeout(() => {
    front.textContent = newNumber;
    card.style.transform = 'rotateX(0deg)';
  }, 600);
}

function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  updateDigit('hour-tens', Math.floor(hours / 10));
  updateDigit('hour-ones', hours % 10);
  updateDigit('minute-tens', Math.floor(minutes / 10));
  updateDigit('minute-ones', minutes % 10);
}

function updateFullDate() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = now.toLocaleDateString('pt-BR', options);
  document.getElementById('full-date').textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
}

setInterval(updateClock, 1000);
updateClock();
updateFullDate();

// ---------------- Tarefas Diárias ----------------

let tasks = JSON.parse(localStorage.getItem('dailyTasks')) || [
  'Estudar Direito Constitucional',
  'Resolver 20 questões',
  'Revisar anotações',
];

let editing = false;
const taskList = document.getElementById('task-list');
const editBtn = document.getElementById('edit-btn');

function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item';

    if (editing) {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = task;
      input.addEventListener('input', (e) => {
        tasks[index] = e.target.value;
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '🗑';
      deleteBtn.onclick = () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      };

      li.appendChild(input);
      li.appendChild(deleteBtn);
    } else {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = false;

      const label = document.createElement('span');
      label.textContent = task;

      li.appendChild(checkbox);
      li.appendChild(label);
    }

    taskList.appendChild(li);
  });

  if (editing) {
    const newTaskLi = document.createElement('li');
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.placeholder = 'Nova tarefa...';
    newInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && e.target.value.trim() !== '') {
        tasks.push(e.target.value.trim());
        e.target.value = '';
        saveTasks();
        renderTasks();
      }
    });
    newTaskLi.appendChild(newInput);
    taskList.appendChild(newTaskLi);
  }
}

function saveTasks() {
  localStorage.setItem('dailyTasks', JSON.stringify(tasks));
}

editBtn.addEventListener('click', () => {
  editing = !editing;
  editBtn.textContent = editing ? '✅ Salvar Tarefas' : '✏️ Editar Tarefas';
  if (!editing) saveTasks();
  renderTasks();
});

renderTasks();

//Cronometro
let isRunning = false;
let elapsedTime = 0; // tempo em segundos
let timerInterval;

function updateTimerDisplay() {
  const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
  const seconds = (elapsedTime % 60).toString().padStart(2, '0');
  document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timerInterval = setInterval(() => {
      elapsedTime++;
      updateTimerDisplay();
    }, 1000);
  }
}

function pauseTimer() {
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  elapsedTime = 0;
  updateTimerDisplay();
}
updatePomodoroDisplay(); // Mostrar o tempo inicial

//Metodo de Estudo
function addStudyGoal() {
  const subject = document.getElementById('subject').value.trim();
  const method = document.getElementById('study-method').value;
  const real = document.getElementById('real-time').value;

  if (subject && planned) {
    const list = document.getElementById('goals-list');
    const li = document.createElement('li');
    
li.innerHTML = `
  <div><strong>${subject}</strong> | Método: ${method} | Realizado: ${real || 0} min</div>
  <div>
    <input type="checkbox" title="Concluído" />
    <button onclick="this.parentElement.parentElement.remove()">Remover</button>
  </div>
`;
}}

// Adiciona Metodos de Estudos
function addStudyGoal() {
  const subjectInput = document.getElementById('subject');
  const methodSelect = document.getElementById('study-method');
  const timeInput = document.getElementById('study-time');
  const goalsList = document.getElementById('goals-list');

  const subject = subjectInput.value.trim();
  const method = methodSelect.value;
  const time = timeInput.value;

  if (!subject || !method || !time) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  const li = document.createElement('li');
  li.innerHTML = `
    <div><strong>${subject}</strong> | Método: ${method} | Tempo: ${time} min</div>
    <div>
      <input type="checkbox" title="Concluído" />
      <button onclick="this.parentElement.parentElement.remove()">Remover</button>
    </div>
  `;

  goalsList.appendChild(li);

  // Limpa os campos
  subjectInput.value = '';
  methodSelect.value = '';
  timeInput.value = '';
}

function addMission() {
  const nameInput = document.getElementById('mission-name');
  const dateInput = document.getElementById('mission-date');
  const missionsList = document.getElementById('missions-list');

  const name = nameInput.value.trim();
  const date = dateInput.value;

  if (!name || !date) {
    alert('Preencha nome e data da prova.');
    return;
  }

  const li = document.createElement('li');
  li.innerHTML = `
    <div><strong>${name}</strong> | ${date}</div>
    <div>
      <button onclick="removeMission(this)">Apagar</button>
      <button onclick="registerMission(this)">Registrar</button>
    </div>
  `;

  missionsList.appendChild(li);

  // Limpar campos
  nameInput.value = '';
  dateInput.value = '';
}

function removeMission(btn) {
  btn.closest('li').remove();
}

function registerMission(btn) {
  const li = btn.closest('li');
  const historyList = document.getElementById('history-list');

  // Clonar o item para o histórico
  const clone = li.cloneNode(true);

  // Remover os botões do clone
  clone.querySelectorAll('button').forEach(b => b.remove());

  historyList.appendChild(clone);

  // Remover da lista original
  li.remove();
}
