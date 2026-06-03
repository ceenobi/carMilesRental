import ActionButton from '@/components/ui/actionButton'
import { Button } from '@/components/ui/button'
import { FormBox } from '@/components/ui/formBox'
import Modal from '@/components/ui/modal'
import { useFiles } from '@/hooks/useFiles'
import axiosClient from '@/lib/axiosClient'
import { carCategories } from '@/lib/constants'
import { carSchema, type carSchemaType } from '@/lib/schemaTypes'
import { cn, queryClient } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Loader, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form'
import { useFetcher, useRevalidator } from 'react-router'
import { toast } from 'sonner'

export default function AddFleet() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadedImages, setUploadedImages] = useState<{ mediaUrl: string; publicId: string }[]>([])
  const fetcher = useFetcher()
  const { revalidate } = useRevalidator()

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<carSchemaType>({
    resolver: zodResolver(carSchema) as never,
    defaultValues: {
      name: '',
      brand: '',
      type: 'sedan',
      category: 'economy',
      price: 0,
      status: 'open',
      info: {
        seats: 4,
        transmission: 'automatic',
        fuel: 'petrol',
        year: new Date().getFullYear().toString(),
      },
      specs: {
        engine: '',
        mileage: '',
        topSpeed: '',
        boot: '',
      },
      summary: '',
      media: [],
    },
    mode: 'onChange',
  })

  const { selectedFiles: imagePreview, setSelectedFiles: setImagePreview, handleFiles: handleImageUpload } = useFiles()

  const stepData = [
    { id: 1, title: 'Essentials' },
    { id: 2, title: 'Specs' },
    { id: 3, title: 'Media' },
    { id: 4, title: 'Review' },
  ]

  const handleNextStep = () => {
    const values = getValues()
    if (currentStep === 1) {
      if (!values.name || !values.brand || !values.price || !values.info.year) {
        toast.error('Please fill in all required fields in step 1')
        return
      }
    } else if (currentStep === 2) {
      if (!values.info.seats || !values.specs.engine || !values.specs.mileage) {
        toast.error('Please fill in all required fields in step 2')
        return
      }
    } else if (currentStep === 3) {
      if (!values.summary || values.media.length === 0) {
        toast.error('Please provide a summary and at least one image')
        return
      }
    }
    setCurrentStep(prev => prev + 1)
  }
  const handlePreviousStep = () => setCurrentStep(prev => prev - 1)

  useEffect(() => {
    const uploadFiles = async () => {
      if (imagePreview.length === 0 || isUploading) return
      setIsUploading(true)
      try {
        const res = await axiosClient.post('/upload', {
          files: imagePreview.map(item => item.preview),
          folder: 'cars',
        })
        const results = res.data.body
        const newImages = results.map((res: { secure_url: string; public_id: string }) => ({
          mediaUrl: res.secure_url,
          publicId: res.public_id,
        }))

        if (newImages.length > 0) {
          const updated = [...uploadedImages, ...newImages]
          setUploadedImages(updated)
          setValue('media', updated, { shouldValidate: true })
          toast.success(`${newImages.length} image(s) uploaded successfully`)
        }
        setImagePreview([])
      } catch (error) {
        console.error(error)
        toast.error('An error occurred during upload')
        setImagePreview([])
      } finally {
        setIsUploading(false)
      }
    }
    uploadFiles()
  }, [imagePreview, isUploading, uploadedImages, setValue, setImagePreview])

  useEffect(() => {
    if (!fetcher.data || fetcher.state !== 'idle') return
    const { status, body } = fetcher.data
    if (status !== 201 && status !== 200) {
      toast.error(body?.message || 'Failed to add a new vehicle')
    } else {
      queryClient.removeQueries({ queryKey: ['cars'] })
      revalidate()
      reset()
      toast.success('Vehicle added successfully')
      const timer = setTimeout(() => {
        setIsOpen(false)
        setUploadedImages([])
        setCurrentStep(1)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [fetcher.data, fetcher.state, reset, revalidate])

  const onSubmit: SubmitHandler<carSchemaType> = data => {
    fetcher.submit(data, {
      method: 'post',
      action: '/dashboard/fleets',
      encType: 'application/json',
    })
  }

  const removeImage = (index: number) => {
    const updated = uploadedImages.filter((_, i) => i !== index)
    setUploadedImages(updated)
    setValue('media', updated, { shouldValidate: true })
  }

  const watchType = useWatch({ control, name: 'type' })
  const watchCategory = useWatch({ control, name: 'category' })
  const watchStatus = useWatch({ control, name: 'status' })
  const watchTransmission = useWatch({ control, name: 'info.transmission' })
  const watchFuel = useWatch({ control, name: 'info.fuel' })

  return (
    <>
      <Button
        className="bg-DeepOrange text-white rounded-full p-4 hover:bg-DeepOrange/90"
        size="lg"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="mr-2" /> Add Fleet
      </Button>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} classname="sm:max-w-3xl">
        <div className="px-6 py-4 border-b border-gray-100 text-left">
          <h1 className="text-xl font-bold text-MainBlack">Add a new vehicle</h1>
          <p className="text-sm text-SoftBlack mt-1">Fill in the details to list a new vehicle in your fleet.</p>
        </div>

        <div className="px-6 py-4 bg-gray-50/50">
          <div className="w-full flex items-center justify-between">
            {stepData.map((step, index) => {
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div key={step.id} className="flex flex-col md:flex-row items-center w-full last:w-auto">
                  <div className="flex flex-col md:flex-row items-center gap-2 relative z-10 shrink-0">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shrink-0',
                        isActive || isCompleted
                          ? 'bg-DeepOrange text-white shadow-md shadow-DeepOrange/20'
                          : 'bg-gray-200 text-gray-500'
                      )}
                    >
                      {isCompleted ? <Check size={16} strokeWidth={3} /> : step.id}
                    </div>
                    <span
                      className={cn(
                        'text-xs font-medium whitespace-nowrap transition-colors duration-300',
                        isActive ? 'text-DeepOrange font-bold' : isCompleted ? 'text-MainBlack' : 'text-gray-400'
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < stepData.length - 1 && (
                    <div
                      className={cn(
                        'flex-1 h-0.5 mx-4 transition-all duration-300 rounded-full',
                        isCompleted ? 'bg-DeepOrange' : 'bg-gray-200'
                      )}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="px-6 py-4 max-h-80 sm:max-h-[60vh] overflow-y-auto">
          <fetcher.Form onSubmit={handleSubmit(onSubmit)} id="addFleetForm">
            {currentStep === 1 && (
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <FormBox
                    label="Car Name"
                    type="text"
                    placeholder="e.g. Lexus ES 350"
                    id="name"
                    register={register}
                    errors={errors?.name}
                    name="name"
                    classname="rounded-xl"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <FormBox
                    label="Brand"
                    type="text"
                    placeholder="e.g. Lexus"
                    id="brand"
                    register={register}
                    errors={errors?.brand}
                    name="brand"
                    classname="rounded-xl"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <FormBox
                    label="Daily Price (₦)"
                    type="number"
                    placeholder="0"
                    id="price"
                    register={register}
                    errors={errors?.price}
                    name="price"
                    classname="rounded-xl"
                    registerOptions={{ valueAsNumber: true }}
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <FormBox
                    label="Year"
                    type="text"
                    placeholder="2024"
                    id="year"
                    register={register}
                    errors={errors?.info?.year}
                    name="info.year"
                    classname="rounded-xl"
                  />
                </div>

                <div className="col-span-12">
                  <p className="text-sm font-medium text-SoftBlack mb-2">Car Type</p>
                  <div className="flex gap-2 flex-wrap">
                    {['sedan', 'suv', 'truck', 'bus'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setValue('type', t as 'sedan' | 'suv' | 'truck' | 'bus')}
                        className={cn(
                          'px-4 py-2 rounded-full text-xs font-medium transition-all',
                          watchType === t ? 'bg-DeepOrange text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                      >
                        {t.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  {errors.type && <p className="text-xs text-red-600 mt-1">{errors.type.message}</p>}
                </div>

                <div className="col-span-12">
                  <p className="text-sm font-medium text-SoftBlack mb-2">Category</p>
                  <div className="flex gap-2 flex-wrap">
                    {carCategories.map(c => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() =>
                          setValue(
                            'category',
                            c.name as 'executive' | 'premium' | 'logistics' | 'city' | 'family' | 'economy'
                          )
                        }
                        className={cn(
                          'px-4 py-2 rounded-full text-xs font-medium transition-all',
                          watchCategory === c.name
                            ? 'bg-DeepOrange text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                      >
                        {c.name.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category.message}</p>}
                </div>

                <div className="col-span-12">
                  <p className="text-sm font-medium text-SoftBlack mb-2">Initial Status</p>
                  <div className="flex gap-2 flex-wrap">
                    {['open', 'booked', 'unavailable'].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setValue('status', s as 'open' | 'booked' | 'unavailable')}
                        className={cn(
                          'px-4 py-2 rounded-full text-xs font-medium transition-all',
                          watchStatus === s ? 'bg-DeepOrange text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                      >
                        {s.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  {errors.status && <p className="text-xs text-red-600 mt-1">{errors.status.message}</p>}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <FormBox
                    label="Seats"
                    type="number"
                    placeholder="4"
                    id="seats"
                    register={register}
                    errors={errors?.info?.seats}
                    name="info.seats"
                    classname="rounded-xl"
                    registerOptions={{ valueAsNumber: true }}
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <FormBox
                    label="Engine"
                    type="text"
                    placeholder="V6 3.5L"
                    id="engine"
                    register={register}
                    errors={errors?.specs?.engine}
                    name="specs.engine"
                    classname="rounded-xl"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <FormBox
                    label="Mileage"
                    type="text"
                    placeholder="15km/L"
                    id="mileage"
                    register={register}
                    errors={errors?.specs?.mileage}
                    name="specs.mileage"
                    classname="rounded-xl"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <FormBox
                    label="Top Speed"
                    type="text"
                    placeholder="240km/h"
                    id="topSpeed"
                    register={register}
                    errors={errors?.specs?.topSpeed}
                    name="specs.topSpeed"
                    classname="rounded-xl"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <FormBox
                    label="Boot Space"
                    type="text"
                    placeholder="450L"
                    id="boot"
                    register={register}
                    errors={errors?.specs?.boot}
                    name="specs.boot"
                    classname="rounded-xl"
                  />
                </div>

                <div className="col-span-12">
                  <p className="text-sm font-medium text-SoftBlack mb-2">Transmission</p>
                  <div className="flex gap-2">
                    {['manual', 'automatic', 'hybrid'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setValue('info.transmission', t as 'manual' | 'automatic' | 'hybrid')}
                        className={cn(
                          'px-4 py-2 rounded-full text-xs font-medium transition-all',
                          watchTransmission === t
                            ? 'bg-DeepOrange text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                      >
                        {t.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-12">
                  <p className="text-sm font-medium text-SoftBlack mb-2">Fuel Type</p>
                  <div className="flex gap-2">
                    {['petrol', 'diesel', 'electric'].map(f => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setValue('info.fuel', f as 'petrol' | 'diesel' | 'electric')}
                        className={cn(
                          'px-4 py-2 rounded-full text-xs font-medium transition-all',
                          watchFuel === f ? 'bg-DeepOrange text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                      >
                        {f.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <FormBox
                  label="Vehicle Summary"
                  type="text"
                  inputType="textarea"
                  placeholder="Write a brief description of the vehicle..."
                  id="summary"
                  register={register}
                  errors={errors?.summary}
                  name="summary"
                  classname="rounded-xl"
                />

                <div className="space-y-4">
                  <p className="text-sm font-medium text-SoftBlack">Vehicle Images (Min 1, Max 10)</p>

                  <div
                    className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-DeepOrange/50 transition-colors bg-gray-50/50"
                    onClick={() => document.getElementById('imageUpload')?.click()}
                  >
                    <input
                      type="file"
                      id="imageUpload"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <div className="w-12 h-12 rounded-full bg-DeepOrange/10 flex items-center justify-center mb-3">
                      <Plus className="text-DeepOrange" />
                    </div>
                    <p className="text-sm font-medium text-MainBlack">Click to upload images</p>
                    <p className="text-xs text-SoftBlack mt-1">PNG, JPG up to 2MB</p>
                  </div>

                  {isUploading && (
                    <div className="flex items-center gap-2 text-sm text-DeepOrange animate-pulse">
                      <Loader className="size-4 animate-spin" />
                      Uploading images...
                    </div>
                  )}

                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border">
                        <img src={img.mediaUrl} alt="car" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  {errors.media && <p className="text-xs text-red-600 mt-1">{errors.media.message}</p>}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h1 className="text-lg font-semibold">Review Vehicle Details</h1>
                <div className="bg-SoftWhite p-4 rounded-xl space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-SoftBlack">Name</span>
                    <span className="font-medium text-MainBlack">{getValues('name')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-SoftBlack">Brand</span>
                    <span className="font-medium text-MainBlack">{getValues('brand')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-SoftBlack">Daily Price</span>
                    <span className="font-medium text-MainBlack">₦{getValues('price').toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-SoftBlack">Category</span>
                    <span className="font-medium text-MainBlack">{getValues('category')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-SoftBlack">Status</span>
                    <span className="font-medium text-MainBlack">{getValues('status')}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-sm">
                    <span className="text-SoftBlack">Transmission</span>
                    <span className="font-medium text-MainBlack">{getValues('info.transmission')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-SoftBlack">Fuel</span>
                    <span className="font-medium text-MainBlack">{getValues('info.fuel')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-SoftBlack">Seats</span>
                    <span className="font-medium text-MainBlack">{getValues('info.seats')}</span>
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {uploadedImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.mediaUrl}
                      className="h-16 w-16 rounded-lg object-cover border shrink-0"
                      alt="car preview"
                    />
                  ))}
                </div>
              </div>
            )}
          </fetcher.Form>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-between bg-white rounded-b-xl">
          <Button
            variant="outline"
            onClick={handlePreviousStep}
            disabled={currentStep === 1}
            className="h-12 w-32 rounded-full"
          >
            Previous
          </Button>

          {currentStep === 4 ? (
            <ActionButton
              text="Confirm & Add"
              classname="w-fit py-5.5 px-6 bg-DeepOrange text-white text-sm md:text-base font-normal hover:bg-DeepOrange/90 transition-all rounded-full"
              type="submit"
              form="addFleetForm"
              loading={fetcher.state === 'submitting'}
              children={<Loader className="animate-spin" />}
            />
          ) : (
            <Button
              className="bg-DeepOrange text-white hover:bg-DeepOrange/90 h-12 w-32 rounded-full"
              onClick={handleNextStep}
            >
              Next
            </Button>
          )}
        </div>
      </Modal>
    </>
  )
}
