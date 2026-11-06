const { createApp } = Vue;

const STORAGE_KEY = "hackready-practice-tasks";

function getInitialTasks() {
    const starterTasks = [
        { id: 1, title: "Pahami struktur HTML semantik", category: "HTML · 20 menit", completed: true },
        { id: 2, title: "Review CSS Grid, Flexbox & responsive", category: "CSS · 30 menit", completed: true },
        { id: 3, title: "Latihan DOM dan event JavaScript", category: "JavaScript · 30 menit", completed: false },
        { id: 4, title: "Coba directive dan data binding Vue", category: "Vue.js · 25 menit", completed: false },
        { id: 5, title: "Siapkan ide dan pembagian tugas tim", category: "Strategi · 15 menit", completed: false },
    ];

    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (!savedTasks) return starterTasks;

    try {
        const tasks = JSON.parse(savedTasks);
        if (Array.isArray(tasks) && tasks.every((task) =>
            Number.isInteger(task.id) &&
            typeof task.title === "string" &&
            typeof task.category === "string" &&
            typeof task.completed === "boolean"
        )) {
            return tasks;
        }
        console.error("Data checklist tersimpan tidak valid. Menggunakan checklist awal.");
    } catch (error) {
        console.error("Checklist tersimpan tidak dapat dibaca.", error);
    }

    return starterTasks;
}

function getTomorrowAtEight(now = new Date()) {
    const deadline = new Date(now);
    deadline.setDate(deadline.getDate() + 1);
    deadline.setHours(8, 0, 0, 0);
    return deadline;
}

function getTimeRemaining(deadline, now = new Date()) {
    const remaining = Math.max(0, deadline.getTime() - now.getTime());
    const totalSeconds = Math.floor(remaining / 1000);
    return {
        days: String(Math.floor(totalSeconds / 86400)).padStart(2, "0"),
        hours: String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, "0"),
        minutes: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0"),
        seconds: String(totalSeconds % 60).padStart(2, "0"),
    };
}

const deadline = getTomorrowAtEight();

createApp({
    data() {
        return {
            tasks: getInitialTasks(),
            newTaskTitle: "",
            countdown: getTimeRemaining(deadline),
            todayLabel: new Intl.DateTimeFormat("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
            }).format(new Date()),
            deadlineLabel: new Intl.DateTimeFormat("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
            }).format(deadline),
            schedule: [
                { time: "16.30", title: "Review materi inti", description: "HTML, CSS, dan JavaScript", current: true },
                { time: "18.00", title: "Diskusi ide bareng tim", description: "Pilih masalah dan solusi", current: false },
                { time: "20.00", title: "Istirahat & siapkan perlengkapan", description: "Laptop, charger, dan koneksi", current: false },
            ],
            countdownInterval: null,
        };
    },
    computed: {
        completedCount() {
            return this.tasks.filter((task) => task.completed).length;
        },
        progressPercent() {
            return this.tasks.length ? Math.round((this.completedCount / this.tasks.length) * 100) : 0;
        },
        progressMessage() {
            if (this.progressPercent === 100) return "Semua target tercapai. Kamu siap!";
            if (this.progressPercent >= 60) return "Keren, tinggal sedikit lagi!";
            if (this.progressPercent > 0) return "Awal yang bagus, lanjutkan!";
            return "Pilih satu target dan mulai sekarang.";
        },
    },
    watch: {
        tasks: {
            deep: true,
            handler(tasks) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
            },
        },
    },
    mounted() {
        this.countdownInterval = window.setInterval(() => {
            this.countdown = getTimeRemaining(deadline);
        }, 1000);
    },
    beforeUnmount() {
        window.clearInterval(this.countdownInterval);
    },
    methods: {
        addTask() {
            const title = this.newTaskTitle.trim();
            if (!title) return;

            this.tasks.push({
                id: Date.now(),
                title,
                category: "Target pribadi",
                completed: false,
            });
            this.newTaskTitle = "";
        },
        toggleTask(id) {
            const task = this.tasks.find((item) => item.id === id);
            if (task) task.completed = !task.completed;
        },
        deleteTask(id) {
            this.tasks = this.tasks.filter((task) => task.id !== id);
        },
        clearCompleted() {
            this.tasks = this.tasks.filter((task) => !task.completed);
        },
    },
}).mount("#app");
