// app/components/AuthTabs.tsx
import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function AuthTabs({ onTabChange }: { onTabChange: (tab: 'login' | 'signup') => void }) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  const handleTabChange = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <View className="flex-row justify-center mb-8">
      <TouchableOpacity
        className={`px-6 py-3 rounded-full ${activeTab === 'login' ? 'bg-primary' : 'bg-gray-200'}`}
        onPress={() => handleTabChange('login')}
      >
        <Text className={`text-lg font-semibold ${activeTab === 'login' ? 'text-white' : 'text-text'}`}>
          Login
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`px-6 py-3 rounded-full ml-4 ${activeTab === 'signup' ? 'bg-primary' : 'bg-gray-200'}`}
        onPress={() => handleTabChange('signup')}
      >
        <Text className={`text-lg font-semibold ${activeTab === 'signup' ? 'text-white' : 'text-text'}`}>
          Signup
        </Text>
      </TouchableOpacity>
    </View>
  );
}