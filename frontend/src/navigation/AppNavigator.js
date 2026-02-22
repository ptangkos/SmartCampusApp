import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthScreen from '../screens/AuthScreen';
import IncidentDetailScreen from '../screens/IncidentDetailScreen';
import ReportScreen from '../screens/ReportScreen';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {/* Fix #21: user is set for both logged-in users AND guests */}
      {!user ? (
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="IncidentDetail" component={IncidentDetailScreen} options={{ title: 'Incident Details' }} />
          <Stack.Screen name="Report" component={ReportScreen} options={{ title: 'Report Incident' }} />
        </>
      )}
    </Stack.Navigator>
  );
}