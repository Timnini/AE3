const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public")); // Pour servir votre HTML/CSS/JS

const FILE_PATH = "tasks.json"; // Stockage des tâches

// Charger les tâches depuis le fichier
app.get("/tasks", (req, res) => {
    if (fs.existsSync(FILE_PATH)) {
        const data = fs.readFileSync(FILE_PATH);
        res.json(JSON.parse(data));
    } else {
        res.json({});
    }
});

// Ajouter une tâche
app.post("/tasks", (req, res) => {
    const { year, month, day, task } = req.body;

    if (!year || !month || !day || !task) {
        return res.status(400).send("Invalid data");
    }

    let tasks = {};
    if (fs.existsSync(FILE_PATH)) {
        tasks = JSON.parse(fs.readFileSync(FILE_PATH));
    }

    const key = `${year}-${month}-${day}`;
    tasks[key] = tasks[key] || [];
    tasks[key].push(task);

    fs.writeFileSync(FILE_PATH, JSON.stringify(tasks));
    res.status(200).send("Task added");
});

// Supprimer une tâche
app.delete("/tasks", (req, res) => {
    const { year, month, day, task } = req.body;

    if (!year || !month || !day || !task) {
        return res.status(400).send("Invalid data");
    }

    if (!fs.existsSync(FILE_PATH)) {
        return res.status(404).send("No tasks found");
    }

    let tasks = JSON.parse(fs.readFileSync(FILE_PATH));
    const key = `${year}-${month}-${day}`;

    if (tasks[key]) {
        tasks[key] = tasks[key].filter(t => t !== task);
        if (tasks[key].length === 0) {
            delete tasks[key];
        }
        fs.writeFileSync(FILE_PATH, JSON.stringify(tasks));
    }

    res.status(200).send("Task deleted");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
