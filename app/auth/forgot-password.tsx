import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { Mail, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/authStore';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword, isLoading, error } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    
    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled by the store
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color={Colors.primary} />
            <Text style={styles.backText}>Back to Sign In</Text>
          </TouchableOpacity>
          
          <View style={styles.header}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password
            </Text>
          </View>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

{isSubmitted ? (
            <View style={styles.successContainer}>
              <Text style={styles.successTitle}>Check Your Email</Text>
              <Text style={styles.successText}>
                We've sent a password reset link to {email}. Please check your email and follow the instructions.
              </Text>
              <Button
                title="Back to Sign In"
                onPress={() => router.replace('/auth/login')}
                style={styles.backToSignInButton}
              />
            </View>
          ) : (
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Mail size={20} color={Colors.textLight} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
              
              <Button
                title="Send Reset Link"
                onPress={handleResetPassword}
                loading={isLoading}
                style={styles.resetButton}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      padding: 24,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 32,
    },
    backText: {
      color: Colors.primary,
      fontSize: 16,
      marginLeft: 8,
    },
    header: {
      marginBottom: 32,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: Colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: Colors.textLight,
      lineHeight: 22,
    },
    errorContainer: {
      backgroundColor: Colors.error + '20',
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    errorText: {
      color: Colors.error,
      fontSize: 14,
    },
    form: {
      marginBottom: 24,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.card,
      borderRadius: 8,
      paddingHorizontal: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    input: {
      flex: 1,
      paddingVertical: 14,
      paddingHorizontal: 8,
      fontSize: 16,
      color: Colors.text,
    },
    resetButton: {
      width: '100%',
    },
    successContainer: {
      backgroundColor: Colors.success + '20',
      padding: 20,
      borderRadius: 8,
      alignItems: 'center',
    },
    successTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: Colors.success,
      marginBottom: 12,
    },
    successText: {
      fontSize: 14,
      color: Colors.text,
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 20,
    },
    backToSignInButton: {
      marginTop: 8,
    },
  });