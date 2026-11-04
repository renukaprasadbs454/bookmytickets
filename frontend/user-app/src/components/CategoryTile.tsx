import React from 'react';
import {Image,Pressable,Text,View} from 'react-native';
import {usePalette} from '../lib/ui';
const artwork:Record<string,any>={
 all:require('../../assets/flaticon/all.png'),movie:require('../../assets/flaticon/movie.png'),music:require('../../assets/flaticon/music.png'),comedy:require('../../assets/flaticon/comedy.png'),play:require('../../assets/flaticon/play.png'),sports:require('../../assets/flaticon/sports.png'),workshop:require('../../assets/flaticon/workshop.png'),exhibition:require('../../assets/flaticon/exhibition.png'),activity:require('../../assets/flaticon/activity.png'),'venue-rentals':require('../../assets/flaticon/venue-rentals.png'),
};
const backgrounds:Record<string,string>={all:'#eee5ff',movie:'#eee5ff',music:'#e5edff',comedy:'#fff0df',play:'#fce6f1',sports:'#ffe7e9',workshop:'#fff2d9',exhibition:'#e0f4f8',activity:'#e1f3e8','venue-rentals':'#ece8fc'};
export default function CategoryTile({name,slug,selected,onPress}:{name:string;slug:string;selected:boolean;onPress:()=>void}){
 const c=usePalette();return <Pressable accessibilityRole="button" accessibilityLabel={name} accessibilityState={{selected}} aria-pressed={selected} onPress={onPress} style={({pressed})=>({width:116,alignItems:'center',gap:11,paddingTop:12,paddingBottom:12,borderRadius:22,borderWidth:1,borderColor:selected?c.accent:'transparent',backgroundColor:selected?c.tint:pressed?c.surface:'transparent',transform:[{scale:pressed?.96:1}]})}>
 <View style={{height:82,width:82,borderRadius:26,backgroundColor:backgrounds[slug]||backgrounds.all,alignItems:'center',justifyContent:'center'}}><Image source={artwork[slug]||artwork.all} resizeMode="contain" style={{width:58,height:58}}/></View>
 <Text numberOfLines={2} style={{height:34,lineHeight:17,paddingHorizontal:6,textAlign:'center',color:selected?c.accent:c.text,fontSize:12,fontWeight:selected?'800':'600'}}>{name}</Text><View style={{height:3,width:selected?22:6,borderRadius:3,backgroundColor:selected?c.accent:c.border}}/>
 </Pressable>;
}
