// Menunggu semua elemen HTML selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
  // Ambil elemen-elemen input dan tombol
  const taskInput = document.getElementById("input-task");
  const priorityInput = document.getElementById("priority");
  const dateInput = document.getElementById("input-date");
  const addButton = document.getElementById("add-btn");
  const resetButton = document.getElementById("reset-btn");
  const clearAllButton = document.getElementById("clear-all");

  // Elemen untuk menampilkan daftar task
  const todoSection = document.getElementById("todo-section");
  const doneSection = document.getElementById("done-section");

  // Elemen untuk menampilkan tanggal dan waktu saat ini
  const dateDisplay = document.getElementById("date");
  const timeDisplay = document.getElementById("time");

  // Elemen tab untuk navigasi To-Do dan Done
  const tabTodo = document.querySelector('[data-tabid="todo"]');
  const tabDone = document.querySelector('[data-tabid="done"]');

  // Ambil data task dari localStorage, jika belum ada maka buat array kosong
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Simpan array task ke localStorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Menampilkan tanggal dan waktu real-time di UI
  setInterval(() => {
    const now = new Date();
    dateDisplay.textContent = now.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    timeDisplay.textContent = now.toLocaleTimeString("id-ID");
  }, 1000); // Update setiap detik

  /**
   * Fungsi pembantu untuk membuat elemen task secara dinamis
   * @param {Object} task - Data task yang akan ditampilkan
   * @param {number} index - Index task dalam array
   * @param {boolean} isDoneTab - Menandai apakah task ini untuk tab Done
   * @returns {HTMLElement} taskItem
   */
  function createTaskElement(task, index, isDoneTab) {
    const taskItem = document.createElement("div");
    taskItem.className =
      "flex items-start gap-3 bg-white rounded-lg p-3 my-2 shadow text-sm";

    // Buat checkbox untuk menandai task selesai
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "mt-1 accent-blue-600";
    checkbox.checked = task.done;

    // Event: Saat user mencentang atau menghapus centang
    checkbox.addEventListener("change", () => {
      tasks[index].done = checkbox.checked; // Perbarui status done
      saveTasks(); // Simpan perubahan ke localStorage
      showTasks(); // Perbarui tampilan
    });

    // Kontainer teks dan info task
    const taskContent = document.createElement("div");
    taskContent.className = "flex-1";

    // Teks utama dari task
    const taskText = document.createElement("p");
    taskText.textContent = task.text;
    taskText.className = "font-medium";

    // Jika task sudah selesai dan masih ditampilkan di tab To-Do, beri efek coret
    if (task.done && !isDoneTab) {
      taskText.classList.add("line-through", "text-slate-400");
    }

    // Informasi tambahan: tanggal dan prioritas
    const taskInfo = document.createElement("span");
    taskInfo.className = "text-xs text-slate-400";
    taskInfo.textContent = `${task.date} • ${task.priority}`;

    // Gabungkan elemen ke dalam task
    taskContent.appendChild(taskText);
    taskContent.appendChild(taskInfo);
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskContent);

    return taskItem;
  }

  // Fungsi utama untuk menampilkan semua task ke tampilan halaman
  function showTasks() {
    // Kosongkan tampilan sebelumnya
    todoSection.innerHTML = "";
    doneSection.innerHTML = "";

    // Jika belum ada task
    if (tasks.length === 0) {
      todoSection.innerHTML =
        "<p class='text-xs text-slate-400 text-center'>Belum ada tugas.</p>";
      return;
    }

    // Loop semua task dan tampilkan sesuai kondisinya
    tasks.forEach((task, index) => {
      // Tampilkan semua task (done atau belum) di tab To-Do
      const todoItem = createTaskElement(task, index, false);
      todoSection.appendChild(todoItem);

      // Jika task selesai, tampilkan juga di tab Done (tanpa coret)
      if (task.done) {
        const doneItem = createTaskElement(task, index, true);
        doneSection.appendChild(doneItem);
      }
    });
  }

  // Fungsi untuk menambahkan task baru
  function addTask() {
    const text = taskInput.value.trim();
    const priority = priorityInput.value;
    const inputDate = dateInput.value;

    // Validasi input wajib diisi
    if (text === "" || priority === "Select Priority") {
      alert("Tugas dan prioritas harus diisi.");
      return;
    }

    // Gunakan tanggal input, atau gunakan hari ini jika kosong
    const today = new Date();
    const formattedDate = inputDate
      ? new Date(inputDate).toLocaleDateString("id-ID")
      : today.toLocaleDateString("id-ID");

    // Buat objek task baru
    const newTask = {
      text: text,
      priority: priority,
      date: formattedDate,
      done: false,
    };

    // Tambahkan ke awal array task, lalu simpan dan tampilkan
    tasks.unshift(newTask);
    saveTasks();
    showTasks();

    // Reset input form
    taskInput.value = "";
    priorityInput.selectedIndex = 0;
    dateInput.value = "";
  }

  // Tombol "Add Task"
  addButton.addEventListener("click", addTask);

  // Tombol "Reset" input
  resetButton.addEventListener("click", () => {
    taskInput.value = "";
    priorityInput.selectedIndex = 0;
    dateInput.value = "";
  });

  // Tombol "Clear All Task"
  clearAllButton.addEventListener("click", () => {
    if (confirm("Apakah kamu yakin ingin menghapus semua tugas?")) {
      tasks = []; // Kosongkan array
      localStorage.removeItem("tasks"); // Hapus dari localStorage
      showTasks(); // Refresh tampilan
    }
  });

  // Event ganti ke tab "To-Do"
  tabTodo.addEventListener("click", () => {
    tabTodo.classList.add("text-blue-600", "border-b-2");
    tabDone.classList.remove("text-blue-600", "border-b-2");
    todoSection.classList.remove("hidden");
    doneSection.classList.add("hidden");
  });

  // Event ganti ke tab "Done"
  tabDone.addEventListener("click", () => {
    tabDone.classList.add("text-blue-600", "border-b-2");
    tabTodo.classList.remove("text-blue-600", "border-b-2");
    doneSection.classList.remove("hidden");
    todoSection.classList.add("hidden");
  });

  // Pertama kali halaman dibuka, tampilkan semua task
  showTasks();
});
