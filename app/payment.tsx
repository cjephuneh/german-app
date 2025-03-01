import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Shield, CreditCard } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { paymentPlans } from '@/mocks/paymentPlans';
import { PaymentPlanCard } from '@/components/PaymentPlanCard';
import { useUserStore } from '@/store/userStore';

export default function PaymentScreen() {
  const router = useRouter();
  const { setPremiumStatus } = useUserStore();
  const [selectedPlanId, setSelectedPlanId] = useState(paymentPlans[1].id); // Default to premium
  
  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };
  
  const handleSubscribe = async () => {
    // In a real app, this would open the Paystack checkout
    // For now, we'll just show an alert and update the user's premium status
    
    Alert.alert(
      'Confirm Subscription',
      'This would normally open the Paystack payment gateway. Would you like to simulate a successful payment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Simulate Payment',
          onPress: async () => {
            try {
              // Simulate loading
              setTimeout(async () => {
                // Update user's premium status in database
                await setPremiumStatus(true);
                
                // Show success message
                Alert.alert(
                  'Payment Successful',
                  'Thank you for subscribing! You now have access to all premium features.',
                  [
                    {
                      text: 'OK',
                      onPress: () => router.back(),
                    },
                  ]
                );
              }, 1500);
            } catch (error) {
              Alert.alert('Error', 'There was an error processing your payment. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>
            Upgrade to access all features and enhance your German learning experience
          </Text>
        </View>
        
        {paymentPlans.map((plan) => (
          <PaymentPlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlanId === plan.id}
            onSelect={() => handleSelectPlan(plan.id)}
            onSubscribe={handleSubscribe}
          />
        ))}
        
        <View style={styles.securityNote}>
          <Shield size={16} color={Colors.textLight} />
          <Text style={styles.securityText}>
            Secure payment processing by Paystack. Your payment information is encrypted and secure.
          </Text>
        </View>
        
        <View style={styles.paymentMethods}>
          <Text style={styles.paymentMethodsTitle}>Accepted Payment Methods</Text>
          <View style={styles.paymentMethodsIcons}>
            <CreditCard size={24} color={Colors.textLight} />
            <Text style={styles.paymentMethodsText}>
              Visa, Mastercard, and more
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 32,
    },
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: Colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: Colors.textLight,
      lineHeight: 22,
    },
    securityNote: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.card,
      padding: 12,
      borderRadius: 8,
      marginBottom: 24,
    },
    securityText: {
      fontSize: 12,
      color: Colors.textLight,
      marginLeft: 8,
      flex: 1,
    },
    paymentMethods: {
      marginBottom: 16,
    },
    paymentMethodsTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: Colors.text,
      marginBottom: 8,
    },
    paymentMethodsIcons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    paymentMethodsText: {
      fontSize: 14,
      color: Colors.textLight,
      marginLeft: 8,
    },
  })