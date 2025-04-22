<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Mis Categorías</h2>

    <div v-if="categories.length" class="space-y-6">
      <div
        v-for="category in categories"
        :key="category._id"
        class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
      >
        <!-- Categories header -->
        <div
          class="flex justify-between items-center p-4 bg-gray-50 border-b cursor-pointer"
          @click="toggleTaskList(category._id)"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0 mr-3">
              <div
                class="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full transition-transform"
                :class="{ 'rotate-90': openCategories.includes(category._id) }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-800">
                {{ category.name }}
              </h3>
              <p class="text-sm text-gray-500">
                {{
                  category.tasks
                    ? `${category.tasks.length} tareas`
                    : "0 tareas"
                }}
              </p>
            </div>
          </div>

          <div class="flex gap-2">
            <button
              @click.stop="startEditing(category)"
              class="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition text-sm"
            >
              Editar
            </button>
            <button
              @click.stop="handleDelete(category._id)"
              class="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition text-sm"
            >
              Eliminar
            </button>
          </div>
        </div>

        <!-- Task list -->
        <div v-if="openCategories.includes(category._id)" class="border-t">
          <TaskList
            :categoryId="category._id"
            :categoryName="category.name"
            @tasks-updated="fetchCategories"
          />
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12 bg-white rounded-lg shadow-md">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 mx-auto text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
      <p class="text-gray-500 text-lg">No hay categorías aún.</p>
      <p class="text-gray-400 text-sm mt-2">
        Crea una categoría para organizar tus tareas.
      </p>
    </div>

    <!-- Edit modal -->
    <div
      v-if="editingCategory"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h4 class="text-lg font-semibold mb-4">Editar categoría</h4>
        <input
          v-model="editingCategory.name"
          type="text"
          class="w-full border border-gray-300 p-3 rounded mb-4"
        />
        <div class="flex justify-end gap-2">
          <button
            @click="cancelEdit"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            @click="handleUpdate"
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
import { ref } from "vue";
import axiosClient from "@/lib/helpers/axiosClient";
import TaskList from "./TaskList.vue";

defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["category-deleted", "category-updated"]);
const editingCategory = ref(null);
const openCategories = ref([]);

const toggleTaskList = (categoryId) => {
  if (openCategories.value.includes(categoryId)) {
    openCategories.value = openCategories.value.filter(
      (id) => id !== categoryId
    );
  } else {
    openCategories.value.push(categoryId);
  }
};

const startEditing = (category) => {
  editingCategory.value = { ...category };
};

const cancelEdit = () => {
  editingCategory.value = null;
};

const handleUpdate = async () => {
  if (!editingCategory.value.name.trim()) return;

  try {
    const response = await axiosClient.put(
      `/categories/${editingCategory.value._id}`,
      {
        name: editingCategory.value.name,
      }
    );

    editingCategory.value = null;
    emit("category-updated", response.data);

    showNotification("Categoría actualizada correctamente", "success");
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    showNotification("Error al actualizar categoría", "error");
  }
};

const handleDelete = async (id) => {
  const confirmDelete = confirm(
    "¿Estás seguro de que deseas eliminar esta categoría y todas sus tareas?"
  );
  if (!confirmDelete) return;

  try {
    await axiosClient.delete(`/categories/${id}`);
    emit("category-deleted");

    showNotification("Categoría eliminada correctamente", "success");
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    showNotification("Error al eliminar la categoría", "error");
  }
};

const fetchCategories = async () => {
  emit("category-updated");
};

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

<style scoped>
.rotate-90 {
  transform: rotate(90deg);
}
</style>
