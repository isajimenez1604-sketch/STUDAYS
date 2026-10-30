import { useEffect, useState } from "react";

import { AppTask, listTasks } from "../services/authApi";

export function useTasks(userId: number) {
  const [tasks, setTasks] = useState<AppTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    listTasks(userId)
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

  return { tasks, loading, error, addTask };
}
