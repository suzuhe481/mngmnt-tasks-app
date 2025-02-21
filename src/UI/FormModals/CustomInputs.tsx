import { ICustomData } from "../../types/types";

interface ICustomInputs {
  customFields: Record<string, ICustomData> | undefined;
  handleCustomFieldChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabledInputs?: boolean;
}

export const CustomInputs = ({
  customFields,
  handleCustomFieldChange,
  disabledInputs = false,
}: ICustomInputs) => {
  if (customFields === undefined) {
    return;
  }

  // Returns multiple inputs based on the customFields
  // Inputs can be text, number, or checkbox.
  return Object.entries(customFields).map(([title, field]) => {
    const { type, value } = field;
    let inputElement;

    switch (type) {
      case "text":
        inputElement = (
          <input
            type="text"
            name={title}
            value={value as string}
            onChange={handleCustomFieldChange}
            disabled={disabledInputs}
            className="rounded-md border-2 border-slate-400 py-3 px-4 focus:outline-none focus:border-[#75C1FF] focus:shadow-[0_0_0_2px_#B3E0FF]"
          />
        );
        break;
      case "number":
        inputElement = (
          <input
            type="number"
            name={title}
            value={value as number}
            onChange={handleCustomFieldChange}
            disabled={disabledInputs}
            className="rounded-md border-2 border-slate-400 py-3 px-4 focus:outline-none focus:border-[#75C1FF] focus:shadow-[0_0_0_2px_#B3E0FF]"
          />
        );
        break;
      case "checkbox":
        inputElement = (
          <input
            type="checkbox"
            name={title}
            checked={value as boolean}
            onChange={handleCustomFieldChange}
            disabled={disabledInputs}
            className="rounded-md border-2 border-slate-400 py-3 px-4 focus:outline-none focus:border-[#75C1FF] focus:shadow-[0_0_0_2px_#B3E0FF]"
          />
        );
        break;
    }

    return (
      <div
        key={title}
        className={`flex ${
          type === "checkbox" ? "flex-row gap-2" : "flex-col"
        } w-full mb-6`}
      >
        <label htmlFor={title}>{title}</label>
        {inputElement}
      </div>
    );
  });
};
