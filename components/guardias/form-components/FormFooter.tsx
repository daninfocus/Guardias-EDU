import React from 'react';

interface FormFooterProps {
  onSubmit: (e: React.SyntheticEvent) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitDisabled?: boolean;
}

export const FormFooter: React.FC<FormFooterProps> = ({
  onSubmit,
  onCancel,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  isSubmitDisabled = false,
}) => {
  return (
    <div className="flex flex-row p-2 justify-end space-x-3 mt-4">
      <button
        type="button"
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        onClick={onCancel}
      >
        {cancelLabel}
      </button>
      <button
        type="submit"
        className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={onSubmit}
        disabled={isSubmitDisabled}
      >
        {submitLabel}
      </button>
    </div>
  );
};

export default FormFooter;
