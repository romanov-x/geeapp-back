"use client";
import * as React from 'react';
import {cn} from '@/lib/utils';
export const GLASS_FILTER='container-glass';
// A single, addressable SVG filter per document, including on native HTML surfaces.
export function GlassFilter(){return <svg width="0" height="0" aria-hidden="true" focusable="false" style={{position:'fixed',pointerEvents:'none'}}><defs><filter id={GLASS_FILTER} x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="turbulence"/>
<feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise"/>
<feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="70" xChannelSelector="R" yChannelSelector="B" result="displaced"/>
<feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur"/>
<feComposite in="finalBlur" in2="finalBlur" operator="over"/>
</filter></defs></svg>;}
export function LiquidLayers(){return null;}
export function LiquidSurface({className,children,...props}:React.HTMLAttributes<HTMLDivElement>){return <div {...props} className={cn('liquid-surface',className)}><LiquidLayers/>{children}</div>;}
