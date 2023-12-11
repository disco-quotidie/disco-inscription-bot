import React, { FC } from "react";
import { twMerge } from "tailwind-merge";

// button component using tailwind
/**
 * @Button
 */

interface Props {
  theme: "primary" | "outline" | 'danger';
  text: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const Button: FC<Props> = ({ theme, text, onClick, className, disabled }) => {
  const colorStyle = {
    primary: "bg-black text-white disabled:bg-gray-300",
    outline: "bg-white text-black disabled:text-gray-300 border border-black disabled:border-gray-300",
    danger: "bg-red-800 text-white disabled:bg-gray-300",
  }
  const cls = twMerge(
    colorStyle[theme],
    "flex justify-center items-center",
    "disabled:cursor-not-allowed ",
    "rounded-full ",
    "py-3 ",
    "hover:scale-[1.01] active:scale-[0.98] disabled:hover:scale-100 transition-all",
    className
  );
  return (
    <button className={cls} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;
