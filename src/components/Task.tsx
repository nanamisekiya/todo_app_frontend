import React, {useState, useEffect} from "react";
import { Task as TaskType } from "../types";
import { updateTask, deleteTask, startTimer, stopTimer } from '../api/tasks';
import './task.css';
import editIcon from '../img/edit.png';
import deleteIcon from '../img/delete.png';
import startIcon from '../img/start.png';
import stopIcon from '../img/stop.png';
import saveIcon from '../img/save.png';

interface TaskProps {
  task: TaskType;
  onTaskUpdate: () => void;
}

const Task: React.FC<TaskProps> = ({ task, onTaskUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [timer, setTimer] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer !== null) {
      interval = setInterval(() => {
        setTimer(prevTimer => (prevTimer !== null ? prevTimer + 1 : null));
      }, 1000);
    }
      return () => clearInterval(interval);
  }, [timer]);

  const handleUpdate = async () => {
    await updateTask(task.id, { title });
    setIsEditing(false);
    onTaskUpdate();
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
    onTaskUpdate();
  };

  const handleStart = async () => {
    await startTimer(task.id);
    setTimer(0);
  };

  const handleStop = async () => {
    const totalTimeSpent = (task.time_spent || 0) + (timer || 0);
    await stopTimer(task.id);
    await updateTask(task.id, { time_spend: totalTimeSpent });
    setTimer(null);
    onTaskUpdate();
  };

  const formatTime = (timeInSeconds: number) => {
    const date = new Date(timeInSeconds * 1000);
    return date.toISOString().substr(11, 8);
  };

  const elapsedTime = (task.time_spent || 0) + (timer || 0);

  return (
    <div className="task">
      <input
        type="checkbox"
        checked={task.completed} 
        onChange={async () => {
          await updateTask(task.id, { completed: !task.completed });
          onTaskUpdate();
        }}
      />
      {isEditing ? (
        <input className="task-title" value={title} onChange={(e) => setTitle(e.target.value)}/>
      ) : (
        <span className="task-title" style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'gray' : 'black' }}>{task.title}</span>
      )}
      {isEditing ? (
        <img src={saveIcon} alt="保存" onClick={handleUpdate} />
      ) : (
        <img src={editIcon} alt="編集" onClick={() => setIsEditing(true)} />
      )}
      <img src={deleteIcon} alt="削除" onClick={handleDelete} />
      {task.completed ? null : timer !== null ? (
        <img src={stopIcon} alt="停止" onClick={handleStop} />
      ) : (
        <img src={startIcon} alt="開始" onClick={handleStart} />
      )}
      <span className="timer">{formatTime(elapsedTime)}</span>
    </div>
  );
};

export default Task;