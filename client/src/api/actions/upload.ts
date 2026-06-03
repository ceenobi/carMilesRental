import axiosClient from '@/lib/axiosClient'
import { UploadSchema, DeleteMediaSchema } from '@/lib/schemaTypes'
import { axiosError } from '@/lib/utils'
import type { ActionFunctionArgs } from 'react-router'

export const uploadApi = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const formDataObj = {
    files: formData.getAll('files'),
    folder: formData.get('folder'),
  }
  
  const validatedData = UploadSchema.parse(formDataObj)

  try {
    const res = await axiosClient.post('/upload', validatedData)
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
        message:
          error instanceof Error ? error.message : 'An unexpected error occurred',
      },
    }
  }
}

export const deleteMediaApi = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const formDataObj = {
    mediaIds: formData.getAll('mediaIds'),
  }
  
  const validatedData = DeleteMediaSchema.parse(formDataObj)

  try {
    const res = await axiosClient.post('/upload/delete', validatedData)
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
        message:
          error instanceof Error ? error.message : 'An unexpected error occurred',
      },
    }
  }
}
