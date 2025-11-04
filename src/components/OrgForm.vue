<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import type { Organization } from '@/types/organization'
import { useOrgsStore } from '@/stores/orgStore'
import { storeToRefs } from 'pinia'

//STORES
const store = useOrgsStore()

//ACTIONS
const { setIsModalOpen } = store

//STORES_TO_REFS
const { isModalOpen } = storeToRefs(store)

const initial = defineModel<Organization | null>()

const emit = defineEmits<{
  (e: 'save', value: Organization): void
}>()

const title = computed(() => (initial.value ? 'Редактировать организацию' : 'Добавить организацию'))

const defaultValue: Organization = {
  id: crypto.randomUUID(),
  name: '',
  director: '',
  phone: '',
  address: { city: '', street: '', house: '' },
}

const form = reactive<Organization>({ ...defaultValue })

onMounted(() => {
  if (initial.value) {
    Object.assign(form, JSON.parse(JSON.stringify(initial.value)))
  }
})

// проверка заполненности формы
const isValid = computed(
  () =>
    form.name &&
    form.director &&
    form.phone &&
    form.address.city &&
    form.address.street &&
    form.address.house
)

const submitForm = () => {
  if (!isValid.value) return
  emit('save', JSON.parse(JSON.stringify(form)))
}

const closeForm = () => {
  setIsModalOpen(false)
  initial.value = null
}
</script>

<template>
  <el-dialog :title="title" v-model="isModalOpen" width="520px" @close="closeForm">
    <el-form :model="form" label-position="top">
      <el-form-item label="Название">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item label="ФИО директора">
        <el-input v-model="form.director" />
      </el-form-item>

      <el-form-item label="Номер телефона">
        <el-input v-model="form.phone" />
      </el-form-item>

      <el-row :gutter="12">
        <el-col :span="8">
          <el-form-item label="Город">
            <el-input v-model="form.address.city" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Улица">
            <el-input v-model="form.address.street" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Дом">
            <el-input v-model="form.address.house" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="closeForm">Отмена</el-button>
      <el-button type="primary" :disabled="!isValid" @click="submitForm">OK</el-button>
    </template>
  </el-dialog>
</template>
