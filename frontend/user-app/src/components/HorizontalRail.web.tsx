import React,{useEffect,useRef,useState} from 'react';
import {usePalette} from '../lib/ui';
import Icon from './Icon';
export default function HorizontalRail({children,gap=14,label}:{children:React.ReactNode;gap?:number;label:string}){
 const c=usePalette(),rail=useRef<HTMLDivElement>(null),drag=useRef<{x:number;left:number;active:boolean}|null>(null),suppress=useRef(false);
 const [position,setPosition]=useState({left:false,right:false});
 useEffect(()=>{const el=rail.current;if(!el)return;const update=()=>setPosition({left:el.scrollLeft>2,right:el.scrollLeft+el.clientWidth<el.scrollWidth-2});const wheel=(event:WheelEvent)=>{if(event.ctrlKey||event.shiftKey||Math.abs(event.deltaX)>Math.abs(event.deltaY))return;const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?el.clientWidth:1);const next=Math.max(0,Math.min(el.scrollWidth-el.clientWidth,el.scrollLeft+delta));if(Math.abs(next-el.scrollLeft)>1){event.preventDefault();el.scrollLeft=next}};const resize=new ResizeObserver(update);resize.observe(el);if(el.firstElementChild)resize.observe(el.firstElementChild);el.addEventListener('scroll',update);el.addEventListener('wheel',wheel,{passive:false});update();return()=>{resize.disconnect();el.removeEventListener('scroll',update);el.removeEventListener('wheel',wheel)}},[children]);
 const move=(direction:number)=>rail.current?.scrollBy({left:direction*Math.max(180,rail.current.clientWidth*.8),behavior:'smooth'});
 return <div style={{minWidth:0,width:'100%'}}>
 <div ref={rail} role="region" aria-label={label} tabIndex={0} onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1)}}}
 onDragStart={e=>e.preventDefault()}
 onPointerDown={e=>{if(e.pointerType==='mouse'&&e.button===0)drag.current={x:e.clientX,left:e.currentTarget.scrollLeft,active:false}}}
 onPointerMove={e=>{const d=drag.current;if(!d)return;const delta=e.clientX-d.x;if(!d.active&&Math.abs(delta)>6){d.active=true;suppress.current=true;e.currentTarget.setPointerCapture(e.pointerId)}if(d.active){e.preventDefault();e.currentTarget.scrollLeft=d.left-delta}}}
 onPointerUp={e=>{if(drag.current?.active){e.preventDefault();if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);setTimeout(()=>{suppress.current=false},0)}drag.current=null}}
 onPointerCancel={()=>{drag.current=null;suppress.current=false}}
 onClickCapture={e=>{if(suppress.current){e.preventDefault();e.stopPropagation()}}}
 style={{width:'100%',overflowX:'auto',overflowY:'hidden',overscrollBehaviorX:'contain',cursor:'grab',touchAction:'auto',scrollbarWidth:'thin',scrollbarColor:c.accent+' '+c.tint,paddingBottom:8,WebkitOverflowScrolling:'touch'}}>
 <div style={{display:'flex',gap,width:'max-content',minWidth:'100%'}}>{React.Children.map(children,(child,index)=><div key={index} style={{flex:'0 0 auto',userSelect:'none'}}>{child}</div>)}</div>
 </div>
 {(position.left||position.right)&&<div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:6}}>{[-1,1].map(direction=><button key={direction} type="button" aria-label={label+': scroll '+(direction===1?'right':'left')} disabled={direction===1?!position.right:!position.left} onClick={()=>move(direction)} style={{display:'flex',alignItems:'center',justifyContent:'center',width:32,height:32,borderRadius:16,border:'1px solid '+c.border,background:c.surface,opacity:(direction===1?position.right:position.left)?1:.35,cursor:'pointer',transform:direction===-1?'rotate(180deg)':undefined}}><Icon name="chevron" size={16} color={c.accent}/></button>)}</div>}
 </div>;
}
