import React, { useState, useRef } from 'react';
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
import { useRouter } from 'expo-router';
import { Plus, Send, Mic, MicOff, MessageCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useConversationStore } from '@/store/conversationStore';
import { MessageBubble } from '@/components/MessageBubble';
import { EmptyState } from '@/components/EmptyState';
import { ConversationCard } from '@/components/ConversationCard';
import { Button } from '@/components/Button';

export default function ConversationScreen() {
  const router = useRouter();
  const { 
    conversations, 
    createConversation, 
    deleteConversation,
    addMessage,
    currentConversationId,
    setCurrentConversation
  } = useConversationStore();
  
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  
  const currentConversation = conversations.find(c => c.id === currentConversationId);
  
  const handleSend = async () => {
    if (!message.trim()) return;
    
    if (!currentConversationId) {
      const newId = createConversation('German Conversation');
      setCurrentConversation(newId);
      
      // Add user message
      addMessage(newId, {
        content: message,
        sender: 'user',
      });
      
      setMessage('');
      setIsLoading(true);
      
      // Simulate AI response
      setTimeout(() => {
        addMessage(newId, {
          content: 'Hallo! Wie kann ich dir heute mit Deutsch helfen?',
          sender: 'ai',
          audioUrl: 'https://example.com/audio.mp3', // This would be the 11labs generated audio URL
        });
        setIsLoading(false);
      }, 1500);
    } else {
      // Add user message
      addMessage(currentConversationId, {
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
        
        addMessage(currentConversationId, {
          content: randomResponse,
          sender: 'ai',
          audioUrl: 'https://example.com/audio.mp3', // This would be the 11labs generated audio URL
        });
        setIsLoading(false);
      }, 1500);
    }
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
  
  const startNewConversation = () => {
    setCurrentConversation(null);
    setShowHistory(false);
  };
  
  const openConversation = (id: string) => {
    setCurrentConversation(id);
    setShowHistory(false);
  };
  
  const renderEmptyConversation = () => (
    <EmptyState
      icon={<MessageCircle size={48} color={Colors.primary} />}
      title="Start a Conversation"
      description="Begin practicing German with our AI language tutor. Ask questions, practice pronunciation, or have a casual conversation."
      actionLabel="Start Talking"
      onAction={() => setCurrentConversation(null)}
    />
  );

  if (showHistory) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Conversation History</Text>
          <Button
            title="New Conversation"
            onPress={startNewConversation}
            leftIcon={<Plus size={16} color={Colors.card} />}
          />
        </View>
        
        {conversations.length === 0 ? (
          <EmptyState
            icon={<MessageCircle size={48} color={Colors.primary} />}
            title="No Conversations Yet"
            description="Start your first German conversation to begin learning."
            actionLabel="Start Conversation"
            onAction={startNewConversation}
          />
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ConversationCard
                conversation={item}
                onPress={() => openConversation(item.id)}
                onDelete={() => deleteConversation(item.id)}
              />
            )}
            contentContainerStyle={styles.historyList}
          />
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          {currentConversation ? (
            <Text style={styles.headerTitle}>{currentConversation.title}</Text>
          ) : (
            <Text style={styles.headerTitle}>New Conversation</Text>
          )}
          
          <Button
            title={currentConversation ? "History" : ""}
            variant="text"
            onPress={() => setShowHistory(true)}
            rightIcon={currentConversation ? undefined : <Plus size={20} color={Colors.primary} />}
          />
        </View>
        
        {!currentConversation && !currentConversationId ? (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Practice German Conversation</Text>
            <Text style={styles.welcomeDescription}>
              Chat with our AI tutor to improve your German language skills. You can type or use voice input.
            </Text>
            <Text style={styles.suggestionsTitle}>Try asking:</Text>
            <View style={styles.suggestionsList}>
              <TouchableOpacity 
                style={styles.suggestionItem}
                onPress={() => setMessage("Wie sagt man 'hello' auf Deutsch?")}
              >
                <Text style={styles.suggestionText}>How do you say 'hello' in German?</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.suggestionItem}
                onPress={() => setMessage("Kannst du mir mit der Grammatik helfen?")}
              >
                <Text style={styles.suggestionText}>Can you help me with grammar?</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.suggestionItem}
                onPress={() => setMessage("Lass uns über das Wetter sprechen.")}
              >
                <Text style={styles.suggestionText}>Let's talk about the weather.</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={currentConversation?.messages || []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageBubble
                message={item}
                onPlayAudio={() => {
                  // In a real app, this would play the audio from 11labs
                  console.log('Playing audio for message:', item.id);
                }}
              />
            )}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            ListEmptyComponent={renderEmptyConversation}
          />
        )}
        
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
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
      backgroundColor: Colors.card,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: Colors.text,
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
      welcomeContainer: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
      },
      welcomeTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 12,
        textAlign: 'center',
      },
      welcomeDescription: {
        fontSize: 16,
        color: Colors.textLight,
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 22,
      },
      suggestionsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 12,
      },
      suggestionsList: {
        gap: 8,
      },
      suggestionItem: {
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
      },
      suggestionText: {
        fontSize: 14,
        color: Colors.text,
      },
      historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
      },
      historyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
      },
      historyList: {
        padding: 16,
      },
    });