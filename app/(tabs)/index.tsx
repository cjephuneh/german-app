import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BookOpen, MessageCircle, Brain, ChevronRight, Award } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useUserStore } from '@/store/userStore';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const [greeting, setGreeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  });

  const features = [
    {
      id: 'conversation',
      title: 'AI Conversation',
      description: 'Practice German with our AI language tutor',
      icon: <MessageCircle size={24} color={Colors.primary} />,
      route: '/conversation',
    },
    {
      id: 'library',
      title: 'Document Library',
      description: 'Upload syllabi and books for personalized learning',
      icon: <BookOpen size={24} color={Colors.primary} />,
      route: '/library',
    },
    {
      id: 'practice',
      title: 'Practice Exercises',
      description: 'Test your knowledge with interactive exercises',
      icon: <Brain size={24} color={Colors.primary} />,
      route: '/practice',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.username}>{user?.name || 'Student'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/profile')}
          >
            {user?.profilePicture ? (
              <Image 
                source={{ uri: user.profilePicture }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Text style={styles.profileInitial}>
                  {(user?.name?.[0] || 'S').toUpperCase()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {!user?.isPremium && (
          <Card style={styles.premiumCard}>
            <View style={styles.premiumContent}>
              <Award size={24} color={Colors.secondary} />
              <View style={styles.premiumTextContainer}>
                <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                <Text style={styles.premiumDescription}>
                  Unlock all features and enhance your learning experience
                </Text>
              </View>
            </View>
            <Button 
              title="View Plans" 
              variant="secondary"
              size="small"
              onPress={() => router.push('/payment')}
            />
          </Card>
        )}

        <Text style={styles.sectionTitle}>Quick Start</Text>
        
        <View style={styles.featuresContainer}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={styles.featureCard}
              onPress={() => router.push(feature.route)}
              activeOpacity={0.7}
            >
              <View style={styles.featureIconContainer}>
                {feature.icon}
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
              <ChevronRight size={20} color={Colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Learning Tips</Text>
        
        <Card style={styles.tipCard}>
          <Text style={styles.tipTitle}>Daily Practice is Key</Text>
          <Text style={styles.tipDescription}>
            Consistent daily practice, even just 15 minutes, is more effective than occasional longer sessions.
          </Text>
        </Card>
        
        <Card style={styles.tipCard}>
          <Text style={styles.tipTitle}>Speak Out Loud</Text>
          <Text style={styles.tipDescription}>
            Practice speaking German out loud to improve pronunciation and build confidence in conversation.
          </Text>
        </Card>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textLight,
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  profileImage: {
    width: 48,
    height: 48,
  },
  profilePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.card,
  },
  premiumCard: {
    backgroundColor: Colors.card,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  premiumTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  premiumDescription: {
    fontSize: 12,
    color: Colors.textLight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: Colors.textLight,
  },
  tipCard: {
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
});