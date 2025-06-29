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
                </div>

            </div>
        </div>
    )
}

export default EditPasswordModal