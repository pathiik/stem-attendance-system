import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../FirebaseConfig';
import { router } from 'expo-router';
import AuthTabs from '../components/AuthTabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../FirebaseConfig'; // Import Firestore instance

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const insets = useSafeAreaInsets();

  // Clearing the error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Function to handle login and signup
  const handleAuth = async () => {
    if (activeTab === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      if (activeTab === 'login') {
        // Login logic
        await signInWithEmailAndPassword(auth, email, password);
        router.replace('/'); // Navigating to the home screen after login
      } else {
        // Signup logic
        // Checking if the email exists in the "parents" collection
        const parentsRef = collection(db, 'parents');
        const q = query(parentsRef, where('parent_email', '==', email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          // If email does not exist in Firestore
          setError('Email is not registered as a parent.');
          return;
        }

        // If email exists in Firestore, creating an account
        await createUserWithEmailAndPassword(auth, email, password);
        router.replace('/'); // Navigating to the home screen after signup
      }
    } catch (err) {
      setError(activeTab === 'login' ? 'Invalid email or password' : 'Failed to create account');
      console.error(err);
    }
  };

  return (
    <View
      className="flex-1 justify-center bg-white p-4"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <AuthTabs onTabChange={(tab) => setActiveTab(tab)} />
      {error && <Text className="text-red-500 mb-4 text-center">{error}</Text>}
      <View className="w-full mb-4">
        <TextInput
          className="w-full bg-gray-100 p-3 rounded-lg mb-4 text-text"
          placeholder="Email"
          placeholderTextColor="#4c516d"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View className="w-full bg-gray-100 p-3 rounded-lg mb-4 flex-row items-center">
          <TextInput
            className="flex-1 text-text"
            placeholder="Password"
            placeholderTextColor="#4c516d"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? 'visibility-off' : 'visibility'}
              size={24}
              color="#4c516d"
            />
          </TouchableOpacity>
        </View>
        {activeTab === 'signup' && (
          <View className="w-full bg-gray-100 p-3 rounded-lg mb-4 flex-row items-center">
            <TextInput
              className="flex-1 text-text"
              placeholder="Confirm Password"
              placeholderTextColor="#4c516d"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <MaterialIcons
                name={showConfirmPassword ? 'visibility-off' : 'visibility'}
                size={24}
                color="#4c516d"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <TouchableOpacity
        className="w-full bg-primary p-3 rounded-lg items-center"
        onPress={handleAuth}
      >
        <Text className="text-white text-lg font-semibold">
          {activeTab === 'login' ? 'Login' : 'Signup'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}