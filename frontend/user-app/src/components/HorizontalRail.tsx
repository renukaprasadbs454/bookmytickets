import React from 'react';
import {ScrollView} from 'react-native';
export default function HorizontalRail({children,gap=14,label}:{children:React.ReactNode;gap?:number;label:string}){return <ScrollView horizontal nestedScrollEnabled directionalLockEnabled showsHorizontalScrollIndicator accessibilityLabel={label} style={{flexGrow:0}} contentContainerStyle={{gap,paddingBottom:8}}>{children}</ScrollView>}
