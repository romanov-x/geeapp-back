"use client";
import * as React from 'react';
import {Slot} from '@radix-ui/react-slot';
import {cva,type VariantProps} from 'class-variance-authority';
import {cn} from '@/lib/utils';
import {LiquidLayers} from './liquid-glass';

// Supplied component API adapted to Tailwind 3. Hover is gated in the shared CSS.
export const buttonVariants=cva('inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',{
variants:{variant:{default:'bg-primary text-primary-foreground',destructive:'bg-destructive text-primary-foreground',cool:'bg-gradient-to-t from-primary to-primary/85 shadow-md shadow-primary/20 text-primary-foreground',outline:'bg-background text-foreground',secondary:'bg-secondary text-secondary-foreground',ghost:'bg-transparent',link:'text-primary underline-offset-4 hover:underline'},size:{default:'h-9 px-4 py-2',sm:'h-8 rounded-md px-3 text-xs',lg:'h-10 rounded-md px-8',icon:'h-9 w-9'}},defaultVariants:{variant:'default',size:'default'}});
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,VariantProps<typeof buttonVariants>{asChild?:boolean}
export const Button=React.forwardRef<HTMLButtonElement,ButtonProps>(({className,variant,size,asChild=false,type='button',...props},ref)=>{const Comp=asChild?Slot:'button';return <Comp type={asChild?undefined:type} className={cn(buttonVariants({variant,size,className}))} ref={ref} {...props}/>;});Button.displayName='Button';
export const liquidbuttonVariants=cva('liquid-button inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 shrink-0',{
variants:{variant:{default:'bg-transparent text-primary',destructive:'bg-destructive text-white',outline:'bg-background text-foreground',secondary:'bg-secondary text-secondary-foreground',ghost:'bg-transparent',link:'text-primary underline-offset-4 hover:underline'},size:{default:'h-9 px-4 py-2',sm:'h-8 text-xs gap-1.5 px-4',lg:'h-10 rounded-md px-6',xl:'h-12 rounded-md px-8',xxl:'h-14 rounded-md px-10',icon:'h-9 w-9'}},defaultVariants:{variant:'default',size:'xxl'}});
export type LiquidButtonProps=React.ComponentPropsWithoutRef<'button'>&VariantProps<typeof liquidbuttonVariants>&{asChild?:boolean};
export const LiquidButton=React.forwardRef<HTMLButtonElement,LiquidButtonProps>(({className,variant,size,asChild=false,children,type='button',...props},ref)=>{
const Comp=asChild?Slot:'button';
const content=asChild&&React.isValidElement<{children?:React.ReactNode}>(children)?React.cloneElement(children,{},<><LiquidLayers/><span className="liquid-label">{children.props.children}</span></>):<><LiquidLayers/><span className="liquid-label">{children}</span></>;
return <Comp data-slot="button" type={asChild?undefined:type} ref={ref} className={cn(liquidbuttonVariants({variant,size,className}))} {...props}>{content}</Comp>;
});LiquidButton.displayName='LiquidButton';

type ColorVariant='default'|'primary'|'success'|'error'|'gold'|'bronze';
const metalColors:Record<ColorVariant,string>={default:'from-[#B9B9B9] to-[#969696]',primary:'from-primary to-primary/40',success:'from-[#9ADBC8] to-[#3E8F7C]',error:'from-[#F08D8F] to-[#A45253]',gold:'from-[#FFEBA1] to-[#9B873F]',bronze:'from-[#FFE3C9] to-[#A36F3D]'};
// Optional metal variant from the supplied kit. The website uses Liquid Glass.
export const MetalButton=React.forwardRef<HTMLButtonElement,React.ButtonHTMLAttributes<HTMLButtonElement>&{variant?:ColorVariant}>(({children,className,variant='default',...props},ref)=><button ref={ref} className={cn('metal-button inline-flex h-11 items-center justify-center rounded-md bg-gradient-to-b px-6 py-2 font-semibold text-white',metalColors[variant],className)} {...props}>{children||'Button'}</button>);MetalButton.displayName='MetalButton';
