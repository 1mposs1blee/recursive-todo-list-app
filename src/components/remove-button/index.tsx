import { DOMAttributes, memo } from "react";
import Image from "next/image";
import classNames from "classnames";

export type RemoveButtonProps = {
  click: DOMAttributes<HTMLButtonElement>["onClick"];
};

export const RemoveButton = memo(function RemoveButton({
  click,
}: RemoveButtonProps) {
  return (
    <button
      className={classNames(
        "justify-self-center flex justify-center items-center border border-red-500 transition-colors",
        "hover:bg-red-500 focus:bg-red-500 w-5 h-5 rounded-full group outline-none"
      )}
      onClick={click}
      aria-label="delete todo"
    >
      <Image
        className="opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity"
        width="6"
        height="6"
        src="/cross.svg"
        alt="cross sign"
      />
    </button>
  );
});
