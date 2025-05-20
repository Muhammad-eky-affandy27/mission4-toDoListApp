// menunggu semua elemen DOM dimuat
document.addEventListener("DOMContentLoaded", () => {
  // elemen DOM atau HTML
  const taskInput = document.getElementById("input-task");
  const priorityInput = document.getElementById("priority");
  const dateInput = document.getElementById("input-date");
  const addButton = document.getElementById("add-btn");
  const resetButton = document.getElementById("reset-btn");
  const clearButton = document.getElementById("clear-all");

  const todoSection = document.getElementById("todo-section");
  const doneSection = document.getElementById("done-section");

  const dateDisplay = document.getElementById("date");
  const timeDisplay = document.getElementById("time");
  const tabTodo = document.querySelector('[data-tabid="todo"]');
  const tabDone = document.querySelector('[data-tabid="done"]');

  // Ambil data dari localStorage atau buat array kosong jika belum ada
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Fungsi untuk menyimpan data ke localStorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // update waktu sekarang di pojok kanan/live clock
  setInterval(function () {
    const now = new Date();
    dateDisplay.textContent = now.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    timeDisplay.textContent = now.toLocaleTimeString("id-ID");
  }, 1000); //update per 1 detik

  // Fungsi untuk menampilkan semua task ke tampilan
  function showTasks() {
    // Kosongkan tampilan sebelumnya
    todoSection.innerHTML = "";
    doneSection.innerHTML = "";

    // Jika belum ada tugas
    if (tasks.length === 0) {
      todoSection.innerHTML =
        "<p class='text-xs text-slate-400 text-center'>Belum ada tugas.</p>";
    }

    // Loop untuk menampilkan semua task
    tasks.forEach(function (task, index) {
      // Buat container task
      const taskItem = document.createElement("div");
      taskItem.className =
        "flex items-start gap-3 bg-white rounded-lg p-3 my-2 shadow text-sm";

      // Checkbox untuk menandai selesai atau belum
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "mt-1 accent-blue-600";
      checkbox.checked = task.done;

      // Event ketika checkbox diubah
      checkbox.addEventListener("change", function () {
        tasks[index].done = checkbox.checked;
        saveTasks();
        showTasks(); // Perbarui tampilan
      });

      // Isi konten task
      const taskContent = document.createElement("div");
      taskContent.className = "flex-1";

      const taskText = document.createElement("p");
      taskText.textContent = task.text;
      taskText.className = "font-medium";
      if (task.done) {
        taskText.classList.add("line-through", "text-slate-400");
      }

      const taskInfo = document.createElement("span");
      taskInfo.className = "text-xs text-slate-400";
      taskInfo.textContent = task.date + " • " + task.priority;

      // Gabungkan konten
      taskContent.appendChild(taskText);
      taskContent.appendChild(taskInfo);
      taskItem.appendChild(checkbox);
      taskItem.appendChild(taskContent);

      // Tempatkan task ke section sesuai statusnya (done atau todo)
      if (task.done) {
        doneSection.appendChild(taskItem);
      } else {
        todoSection.appendChild(taskItem);
      }
    });
  }

  // Fungsi untuk menambahkan task baru
  function addTask() {
    const text = taskInput.value.trim();
    const priority = priorityInput.value;
    const inputDate = dateInput.value;

    // Validasi input
    if (text === "" || priority === "Select Priority") {
      alert("Tugas dan prioritas harus diisi.");
      return;
    }

    // Gunakan tanggal dari input atau gunakan tanggal hari ini
    const today = new Date();
    const formattedDate = inputDate
      ? new Date(inputDate).toLocaleDateString("id-ID")
      : today.toLocaleDateString("id-ID");

    // Buat object task
    const newTask = {
      text: text,
      priority: priority,
      date: formattedDate,
      done: false,
    };

    // Tambahkan task ke awal array dan simpan
    tasks.unshift(newTask);
    saveTasks();
    showTasks();

    // Reset form input
    taskInput.value = "";
    priorityInput.selectedIndex = 0;
    dateInput.value = "";
  }

  // Fungsi untuk menghapus semua task
  function clearTasks() {
    if (confirm("Hapus semua tugas?")) {
      tasks = [];
      saveTasks();
      showTasks();
    }
  }

  // Event untuk tombol "Add Task"
  addButton.addEventListener("click", addTask);

  // Event untuk tombol "Reset"
  resetButton.addEventListener("click", function () {
    taskInput.value = "";
    priorityInput.selectedIndex = 0;
    dateInput.value = "";
  });

  // Event untuk tombol "Clear All"
  const clearAllButton = document.getElementById("clear-all");

  clearAllButton.addEventListener("click", function () {
    const confirmClear = confirm(
      "Apakah kamu yakin ingin menghapus semua tugas?"
    );
    if (confirmClear) {
      localStorage.removeItem("tasks"); // Hapus dari localStorage
      tasks = []; // Kosongkan array tasks
      showTasks(); // Refresh tampilan
    }
  });

  // Tab switching
  tabTodo.addEventListener("click", () => {
    tabTodo.classList.add("text-blue-600", "border-b-2");
    tabDone.classList.remove("text-blue-600", "border-b-2");
    todoSection.classList.remove("hidden");
    doneSection.classList.add("hidden");
  });

  tabDone.addEventListener("click", () => {
    tabDone.classList.add("text-blue-600", "border-b-2");
    tabTodo.classList.remove("text-blue-600", "border-b-2");
    doneSection.classList.remove("hidden");
    todoSection.classList.add("hidden");
  });

  // Tampilkan semua task saat halaman pertama kali dibuka
  showTasks();
});
