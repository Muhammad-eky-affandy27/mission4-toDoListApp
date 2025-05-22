// Menunggu DOM selesai dimuat sebelum menjalankan script
document.addEventListener("DOMContentLoaded", () => {
  // Mendapatkan elemen-elemen penting dari DOM
  const taskInput = document.getElementById("input-task");
  const priorityInput = document.getElementById("priority");
  const dateInput = document.getElementById("input-date");
  const addButton = document.getElementById("add-btn");
  const resetButton = document.getElementById("reset-btn");
  const clearAllButton = document.getElementById("clear-all");
  const todoSection = document.getElementById("todo-section");
  const doneSection = document.getElementById("done-section");
  const dateDisplay = document.getElementById("date");
  const timeDisplay = document.getElementById("time");
  const tabButtons = document.querySelectorAll("[data-tabid]");

  // Mengambil data task dari localStorage atau membuat array kosong jika belum ada
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Fungsi untuk menyimpan task ke localStorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Fungsi untuk memperbarui jam dan tanggal secara real-time
  function updateClock() {
    const now = new Date();
    // Menampilkan tanggal dalam format Indonesia
    dateDisplay.textContent = now.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    // Menampilkan waktu dalam format Indonesia
    timeDisplay.textContent = now.toLocaleTimeString("id-ID");
  }
  // Update jam setiap detik
  setInterval(updateClock, 1000);
  // Memanggil fungsi pertama kali saat halaman dimuat
  updateClock();

  // Fungsi untuk membuat elemen task
  function createTaskElement(task, index) {
    // Membuat container task
    const taskItem = document.createElement("div");
    taskItem.className = `task-item flex items-start gap-3 bg-white rounded-lg p-3 mb-2 border border-gray-100 ${
      task.done ? "opacity-75" : ""
    }`;

    // Membuat checkbox untuk menandai task selesai
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className =
      "mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500";
    checkbox.checked = task.done;
    // Event ketika checkbox diubah
    checkbox.addEventListener("change", () => {
      tasks[index].done = checkbox.checked;
      saveTasks();
      showTasks();
    });

    // Container untuk konten task
    const taskContent = document.createElement("div");
    taskContent.className = "flex-1";

    // Teks deskripsi task
    const taskText = document.createElement("p");
    taskText.className = `text-sm ${
      task.done ? "line-through text-gray-400" : "text-gray-700 font-medium"
    }`;
    taskText.textContent = task.text;

    // Container untuk info tambahan (prioritas dan tanggal)
    const taskInfo = document.createElement("div");
    taskInfo.className = "flex items-center gap-2 mt-1";

    // Badge untuk prioritas
    const priorityBadge = document.createElement("span");
    priorityBadge.className = `priority-${task.priority.toLowerCase()} text-xs px-2 py-1 rounded-full`;
    priorityBadge.textContent = task.priority;

    // Tanggal task
    const dateSpan = document.createElement("span");
    dateSpan.className = "text-xs text-gray-400";
    dateSpan.textContent = task.date;

    // Tombol hapus task
    const deleteBtn = document.createElement("button");
    deleteBtn.className =
      "ml-auto text-gray-400 hover:text-red-500 transition duration-200";
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm("Apakah Anda yakin ingin menghapus task ini?")) {
        tasks.splice(index, 1);
        saveTasks();
        showTasks();
      }
    });

    // Menyusun semua elemen ke dalam task item
    taskInfo.appendChild(priorityBadge);
    taskInfo.appendChild(dateSpan);
    taskContent.appendChild(taskText);
    taskContent.appendChild(taskInfo);
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskContent);
    taskItem.appendChild(deleteBtn);

    return taskItem;
  }

  // Fungsi untuk menampilkan task di UI
  function showTasks() {
    // Mengosongkan section sebelum menampilkan task
    todoSection.innerHTML = "";
    doneSection.innerHTML = "";

    // Jika tidak ada task, tampilkan pesan
    if (tasks.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "text-center text-gray-400 text-sm py-4";
      emptyMessage.textContent = "Belum ada task. Tambahkan task pertama Anda!";
      todoSection.appendChild(emptyMessage);
      return;
    }

    // Loop melalui semua task dan tampilkan
    tasks.forEach((task, index) => {
      const taskElement = createTaskElement(task, index);

      // Memisahkan task yang selesai dan belum
      if (task.done) {
        doneSection.appendChild(taskElement);
      } else {
        todoSection.appendChild(taskElement);
      }
    });
  }

  // Fungsi untuk menambahkan task baru
  function addTask() {
    const text = taskInput.value.trim();
    const priority = priorityInput.value;
    const inputDate = dateInput.value;

    // Validasi input
    if (!text) {
      alert("Harap masukkan deskripsi task");
      return;
    }

    if (!priority) {
      alert("Harap pilih prioritas task");
      return;
    }

    // Format tanggal, gunakan hari ini jika tidak diisi
    const today = new Date();
    const formattedDate = inputDate
      ? new Date(inputDate).toLocaleDateString("id-ID")
      : today.toLocaleDateString("id-ID");

    // Membuat objek task baru
    const newTask = {
      text,
      priority,
      date: formattedDate,
      done: false,
      createdAt: new Date().toISOString(),
    };

    // Menambahkan task baru ke awal array
    tasks.unshift(newTask);
    saveTasks();
    showTasks();

    // Mereset form input
    taskInput.value = "";
    priorityInput.selectedIndex = 0;
    dateInput.value = "";
  }

  // Fungsi untuk berpindah antar tab
  function switchTab(tabId) {
    tabButtons.forEach((btn) => {
      if (btn.dataset.tabid === tabId) {
        btn.classList.add("text-blue-600", "border-b-2");
        btn.classList.remove("text-gray-500");
      } else {
        btn.classList.remove("text-blue-600", "border-b-2");
        btn.classList.add("text-gray-500");
      }
    });

    // Menampilkan/menyembunyikan section sesuai tab yang dipilih
    if (tabId === "todo") {
      todoSection.classList.remove("hidden");
      doneSection.classList.add("hidden");
    } else {
      todoSection.classList.add("hidden");
      doneSection.classList.remove("hidden");
    }
  }

  // Event Listeners

  // Ketika tombol tambah task diklik
  addButton.addEventListener("click", addTask);

  // Ketika tombol reset diklik
  resetButton.addEventListener("click", () => {
    taskInput.value = "";
    priorityInput.selectedIndex = 0;
    dateInput.value = "";
  });

  // Ketika tombol hapus semua diklik
  clearAllButton.addEventListener("click", () => {
    if (tasks.length === 0) {
      alert("Tidak ada task yang bisa dihapus");
      return;
    }

    if (confirm("Apakah Anda yakin ingin menghapus SEMUA task?")) {
      tasks = [];
      saveTasks();
      showTasks();
    }
  });

  // Ketika tab diklik
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      switchTab(button.dataset.tabid);
    });
  });

  // Mengatur tanggal default ke hari ini
  const today = new Date();
  dateInput.valueAsDate = today;

  // Inisialisasi aplikasi
  showTasks();
  switchTab("todo");
});
