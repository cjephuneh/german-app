import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { PaymentPlan } from '@/types';
import { Button } from './Button';

interface PaymentPlanCardProps {
  plan: PaymentPlan;
  isSelected?: boolean;
  onSelect: () => void;
  onSubscribe: () => void;
}

export const PaymentPlanCard: React.FC<PaymentPlanCardProps> = ({
  plan,
  isSelected = false,
  onSelect,
  onSubscribe,
}) => {
  return (
    <View 
      style={[
        styles.container,
        isSelected && styles.selectedContainer
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{plan.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.currency}>{plan.currency}</Text>
          <Text style={styles.price}>{plan.price.toFixed(2)}</Text>
          <Text style={styles.duration}>/{plan.duration === 1 ? 'month' : `${plan.duration} months`}</Text>
        </View>
      </View>
      
      <View style={styles.featuresContainer}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Check size={16} color={Colors.success} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title={isSelected ? "Selected" : "Select Plan"}
          variant={isSelected ? "secondary" : "outline"}
          onPress={onSelect}
          style={styles.selectButton}
        />
        
        {isSelected && (
          <Button
            title="Subscribe Now"
            onPress={onSubscribe}
            style={styles.subscribeButton}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      backgroundColor: Colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    selectedContainer: {
      borderColor: Colors.primary,
      borderWidth: 2,
    },
    header: {
      marginBottom: 16,
    },
    name: {
      fontSize: 20,
      fontWeight: '700',
      color: Colors.text,
      marginBottom: 8,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    currency: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.text,
    },
    price: {
      fontSize: 28,
      fontWeight: '700',
      color: Colors.text,
      marginHorizontal: 2,
    },
    duration: {
      fontSize: 14,
      color: Colors.textLight,
    },
    featuresContainer: {
      marginBottom: 16,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    featureText: {
      fontSize: 14,
      color: Colors.text,
      marginLeft: 8,
    },
    buttonContainer: {
      gap: 8,
    },
    selectButton: {
      width: '100%',
    },
    subscribeButton: {
      width: '100%',
    },
  });