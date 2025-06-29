import React from 'react'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'

const EditPasswordModal = ({ isOpen, onClose, onSubmit }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const handleFormSubmit = async (data) => {
        await onSubmit(data);
        reset()
        onClose()
    }

    if (!isOpen) {
        return null;
    }

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-base-100 rounded-lg shadow-xl w-full max-w-md'>
                <div className='flex justify-between items-center p-4 border-b border-base-300'>
                    <h3 className='text-xl font-bold'>Change Password</h3>
                    <button onClick={onClose} className='btn btn-ghost btn-sm btn-circle'>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} className='p-6 space-y-4'>
                    {/* passsword input box */}
                    <div className='form-control'>
                        <label className='label'>
                            <span className='label-text font-medium'>Old Password</span>
                        </label>
                        <input
                            type='password'
                            className='input input-bordered w-full'
                            placeholder='Enter Old Password'
                            {...register('password', { required: 'Old Password is Required' })}
                        />

                        {errors.password && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.password.message}</span>
                            </label>
                        )}

                    </div>
                    {/* New Password Input Box */}
                    <div className='form-control'>

                        <label className='label'>
                            <span className='label-text font-medium'>New Password</span>
                        </label>

                        <input
                            type='password'
                            className='input input-bordered w-full'
                            placeholder='Enter New Password'
                            {...register('newpassword', { required: 'New Password Cannot be Blank' })}
                        />

                        {errors.newpassword && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.password.message}</span>
                            </label>
                        )}

                        <div className="flex justify-end gap-2 mt-6">
                            <button type="button" onClick={onClose} className="btn btn-ghost">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Change Password
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditPasswordModal