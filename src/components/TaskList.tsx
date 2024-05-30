import React, {useState, useEffect} from "react";
import {Task as TaskType} from "../types";
import {getTasks, createTask} from "../api/tasks";
import Task from "./Task";

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
    <div>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={handleCreate}>追加</button>
      <div>
        {tasks.map((task) => (
          <Task key={task.id} task={task} onTaskUpdate={fetchTasks} />
        ))}
      </div>
    </div>
  )
};

export default TaskList;