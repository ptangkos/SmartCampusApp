import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import AuthScreen from '../screens/AuthScreen';
import IncidentDetailScreen from '../screens/IncidentDetailScreen';
import ReportScreen from '../screens/ReportScreen';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="IncidentDetail" component={IncidentDetailScreen} />
          <Stack.Screen name="Report" component={ReportScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}