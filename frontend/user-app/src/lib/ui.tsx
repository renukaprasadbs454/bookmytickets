import React from 'react';
import {ActivityIndicator,Pressable,ScrollView,StyleSheet,Text,View} from 'react-native';
import {useSession} from './session';
export function usePalette(){const {mode}=useSession();return mode==='dark'?{bg:'#101014',surface:'#1b1822',text:'#f5f0fd',muted:'#a39bad',border:'#37303f',accent:'#ae8af7',tint:'#312342',button:'#21132e'}:{bg:'#f7f5fb',surface:'#fff',text:'#251c35',muted:'#776b87',border:'#e5deef',accent:'#7040cd',tint:'#eee5fc',button:'#fff'}}
export function Screen({children}:{children:React.ReactNode}){const c=usePalette();return <ScrollView style={{flex:1,backgroundColor:c.bg}} contentContainerStyle={{padding:22,gap:18,paddingBottom:40,width:'100%',maxWidth:1180,alignSelf:'center'}} keyboardShouldPersistTaps="handled">{children}</ScrollView>}
export function Heading({children}:{children:React.ReactNode}){const c=usePalette();return <Text style={{color:c.text,fontSize:25,fontWeight:'800',lineHeight:33}}>{children}</Text>}
export function Muted({children}:{children:React.ReactNode}){const c=usePalette();return <Text style={{color:c.muted,fontSize:13,lineHeight:22}}>{children}</Text>}
export function Card({children}:{children:React.ReactNode}){const c=usePalette();return <View style={{padding:18,borderRadius:18,gap:10,backgroundColor:c.surface,borderWidth:1,borderColor:c.border}}>{children}</View>}
export function Button({title,onPress,disabled=false,secondary=false}:{title:string;onPress:()=>void;disabled?:boolean;secondary?:boolean}){const c=usePalette();return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={{backgroundColor:secondary?c.tint:c.accent,borderRadius:24,padding:16,alignItems:'center',opacity:disabled?.4:1}}><Text style={{color:secondary?c.accent:c.button,fontWeight:'700',fontSize:14}}>{title}</Text></Pressable>}
export function ErrorBox({error}:{error:string}){return error?<Text accessibilityRole="alert" style={{color:'#c66681',fontSize:13,lineHeight:21}}>{error}</Text>:null}
export function Loading(){const c=usePalette();return <ActivityIndicator color={c.accent} style={{margin:30}}/>}
export function Empty({title,message}:{title:string;message:string}){return <Card><Heading>{title}</Heading><Muted>{message}</Muted></Card>}
export const common=StyleSheet.create({row:{flexDirection:'row',alignItems:'center',gap:12},wrap:{flexDirection:'row',flexWrap:'wrap',gap:10},input:{borderWidth:1,borderRadius:12,padding:14,fontSize:15},poster:{height:220,width:'100%',borderRadius:16},smallPoster:{width:62,height:90,borderRadius:8}});
