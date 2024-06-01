import React, {useState, useEffect} from "react";
import {Task as TaskType} from "../types";
import {getTasks, createTask} from "../api/tasks";
import Task from "./Task";
import './tasklist.css';
import addIcon from '../img/add.png';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await getTasks();
    setTasks(response.data);
  };

  const handleCreate = async () => {
    if (newTask) {
      await createTask(newTask);
      setNewTask('');
      fetchTasks();
    }
  };

  return(
    <div className="task-list">
      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <img src={addIcon} alt="追加" onClick={handleCreate} />
      </div>
      <div className="tasks">
        {tasks.map((task) => (
          <Task key={task.id} task={task} onTaskUpdate={fetchTasks} />
        ))}
      </div>
    </div>
  )
};

export default TaskList;