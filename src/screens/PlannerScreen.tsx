import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AppState,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import BottomNavigation from "../components/BottomNavigation";
import ThemeToggleButton from "../components/ThemeToggleButton";
import { useAppTheme } from "../context/ThemeContext";
import { RootStackParamList } from "../navigation/AppNavigator";
import {
  createPlannerInterval,
  deletePlannerInterval,
  listPlannerIntervals,
  PlannerInterval,
  PlannerIntervalInput,
  PlannerIntervalKind,
  updatePlannerInterval,
} from "../services/plannerApi";
import {
  cancelPlannerNotifications,
  requestPlannerNotificationPermission,
  schedulePlannerSequence,
} from "../services/plannerNotifications";
import { plannerStyles as styles } from "../styles/PlannerStyles";
import {
  advanceTimer,
  EMPTY_TIMER,
  formatTime,
  isTimerState,
  TimerState,
} from "../utils/plannerTimer";

type Props = NativeStackScreenProps<RootStackParamList, "Planner">;

const RING_SIZE = 250;
const RING_RADIUS = 109;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const TIMER_STORAGE_PREFIX = "studays-planner-timer-";

export default function PlannerScreen({ navigation, route }: Props) {
  const { user } = route.params;
  const { colors } = useAppTheme();
  const [intervals, setIntervals] = useState<PlannerInterval[]>([]);
  const [timer, setTimer] = useState<TimerState>(EMPTY_TIMER);
  const timerRef = useRef(timer);
  const notificationIdsRef = useRef<string[]>([]);
  const notificationGenerationRef = useRef(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("25");
  const [kind, setKind] = useState<PlannerIntervalKind>("study");
  const [editingId, setEditingId] = useState<number | null>(null);

  const storageKey = `${TIMER_STORAGE_PREFIX}${user.id}`;

  const persistTimer = useCallback(
    (next: TimerState) => {
      timerRef.current = next;
      setTimer(next);
      AsyncStorage.setItem(storageKey, JSON.stringify(next)).catch((storageError) => {
        setError(
          storageError instanceof Error
            ? `No se pudo guardar el temporizador: ${storageError.message}`
            : "No se pudo guardar el temporizador."
        );
      });
    },
    [storageKey]
  );

  const clearScheduledNotifications = useCallback(async () => {
    notificationGenerationRef.current += 1;
    const identifiers = notificationIdsRef.current;
    notificationIdsRef.current = [];
    await cancelPlannerNotifications(identifiers);
  }, []);

  const scheduleTimerNotifications = useCallback(
    async (next: TimerState, enabled: boolean) => {
      const generation = notificationGenerationRef.current + 1;
      notificationGenerationRef.current = generation;
      const previousIdentifiers = notificationIdsRef.current;
      notificationIdsRef.current = [];
      await cancelPlannerNotifications(previousIdentifiers);
      if (generation !== notificationGenerationRef.current) return;
      if (
        next.phase !== "running" ||
        !next.endsAt ||
        !enabled
      ) {
        return;
      }
      const identifiers = await schedulePlannerSequence(
        next.intervals,
        next.currentIndex,
        next.endsAt
      );
      if (generation !== notificationGenerationRef.current) {
        await cancelPlannerNotifications(identifiers);
        return;
      }
      notificationIdsRef.current = identifiers;
    },
    []
  );

  const refreshIntervals = useCallback(async () => {
    setError("");
    try {
      setIntervals(await listPlannerIntervals());
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudieron cargar tus intervalos."
      );
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([
      listPlannerIntervals(),
      AsyncStorage.getItem(storageKey),
    ])
      .then(([loadedIntervals, savedTimer]) => {
        if (!active) return;
        setIntervals(loadedIntervals);
        if (!savedTimer) return;

        const parsed: unknown = JSON.parse(savedTimer);
        if (!isTimerState(parsed)) {
          throw new Error("Los datos guardados del temporizador no son válidos.");
        }

        const restored =
          parsed.phase === "running" && parsed.endsAt
            ? advanceTimer(parsed, Date.now())
            : parsed;
        timerRef.current = restored;
        setTimer(restored);
        AsyncStorage.setItem(storageKey, JSON.stringify(restored)).catch(
          (storageError) => {
            setError(
              storageError instanceof Error
                ? storageError.message
                : "No se pudo guardar el estado del temporizador."
            );
          }
        );
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudo cargar el planificador."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [storageKey]);

  const currentInterval = timer.intervals[timer.currentIndex] ?? intervals[0];
  const timerColor =
    currentInterval?.kind === "break" ? "#16A34A" : "#4F46E5";
  const remainingMs = timer.remainingMs;
  const currentDuration = currentInterval
    ? currentInterval.duration_minutes * 60_000
    : 0;
  const progress =
    currentDuration > 0 ? Math.min(1, remainingMs / currentDuration) : 1;
  const strokeOffset = RING_CIRCUMFERENCE * (1 - progress);

  const totalMinutes = useMemo(
    () => intervals.reduce((total, item) => total + item.duration_minutes, 0),
    [intervals]
  );

  useEffect(() => {
    if (timer.phase !== "running" || !timer.endsAt) return;
    const intervalId = setInterval(() => {
      const current = timerRef.current;
      if (current.phase !== "running" || !current.endsAt) return;
      if (Date.now() < current.endsAt) {
        const updated = { ...current, remainingMs: current.endsAt - Date.now() };
        timerRef.current = updated;
        setTimer(updated);
        return;
      }

      const next = advanceTimer(current, Date.now());
      persistTimer(next);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timer.phase, timer.endsAt, persistTimer]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState !== "active") return;
      const current = timerRef.current;
      if (current.phase !== "running" || !current.endsAt) return;
      const now = Date.now();
      const updated =
        now >= current.endsAt
          ? advanceTimer(current, now)
          : { ...current, remainingMs: current.endsAt - now };
      persistTimer(updated);
    });
    return () => subscription.remove();
  }, [persistTimer]);

  const handleSaveInterval = async () => {
    const parsedDuration = Number(duration);
    if (!title.trim() || !Number.isInteger(parsedDuration) || parsedDuration < 1 || parsedDuration > 240) {
      setError("Ingresa un título y un tiempo entre 1 y 240 minutos.");
      return;
    }

    setError("");
    setSaving(true);
    try {
      const input: PlannerIntervalInput = {
        title: title.trim(),
        durationMinutes: parsedDuration,
        kind,
      };
      if (editingId) {
        await updatePlannerInterval(editingId, input);
      } else {
        await createPlannerInterval(input);
      }
      setTitle("");
      setDuration("25");
      setKind("study");
      setEditingId(null);
      await refreshIntervals();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo guardar el intervalo."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (interval: PlannerInterval) => {
    setEditingId(interval.id);
    setTitle(interval.title);
    setDuration(String(interval.duration_minutes));
    setKind(interval.kind);
  };

  const handleDelete = (interval: PlannerInterval) => {
    Alert.alert("Eliminar intervalo", `¿Eliminar "${interval.title}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePlannerInterval(interval.id);
            if (editingId === interval.id) {
              setEditingId(null);
              setTitle("");
              setDuration("25");
            }
            await refreshIntervals();
          } catch (deleteError) {
            setError(
              deleteError instanceof Error
                ? deleteError.message
                : "No se pudo eliminar el intervalo."
            );
          }
        },
      },
    ]);
  };

  const handleStart = async () => {
    if (timer.phase === "running") {
      const remaining = Math.max(0, (timer.endsAt ?? Date.now()) - Date.now());
      clearScheduledNotifications().catch((notificationError) => {
        setError(
          notificationError instanceof Error
            ? notificationError.message
            : "No se pudieron cancelar los avisos del plan."
        );
      });
      persistTimer({
        ...timer,
        phase: "paused",
        endsAt: null,
        remainingMs: remaining,
      });
      return;
    }

    if (timer.phase === "paused") {
      let permission = false;
      try {
        permission = await requestPlannerNotificationPermission();
      } catch (permissionError) {
        setError(
          permissionError instanceof Error
            ? permissionError.message
            : "No se pudo configurar el aviso sonoro."
        );
      }
      const endsAt = Date.now() + timer.remainingMs;
      const resumed = { ...timer, phase: "running" as const, endsAt };
      persistTimer(resumed);
      if (permission) {
        scheduleTimerNotifications(resumed, permission).catch((notificationError) => {
          setError(
            notificationError instanceof Error
              ? notificationError.message
              : "No se pudieron programar los avisos del plan."
          );
        });
      } else {
        Alert.alert(
          "Aviso sonoro desactivado",
          "El temporizador contará, pero necesitas permitir notificaciones para escuchar el aviso al cambiar de intervalo."
        );
      }
      return;
    }

    if (intervals.length === 0) {
      setError("Agrega al menos un intervalo antes de iniciar.");
      return;
    }

    let permission = false;
    try {
      permission = await requestPlannerNotificationPermission();
      if (!permission) {
        Alert.alert(
          "Aviso sonoro desactivado",
          "El temporizador contará, pero necesitas permitir notificaciones para escuchar el aviso al cambiar de intervalo."
        );
      }
    } catch (permissionError) {
      setError(
        permissionError instanceof Error
          ? permissionError.message
          : "No se pudo configurar el aviso sonoro."
      );
    }

    const first = intervals[0];
    const remaining = first.duration_minutes * 60_000;
    const started: TimerState = {
      phase: "running",
      intervals: [...intervals],
      currentIndex: 0,
      endsAt: Date.now() + remaining,
      remainingMs: remaining,
    };
    persistTimer(started);
    if (permission) {
      scheduleTimerNotifications(started, permission).catch((notificationError) => {
        setError(
          notificationError instanceof Error
            ? notificationError.message
            : "No se pudieron programar los avisos del plan."
        );
      });
    }
  };

  const handleStop = () => {
    clearScheduledNotifications().catch((notificationError) => {
      setError(
        notificationError instanceof Error
          ? notificationError.message
          : "No se pudieron cancelar los avisos del temporizador."
      );
    });
    persistTimer(EMPTY_TIMER);
    AsyncStorage.removeItem(storageKey).catch((storageError) => {
      setError(
        storageError instanceof Error
          ? storageError.message
          : "No se pudo limpiar el temporizador."
      );
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.heading, { color: colors.text }]}>
              Planificador
            </Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
              Organiza tu tiempo de estudio
            </Text>
          </View>
          <ThemeToggleButton />
        </View>

        <View
          style={[
            styles.timerCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.phaseLabel, { color: timerColor }]}>
            {timer.phase === "completed"
              ? "¡Plan completado!"
              : currentInterval?.title ?? "Tu tiempo de estudio"}
          </Text>
          <View style={styles.ring}>
            <Svg
              width={RING_SIZE}
              height={RING_SIZE}
              viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
              style={styles.ringSvg}
            >
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_RADIUS}
                fill="none"
                stroke={colors.border}
                strokeWidth={14}
              />
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_RADIUS}
                fill="none"
                stroke={timerColor}
                strokeWidth={14}
                strokeLinecap="round"
                strokeDasharray={`${RING_CIRCUMFERENCE}, ${RING_CIRCUMFERENCE}`}
                strokeDashoffset={strokeOffset}
                rotation={-90}
                originX={RING_SIZE / 2}
                originY={RING_SIZE / 2}
              />
            </Svg>
            <View>
              <Text style={[styles.timerText, { color: colors.text }]}>
                {formatTime(remainingMs)}
              </Text>
              <Text style={[styles.timerHint, { color: colors.secondaryText }]}>
                {timer.phase === "paused"
                  ? "En pausa"
                  : timer.phase === "completed"
                    ? "Vuelve a empezar cuando quieras"
                    : timer.phase === "running"
                      ? `${timer.currentIndex + 1} de ${timer.intervals.length}`
                      : `${totalMinutes} min en tu plan`}
              </Text>
            </View>
          </View>

          <View style={styles.timerControls}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: timerColor }]}
              onPress={handleStart}
              accessibilityRole="button"
              accessibilityLabel={
                timer.phase === "running"
                  ? "Pausar temporizador"
                  : timer.phase === "paused"
                    ? "Continuar temporizador"
                    : "Iniciar temporizador"
              }
            >
              <Ionicons
                name={timer.phase === "running" ? "pause" : "play"}
                size={18}
                color="#FFFFFF"
              />
              <Text style={styles.buttonText}>
                {timer.phase === "running"
                  ? "Pausar"
                  : timer.phase === "paused"
                    ? "Continuar"
                    : "Iniciar"}
              </Text>
            </TouchableOpacity>
            {timer.phase !== "idle" ? (
              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  { borderColor: colors.border },
                ]}
                onPress={handleStop}
                accessibilityRole="button"
                accessibilityLabel="Reiniciar temporizador"
              >
                <Ionicons name="refresh" size={20} color={colors.text} />
              </TouchableOpacity>
            ) : null}
          </View>
          <Text style={[styles.helperText, { color: colors.secondaryText }]}>
            El tiempo sigue contando al minimizar la app. Permite notificaciones
            para recibir el sonido cuando cambie la actividad.
          </Text>
        </View>

        <Text style={[styles.sectionHeading, { color: colors.text }]}>
          Planear estudio
        </Text>
        <View
          style={[
            styles.formCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.label, { color: colors.text }]}>Título</Text>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.text,
                backgroundColor: colors.input,
                borderColor: colors.border,
              },
            ]}
            placeholder="Ej. Estudiar matemáticas"
            placeholderTextColor={colors.secondaryText}
            value={title}
            onChangeText={setTitle}
            maxLength={80}
            accessibilityLabel="Título del intervalo"
          />

          <View style={styles.fieldRow}>
            <View style={styles.durationField}>
              <Text style={[styles.label, { color: colors.text }]}>
                Tiempo (minutos)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    backgroundColor: colors.input,
                    borderColor: colors.border,
                  },
                ]}
                keyboardType="number-pad"
                value={duration}
                onChangeText={setDuration}
                maxLength={3}
                accessibilityLabel="Duración en minutos"
              />
            </View>
          </View>

          <Text style={[styles.label, { color: colors.text }]}>Tipo</Text>
          <View style={styles.typeOptions}>
            {(["study", "break"] as const).map((option) => {
              const selected = kind === option;
              const optionColor = option === "study" ? "#4F46E5" : "#16A34A";
              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.typeButton,
                    {
                      borderColor: selected ? optionColor : colors.border,
                      backgroundColor: selected
                        ? `${optionColor}18`
                        : colors.surface,
                    },
                  ]}
                  onPress={() => setKind(option)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Ionicons
                    name={option === "study" ? "book-outline" : "cafe-outline"}
                    size={17}
                    color={optionColor}
                  />
                  <Text style={[styles.typeButtonText, { color: optionColor }]}>
                    {option === "study" ? "Estudio" : "Descanso"}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity
            style={[
              styles.intervalButton,
              { backgroundColor: "#3B82F6" },
              saving && { opacity: 0.6 },
            ]}
            onPress={handleSaveInterval}
            disabled={saving}
            accessibilityRole="button"
          >
            <Ionicons
              name={editingId ? "checkmark" : "add"}
              size={19}
              color="#FFFFFF"
            />
            <Text style={styles.intervalButtonText}>
              {saving
                ? "Guardando..."
                : editingId
                  ? "Guardar cambios"
                  : "Agregar al plan"}
            </Text>
          </TouchableOpacity>
          {editingId ? (
            <TouchableOpacity
              onPress={() => {
                setEditingId(null);
                setTitle("");
                setDuration("25");
              }}
            >
              <Text style={[styles.helperText, { color: colors.secondaryText }]}>
                Cancelar edición
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <Text style={[styles.sectionHeading, { color: colors.text }]}>
          Tu secuencia ({intervals.length})
        </Text>
        {loading ? (
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
            Cargando intervalos...
          </Text>
        ) : intervals.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
            Agrega actividades para construir tu ciclo de estudio y descanso.
          </Text>
        ) : (
          intervals.map((interval, index) => {
            const intervalColor =
              interval.kind === "break" ? "#16A34A" : "#4F46E5";
            return (
              <View
                key={interval.id}
                style={[
                  styles.intervalCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.intervalIcon,
                    { backgroundColor: colors.iconBackground },
                  ]}
                >
                  <Ionicons
                    name={interval.kind === "break" ? "cafe-outline" : "book-outline"}
                    size={20}
                    color={intervalColor}
                  />
                </View>
                <View style={styles.intervalInfo}>
                  <Text
                    style={[styles.intervalTitle, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {index + 1}. {interval.title}
                  </Text>
                  <Text
                    style={[
                      styles.intervalSubtitle,
                      { color: colors.secondaryText },
                    ]}
                  >
                    {interval.duration_minutes} min ·{" "}
                    {interval.kind === "break" ? "Descanso" : "Estudio"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleEdit(interval)}
                  accessibilityRole="button"
                  accessibilityLabel={`Editar ${interval.title}`}
                >
                  <Ionicons name="create-outline" size={20} color={colors.secondaryText} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleDelete(interval)}
                  accessibilityRole="button"
                  accessibilityLabel={`Eliminar ${interval.title}`}
                >
                  <Ionicons name="trash-outline" size={19} color="#DC2626" />
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>

      <BottomNavigation
        active="Planner"
        navigation={navigation}
        user={user}
        themeColors={colors}
      />
    </SafeAreaView>
  );
}
