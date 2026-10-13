const taskInput = document.getElementById('taskInput');
const categorySelect = document.getElementById('categorySelect');
const customCategoryInput = document.getElementById('customCategoryInput');
const prioritySelect = document.getElementById('prioritySelect');
const taskDateInput = document.getElementById('taskDate');
const taskStartHour = document.getElementById('taskStartHour');
const taskStartMinute = document.getElementById('taskStartMinute');
const taskEndHour = document.getElementById('taskEndHour');
const taskEndMinute = document.getElementById('taskEndMinute');
const taskReminder = document.getElementById('taskReminder');
const repeatSelect = document.getElementById('repeatSelect');
const repeatDaysGroup = document.getElementById('repeatDaysGroup');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const statsDisplay = document.getElementById('statsDisplay');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const categoryFilter = document.getElementById('categoryFilter');
const priorityFilter = document.getElementById('priorityFilter');
const dateFilter = document.getElementById('dateFilter');
const taskFormTitle = document.getElementById('taskFormTitle');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const recurringScopeDialog = document.getElementById('recurringScopeDialog');
const recurringScopeSelect = document.getElementById('recurringScopeSelect');
const scopeDialogTitle = document.getElementById('scopeDialogTitle');

const monthYearDisplay = document.getElementById('monthYearDisplay');
const calendarDays = document.getElementById('calendarDays');
const calendarWeekdays = document.getElementById('calendarWeekdays');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const todayBtn = document.getElementById('todayBtn');
const calendarViewSelect = document.getElementById('calendarViewSelect');
const calendarLegend = document.getElementById('calendarLegend');
const upcomingList = document.getElementById('upcomingList');
const upcomingCount = document.getElementById('upcomingCount');

const timerDisplay = document.getElementById('timerDisplay');
const customMinutesInput = document.getElementById('customMinutes');
const startTimerBtn = document.getElementById('startTimerBtn');
const pauseTimerBtn = document.getElementById('pauseTimerBtn');
const resetTimerBtn = document.getElementById('resetTimerBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const tabBtns = document.querySelectorAll('.tab-btn');
const musicFileInput = document.getElementById('musicFileInput');
const musicTrackName = document.getElementById('musicTrackName');
const musicPlayer = document.getElementById('musicPlayer');
const musicControlBox = document.getElementById('musicControlBox');
const musicPlayPauseBtn = document.getElementById('musicPlayPauseBtn');
const musicSeek = document.getElementById('musicSeek');
const musicCurrentTime = document.getElementById('musicCurrentTime');
const musicDuration = document.getElementById('musicDuration');
const musicVolume = document.getElementById('musicVolume');
const musicVolumeControl = document.getElementById('musicVolumeControl');
const showMiniMusicBtn = document.getElementById('showMiniMusicBtn');
const musicPlayerSlot = document.getElementById('musicPlayerSlot');
const miniMusic = document.getElementById('miniMusic');
const miniMusicTrackName = document.getElementById('miniMusicTrackName');
const miniMusicPlayerSlot = document.getElementById('miniMusicPlayerSlot');
const miniMusicCloseBtn = document.getElementById('miniMusicCloseBtn');
const miniTimer = document.getElementById('miniTimer');
const miniTimerDisplay = document.getElementById('miniTimerDisplay');
const miniTimerOpenBtn = miniTimerDisplay;
const miniTimerPauseBtn = document.getElementById('miniTimerPauseBtn');
const miniTimerCloseBtn = document.getElementById('miniTimerCloseBtn');
const backgroundFileInput = document.getElementById('backgroundFileInput');
const backgroundFileName = document.getElementById('backgroundFileName');
const backgroundOverlayInput = document.getElementById('backgroundOverlayInput');
const backgroundOverlayValue = document.getElementById('backgroundOverlayValue');
const resetBackgroundBtn = document.getElementById('resetBackgroundBtn');
const breakMinutesInput = document.getElementById('breakMinutes');
const timerPhaseDisplay = document.getElementById('timerPhase');
const pomodoroStatsDisplay = document.getElementById('pomodoroStats');
const exportTasksBtn = document.getElementById('exportTasksBtn');
const importTasksInput = document.getElementById('importTasksInput');
const enableNotificationsBtn = document.getElementById('enableNotificationsBtn');
const notificationStatus = document.getElementById('notificationStatus');

let timerInterval = null;
let timeLeft = 25 * 60;
let timerEndTime = null;
let timerPhase = 'focus';
let currentFilter = 'all';
let currentDate = new Date();
let calendarView = 'month';
let musicObjectUrl = null;
let currentMusicFile = null;
let backgroundObjectUrl = null;
let editingTaskId = null;
let musicSaveTimeout = null;
const sentReminderKeys = new Set(JSON.parse(localStorage.getItem('sentTaskReminders') || '[]'));
const pageTitle = document.title;
const backgroundDatabaseName = 'tech-task-preferences';
const backgroundStoreName = 'settings';

document.addEventListener('DOMContentLoaded', () => {
    taskDateInput.value = formatDate(new Date());
    populateTimeOptions();
    populateCategoryFilter();
    loadTasks();
    updateTimerDisplay();
    refreshTimer();
    updatePomodoroStats();
    initTheme();
    initBackgroundSettings();
    initSavedMusic();
    initNotifications();
    renderCalendar();
});

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(tab => {
            const isActive = tab === btn;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', String(isActive));
        });
        document.querySelectorAll('.tab-panel').forEach(panel => {
            const isActive = panel.id === btn.dataset.tab;
            panel.classList.toggle('active', isActive);
            panel.hidden = !isActive;
        });
    });
});

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeToggleLabel(isDark);
});

function initTheme() {
    const isDark = localStorage.getItem('theme') === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    updateThemeToggleLabel(isDark);
}

function updateThemeToggleLabel(isDark) {
    themeToggleBtn.textContent = isDark ? '☀️ Chế độ sáng' : '🌙 Chế độ tối';
    themeToggleBtn.setAttribute('aria-label', isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối');
}

prevMonthBtn.addEventListener('click', () => {
    moveCalendar(-1);
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    moveCalendar(1);
    renderCalendar();
});

todayBtn.addEventListener('click', () => {
    currentDate = new Date();
    renderCalendar();
});

calendarViewSelect.addEventListener('change', () => {
    calendarView = calendarViewSelect.value;
    renderCalendar();
});

function moveCalendar(direction) {
    if (calendarView === 'day') {
        currentDate.setDate(currentDate.getDate() + direction);
    } else if (calendarView === 'week') {
        currentDate.setDate(currentDate.getDate() + direction * 7);
    } else {
        currentDate.setDate(1);
        currentDate.setMonth(currentDate.getMonth() + direction);
    }
}

function renderCalendar() {
    calendarDays.innerHTML = '';
    const tasks = getTasksFromStorage();
    calendarViewSelect.value = calendarView;
    calendarWeekdays.hidden = calendarView !== 'month';
    calendarDays.className = `calendar-days calendar-${calendarView}-view`;

    if (calendarView === 'month') renderMonthCalendar(tasks);
    else renderTimedCalendar(tasks);
    renderCalendarLegend(tasks);
    renderUpcomingTasks(tasks);
}

function renderMonthCalendar(tasks) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthYearDisplay.textContent = `Tháng ${month + 1} / ${year}`;

    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
    const totalDays = new Date(year, month + 1, 0).getDate();
    const monthTasks = getCalendarTasks(tasks, year, month);

    for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'day-cell empty';
        calendarDays.appendChild(emptyCell);
    }

    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(year, month, day);
        const dateString = formatDate(date);
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';
        dayCell.classList.toggle('today', isSameDate(date, new Date()));
        dayCell.setAttribute('role', 'button');
        dayCell.tabIndex = 0;
        dayCell.setAttribute('aria-label', `Tạo công việc ngày ${date.toLocaleDateString('vi-VN')}`);
        dayCell.addEventListener('click', () => quickAddTask(dateString));
        dayCell.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                quickAddTask(dateString);
            }
        });

        const dayNum = document.createElement('span');
        dayNum.className = 'day-number';
        dayNum.textContent = day;
        dayCell.appendChild(dayNum);

        monthTasks.filter(task => task.dueDate === dateString).forEach(task => {
            dayCell.appendChild(createCalendarEvent(task));
        });
        calendarDays.appendChild(dayCell);
    }
}

function renderTimedCalendar(tasks) {
    const dates = [];
    if (calendarView === 'day') {
        dates.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));
    } else {
        const monday = new Date(currentDate);
        monday.setHours(0, 0, 0, 0);
        monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            dates.push(date);
        }
    }

    const rangeStart = dates[0];
    const rangeEnd = dates[dates.length - 1];
    const visibleTasks = getCalendarTasksInRange(tasks, rangeStart, rangeEnd);
    monthYearDisplay.textContent = calendarView === 'day'
        ? currentDate.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        : `${rangeStart.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })} – ${rangeEnd.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' })}`;

    const weekView = document.createElement('div');
    weekView.className = 'week-view';
    const columns = calendarView === 'day' ? 1 : 7;
    weekView.style.setProperty('--calendar-day-count', columns);
    weekView.style.setProperty('--calendar-grid-columns', `48px repeat(${columns}, minmax(${columns === 1 ? '220px' : '90px'}, 1fr))`);

    const header = document.createElement('div');
    header.className = 'week-head';
    header.style.gridTemplateColumns = `var(--calendar-grid-columns)`;
    header.appendChild(document.createElement('div'));
    dates.forEach(date => {
        const heading = document.createElement('button');
        heading.type = 'button';
        heading.className = 'week-day-heading';
        heading.classList.toggle('today', isSameDate(date, new Date()));
        heading.innerHTML = `<span>${date.toLocaleDateString('vi-VN', { weekday: 'short' })}</span><strong>${date.getDate()}</strong>`;
        heading.addEventListener('click', () => quickAddTask(formatDate(date)));
        header.appendChild(heading);
    });
    weekView.appendChild(header);

    const body = document.createElement('div');
    body.className = 'week-body';
    body.style.gridTemplateColumns = `var(--calendar-grid-columns)`;
    const timeAxis = document.createElement('div');
    timeAxis.className = 'week-time-axis';
    const allDayLabel = document.createElement('span');
    allDayLabel.className = 'week-all-day-label';
    allDayLabel.textContent = 'Cả ngày';
    timeAxis.appendChild(allDayLabel);
    for (let hour = 0; hour < 24; hour++) {
        const label = document.createElement('span');
        label.className = 'week-hour-label';
        label.textContent = `${String(hour).padStart(2, '0')}:00`;
        timeAxis.appendChild(label);
    }
    body.appendChild(timeAxis);

    dates.forEach(date => {
        const dateString = formatDate(date);
        const dayColumn = document.createElement('div');
        dayColumn.className = 'week-day-column';
        dayColumn.classList.toggle('today', isSameDate(date, new Date()));

        const allDay = document.createElement('div');
        allDay.className = 'week-all-day';
        visibleTasks.filter(task => task.dueDate === dateString && !task.startTime).forEach(task => {
            allDay.appendChild(createCalendarEvent(task));
        });
        dayColumn.appendChild(allDay);

        const timeline = document.createElement('div');
        timeline.className = 'week-timeline';
        timeline.dataset.date = dateString;
        for (let hour = 0; hour < 24; hour++) {
            const slot = document.createElement('button');
            slot.type = 'button';
            slot.className = 'week-time-slot';
            slot.setAttribute('aria-label', `Tạo công việc ${dateString} lúc ${String(hour).padStart(2, '0')}:00`);
            slot.style.top = `${(hour / 24) * 100}%`;
            slot.style.height = `${100 / 24}%`;
            slot.addEventListener('click', () => quickAddTask(dateString, `${String(hour).padStart(2, '0')}:00`));
            timeline.appendChild(slot);
        }

        visibleTasks.filter(task => task.dueDate === dateString && task.startTime).forEach(task => {
            timeline.appendChild(createTimedCalendarEvent(task));
        });
        dayColumn.appendChild(timeline);
        body.appendChild(dayColumn);
    });
    weekView.appendChild(body);
    calendarDays.appendChild(weekView);
}

function getCalendarTasksInRange(tasks, start, end) {
    const rangeTasks = [];
    const month = new Date(start.getFullYear(), start.getMonth(), 1);
    const lastMonth = new Date(end.getFullYear(), end.getMonth(), 1);
    while (month <= lastMonth) {
        rangeTasks.push(...getCalendarTasks(tasks, month.getFullYear(), month.getMonth()));
        month.setMonth(month.getMonth() + 1);
    }
    const firstDate = formatDate(start);
    const lastDate = formatDate(end);
    return rangeTasks.filter(task => task.dueDate >= firstDate && task.dueDate <= lastDate);
}

function createCalendarEvent(task) {
    const event = document.createElement('div');
    event.className = 'calendar-event';
    if (task.completed) event.classList.add('completed');
    if (hasRepeat(task)) event.classList.add('repeating-event');
    event.style.backgroundColor = getCategoryColor(task.category);
    event.title = `${task.text}${hasRepeat(task) ? ` - ${getRepeatLabel(task)}` : ''}`;
    const name = document.createElement('span');
    name.className = 'calendar-event-name';
    name.textContent = `${hasRepeat(task) ? '↻ ' : ''}${task.text}`;
    event.appendChild(name);
    if (task.startTime || task.endTime) {
        const time = document.createElement('span');
        time.className = 'calendar-event-time';
        time.textContent = [task.startTime, task.endTime].filter(Boolean).join('–');
        event.appendChild(time);
    }
    return event;
}

function createTimedCalendarEvent(task) {
    const event = createCalendarEvent(task);
    event.classList.add('timed-calendar-event');
    const start = timeToMinutes(task.startTime);
    const end = Math.max(start + 30, task.endTime ? timeToMinutes(task.endTime) : start + 60);
    const visibleStart = Math.max(0, start);
    const visibleEnd = Math.min(24 * 60, end);
    event.style.top = `${(visibleStart / (24 * 60)) * 100}%`;
    event.style.height = `${Math.max(2.2, ((visibleEnd - visibleStart) / (24 * 60)) * 100)}%`;
    return event;
}

function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function getCategoryColor(category) {
    const knownColors = {
        'Học tập': 211,
        'Việc nhà': 145,
        'Giải trí': 282
    };
    let hue = knownColors[category];
    if (hue === undefined) {
        let hash = 2166136261;
        for (const character of category || '') {
            hash ^= character.charCodeAt(0);
            hash = Math.imul(hash, 16777619);
        }
        hue = (hash >>> 0) % 360;
    }
    return `hsl(${hue} 62% 36%)`;
}

function renderCalendarLegend(tasks) {
    calendarLegend.replaceChildren();
    [...new Set(tasks.map(task => task.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'vi')).forEach(category => {
        const item = document.createElement('span');
        item.className = 'calendar-legend-item';
        const swatch = document.createElement('i');
        swatch.style.backgroundColor = getCategoryColor(category);
        item.append(swatch, document.createTextNode(category));
        calendarLegend.appendChild(item);
    });
}

function quickAddTask(date, startTime = '') {
    if (editingTaskId !== null) {
        const shouldDiscard = confirm('Bỏ chỉnh sửa hiện tại để tạo công việc từ lịch?');
        if (!shouldDiscard) return;
        resetTaskForm();
    }
    taskDateInput.value = date;
    resetTimeSelects();
    if (startTime) {
        const [hour, minute] = startTime.split(':');
        const endMinutes = Number(hour) * 60 + Number(minute) + 60;
        setTimeSelects(startTime, taskStartHour, taskStartMinute);
        if (endMinutes < 24 * 60) {
            setTimeSelects(`${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`, taskEndHour, taskEndMinute);
        }
    }
    document.querySelector('.input-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    taskInput.focus({ preventScroll: true });
}

function isSameDate(first, second) {
    return first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate();
}

function renderUpcomingTasks(tasks) {
    upcomingList.replaceChildren();
    const now = new Date();
    const rangeEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6);
    const upcomingTasks = getCalendarTasksInRange(tasks, new Date(now.getFullYear(), now.getMonth(), now.getDate()), rangeEnd)
        .filter(task => !task.completed && isUpcomingTask(task, now))
        .sort((a, b) => {
            const dateOrder = a.dueDate.localeCompare(b.dueDate);
            return dateOrder || (a.startTime || '').localeCompare(b.startTime || '') || a.text.localeCompare(b.text, 'vi');
        })
        .slice(0, 6);

    upcomingCount.textContent = String(upcomingTasks.length);
    if (!upcomingTasks.length) {
        const empty = document.createElement('li');
        empty.className = 'upcoming-empty';
        empty.textContent = 'Chưa có công việc nào trong 7 ngày tới.';
        upcomingList.appendChild(empty);
        return;
    }

    upcomingTasks.forEach(task => {
        const item = document.createElement('li');
        item.className = 'upcoming-item';
        const color = document.createElement('span');
        color.className = 'upcoming-color';
        color.style.backgroundColor = getCategoryColor(task.category);

        const details = document.createElement('div');
        details.className = 'upcoming-details';
        const name = document.createElement('strong');
        name.textContent = task.text;
        const when = document.createElement('span');
        when.textContent = `${formatUpcomingDate(task.dueDate)}${task.startTime ? ` · ${task.startTime}` : ' · Cả ngày'}`;
        details.append(name, when);

        const viewButton = document.createElement('button');
        viewButton.type = 'button';
        viewButton.className = 'upcoming-open-btn';
        viewButton.textContent = 'Xem';
        viewButton.addEventListener('click', () => {
            const [year, month, day] = task.dueDate.split('-').map(Number);
            currentDate = new Date(year, month - 1, day);
            calendarView = 'day';
            renderCalendar();
            document.querySelector('.calendar-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        item.append(color, details, viewButton);
        upcomingList.appendChild(item);
    });
}

function isUpcomingTask(task, now) {
    if (!task.dueDate) return false;
    if (task.dueDate > formatDate(now)) return true;
    if (task.dueDate < formatDate(now) || !task.startTime) return task.dueDate === formatDate(now);
    const endTime = task.endTime || task.startTime;
    return endTime >= `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function formatUpcomingDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    if (isSameDate(date, today)) return 'Hôm nay';
    if (isSameDate(date, tomorrow)) return 'Ngày mai';
    return date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'short' });
}

function getCalendarTasks(tasks, year, month) {
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);
    const calendarTasks = tasks.filter(task => !hasRepeat(task));
    const recurringGroups = new Map();

    tasks.filter(hasRepeat).forEach(task => {
        const seriesId = task.seriesId ?? task.id;
        if (!recurringGroups.has(seriesId)) recurringGroups.set(seriesId, []);
        recurringGroups.get(seriesId).push(task);
    });

    recurringGroups.forEach(seriesTasks => {
        const datedTasks = seriesTasks
            .filter(task => task.dueDate)
            .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
        const template = datedTasks[0] || seriesTasks[0];
        if (!template.dueDate) return;

        const actualByDate = new Map();
        datedTasks.forEach(task => {
            if (!actualByDate.has(task.dueDate)) actualByDate.set(task.dueDate, task);
        });

        const firstDate = new Date(`${template.dueDate}T00:00:00`);
        let occurrenceDate = new Date(Math.max(monthStart.getTime(), firstDate.getTime()));
        occurrenceDate.setHours(0, 0, 0, 0);
        while (occurrenceDate <= monthEnd) {
            if (getRepeatDays(template).includes(occurrenceDate.getDay())) {
                const dateString = formatDate(occurrenceDate);
                calendarTasks.push({
                    ...template,
                    ...(actualByDate.get(dateString) || {}),
                    dueDate: dateString
                });
            }
            occurrenceDate.setDate(occurrenceDate.getDate() + 1);
        }
    });

    return calendarTasks;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function resetTimerToCustom() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerEndTime = null;
    timerPhase = 'focus';
    timeLeft = getPhaseDuration('focus') * 60;
    localStorage.removeItem('pomodoroEndTime');
    localStorage.removeItem('pomodoroMiniHidden');
    localStorage.removeItem('pomodoroPausedTimeLeft');
    localStorage.removeItem('pomodoroPausedPhase');
    localStorage.setItem('pomodoroPhase', 'focus');
    miniTimer.hidden = true;
    document.title = pageTitle;
    updateTimerDisplay();
}

customMinutesInput.addEventListener('change', resetTimerToCustom);
breakMinutesInput.addEventListener('change', () => {
    if (timerEndTime === null && timerPhase === 'break') resetTimerToCustom();
});

startTimerBtn.addEventListener('click', () => {
    refreshTimer();
    if (timerEndTime !== null) return;
    const pausedPhase = localStorage.getItem('pomodoroPausedPhase');
    const pausedTimeLeft = Number(localStorage.getItem('pomodoroPausedTimeLeft'));
    if (pausedPhase === 'focus' || pausedPhase === 'break') timerPhase = pausedPhase;
    if (pausedTimeLeft > 0) timeLeft = pausedTimeLeft;
    else timeLeft = getPhaseDuration(timerPhase) * 60;
    timerEndTime = Date.now() + timeLeft * 1000;
    localStorage.removeItem('pomodoroMiniHidden');
    localStorage.removeItem('pomodoroPausedTimeLeft');
    localStorage.removeItem('pomodoroPausedPhase');
    localStorage.setItem('pomodoroPhase', timerPhase);
    localStorage.setItem('pomodoroEndTime', String(timerEndTime));
    refreshTimer();
});

pauseTimerBtn.addEventListener('click', () => {
    refreshTimer();
    if (timerEndTime === null) return;
    localStorage.setItem('pomodoroPausedTimeLeft', String(timeLeft));
    localStorage.setItem('pomodoroPausedPhase', timerPhase);
    clearInterval(timerInterval);
    timerInterval = null;
    timerEndTime = null;
    localStorage.removeItem('pomodoroEndTime');
    miniTimer.hidden = localStorage.getItem('pomodoroMiniHidden') === 'true';
    document.title = pageTitle;
});

resetTimerBtn.addEventListener('click', resetTimerToCustom);

function updateTimerDisplay() {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    const display = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    timerDisplay.textContent = display;
    miniTimerDisplay.textContent = display;
    timerPhaseDisplay.textContent = timerPhase === 'focus' ? 'Phiên tập trung' : 'Giờ nghỉ';
    miniTimer.querySelector('.mini-timer-label').textContent = timerPhase === 'focus' ? 'Đang tập trung' : 'Đang nghỉ';
}

function getPhaseDuration(phase) {
    const input = phase === 'focus' ? customMinutesInput : breakMinutesInput;
    const maximum = phase === 'focus' ? 180 : 60;
    const minutes = Number.parseInt(input.value, 10);
    if (!Number.isFinite(minutes) || minutes < 1 || minutes > maximum) {
        const corrected = Math.min(maximum, Math.max(1, Number.isFinite(minutes) ? minutes : 1));
        input.value = String(corrected);
        return corrected;
    }
    return minutes;
}

function recordFocusSession() {
    const date = formatDate(new Date());
    const stats = JSON.parse(localStorage.getItem('pomodoroStats') || '{}');
    const todayStats = stats[date] || { sessions: 0, minutes: 0 };
    todayStats.sessions += 1;
    todayStats.minutes += getPhaseDuration('focus');
    stats[date] = todayStats;
    localStorage.setItem('pomodoroStats', JSON.stringify(stats));
    updatePomodoroStats();
}

function updatePomodoroStats() {
    const stats = JSON.parse(localStorage.getItem('pomodoroStats') || '{}');
    const todayStats = stats[formatDate(new Date())] || { sessions: 0, minutes: 0 };
    pomodoroStatsDisplay.textContent = `Hôm nay: ${todayStats.sessions} phiên · ${todayStats.minutes} phút tập trung`;
}

function notifyUser(title, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        try {
            new Notification(title, { body: message });
            return true;
        } catch (error) {
            console.error('Không thể hiển thị thông báo:', error);
        }
    }
    return false;
}

function completeTimerPhase(completedEndTime) {
    if (Number(localStorage.getItem('pomodoroEndTime')) !== completedEndTime) return;

    clearInterval(timerInterval);
    timerInterval = null;
    if (timerPhase === 'focus') {
        recordFocusSession();
        timerPhase = 'break';
        notifyUser('Phiên tập trung hoàn thành', 'Đến giờ nghỉ ngắn rồi!');
    } else {
        timerPhase = 'focus';
        notifyUser('Hết giờ nghỉ', 'Bắt đầu phiên tập trung tiếp theo.');
    }
    timeLeft = getPhaseDuration(timerPhase) * 60;
    timerEndTime = Date.now() + timeLeft * 1000;
    localStorage.setItem('pomodoroPhase', timerPhase);
    localStorage.setItem('pomodoroEndTime', String(timerEndTime));
    localStorage.removeItem('pomodoroMiniHidden');
    miniTimer.hidden = false;
    updateTimerDisplay();
    startTimerInterval();
}

function refreshTimer() {
    const storedEndTime = Number(localStorage.getItem('pomodoroEndTime'));
    if (!storedEndTime) {
        clearInterval(timerInterval);
        timerInterval = null;
        timerEndTime = null;
        const pausedTimeLeft = Number(localStorage.getItem('pomodoroPausedTimeLeft'));
        const pausedPhase = localStorage.getItem('pomodoroPausedPhase');
        if (pausedTimeLeft > 0 && (pausedPhase === 'focus' || pausedPhase === 'break')) {
            timeLeft = pausedTimeLeft;
            timerPhase = pausedPhase;
        } else {
            timerPhase = localStorage.getItem('pomodoroPhase') === 'break' ? 'break' : 'focus';
            timeLeft = getPhaseDuration(timerPhase) * 60;
        }
        miniTimer.hidden = true;
        document.title = pageTitle;
        updateTimerDisplay();
        return;
    }

    timerPhase = localStorage.getItem('pomodoroPhase') === 'break' ? 'break' : 'focus';
    timerEndTime = storedEndTime;
    timeLeft = Math.max(0, Math.ceil((timerEndTime - Date.now()) / 1000));
    updateTimerDisplay();
    miniTimer.hidden = localStorage.getItem('pomodoroMiniHidden') === 'true';
    document.title = `(${timerDisplay.textContent}) Pomodoro - ${pageTitle}`;

    if (timeLeft === 0) {
        completeTimerPhase(storedEndTime);
        return;
    }

    startTimerInterval();
}

function startTimerInterval() {
    if (timerInterval === null) timerInterval = setInterval(refreshTimer, 250);
}

miniTimerOpenBtn.addEventListener('click', () => {
    document.getElementById('timerTab').click();
});
miniTimerPauseBtn.addEventListener('click', () => pauseTimerBtn.click());
miniTimerCloseBtn.addEventListener('click', () => {
    localStorage.setItem('pomodoroMiniHidden', 'true');
    miniTimer.hidden = true;
});
document.addEventListener('visibilitychange', refreshTimer);
window.addEventListener('storage', event => {
    if (event.key === 'pomodoroEndTime') refreshTimer();
});

function openBackgroundDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(backgroundDatabaseName, 1);
        request.onupgradeneeded = () => {
            if (!request.result.objectStoreNames.contains(backgroundStoreName)) {
                request.result.createObjectStore(backgroundStoreName);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('Không thể mở bộ nhớ hình nền.'));
    });
}

async function readBackgroundImage() {
    const database = await openBackgroundDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(backgroundStoreName, 'readonly');
        const request = transaction.objectStore(backgroundStoreName).get('backgroundImage');
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error || new Error('Không thể đọc hình nền đã lưu.'));
        transaction.oncomplete = () => database.close();
        transaction.onerror = () => {
            database.close();
            reject(transaction.error || new Error('Không thể đọc hình nền đã lưu.'));
        };
    });
}

async function readSavedMusic() {
    const database = await openBackgroundDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(backgroundStoreName, 'readonly');
        const request = transaction.objectStore(backgroundStoreName).get('musicFile');
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error || new Error('Không thể đọc tệp nhạc đã lưu.'));
        transaction.oncomplete = () => database.close();
        transaction.onerror = () => {
            database.close();
            reject(transaction.error || new Error('Không thể đọc tệp nhạc đã lưu.'));
        };
    });
}

async function writeSavedMusic(file, playback = {}) {
    const database = await openBackgroundDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(backgroundStoreName, 'readwrite');
        transaction.objectStore(backgroundStoreName).put({
            file,
            name: file.name,
            currentTime: playback.currentTime ?? 0,
            volume: playback.volume ?? musicPlayer.volume,
            wasPlaying: playback.wasPlaying ?? !musicPlayer.paused
        }, 'musicFile');
        transaction.oncomplete = () => {
            database.close();
            resolve();
        };
        transaction.onerror = () => {
            database.close();
            reject(transaction.error || new Error('Không thể lưu tệp nhạc.'));
        };
        transaction.onabort = () => {
            database.close();
            reject(transaction.error || new Error('Không thể lưu tệp nhạc.'));
        };
    });
}

function setMusicFile(file, name = file.name) {
    moveMusicPlayerToMainTab();
    if (musicObjectUrl) URL.revokeObjectURL(musicObjectUrl);
    currentMusicFile = file;
    musicObjectUrl = URL.createObjectURL(file);
    musicPlayer.src = musicObjectUrl;
    musicPlayer.load();
    musicTrackName.textContent = `Đã chọn: ${name}`;
    miniMusicTrackName.textContent = name;
    showMiniMusicBtn.hidden = true;
    musicPlayPauseBtn.disabled = false;
    musicSeek.disabled = true;
    updateMusicControls();
}

function moveMusicPlayerToMini() {
    if (musicControlBox.parentElement !== miniMusicPlayerSlot) {
        miniMusicPlayerSlot.appendChild(musicControlBox);
    }
    miniMusic.hidden = false;
    showMiniMusicBtn.hidden = true;
}

function moveMusicPlayerToMainTab() {
    if (musicControlBox.parentElement !== musicPlayerSlot) {
        musicPlayerSlot.appendChild(musicControlBox);
    }
    miniMusic.hidden = true;
    showMiniMusicBtn.hidden = !musicPlayer.src || !musicPlayer.paused;
}

async function initSavedMusic() {
    try {
        const savedMusic = await readSavedMusic();
        if (savedMusic && savedMusic.file instanceof Blob) {
            setMusicFile(savedMusic.file, savedMusic.name || 'Nhạc đã lưu');
            const savedVolume = Number(savedMusic.volume);
            if (Number.isFinite(savedVolume)) setMusicVolume(savedVolume * 100);
            musicPlayer.addEventListener('loadedmetadata', async () => {
                if (Number.isFinite(savedMusic.currentTime) && savedMusic.currentTime > 0) {
                    musicPlayer.currentTime = Math.min(savedMusic.currentTime, musicPlayer.duration || savedMusic.currentTime);
                }
                if (savedMusic.wasPlaying) {
                    try {
                        await musicPlayer.play();
                    } catch {
                        musicTrackName.textContent = `Đã chọn: ${savedMusic.name || 'Nhạc đã lưu'} · bấm Phát để tiếp tục`;
                    }
                }
            }, { once: true });
        }
    } catch (error) {
        console.error('Không thể khôi phục tệp nhạc:', error);
        musicTrackName.textContent = 'Không thể tải tệp nhạc đã lưu';
    }
}

function setMusicVolume(value) {
    const volume = Math.min(100, Math.max(0, Number(value))) / 100;
    musicPlayer.volume = volume;
    musicVolume.value = String(Math.round(volume * 100));
}

setMusicVolume(musicVolume.value);

function updateMusicControls() {
    const duration = Number.isFinite(musicPlayer.duration) ? musicPlayer.duration : 0;
    const currentTime = Number.isFinite(musicPlayer.currentTime) ? musicPlayer.currentTime : 0;
    musicCurrentTime.textContent = formatMusicTime(currentTime);
    musicDuration.textContent = formatMusicTime(duration);
    musicSeek.value = String(duration > 0 ? Math.round(currentTime / duration * 1000) : 0);
    musicSeek.disabled = duration <= 0;
    musicPlayPauseBtn.textContent = musicPlayer.paused ? '▶' : '⏸';
    musicPlayPauseBtn.setAttribute('aria-label', musicPlayer.paused ? 'Phát nhạc' : 'Tạm dừng nhạc');
}

function formatMusicTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const wholeSeconds = Math.floor(seconds);
    return `${Math.floor(wholeSeconds / 60)}:${String(wholeSeconds % 60).padStart(2, '0')}`;
}

function scheduleMusicStateSave() {
    if (musicSaveTimeout !== null) return;
    musicSaveTimeout = setTimeout(() => {
        musicSaveTimeout = null;
        saveMusicPlaybackState();
    }, 5000);
}

function saveMusicPlaybackState() {
    if (!currentMusicFile) return;
    if (musicSaveTimeout !== null) {
        clearTimeout(musicSaveTimeout);
        musicSaveTimeout = null;
    }
    writeSavedMusic(currentMusicFile, {
        currentTime: musicPlayer.currentTime,
        volume: musicPlayer.volume,
        wasPlaying: !musicPlayer.paused
    }).catch(error => {
        console.error('Không thể lưu trạng thái phát nhạc:', error);
    });
}

async function writeBackgroundImage(file) {
    const database = await openBackgroundDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(backgroundStoreName, 'readwrite');
        transaction.objectStore(backgroundStoreName).put(file, 'backgroundImage');
        transaction.oncomplete = () => {
            database.close();
            resolve();
        };
        transaction.onerror = () => {
            database.close();
            reject(transaction.error || new Error('Không thể lưu hình nền.'));
        };
        transaction.onabort = () => {
            database.close();
            reject(transaction.error || new Error('Không thể lưu hình nền.'));
        };
    });
}

async function deleteBackgroundImage() {
    const database = await openBackgroundDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(backgroundStoreName, 'readwrite');
        transaction.objectStore(backgroundStoreName).delete('backgroundImage');
        transaction.oncomplete = () => {
            database.close();
            resolve();
        };
        transaction.onerror = () => {
            database.close();
            reject(transaction.error || new Error('Không thể xóa hình nền đã lưu.'));
        };
        transaction.onabort = () => {
            database.close();
            reject(transaction.error || new Error('Không thể xóa hình nền đã lưu.'));
        };
    });
}

function applyBackgroundImage(file, name = file.name) {
    if (backgroundObjectUrl) URL.revokeObjectURL(backgroundObjectUrl);
    backgroundObjectUrl = URL.createObjectURL(file);
    document.body.style.setProperty('--custom-background-image', `url("${backgroundObjectUrl}")`);
    document.body.classList.add('custom-background');
    backgroundFileName.textContent = `Đang dùng: ${name}`;
}

function applyBackgroundOverlay(value) {
    const opacity = Number(value);
    document.body.style.setProperty('--background-overlay-opacity', String(opacity / 100));
    backgroundOverlayValue.value = `${opacity}%`;
    backgroundOverlayValue.textContent = `${opacity}%`;
    localStorage.setItem('backgroundOverlay', String(opacity));
}

async function initBackgroundSettings() {
    const savedOverlay = Number(localStorage.getItem('backgroundOverlay'));
    const overlay = Number.isInteger(savedOverlay) && savedOverlay >= 0 && savedOverlay <= 85 ? savedOverlay : 32;
    backgroundOverlayInput.value = String(overlay);
    applyBackgroundOverlay(overlay);

    try {
        const savedImage = await readBackgroundImage();
        if (savedImage instanceof Blob) applyBackgroundImage(savedImage, 'Hình nền đã lưu');
    } catch (error) {
        console.error('Không thể khôi phục hình nền:', error);
        backgroundFileName.textContent = 'Không thể tải hình nền đã lưu';
    }
}

backgroundOverlayInput.addEventListener('input', () => {
    applyBackgroundOverlay(backgroundOverlayInput.value);
});

backgroundFileInput.addEventListener('change', async () => {
    const file = backgroundFileInput.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn một tệp hình ảnh hợp lệ.');
        backgroundFileInput.value = '';
        return;
    }

    try {
        await writeBackgroundImage(file);
        applyBackgroundImage(file);
    } catch (error) {
        console.error('Không thể lưu hình nền:', error);
        alert('Không thể lưu hình nền này. Hãy thử một ảnh khác hoặc kiểm tra dung lượng lưu trữ của trình duyệt.');
    }
});

resetBackgroundBtn.addEventListener('click', async () => {
    try {
        await deleteBackgroundImage();
        if (backgroundObjectUrl) URL.revokeObjectURL(backgroundObjectUrl);
        backgroundObjectUrl = null;
        document.body.style.removeProperty('--custom-background-image');
        document.body.classList.remove('custom-background');
        backgroundFileName.textContent = 'Đang dùng hình nền mặc định';
        backgroundFileInput.value = '';
    } catch (error) {
        console.error('Không thể khôi phục hình nền mặc định:', error);
        alert('Không thể xóa hình nền đã lưu. Vui lòng thử lại.');
    }
});

musicPlayer.addEventListener('play', () => {
    updateMusicControls();
    moveMusicPlayerToMini();
});
musicPlayer.addEventListener('pause', () => {
    updateMusicControls();
    saveMusicPlaybackState();
});
musicPlayer.addEventListener('timeupdate', () => {
    updateMusicControls();
    scheduleMusicStateSave();
});
musicPlayer.addEventListener('loadedmetadata', updateMusicControls);
musicPlayer.addEventListener('durationchange', updateMusicControls);
musicPlayer.addEventListener('volumechange', saveMusicPlaybackState);
miniMusicCloseBtn.addEventListener('click', moveMusicPlayerToMainTab);
showMiniMusicBtn.addEventListener('click', moveMusicPlayerToMini);
musicVolume.addEventListener('input', () => setMusicVolume(musicVolume.value));
musicPlayPauseBtn.addEventListener('click', async () => {
    if (musicPlayer.paused) {
        try {
            await musicPlayer.play();
        } catch (error) {
            console.error('Không thể phát nhạc:', error);
            musicTrackName.textContent = 'Không thể phát bài nhạc. Hãy chọn tệp khác và thử lại.';
        }
    } else {
        musicPlayer.pause();
    }
});
musicSeek.addEventListener('input', () => {
    if (Number.isFinite(musicPlayer.duration) && musicPlayer.duration > 0) {
        musicPlayer.currentTime = musicPlayer.duration * Number(musicSeek.value) / 1000;
    }
});
window.addEventListener('pagehide', saveMusicPlaybackState);

addBtn.addEventListener('click', saveTask);
cancelEditBtn.addEventListener('click', resetTaskForm);
searchInput.addEventListener('input', renderTasks);
sortSelect.addEventListener('change', renderTasks);
categoryFilter.addEventListener('change', renderTasks);
priorityFilter.addEventListener('change', renderTasks);
dateFilter.addEventListener('change', renderTasks);
categorySelect.addEventListener('change', () => {
    customCategoryInput.hidden = categorySelect.value !== 'custom';
});
repeatSelect.addEventListener('change', () => {
    repeatDaysGroup.hidden = repeatSelect.value !== 'custom';
});

function populateTimeOptions() {
    for (let hour = 0; hour < 24; hour++) {
        const option = document.createElement('option');
        option.value = String(hour).padStart(2, '0');
        option.textContent = option.value;
        [taskStartHour, taskEndHour].forEach(select => select.appendChild(option.cloneNode(true)));
    }

    for (let minute = 0; minute < 60; minute++) {
        const option = document.createElement('option');
        option.value = String(minute).padStart(2, '0');
        option.textContent = option.value;
        [taskStartMinute, taskEndMinute].forEach(select => select.appendChild(option.cloneNode(true)));
    }
}

function getSelectedTime(hourSelect, minuteSelect) {
    if (!hourSelect.value && !minuteSelect.value) return '';
    if (!hourSelect.value || !minuteSelect.value) return null;
    return `${hourSelect.value}:${minuteSelect.value}`;
}

function resetTimeSelects() {
    [taskStartHour, taskStartMinute, taskEndHour, taskEndMinute].forEach(select => {
        select.value = '';
    });
}

musicFileInput.addEventListener('change', () => {
    const file = musicFileInput.files[0];
    if (!file) return;
    if (!file.type.startsWith('audio/')) {
        alert('Vui lòng chọn một tệp âm thanh hợp lệ.');
        musicFileInput.value = '';
        return;
    }

    setMusicFile(file);
    writeSavedMusic(file).catch(error => {
        console.error('Không thể lưu tệp nhạc:', error);
        alert('Nhạc vẫn phát trong phiên này, nhưng không thể lưu để dùng lại sau. Hãy kiểm tra dung lượng lưu trữ của trình duyệt.');
    });
});

async function saveTask() {
    const text = taskInput.value.trim();
    if (text === '') {
        alert('Vui lòng nhập tên công việc!');
        return;
    }

    const repeat = repeatSelect.value;
    const category = categorySelect.value === 'custom'
        ? customCategoryInput.value.trim()
        : categorySelect.value;
    if (!category) {
        alert('Vui lòng nhập phân loại công việc.');
        return;
    }

    const startTime = getSelectedTime(taskStartHour, taskStartMinute);
    const endTime = getSelectedTime(taskEndHour, taskEndMinute);
    const reminderMinutes = Number(taskReminder.value);
    if (startTime === null || endTime === null) {
        alert('Vui lòng chọn cả giờ và phút, hoặc để trống cả hai.');
        return;
    }
    if (startTime && endTime && endTime <= startTime) {
        alert('Thời gian kết thúc cần sau thời gian bắt đầu.');
        return;
    }

    const repeatDays = repeat === 'custom'
        ? Array.from(repeatDaysGroup.querySelectorAll('input:checked'), checkbox => Number(checkbox.value))
        : [];
    if (repeat === 'custom' && repeatDays.length === 0) {
        alert('Vui lòng chọn ít nhất một ngày lặp lại.');
        return;
    }

    let dueDate = taskDateInput.value || (repeat !== 'none' ? formatDate(new Date()) : '');
    if (repeat !== 'none' && dueDate) {
        const startDate = new Date(`${dueDate}T00:00:00`);
        const scheduledDays = getRepeatDays({ repeat, repeatDays });
        while (!scheduledDays.includes(startDate.getDay())) {
            startDate.setDate(startDate.getDate() + 1);
        }
        dueDate = formatDate(startDate);
    }

    const taskId = Date.now();
    const task = {
        text: text,
        category,
        priority: prioritySelect.value,
        dueDate,
        startTime,
        endTime,
        reminderMinutes,
        completed: false,
        repeat,
        repeatDays,
    };

    let tasks = getTasksFromStorage();
    if (editingTaskId !== null) {
        const original = tasks.find(item => item.id === editingTaskId);
        if (!original) {
            alert('Không tìm thấy công việc cần chỉnh sửa. Hãy tải lại trang và thử lại.');
            return;
        }

        const scope = hasRepeat(original) ? await chooseRecurringScope('Chỉnh sửa công việc lặp') : 'single';
        if (!scope) return;
        const seriesId = original.seriesId ?? original.id;
        tasks = tasks.map(item => {
            const applies = scope === 'series'
                ? (item.seriesId ?? item.id) === seriesId
                : item.id === editingTaskId;
            if (!applies) return item;
            return {
                ...item,
                ...task,
                id: item.id,
                dueDate: item.id === editingTaskId ? dueDate : item.dueDate,
                completed: item.completed,
                ...(repeat !== 'none' ? { seriesId } : { seriesId: undefined })
            };
        });
    } else {
        tasks.push({
            ...task,
            id: taskId,
            completed: false,
            ...(repeat !== 'none' ? { seriesId: taskId } : {})
        });
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));

    resetTaskForm();
    renderTasks();
    renderCalendar();
}

function chooseRecurringScope(action) {
    scopeDialogTitle.textContent = action;
    recurringScopeSelect.value = 'single';
    recurringScopeDialog.showModal();
    return new Promise(resolve => {
        recurringScopeDialog.addEventListener('close', () => {
            resolve(recurringScopeDialog.returnValue === 'confirm' ? recurringScopeSelect.value : null);
        }, { once: true });
    });
}

function resetTaskForm() {
    editingTaskId = null;
    taskInput.value = '';
    taskDateInput.value = formatDate(new Date());
    resetTimeSelects();
    categorySelect.value = 'Học tập';
    customCategoryInput.value = '';
    customCategoryInput.hidden = true;
    prioritySelect.value = 'Trung bình';
    repeatSelect.value = 'none';
    taskReminder.value = '10';
    repeatDaysGroup.hidden = true;
    repeatDaysGroup.querySelectorAll('input').forEach(checkbox => {
        checkbox.checked = false;
    });
    taskFormTitle.textContent = '📝 Thêm công việc mới';
    addBtn.textContent = '＋ Thêm công việc';
    cancelEditBtn.hidden = true;
}

function setTimeSelects(time, hourSelect, minuteSelect) {
    const [hour, minute] = (time || '').split(':');
    hourSelect.value = hour || '';
    minuteSelect.value = minute || '';
}

function editTask(id) {
    const task = getTasksFromStorage().find(item => item.id === id);
    if (!task) return;
    editingTaskId = id;
    taskInput.value = task.text;
    taskDateInput.value = task.dueDate || '';
    categorySelect.value = ['Học tập', 'Việc nhà', 'Giải trí'].includes(task.category) ? task.category : 'custom';
    customCategoryInput.hidden = categorySelect.value !== 'custom';
    customCategoryInput.value = categorySelect.value === 'custom' ? task.category : '';
    prioritySelect.value = task.priority;
    setTimeSelects(task.startTime, taskStartHour, taskStartMinute);
    setTimeSelects(task.endTime, taskEndHour, taskEndMinute);
    taskReminder.value = String(task.reminderMinutes ?? 0);
    repeatSelect.value = task.repeat || 'none';
    repeatDaysGroup.hidden = repeatSelect.value !== 'custom';
    repeatDaysGroup.querySelectorAll('input').forEach(checkbox => {
        checkbox.checked = Array.isArray(task.repeatDays) && task.repeatDays.includes(Number(checkbox.value));
    });
    taskFormTitle.textContent = '✏️ Chỉnh sửa công việc';
    addBtn.textContent = 'Lưu thay đổi';
    cancelEditBtn.hidden = false;
    document.getElementById('tasksPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    taskInput.focus();
}

function toggleTask(id) {
    let tasks = getTasksFromStorage();
    const task = tasks.find(item => item.id === id);
    if (!task) return;

    if (!task.completed && hasRepeat(task)) {
        const repeatDays = getRepeatDays(task);
        if (repeatDays.length) {
            const seriesId = task.seriesId ?? task.id;
            task.seriesId = seriesId;
            const dueDate = task.dueDate ? new Date(`${task.dueDate}T00:00:00`) : new Date();
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const referenceDate = dueDate > today ? dueDate : today;
            const nextDate = new Date(referenceDate);
            nextDate.setDate(nextDate.getDate() + 1);
            while (!repeatDays.includes(nextDate.getDay())) {
                nextDate.setDate(nextDate.getDate() + 1);
            }

            const nextId = tasks.reduce((maxId, item) => Math.max(maxId, Number(item.id) || 0), 0) + 1;
            tasks.push({
                ...task,
                id: nextId,
                seriesId,
                dueDate: formatDate(nextDate),
                completed: false
            });
        }
    }

    tasks = tasks.map(item => item.id === id ? { ...item, completed: !item.completed } : item);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    renderCalendar();
}

function hasRepeat(task) {
    return task.repeat && task.repeat !== 'none';
}

function getRepeatDays(task) {
    if (task.repeat === 'daily') return [0, 1, 2, 3, 4, 5, 6];
    if (task.repeat === 'weekends') return [0, 6];
    if (task.repeat === 'weekdays') return [1, 2, 3, 4, 5];
    if (task.repeat === 'custom' && Array.isArray(task.repeatDays)) return task.repeatDays;
    return [];
}

function deleteTask(id) {
    const existingTasks = getTasksFromStorage();
    const task = existingTasks.find(item => item.id === id);
    if (!task) return;
    const scope = hasRepeat(task) ? chooseRecurringScope('Xóa công việc lặp') : Promise.resolve('single');
    scope.then(selectedScope => {
        if (!selectedScope) return;
        const seriesId = task.seriesId ?? task.id;
        const tasks = existingTasks.filter(item => selectedScope === 'series'
            ? (item.seriesId ?? item.id) !== seriesId
            : item.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        renderCalendar();
    });
}

function getTasksFromStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function loadTasks() {
    renderTasks();
}

function populateCategoryFilter() {
    const selectedCategory = categoryFilter.value;
    const categories = [...new Set(getTasksFromStorage().map(task => task.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'vi'));
    categoryFilter.replaceChildren(new Option('Mọi phân loại', ''));
    categories.forEach(category => categoryFilter.add(new Option(category, category)));
    categoryFilter.value = categories.includes(selectedCategory) ? selectedCategory : '';
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

function renderTasks() {
    taskList.innerHTML = '';
    const tasks = getTasksFromStorage();
    const query = searchInput.value.toLowerCase().trim();
    const sortBy = sortSelect.value;
    const selectedCategory = categoryFilter.value;
    const selectedPriority = priorityFilter.value;
    const selectedDate = dateFilter.value;
    const today = formatDate(new Date());

    let filteredTasks = tasks.filter(task => {
        const matchesFilter = (currentFilter === 'active') ? !task.completed :
                              (currentFilter === 'completed') ? task.completed : true;
        const matchesSearch = task.text.toLowerCase().includes(query) ||
            (task.category || '').toLowerCase().includes(query);
        const matchesCategory = !selectedCategory || task.category === selectedCategory;
        const matchesPriority = !selectedPriority || task.priority === selectedPriority;
        const matchesDate = selectedDate === 'all' ||
            (selectedDate === 'today' && task.dueDate === today) ||
            (selectedDate === 'upcoming' && task.dueDate > today) ||
            (selectedDate === 'overdue' && Boolean(task.dueDate) && task.dueDate < today);
        return matchesFilter && matchesSearch && matchesCategory && matchesPriority && matchesDate;
    });

    if (sortBy === 'dateAsc') {
        filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === 'dateDesc') {
        filteredTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    } else {
        filteredTasks.reverse();
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');

        const contentDiv = document.createElement('div');
        
        const spanText = document.createElement('span');
        spanText.className = 'task-text';
        spanText.textContent = task.text;
        if (!(task.completed && hasRepeat(task))) {
            spanText.style.cursor = 'pointer';
            spanText.addEventListener('click', () => toggleTask(task.id));
        }

        const tagsWrapper = document.createElement('div');
        tagsWrapper.className = 'tags-wrapper';

        const spanCat = document.createElement('span');
        spanCat.className = 'tag category-tag';
        spanCat.textContent = task.category;

        const spanPrio = document.createElement('span');
        const prioClass = task.priority.replace(/\s+/g, '-');
        spanPrio.className = `tag priority-${prioClass}`;
        spanPrio.textContent = task.priority;

        const spanDate = document.createElement('span');
        spanDate.className = 'tag date-tag';
        spanDate.textContent = task.dueDate ? `📅 ${task.dueDate}` : '📅 Không có ngày';

        if (task.startTime || task.endTime) {
            const timeTag = document.createElement('span');
            timeTag.className = 'tag time-tag';
            timeTag.textContent = `🕒 ${[task.startTime, task.endTime].filter(Boolean).join('–')}`;
            tagsWrapper.appendChild(timeTag);
        }

        if (hasRepeat(task)) {
            const repeatTag = document.createElement('span');
            repeatTag.className = 'tag repeat-tag';
            repeatTag.textContent = getRepeatLabel(task);
            tagsWrapper.appendChild(repeatTag);
        }

        tagsWrapper.appendChild(spanCat);
        tagsWrapper.appendChild(spanPrio);
        tagsWrapper.appendChild(spanDate);

        contentDiv.appendChild(spanText);
        contentDiv.appendChild(tagsWrapper);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Xóa';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Sửa';
        editBtn.className = 'edit-btn';
        editBtn.addEventListener('click', () => editTask(task.id));

        const actionGroup = document.createElement('div');
        actionGroup.className = 'task-actions';
        actionGroup.append(editBtn, deleteBtn);

        li.appendChild(contentDiv);
        li.appendChild(actionGroup);
        taskList.appendChild(li);
    });

    const completedCount = tasks.filter(t => t.completed).length;
    statsDisplay.textContent = `Tiến độ: Hoàn thành ${completedCount}/${tasks.length} nhiệm vụ · Đang hiển thị ${filteredTasks.length}`;
    populateCategoryFilter();
}

function getRepeatLabel(task) {
    if (task.repeat === 'daily') return '🔁 Mỗi ngày';
    if (task.repeat === 'weekends') return '🔁 Cuối tuần';
    if (task.repeat === 'weekdays') return '🔁 Ngày trong tuần';
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return `🔁 ${getRepeatDays(task).map(day => dayNames[day]).join(', ')}`;
}

function initNotifications() {
    updateNotificationStatus();
    enableNotificationsBtn.addEventListener('click', async () => {
        if (!('Notification' in window)) {
            notificationStatus.textContent = 'Trình duyệt này không hỗ trợ thông báo.';
            return;
        }
        try {
            await Notification.requestPermission();
            updateNotificationStatus();
            checkTaskReminders();
        } catch (error) {
            console.error('Không thể bật thông báo:', error);
            notificationStatus.textContent = 'Không thể bật thông báo. Hãy kiểm tra quyền của trình duyệt.';
        }
    });
    checkTaskReminders();
    setInterval(checkTaskReminders, 30000);
}

function updateNotificationStatus() {
    if (!('Notification' in window)) {
        notificationStatus.textContent = 'Trình duyệt này không hỗ trợ thông báo.';
        return;
    }
    notificationStatus.textContent = Notification.permission === 'granted'
        ? 'Thông báo đã bật.'
        : Notification.permission === 'denied'
            ? 'Thông báo bị chặn trong cài đặt trình duyệt.'
            : 'Thông báo đang tắt.';
}

function checkTaskReminders() {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    getCalendarTasksInRange(getTasksFromStorage(), today, tomorrow).forEach(task => {
        if (task.completed || !task.dueDate || !task.startTime) return;
        const reminderMinutes = Number(task.reminderMinutes ?? 0);
        if (![0, 10, 30].includes(reminderMinutes)) return;
        const scheduledAt = new Date(`${task.dueDate}T${task.startTime}:00`);
        const reminderAt = new Date(scheduledAt.getTime() - reminderMinutes * 60 * 1000);
        const lateGracePeriod = reminderMinutes === 0 ? 60000 : 0;
        if (now < reminderAt || now.getTime() >= scheduledAt.getTime() + lateGracePeriod) return;

        const reminderKey = `${task.seriesId ?? task.id}|${task.dueDate}|${task.startTime}|${reminderMinutes}`;
        if (sentReminderKeys.has(reminderKey)) return;
        if (!notifyUser(
            reminderMinutes ? `Còn ${reminderMinutes} phút đến giờ` : 'Đến giờ làm việc',
            task.text
        )) return;

        sentReminderKeys.add(reminderKey);
        localStorage.setItem('sentTaskReminders', JSON.stringify([...sentReminderKeys].slice(-500)));
    });
}

exportTasksBtn.addEventListener('click', () => {
    const backup = {
        version: 1,
        exportedAt: new Date().toISOString(),
        tasks: getTasksFromStorage()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cong-viec-${formatDate(new Date())}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
});

importTasksInput.addEventListener('change', async () => {
    const file = importTasksInput.files[0];
    if (!file) return;
    try {
        const parsed = JSON.parse(await file.text());
        const importedTasks = Array.isArray(parsed) ? parsed : parsed.tasks;
        if (!Array.isArray(importedTasks) || !importedTasks.every(isValidImportedTask)) {
            throw new Error('Tệp không chứa danh sách công việc hợp lệ.');
        }

        const replace = confirm('Nhấn OK để thay thế toàn bộ danh sách hiện tại; nhấn Hủy để gộp công việc từ bản sao lưu.');
        let tasks = replace ? [] : getTasksFromStorage();
        const nextIdBase = Math.max(Date.now(), ...tasks.map(task => Number(task.id) || 0)) + 1;
        const seriesIds = new Map();
        const remapped = importedTasks.map((task, index) => {
            const importedSeriesId = task.seriesId ?? task.id;
            let seriesId;
            if (hasRepeat(task)) {
                if (!seriesIds.has(importedSeriesId)) seriesIds.set(importedSeriesId, nextIdBase + index);
                seriesId = seriesIds.get(importedSeriesId);
            }
            return {
                ...task,
                id: nextIdBase + index,
                ...(seriesId !== undefined ? { seriesId } : {})
            };
        });
        tasks = tasks.concat(remapped);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        renderCalendar();
        alert(`Đã nhập ${remapped.length} công việc.`);
    } catch (error) {
        console.error('Không thể nhập bản sao lưu:', error);
        alert(`Không thể nhập tệp: ${error.message}`);
    } finally {
        importTasksInput.value = '';
    }
});

function isValidImportedTask(task) {
    if (!task || typeof task !== 'object' || Array.isArray(task)) return false;
    const validId = (value) => (typeof value === 'number' && Number.isFinite(value)) ||
        (typeof value === 'string' && value.length > 0);
    const validTime = value => value == null || value === '' || /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
    const repeat = task.repeat || 'none';
    const validDate = !task.dueDate || (
        /^\d{4}-\d{2}-\d{2}$/.test(task.dueDate) &&
        formatDate(new Date(`${task.dueDate}T00:00:00`)) === task.dueDate
    );
    return validId(task.id) &&
        typeof task.text === 'string' && task.text.trim() !== '' &&
        typeof task.category === 'string' && task.category.trim() !== '' &&
        ['Cao', 'Trung bình', 'Thấp'].includes(task.priority) &&
        typeof task.completed === 'boolean' && validDate &&
        ['none', 'daily', 'weekends', 'weekdays', 'custom'].includes(repeat) &&
        (repeat === 'none' || Boolean(task.dueDate)) &&
        validTime(task.startTime) && validTime(task.endTime) &&
        !(task.startTime && task.endTime && task.endTime <= task.startTime) &&
        (task.reminderMinutes == null || [0, 10, 30].includes(Number(task.reminderMinutes))) &&
        (repeat !== 'custom' || (Array.isArray(task.repeatDays) &&
            task.repeatDays.length > 0 &&
            task.repeatDays.every(day => Number.isInteger(day) && day >= 0 && day <= 6))) &&
        (task.seriesId == null || validId(task.seriesId));
}