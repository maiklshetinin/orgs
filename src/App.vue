<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useOrgsStore } from '@/stores/orgStore'
import OrgTable from '@/components/OrgTable.vue'
import OrgForm from '@/components/OrgForm.vue'
import type { Organization } from '@/types/organization'

//STORES
const store = useOrgsStore()

//ACTIONS
const { setIsModalOpen, addOrg, updateOrg } = store

//STORES_TO_REFS
const { search, isModalOpen, organizations } = storeToRefs(store)

const selectedOrg = ref<Organization | null>(null)

const openModal = (org?: Organization | null) => {
  selectedOrg.value = org ? { ...org } : null
  setIsModalOpen(true)
}

const saveOrg = (org: Organization) => {
  const idx = organizations.value.findIndex(o => o.id === org.id)
  if (idx === -1) {
    addOrg(org)
  } else {
    updateOrg(org)
  }
  setIsModalOpen(false)
}
</script>

<template>
  <div class="container">
    <header class="header">
      <h1>Справочник организаций</h1>
      <div class="actions">
        <el-input
          v-model="search"
          placeholder="Найти по ФИО директора..."
          clearable
          size="default"
        />
        <el-button type="primary" @click="openModal(null)">Добавить</el-button>
      </div>
    </header>

    <OrgTable @edit="openModal" />
  </div>

  <OrgForm v-if="isModalOpen" v-model="selectedOrg" @save="saveOrg" />
</template>

<style scoped>
.container {
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  padding: 24px;
  width: 100%;
  max-width: 960px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header h1 {
  font-size: 22px;
  margin: 0;
  color: #333;
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
