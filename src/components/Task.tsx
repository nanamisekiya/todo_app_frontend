import React, {useState, useEffect} from "react";
import { Task as TaskType } from "../types";
import { updateTask, deleteTask, startTimer, stopTimer } from '../api/tasks';

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
    <div>
      <input
        type="checkbox"
        checked={task.completed} 
        onChange={async () => {
          await updateTask(task.id, { completed: !task.completed });
          onTaskUpdate();
        }}
      />
      {isEditing ? (
        <input value={title} onChange={(e) => setTitle(e.target.value)}/>
      ) : (
        <span>{task.title}</span>
      )}
      {isEditing ? (
        <button onClick={handleUpdate}>保存</button>
      ) : (
        <button onClick={() => setIsEditing(true)}>編集</button>
      )}
      <button onClick={handleDelete}>削除</button>
      {task.completed ? null : timer !== null ? (
        <button onClick={handleStop}>停止</button>
      ) : (
        <button onClick={handleStart}>開始</button>
      )}
      <span>{formatTime(elapsedTime)}</span>
    </div>
  );
};

export default Task;