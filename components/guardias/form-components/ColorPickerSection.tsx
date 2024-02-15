interface ColorPickerSectionProps {
  selectedColor: number;
  changeColor: (number: number) => void;
  colors: string[];
}

export const ColorPickerSection: React.FC<ColorPickerSectionProps> = ({
  selectedColor,
  changeColor,
  colors,
}) => {
  return (
    <div className="flex flex-row items-center justify-between w-full">
      <label className="text-sm font-medium">Color:</label>
      <div className="flex flex-row items-center">
        {colors.map((color, index) => (
          <button
            key={index}
            style={{ backgroundColor: color }}
            className={`h-8 w-8 rounded-full m-1 ${
              selectedColor === index ? "ring-2 ring-offset-2 ring-white" : ""
            }`}
            onClick={() => changeColor(index)}
          />
        ))}
      </div>
    </div>
  );
};
