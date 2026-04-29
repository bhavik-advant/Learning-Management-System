import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

type DropDownProps = {
  onSelect: (val: string) => void;
  trigger: string | React.ReactNode;
  options: string[];
};

function DropDown({ trigger, options, onSelect }: DropDownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {options.map((option, index) => (
            <DropdownMenuItem onClick={onSelect.bind(null, option)} key={index}>
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DropDown;
