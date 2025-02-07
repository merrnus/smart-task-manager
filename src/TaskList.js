//starting to project 
import React, { useState, useEffect } from "react";
import styles from "./TaskList.module.css";

function TaskList() {
  const getSavedTasks = () => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  };

  const [tasks, setTasks] = useState(getSavedTasks);
  const [newTask, setNewTask] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedTask, setEditedTask] = useState("");

  // Load Dark Mode state from Local Storage
  const getSavedTheme = () => {
    return localStorage.getItem("darkMode") === "true";
  };
  const [darkMode, setDarkMode] = useState(getSavedTheme);

  // Save Dark Mode state when changed
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const toggleTaskCompletion = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditedTask(tasks[index].text);
  };

  const saveEdit = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, text: editedTask } : task
    );
    setTasks(updatedTasks);
    setEditingIndex(null);
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : styles.light}`}>
      <h2>Task List</h2>

      <button onClick={toggleDarkMode} className={styles["theme-button"]}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTask()}
        placeholder="Enter a task..."
        className={styles["task-input"]}
      />
      <button onClick={addTask} className={styles["add-button"]}>
        Add Task
      </button>

      <ul className={styles["task-list"]}>
        {tasks.map((task, index) => (
          <li key={index} className={`${styles["task-item"]} ${task.completed ? styles["completed"] : ""}`}>
            <div className={styles["task-content"]}>
              {editingIndex === index ? (
                <input
                  type="text"
                  value={editedTask}
                  onChange={(e) => setEditedTask(e.target.value)}
                  className={styles["edit-input"]}
                />
              ) : (
                <span onClick={() => toggleTaskCompletion(index)}>{task.text}</span>
              )}
            </div>

            <div className={styles["button-group"]}>
              {editingIndex === index ? (
                <button onClick={() => saveEdit(index)} className={styles["save-button"]}>
                  ✅
                </button>
              ) : (
                <>
                  <button onClick={() => startEditing(index)} className={styles["edit-button"]}>
                    ✏️
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); deleteTask(index); }} className={styles["delete-button"]}>
                    ❌
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
