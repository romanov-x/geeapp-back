"use client";
import {useEffect} from "react";
export function useFaqMotion(){useEffect(()=>{
  const cleanups:(()=>void)[]=[];
  document.querySelectorAll<HTMLDetailsElement>("#faq details").forEach(details=>{
    const summary=details.querySelector("summary")!,answer=details.querySelector<HTMLElement>(".faq-answer")!;
    let animation:Animation|null=null,target=details.open;
    const toggle=(event:MouseEvent)=>{
      event.preventDefault();target=animation?!target:!details.open;
      const from=answer.getBoundingClientRect().height,opacity=getComputedStyle(answer).opacity;
      animation?.cancel();animation=null;details.dataset.expanded=String(target);
      if(event.detail===0){details.open=target;return;}
      details.open=true;const height=answer.scrollHeight,reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
      animation=answer.animate(reduced?[{opacity:target?0:opacity},{opacity:target?1:0}]:[{height:`${from}px`,opacity:target?Math.min(+opacity,.5):opacity},{height:`${target?height:0}px`,opacity:target?1:0}],{duration:reduced?120:200,easing:"cubic-bezier(.23,1,.32,1)",fill:"both"});
      const current=animation;void current.finished.then(()=>{if(animation!==current)return;details.open=target;current.cancel();animation=null;}).catch(()=>{});
    };
    summary.addEventListener("click",toggle);cleanups.push(()=>{animation?.cancel();summary.removeEventListener("click",toggle);});
  });return()=>cleanups.forEach(clean=>clean());
},[]);}
