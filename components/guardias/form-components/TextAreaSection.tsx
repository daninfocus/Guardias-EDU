interface TextAreaSectionProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
}

export const TextAreaSection: React.FC<TextAreaSectionProps> = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  required = false,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        required={required}
        id={id}
        className="mt-1 block w-full resize-none border border-gray-300 shadow-sm sm:text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      ></textarea>
    </div>
  );
};
