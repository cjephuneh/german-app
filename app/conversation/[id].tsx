import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Send, Mic, MicOff, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useConversationStore } from '@/store/conversationStore';
import { MessageBubble } from '@/components/MessageBubble';

export default function ConversationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { 
    getConversation, 
    addMessage, 
    deleteConversation 
  } = useConversationStore();
  
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  
  const flatListRef = useRef<FlatList>(null);
  
  const conversation = getConversation(id);
  
  useEffect(() => {
    if (!conversation) {
      router.replace('/conversation');
    }
  }, [conversation, router]);
  
  const handleSend = async () => {
    if (!message.trim() || !conversation) return;
    
    // Add user message
    addMessage(conversation.id, {
      content: message,
      sender: 'user',
    });
    
    setMessage('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'Das ist eine gute Frage! Lass mich dir helfen.',
        'Ich verstehe. Möchtest du mehr über dieses Thema wissen?',
        'In der deutschen Grammatik ist das ein wichtiges Konzept.',
        'Sehr gut! Dein Deutsch wird immer besser.',
        'Lass uns das Vokabular zu diesem Thema üben.'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      addMessage(conversation.id, {
        content: randomResponse,
        sender: 'ai',
        audioUrl: 'https://example.com/audio.mp3', // This would be the 11labs generated audio URL
      });
      setIsLoading(false);
    }, 1500);
  };
  
  const toggleRecording = () => {
    // In a real app, this would start/stop voice recording
    // and use speech-to-text to convert to message
    setIsRecording(!isRecording);
    
    if (isRecording) {
      // Simulate end of recording with transcribed text
      setTimeout(() => {
        setMessage('Wie sagt man "hello" auf Deutsch?');
        setIsRecording(false);
      }, 1000);
    }
  };

  const handlePlayAudio = (messageId: string) => {
    // In a real app, this would play the audio from 11labs
    setPlayingMessageId(messageId);
    
    // Simulate audio playback ending after 3 seconds
    setTimeout(() => {
      setPlayingMessageId(null);
    }, 3000);
  };
  
  const handlePauseAudio = () => {
    // In a real app, this would pause the audio playback
    setPlayingMessageId(null);
  };
  
  const handleDeleteConversation = () => {
    if (!conversation) return;
    
    deleteConversation(conversation.id);
    router.replace('/conversation');
  };
  
  if (!conversation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{
          title: conversation.title,
          headerRight: () => (
            <TouchableOpacity onPress={handleDeleteConversation}>
              <Trash2 size={20} color={Colors.error} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={conversation.messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isPlaying={playingMessageId === item.id}
              onPlayAudio={() => handlePlayAudio(item.id)}
              onPauseAudio={handlePauseAudio}
            />
          )}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

{isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={Colors.primary} size="small" />
            <Text style={styles.loadingText}>Generating response...</Text>
          </View>
        )}
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type in English or German..."
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity
            style={[
              styles.iconButton,
              isRecording && styles.recordingButton
            ]}
            onPress={toggleRecording}
          >
            {isRecording ? (
              <MicOff size={20} color={Colors.card} />
            ) : (
              <Mic size={20} color={Colors.primary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.iconButton,
              styles.sendButton,
              !message.trim() && styles.disabledButton
            ]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Send size={20} color={message.trim() ? Colors.card : Colors.textLight} />
          </TouchableOpacity>
        </View>
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
    messagesList: {
      flexGrow: 1,
      padding: 16,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      borderTopWidth: 1,
      borderTopColor: Colors.border,
      backgroundColor: Colors.card,
    },
    input: {
      flex: 1,
      backgroundColor: Colors.background,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      maxHeight: 100,
      fontSize: 16,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
      backgroundColor: Colors.background,
    },
    sendButton: {
      backgroundColor: Colors.primary,
    },
    disabledButton: {
      backgroundColor: Colors.border,
    },
    recordingButton: {
      backgroundColor: Colors.error,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
      backgroundColor: Colors.background,
    },
    loadingText: {
      marginLeft: 8,
      color: Colors.textLight,
      fontSize: 14,
    },
  });