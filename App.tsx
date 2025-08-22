import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from './src/components/ui/toaster';
import { User, UserProvider, useUser } from './src/context/UserContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getUserDocument } from './src/lib/firebase';
import LinearGradient from 'react-native-linear-gradient';

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <LinearGradient colors={['#394242', '#26394C']} style={StyleSheet.absoluteFill} />
    <ActivityIndicator size="large" color="#ffffff" />
  </View>
);

const AppContent = () => {
  const { login } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = await getUserDocument(firebaseUser.uid);
        if (userProfile) {
          // The flexible User type in the context now accepts the userProfile object directly
          login(userProfile as User);
        }
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <AppNavigator />;
};

export default function App() {
  return (
    <UserProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
        <Toaster />
      </SafeAreaProvider>
    </UserProvider>
  );
}

// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, Button } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const App = () => {
//   const [testResult, setTestResult] = useState('Testing...');
//   const [readResult, setReadResult] = useState<string | null>('Not read yet.');

//   const runTest = async () => {
//     try {
//       console.log('--- RUNNING ASYNCSTORAGE TEST ---');

//       // 1. Try to write a value
//       await AsyncStorage.setItem('debug_key', 'it_works!');
//       console.log('setItem successful.');

//       // 2. Try to read the value back immediately
//       const value = await AsyncStorage.getItem('debug_key');
//       console.log('getItem result:', value);
//       setTestResult(value === 'it_works!' ? '✅ Write/Read Test PASSED' : '❌ Write/Read Test FAILED');

//     } catch (e) {
//       // This is the updated block
//       console.error('AsyncStorage test failed with error:', e);
//       if (e instanceof Error) {
//         setTestResult(`❌ Test failed with error: ${e.message}`);
//       } else {
//         setTestResult(`❌ Test failed with an unknown error type.`);
//       }
//     }
//   };

//   const readOnDemand = async () => {
//     const value = await AsyncStorage.getItem('debug_key');
//     setReadResult(value);
//   }

//   // Run the test once when the app starts
//   useEffect(() => {
//     runTest();
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.header}>AsyncStorage Debug Test</Text>
//       <Text style={styles.text}>Initial Test Result:</Text>
//       <Text style={styles.result}>{testResult}</Text>

//       <View style={styles.divider} />

//       <Button title="Attempt to Read Value Again" onPress={readOnDemand} />
//       <Text style={styles.text}>Value read on demand:</Text>
//       <Text style={styles.result}>{String(readResult)}</Text>

//       <Text style={styles.instructions}>
//         Close the app completely (swipe away) and reopen it. Then press the button again. If the value is 'null', storage is not persisting.
//       </Text>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#1a1a1a',
//     padding: 20,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 20,
//   },
//   text: {
//     fontSize: 16,
//     color: '#ccc',
//     marginTop: 15,
//   },
//   result: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginTop: 5,
//   },
//   divider: {
//     height: 1,
//     width: '80%',
//     backgroundColor: '#444',
//     marginVertical: 30,
//   },
//   instructions: {
//     fontSize: 14,
//     color: '#aaa',
//     textAlign: 'center',
//     marginTop: 40,
//   }
// });

// export default App;

// import React, { useEffect, useState } from 'react';
// import { View, ActivityIndicator, StyleSheet } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { AppNavigator } from './src/navigation/AppNavigator';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { Toaster } from './src/components/ui/toaster';
// import { User, UserProvider, useUser } from './src/context/UserContext';
// // DELETED: import { onAuthStateChanged } from 'firebase/auth';
// import { auth, getUserDocument } from './src/lib/firebase';
// import LinearGradient from 'react-native-linear-gradient';

// const LoadingScreen = () => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <LinearGradient
//         colors={['#394242', '#26394C']}
//         style={StyleSheet.absoluteFill}
//     />
//     <ActivityIndicator size="large" color="#ffffff" />
//   </View>
// );

// const AppContent = () => {
//   const { login } = useUser();
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // MODIFIED: The compat API uses a method on the auth object directly
//     const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
//       if (firebaseUser) {
//         const userProfile = await getUserDocument(firebaseUser.uid);
//         if (userProfile) {
//           login(userProfile as User);
//         }
//       }
//       setIsLoading(false);
//     });
//     return unsubscribe;
//   }, []);

//   if (isLoading) {
//     return <LoadingScreen />;
//   }

//   return <AppNavigator />;
// }

// export default function App() {
//   return (
//     <UserProvider>
//       <SafeAreaProvider>
//         <NavigationContainer>
//           <AppContent />
//         </NavigationContainer>
//         <Toaster />
//       </SafeAreaProvider>
//     </UserProvider>
//   );
// }
