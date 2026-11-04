import React from 'react';
import Svg,{Path,Circle,Rect} from 'react-native-svg';
const paths:Record<string,string>={
 ticket:'M3 7h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4V7M15 7v2m0 3v2m0 3v2',
 film:'M4 3h16v18H4zM4 8h16M4 16h16M8 3v18M16 3v18',
 heart:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
 home:'m3 10 9-7 9 7v11h-6v-7H9v7H3Z',
 user:'M20 21v-2a7 7 0 0 0-14 0v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
 bell:'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
 pin:'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
 sun:'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
 moon:'M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10Z',
 sliders:'M4 4v4m0 4v8M12 4v9m0 4v3M20 4v1m0 4v11M1 8h6m2 9h6m2-12h6',
 music:'M9 18V5l12-2v13M9 8l12-2M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0M21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
 smile:'M8 14c2 3 6 3 8 0M8 9h.01M16 9h.01',
 theatre:'M4 3h7v6c0 5-7 6-7 0V3M14 6h7v7c0 5-7 6-7 0V6M6 7h.1M9 7h.1M16 10h.1M19 10h.1',
 sports:'M8 2h8M12 2v4M8 8l8 8m-8 0 8-8',
 pen:'m16 3 5 5-12 12-6 1 1-6L16 3M13 6l5 5',
 image:'M3 3h18v18H3zM3 17l6-6 5 5 3-3 4 4M16 7h.01',
 mountain:'m2 20 7-15 5 9 3-5 5 11H2M6 12h6',
 building:'M4 21V5l8-3 8 3v16M2 21h20M8 8h1m6 0h1M8 12h1m6 0h1M10 21v-5h4v5',
 grid:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
 help:'M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5M12 17h.01',
 arrow:'M5 12h14m-5-5 5 5-5 5',
 chevron:'m9 5 7 7-7 7',
};
export default function Icon({name,color,size=22}:{name:string;color:string;size?:number}){return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">{['smile','help','sports'].includes(name)&&<Circle cx={12} cy={12} r={9}/>}<Path d={paths[name]||paths.ticket}/>{name==='grid'&&<Rect x={3} y={3} width={7} height={7}/>}</Svg>}
