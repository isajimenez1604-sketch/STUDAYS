import { useEffect, useState } from "react";

import {
  AppTask,
  deleteTask as deleteTaskRequest,
  listTasks,
  updateTask as updateTaskRequest,
  UpdateTaskInput,
} from "../services/authApi";

export function useTasks(userId: number) {
  const [tasks, setTasks] = useState<AppTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    listTasks()
      .then((loadedTasks) => {
        if (active) setTasks(loadedTasks);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudieron cargar las tareas"
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userId]);

  const addTask = (task: AppTask) => {
    setTasks((currentTasks) => [task, ...currentTasks]);
  };

  const updateTask = async (
    taskId: number,
    changes: UpdateTaskInput
  ): Promise<AppTask> => {
    const updatedTask = await updateTaskRequest(taskId, changes);
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === taskId ? updatedTask : task))
    );
    return updatedTask;
  };

  const deleteTask = async (taskId: number): Promise<void> => {
    await deleteTaskRequest(taskId);
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId)
    );
  };

  const refreshTasks = async (): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      setTasks(await listTasks());
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudieron cargar las tareas"
      );
    } finally {
      setLoading(false);
    }
  };

  return { tasks, loading, error, addTask, updateTask, deleteTask, refreshTasks };
}
