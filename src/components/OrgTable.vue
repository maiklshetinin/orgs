<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useOrgsStore } from '@/stores/orgStore'
import type { Organization } from '@/types/organization'

const store = useOrgsStore()

//STORES_TO_REFS
const { filteredOrgs } = storeToRefs(store)

const { setSort, deleteOrg } = store

const emit = defineEmits<{
  (e: 'edit', row: Organization): void
}>()

const currentPage = ref(1)
const pageSize = ref(5)

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredOrgs.value.slice(start, start + pageSize.value)
})

const handleSortChange = ({
  prop,
  order,
}: {
  prop: string
  order: 'ascending' | 'descending' | null
}) => {
  if (!order || (prop !== 'name' && prop !== 'director')) return
  setSort(prop as 'name' | 'director', order === 'ascending' ? 'asc' : 'desc')
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}
</script>

<template>
  <el-table
    :data="paginatedItems"
    style="width: 100%"
    stripe
    border
    @sort-change="handleSortChange"
    @row-click="(row: Organization) => emit('edit', row)"
  >
    <el-table-column
      prop="name"
      label="Название"
      sortable="custom"
      :sort-orders="['ascending', 'descending']"
    />
    <el-table-column
      prop="director"
      label="ФИО директора"
      sortable="custom"
      :sort-orders="['ascending', 'descending']"
    />
    <el-table-column prop="phone" label="Номер телефона" />

    <el-table-column label="Адрес">
      <template #default="{ row }">
        {{ row.address.city }}, {{ row.address.street }}, {{ row.address.house }}
      </template>
    </el-table-column>

    <el-table-column label=" " align="center" width="60">
      <template #default="{ row }">
        <el-button class="delete-btn" @click.stop="deleteOrg(row.id)">✖</el-button>
      </template>
    </el-table-column>
  </el-table>

  <div class="pagination">
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="filteredOrgs.length"
      layout="prev, pager, next"
      @current-change="handlePageChange"
    />
  </div>
</template>

<style scoped>
.delete-btn {
  border: none;
  background: none;
  color: #d93025;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  transition: all 0.2s ease;
}
.delete-btn:hover {
  color: #ff1100;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
