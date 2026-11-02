// // import React, { useEffect, useState } from "react";
// // import Select from "react-select";

// // export type Option = {
// //   value: string;
// //   label: string;
// // };

// // export interface SelectProps {
// //   options: Option[];
// //   defaultValue?: Option;
// //   className?: string;
// //   name?:string;
// //   styles?: any; 
// //   value?: string;
// //   onChange?: (name: string, value: string) => void; 
// // }

// // const customComponents = {
// //   IndicatorSeparator: () => null,
// // };

// // const CommonSelect: React.FC<SelectProps> = ({ options, defaultValue, className, name,  value,onChange,}) => {
// //   const [selectedOption, setSelectedOption] = useState<Option | undefined>(defaultValue);

// //  const customStyles = {
// //   option: (base: any, state: any) => ({
// //     ...base,
// //     backgroundColor: state.isSelected
// //       ? "#E41F07"
// //       : state.isFocused
// //       ? "#white" // optional: different hover bg if not selected
// //       : "white",
// //     color: state.isSelected
// //       ? "#fff"
// //       : state.isFocused
// //       ? "#E41F07"
// //       : "#707070",
// //     cursor: "pointer",
// //     "&:hover": {
// //       backgroundColor: "#E41F07", // lighter hover effect (or keep same as focused)
// //       color: state.isSelected ? "white" : "#fff",
// //     },
// //   }),
// // };


// //  const handleChange = (option: Option | null) => {
// //     setSelectedOption(option || undefined);
// //     if (onChange && name && option) {
// //       onChange(name, option.value); // 👈 send data to parent
// //     }
// //   };

// //   useEffect(() => {
// //     setSelectedOption(defaultValue || undefined);
// //   }, [defaultValue]);
// //   return (
// //     <div className="common-select">
// //     <Select
// //      classNamePrefix="react-select"
// //       className={className}
// //       styles={customStyles}
// //       options={options}
// //       value={selectedOption}
// //       onChange={handleChange}
// //       components={customComponents}
// //       placeholder="Select"
// //       name={name}
// //     />
// //     </div>
// //   );
// // };

// // export default CommonSelect;

// import React, { useEffect, useState } from "react";
// import Select from "react-select";

// export type Option = {
//   value: string;
//   label: string;
// };

// export interface SelectProps {
//   options: Option[];
//   defaultValue?: Option;
//   className?: string;
//   name?: string;
//   value?: string;
//   onChange?: (name: string, value: string) => void;
// }

// const customComponents = {
//   IndicatorSeparator: () => null,
// };

// const CommonSelect: React.FC<SelectProps> = ({
//   options,
//   defaultValue,
//   className,
//   name,
//   value,
//   onChange,
// }) => {
//   // Internal selected state
//   const [selectedOption, setSelectedOption] = useState<Option | null>(null);

//   // Sync internal state with parent value
//  useEffect(() => {
//   if (options.length > 0) {
//     if (value) {
//       const match = options.find((opt) => opt.value === value);
//       setSelectedOption(match || null);
//     } else if (defaultValue) {
//       setSelectedOption(defaultValue);
//     }
//   }
// }, [value, defaultValue, options]);

//   // Handle selection change
//   const handleChange = (option: Option | null) => {
//   setSelectedOption(option);

//   if (onChange && option && name !== undefined) {
//     onChange(name, option.value);
//   }
// };


//   return (
//     <Select
//       classNamePrefix="react-select"
//       className={className}
//       options={options}
//       value={selectedOption}
//       onChange={handleChange}
//       components={customComponents}
//       placeholder="Select"
//       name={name}
//     />
//   );
// };

// export default CommonSelect;


//nexila changes - dropdown
import React, { useEffect, useState } from "react";
import Select from "react-select";

export type Option = {
  value: string;
  label: string;
};

export interface SelectProps {
  options: Option[];
  className?: string;
  name?: string;
  value?: string;
  onChange?: (name: string, value: string) => void;
}

const customComponents = {
  IndicatorSeparator: () => null,
};

const CommonSelect: React.FC<SelectProps> = ({
  options,
  className,
  name,
  value,
  onChange,
}) => {

  // Internal selected state
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  // Sync internal state with parent value
  useEffect(() => {

    if (options.length > 0) {

      // if value exists
      if (value) {
        const match = options.find((opt) => opt.value === value);
        setSelectedOption(match || null);
      }

      // if value empty -> clear dropdown
      else {
        setSelectedOption(null);
      }
    }

  }, [value, options]);

  // Handle selection change

  // const handleChange = (option: Option | null) => {
  //   setSelectedOption(option);

  //   if (onChange && option && name !== undefined) {
  //     onChange(name, option.value);
  //   }
  // };

  // nexila change
  const handleChange = (option: Option | null) => {

    setSelectedOption(option);

    if (onChange && name !== undefined) {
      onChange(name, option ? option.value : "");
    }

  };

  return (
    <Select
      classNamePrefix="react-select"
      className={className}
      options={options}
      value={selectedOption}
      onChange={handleChange}
      components={customComponents}
      placeholder="Select"
      name={name}
      isClearable
    />
  );
};

export default CommonSelect;