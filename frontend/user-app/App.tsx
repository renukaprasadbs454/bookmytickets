import React, {useEffect} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  useEffect(() => {
    // Remove only this app's retired prototype data when upgrading an install.
    // Retry on the next launch if device storage is temporarily unavailable.
    void AsyncStorage.multiRemove(['cinepass-v1', 'cinepass-theme']).catch(() => {});
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: '#FFFFFF'},
});
