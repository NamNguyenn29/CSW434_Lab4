import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NotesScreen from '../screens/NotesScreen';
import EditNoteScreen from '../screens/EditNoteScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator({ navigationRef }) {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Notes"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Notes" component={NotesScreen} />
        <Stack.Screen name="EditNote" component={EditNoteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
