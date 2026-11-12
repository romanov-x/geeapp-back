"use client";
export type DropdownItem={value:string;label:string;hint?:string;disabled?:boolean};
export type DropdownProps={items:DropdownItem[];value?:string;onChange?:(value:string)=>void;label?:string;placeholder?:string;disabled?:boolean;controlId?:string;describedBy?:string;invalid?:boolean;required?:boolean;complete?:boolean};
export function Dropdown({items,value="",onChange,label,disabled,controlId,describedBy,invalid,required,complete}:DropdownProps){
  return (
    <select id={controlId} name={controlId} aria-label={label}
      aria-describedby={describedBy} aria-invalid={invalid || undefined}
      disabled={disabled} required={required} value={value}
      onChange={event=>onChange?.(event.target.value)}
      className="hero-select-trigger native-select"
      data-complete={complete} data-select-id={controlId}>
      {items.map(item=><option key={item.value} value={item.value} disabled={item.disabled || !item.value}>{item.label}</option>)}
    </select>
  );
}
