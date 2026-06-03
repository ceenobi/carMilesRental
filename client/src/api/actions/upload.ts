import axiosClient from '@/lib/axiosClient'
import type { uploadSchemaType } from '@/lib/schemaTypes'
import { axiosError } from '@/lib/utils'

export const uploadApi = async ({ request }) => {
  const formData = await request.formData()
  const formDataObj = Object.fromEntries(formData) as uploadSchemaType
  try {
    const res = await axiosClient.post('/upload', formDataObj)
    return res
  } catch (error) {
    const errorResponse = axiosError(error)
    if (errorResponse) {
      return errorResponse
    }
    return {
      status: 500,
      body: {
        success: false,
        message: error.message || 'An unexpected error occurred',
      },
    }
  }
}

export const deleteMediaApi = async ({ request }) => {
  const formData = await request.formData()
  const formDataObj = Object.fromEntries(formData) as uploadSchemaType
  try {
    const res = await axiosClient.post('/upload/delete', formDataObj)
    return res
  } catch (error) {
    const errorResponse = axiosError(error)
    if (errorResponse) {
      return errorResponse
    }
    return {
      status: 500,
      body: {
        success: false,
        message: error.message || 'An unexpected error occurred',
      },
    }
  }
}
