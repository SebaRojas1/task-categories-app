<template>
  <div class="p-4">
    <!-- Add task form -->
    <div class="mb-5">
      <div class="flex">
        <input
          v-model="newTaskName"
          type="text"
          placeholder="Nueva tarea"
          class="flex-grow border border-gray-300 p-3 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @keyup.enter="addTask"
        />
        <button
          @click="addTask"
          class="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none"
        >
          Añadir
        </button>
      </div>
    </div>

    <!-- Task list -->
    <div v-if="tasks.length">
      <div class="flex justify-between mb-4">
        <span class="text-sm text-gray-500"
          >{{ tasksCompleted }} de {{ tasks.length }} completadas</span
        >
        <button
          v-if="tasksCompleted > 0"
          @click="clearCompleted"
          class="text-sm text-red-600 hover:text-red-800"
        >
          Eliminar completadas
        </button>
      </div>

      <div class="space-y-2">
        <div
          v-for="task in tasks"
          :key="task._id"
          class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
          :class="{ 'bg-green-50 border-green-200': task.completed }"
        >
          <div class="flex items-center gap-3">
            <input
              type="checkbox"
              :checked="task.completed"
              @change="toggleCompleted(task)"
              class="h-5 w-5 text-blue-600 focus:ring-blue-500 transition"
            />
            <span
              :class="{ 'line-through text-gray-500': task.completed }"
              class="transition-all duration-200"
            >
              {{ task.name }}
            </span>
          </div>

          <div class="flex gap-2">
            <button
              @click="startEditingTask(task)"
              class="text-yellow-600 hover:text-yellow-800 p-1"
              title="Editar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              @click="deleteTask(task._id)"
              class="text-red-600 hover:text-red-800 p-1"
              title="Eliminar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-12 w-12 mx-auto text-gray-300 mb-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <p class="text-gray-500">No hay tareas en esta categoría.</p>
      <p class="text-gray-400 text-sm mt-1">Añade una tarea para comenzar.</p>
    </div>

    <!-- Edit modal -->
    <div
      v-if="editingTask"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h4 class="text-lg font-semibold mb-4">Editar tarea</h4>
        <input
          v-model="editingTask.name"
          type="text"
          class="w-full border border-gray-300 p-3 rounded mb-4"
        />
        <div class="flex justify-end gap-2">
          <button
            @click="cancelEditing"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            @click="saveEditedTask"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axiosClient from "@/lib/helpers/axiosClient";

const props = defineProps({
  categoryId: {
    type: String,
    required: true,
  },
  categoryName: {
    type: String,
    required: true,
  },
});

const tasks = ref([]);
const newTaskName = ref("");
const editingTask = ref(null);

const emit = defineEmits(["tasks-updated"]);

const tasksCompleted = computed(() => {
  return tasks.value.filter((task) => task.completed).length;
});

onMounted(fetchTasks);

async function fetchTasks() {
  try {
    const response = await axiosClient.get(
      `/categories/${props.categoryId}/tasks`
    );
    tasks.value = response.data;
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    showNotification("Error al cargar las tareas", "error");
  }
}

async function addTask() {
  if (!newTaskName.value.trim()) return;

  try {
    const response = await axiosClient.post(
      `/categories/${props.categoryId}/tasks`,
      {
        name: newTaskName.value,
      }
    );

    tasks.value.push(response.data);
    newTaskName.value = "";
    emit("tasks-updated");
    showNotification("Tarea añadida correctamente", "success");
  } catch (error) {
    console.error("Error al añadir tarea:", error);
    showNotification("Error al añadir tarea", "error");
  }
}

async function toggleCompleted(task) {
  try {
    const updatedTask = {
      ...task,
      completed: !task.completed,
    };

    const response = await axiosClient.put(`/tasks/${task._id}`, {
      completed: updatedTask.completed,
    });

    const index = tasks.value.findIndex((t) => t._id === task._id);
    if (index !== -1) {
      tasks.value[index].completed = response.data.completed;
    }
  } catch (error) {
    console.error("Error al actualizar el estado de la tarea:", error);
    showNotification("Error al actualizar la tarea", "error");
  }
}

async function clearCompleted() {
  const confirmDelete = confirm("¿Eliminar todas las tareas completadas?");
  if (!confirmDelete) return;

  const completedTasks = tasks.value.filter((task) => task.completed);

  try {
    for (const task of completedTasks) {
      await axiosClient.delete(`/tasks/${task._id}`);
    }

    tasks.value = tasks.value.filter((task) => !task.completed);
    emit("tasks-updated");
    showNotification("Tareas completadas eliminadas", "success");
  } catch (error) {
    console.error("Error al eliminar tareas completadas:", error);
    showNotification("Error al eliminar tareas", "error");
  }
}

async function deleteTask(taskId) {
  try {
    await axiosClient.delete(`/tasks/${taskId}`);
    tasks.value = tasks.value.filter((task) => task._id !== taskId);
    emit("tasks-updated");
    showNotification("Tarea eliminada correctamente", "success");
  } catch (error) {
    console.error("Error al eliminar la tarea:", error);
    showNotification("Error al eliminar la tarea", "error");
  }
}

function startEditingTask(task) {
  editingTask.value = { ...task };
}

function cancelEditing() {
  editingTask.value = null;
}

async function saveEditedTask() {
  if (!editingTask.value.name.trim()) return;

  try {
    const response = await axiosClient.put(`/tasks/${editingTask.value._id}`, {
      name: editingTask.value.name,
    });

    const index = tasks.value.findIndex(
      (task) => task._id === editingTask.value._id
    );
    if (index !== -1) {
      tasks.value[index].name = response.data.name;
    }

    editingTask.value = null;
    showNotification("Tarea actualizada correctamente", "success");
  } catch (error) {
    console.error("Error al editar la tarea:", error);
    showNotification("Error al editar la tarea", "error");
  }
}

const showNotification = (message, type = "success") => {
  const notification = document.createElement("div");
  notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 ${
    type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
  }`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 2000);
};
</script>
