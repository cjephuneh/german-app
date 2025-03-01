import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Play, Pause } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  isPlaying?: boolean;
  onPlayAudio?: () => void;
  onPauseAudio?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isPlaying = false,
  onPlayAudio,
  onPauseAudio,
}) => {
  const isUser = message.sender === 'user';
  
  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.aiContainer
    ]}>
      <View style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.aiBubble
      ]}>
        <Text style={[
          styles.text,
          isUser ? styles.userText : styles.aiText
        ]}>
          {message.content}
        </Text>
        
        {message.audioUrl && !isUser && (
          <TouchableOpacity 
            style={styles.audioButton}
            onPress={isPlaying ? onPauseAudio : onPlayAudio}
          >
            {isPlaying ? (
              <Pause size={18} color={Colors.primary} />
            ) : (
              <Play size={18} color={Colors.primary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.timestamp}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      marginVertical: 8,
      maxWidth: '80%',
    },
    userContainer: {
      alignSelf: 'flex-end',
    },
    aiContainer: {
      alignSelf: 'flex-start',
    },
    bubble: {
      borderRadius: 16,
      padding: 12,
      minWidth: 60,
    },
    userBubble: {
      backgroundColor: Colors.primary,
      borderBottomRightRadius: 4,
    },
    aiBubble: {
      backgroundColor: Colors.card,
      borderBottomLeftRadius: 4,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    text: {
      fontSize: 15,
      lineHeight: 20,
    },
    userText: {
      color: Colors.card,
    },
    aiText: {
      color: Colors.text,
    },
    timestamp: {
      fontSize: 11,
      color: Colors.textLight,
      marginTop: 4,
      marginHorizontal: 4,
    },
    audioButton: {
      marginTop: 8,
      alignSelf: 'flex-end',
    },
  });