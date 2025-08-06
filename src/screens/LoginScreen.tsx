import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, TextInput } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff, ChevronLeft } from 'lucide-react-native';

const GoogleIcon = () => (
  <Image
    source={{ uri: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg' }}
    className="w-4 h-4 mr-2"
  />
);

export default function LoginScreen({ navigation }: any) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validate = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    // Email validation: checks for @ and .
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Enter a valid email address';
      isValid = false;
    }

    // Password validation: checks for minimum length
    if (!password || password.length < 8) {
      newErrors.password = 'The password must be at least 8 characters long';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignIn = () => {
    if (validate()) {
      // If validation passes, proceed to the home screen
      console.log('Login successful');
      navigation.navigate('Home');
    }
  };

  return (
    <ScrollView className="flex-1 bg-login-background" contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 justify-center items-center p-4">
        {/* Back Button */}
        <Pressable 
          onPress={() => navigation.goBack()} 
          className="absolute top-16 left-4 z-10 p-2"
        >
          <ChevronLeft className="h-8 w-8 text-white" />
        </Pressable>

        {/* Logo and Title */}
        <View className="items-center mb-8">
          <View
            className="w-16 h-16 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <Image
              source={require('../../assets/images/bolta.png')}
              className="w-12 h-12"
              resizeMode="contain"
            />
          </View>
          <Text className="text-4xl font-bold text-white">ბოლთა</Text>
          <Text className="text-sm text-gray-400">იარე, იმოძრავე, გადაცვალე.</Text>
        </View>

        {/* Form Card */}
        <Card className="w-full max-w-sm bg-login-card border-0 p-4 rounded-xl">
          <CardHeader className="items-center p-2">
            <Text className="text-2xl font-bold text-white">Welcome Back</Text>
            <Text className="text-gray-400">Sign in to continue</Text>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {/* Email Input */}
            <View className="space-y-2">
              <Label className="text-white">Email</Label>
              <View className={`flex-row items-center h-12 w-full rounded-md border bg-input-background px-3 ${errors.email ? 'border-red-500' : 'border-input-border'}`}>
                <Mail className="h-4 w-4 text-gray-400" />
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor="#9ca3af"
                  className="flex-1 text-white ml-2 text-base"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              {errors.email ? <Text className="text-red-500 text-xs mt-1">{errors.email}</Text> : null}
            </View>
            
            {/* Password Input */}
            <View className="space-y-2">
              <Label className="text-white">Password</Label>
              <View className={`flex-row items-center h-12 w-full rounded-md border bg-input-background px-3 ${errors.password ? 'border-red-500' : 'border-input-border'}`}>
                <Lock className="h-4 w-4 text-gray-400" />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#9ca3af"
                  className="flex-1 text-white ml-2 text-base"
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
                  {passwordVisible ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </Pressable>
              </View>
              {errors.password ? <Text className="text-red-500 text-xs mt-1">{errors.password}</Text> : null}
            </View>

            <Button size="lg" onPress={handleSignIn} className="bg-button-primary rounded-md">
              <Text className="font-bold text-white">Sign In</Text>
            </Button>

            {/* Separator */}
            <View className="flex-row items-center my-2">
                <View className="flex-1 h-px bg-gray-600" /> 
                <Text className="mx-4 text-xs uppercase text-gray-400">Or Continue With</Text>
                <View className="flex-1 h-px bg-gray-600" />
            </View>

            <Button variant="outline" size="lg" className="bg-white flex-row rounded-md">
              <GoogleIcon />
              <Text className="font-bold text-rich-background">Continue with Google</Text>
            </Button>
            
            <Pressable onPress={() => alert("Navigate to Sign Up Screen")} className="mt-4">
                <Text className="text-center text-sm text-gray-400">
                    Don't have an account? <Text className="text-primary font-bold">Sign up</Text>
                </Text>
            </Pressable>

          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}