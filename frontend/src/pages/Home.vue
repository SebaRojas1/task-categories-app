<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-4xl mx-auto">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Gestor de Tareas</h1>
        <p class="text-gray-600">Organiza tus tareas por categorías</p>
      </header>

      <main>
        <CategoryForm @category-added="fetchCategories" />
        <CategoryList
          :categories="categories"
          @category-deleted="fetchCategories"
          @category-updated="fetchCategories"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axiosClient from "@/lib/helpers/axiosClient";
import CategoryForm from "@/components/CategoryForm.vue";
import CategoryList from "@/components/CategoryList.vue";

const categories = ref([]);

const fetchCategories = async () => {
  try {
    const response = await axiosClient.get("/categories");
    categories.value = response.data;
    console.log("Categorías actualizadas:", categories.value);
  } catch (error) {
    console.error("Error al obtener categorías:", error);

    const notification = document.createElement("div");
    notification.className =
      "fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg";
    notification.textContent = "Error al cargar las categorías";
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 2000);
  }
};

onMounted(fetchCategories);
</script>
