import React from 'react';
import {Pressable,Text,View} from 'react-native';
import Svg,{Circle,Ellipse,G,Path,Rect} from 'react-native-svg';
import {usePalette} from '../lib/ui';
import {useSession} from '../lib/session';
const themes:Record<string,{icon:string;color:string;light:string;dark:string}>={
 all:{icon:'all',color:'#9c72f5',light:'#eee5ff',dark:'#302240'},
 movie:{icon:'movie',color:'#9c72f5',light:'#eee5ff',dark:'#302240'},
 music:{icon:'music',color:'#638cf5',light:'#e5edff',dark:'#202d48'},
 comedy:{icon:'comedy',color:'#ed9860',light:'#fff0df',dark:'#3d2c23'},
 play:{icon:'play',color:'#dc78a9',light:'#fce6f1',dark:'#3d2333'},
 sports:{icon:'sports',color:'#ec737b',light:'#ffe7e9',dark:'#40252d'},
 workshop:{icon:'workshop',color:'#d9a346',light:'#fff2d9',dark:'#393020'},
 exhibition:{icon:'exhibition',color:'#55afc7',light:'#e0f4f8',dark:'#20343d'},
 activity:{icon:'activity',color:'#66b58e',light:'#e1f3e8',dark:'#21382f'},
 'venue-rentals':{icon:'venue',color:'#9b89db',light:'#ece8fc',dark:'#2e2941'},
};
function Artwork({kind,color,background}:{kind:string;color:string;background:string}){
 const ink='#352747',paper='#fff9ef';
 return <Svg width={94} height={88} viewBox="0 0 100 94" fill="none">
 <Circle cx={50} cy={45} r={37} fill={background}/><Circle cx={17} cy={24} r={3} fill={color} opacity={.5}/><Circle cx={83} cy={65} r={2.5} fill={color} opacity={.6}/><Path d="M79 17v8m-4-4h8M17 65v7m-3.5-3.5h7" stroke={color} strokeWidth={2} strokeLinecap="round"/><Ellipse cx={50} cy={77} rx={23} ry={4} fill={color} opacity={.13}/>
 <G rotation={-9} origin="50,48" stroke={ink} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round">
 {kind==='movie'?<><Path d="M31 37h38l-5 36H36Z" fill={color}/><Path d="m40 38 3 33m9-33v33m10-33-3 33" stroke={paper} strokeWidth={5}/><Path d="M28 38c-5-6 0-13 6-12-2-9 10-14 15-7 5-9 18-5 17 3 9-1 15 11 7 16Z" fill={paper}/><Circle cx={42} cy={29} r={3} fill="#f7d995" stroke="none"/><Circle cx={60} cy={30} r={3} fill="#f7d995" stroke="none"/></>:
 kind==='music'?<><Rect x={41} y={20} width={19} height={34} rx={9.5} fill={color}/><Path d="M35 42v4a15 15 0 0 0 30 0v-4M50 61v13m-10 0h20M46 28h9m-9 7h9"/><Path d="m70 25 8-3v17m-5-12 5-2" stroke={color} strokeWidth={3}/><Circle cx={74} cy={40} r={4} fill={color} stroke="none"/></>:
 kind==='comedy'?<><Circle cx={50} cy={46} r={26} fill={color}/><Path d="M32 47c4 22 32 22 36 0Z" fill={paper}/><Path d="M35 38q5-8 10 0m10 0q5-8 10 0" strokeWidth={3}/><Path d="M43 63q7-7 14 0" fill="#ed737b"/></>:
 kind==='play'?<><Path d="M26 23q14 9 28 0v25c0 20-28 23-28 0Z" fill={paper}/><Path d="M45 35q14 9 28 0v25c0 20-28 23-28 0Z" fill={color}/><Path d="m32 36 7 2m5 0 5-2M33 48q7-7 14 0M51 48l6 2m6 0 5-2M53 59q7 8 13 0"/></>:
 kind==='sports'?<><Path d="M33 25h34v18c0 25-34 25-34 0Z" fill={color}/><Path d="M33 29H22v9c0 10 9 14 15 13m30-22h11v9c0 10-9 14-15 13M50 61v9"/><Path d="M38 70h24v7H38Z" fill={color}/><Path d="m50 32 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1Z" fill={paper} stroke="none"/></>:
 kind==='workshop'?<><Path d="m29 61 6 12 10-5 30-38-15-12Z" fill={color}/><Path d="m35 73 10-5-9-8-7 1Z" fill={paper}/><Path d="m55 25 14 12M32 67l-5 9 8-3"/><Rect x={24} y={25} width={24} height={29} rx={4} fill={paper}/><Path d="M30 33h12m-12 7h9m-9 7h6" stroke={color}/></>:
 kind==='exhibition'?<><Rect x={23} y={23} width={54} height={49} rx={4} fill={color}/><Rect x={29} y={29} width={42} height={37} rx={2} fill={paper}/><Circle cx={58} cy={39} r={6} fill={color} stroke="none"/><Path d="m29 59 13-17 14 18 7-9 8 15H29Z" fill={color}/></>:
 kind==='activity'?<><Path d="m20 71 26-46 19 31 9-14 13 29Z" fill={color}/><Path d="m36 42 10-17 10 17-10-5Z" fill={paper}/><Path d="M33 72q27-12 17-18" stroke={paper} strokeWidth={3}/><Circle cx={72} cy={25} r={8} fill="#f3cc77" stroke="none"/></>:
 kind==='venue'?<><Path d="M25 75V30l25-12 25 12v45Z" fill={color}/><Path d="M20 75h60M23 30h54"/><Path d="M42 75V57h16v18" fill={paper}/>{[34,49,64].map(x=><G key={x}><Rect x={x-3} y={37} width={7} height={10} rx={1} fill={paper} stroke="none"/></G>)}</>:
 <><Rect x={25} y={26} width={48} height={40} rx={6} fill={color} transform="rotate(12 49 46)"/><Path d="M22 38h51v10a6 6 0 0 0 0 12v10H22V60a6 6 0 0 0 0-12Z" fill={paper}/><Path d="M60 39v7m0 5v7m0 5v6" stroke={color}/><Path d="m41 44 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" fill={color} stroke="none"/></>}
 </G></Svg>;
}
export default function CategoryTile({name,slug,selected,onPress}:{name:string;slug:string;selected:boolean;onPress:()=>void}){
 const c=usePalette(),{mode}=useSession(),t=themes[slug]||themes.all;
 return <Pressable accessibilityRole="button" accessibilityLabel={name} accessibilityState={{selected}} aria-pressed={selected} onPress={onPress} style={({pressed})=>({width:116,alignItems:'center',gap:9,paddingTop:8,paddingBottom:12,borderRadius:22,borderWidth:1,borderColor:selected?c.accent:'transparent',backgroundColor:selected?c.tint:pressed?c.surface:'transparent',transform:[{scale:pressed?.96:1}]})}>
 <View style={{height:88,width:100,alignItems:'center',justifyContent:'center'}}><Artwork kind={t.icon} color={t.color} background={mode==='dark'?t.dark:t.light}/></View>
 <Text numberOfLines={2} style={{height:34,lineHeight:17,paddingHorizontal:6,textAlign:'center',color:selected?c.accent:c.text,fontSize:12,fontWeight:selected?'800':'600'}}>{name}</Text>
 <View style={{height:3,width:selected?22:6,borderRadius:3,backgroundColor:selected?c.accent:c.border}}/>
 </Pressable>;
}
