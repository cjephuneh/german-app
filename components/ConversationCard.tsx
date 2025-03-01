import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MessageCircle, Clock, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Conversation } from '@/types';

interface ConversationCardProps {
  conversation: Conversation;
  onPress: () => void;
  onDelete?: () => void;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  onPress,
  onDelete,
}) => {
  const messageCount = conversation.messages.length;
  const lastUpdated = new Date(conversation.updatedAt).toLocaleDateString();
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <MessageCircle size={24} color={Colors.primary} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {conversation.title}
        </Text>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <MessageCircle size={14} color={Colors.textLight} />
            <Text style={styles.detailText}>
              {messageCount} {messageCount === 1 ? 'message' : 'messages'}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Clock size={14} color={Colors.textLight} />
            <Text style={styles.detailText}>
              {lastUpdated}
            </Text>
          </View>
        </View>
      </View>
      
      {onDelete && (
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={onDelete}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Trash2 size={18} color={Colors.error} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: Colors.card,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: 'center',
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 8,
      backgroundColor: Colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.text,
      marginBottom: 4,
    },
    detailsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 12,
    },
    detailText: {
      fontSize: 12,
      color: Colors.textLight,
      marginLeft: 4,
    },
    deleteButton: {
      padding: 4,
    },
  });