// screens/LoginScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { Ionicons } from '@expo/vector-icons';
import { trackScreen } from '../services/analytics';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, signUp, isLoading: authLoading, initialized } = useAuth();
  const { colors, wp, hp, normalize, isTablet } = useThemeStyles();

  useEffect(() => {
    trackScreen('LoginScreen');
  }, []);

  // Show loading while auth is initializing
  if (!initialized || authLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', padding: wp(5) }]}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={{ color: colors.text, marginTop: hp(2), fontSize: normalize(16) }}>Initializing...</Text>
      </View>
    );
  }

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    const action = isLogin ? signIn : signUp;
    const result = await action(email, password);
    setIsSubmitting(false);

    if (!result.success) {
      Alert.alert('Error', result.error || 'Authentication failed');
    }
  };

  const isButtonDisabled = isSubmitting || !email || !password;

  const containerPadding = wp(6);
  const formWidth = isTablet ? wp(60) : wp(88);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: containerPadding, alignItems: 'center' }]}>
      <View style={[styles.header, { marginTop: hp(8), marginBottom: hp(5) }]}>
        <Ionicons name="person-circle" size={normalize(80)} color="#4f46e5" />
        <Text style={[styles.title, { color: colors.text, fontSize: normalize(28) }]}>
          {isLogin ? 'Welcome' : 'Create Account'}
        </Text>
      </View>

      <View style={[styles.form, { width: formWidth }]}>
        <TextInput
          style={[styles.input, { 
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border || '#ccc',
            height: normalize(50),
            fontSize: normalize(16),
            paddingHorizontal: wp(4)
          }]}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isSubmitting}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.passwordInput, { 
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border || '#ccc',
              height: normalize(50),
              fontSize: normalize(16),
              paddingHorizontal: wp(4),
              paddingRight: wp(12)
            }]}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!isSubmitting}
          />
          <TouchableOpacity
            style={[styles.eyeIcon, { top: normalize(13), right: wp(3) }]}
            onPress={() => setShowPassword(!showPassword)}
            disabled={isSubmitting}
          >
            <Ionicons 
              name={showPassword ? 'eye-off' : 'eye'} 
              size={normalize(24)}
              color="#999" 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.button, 
            { height: normalize(50) },
            isButtonDisabled && styles.buttonDisabled
          ]}
          onPress={handleSubmit}
          disabled={isButtonDisabled}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={[styles.buttonText, { fontSize: normalize(18) }]}>
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.switchButton, { marginTop: hp(3) }]}
          onPress={() => setIsLogin(!isLogin)}
          disabled={isSubmitting}
        >
          <Text style={{ color: colors.text || '#666', fontSize: normalize(14) }}>
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginTop: 16,
  },
  form: {
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  passwordInput: {
    borderWidth: 1,
    borderRadius: 8,
  },
  eyeIcon: {
    position: 'absolute',
  },
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
  },
});