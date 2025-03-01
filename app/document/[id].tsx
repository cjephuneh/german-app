import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { FileText, Book, FileQuestion, Trash2, Play, Brain } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useLibraryStore } from '@/store/libraryStore';
import { usePracticeStore } from '@/store/practiceStore';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getDocument, removeDocument, addQuestionsToDocument } = useLibraryStore();
  const { createSession } = usePracticeStore();
  
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  
  const document = getDocument(id);
  
  useEffect(() => {
    if (!document) {
      router.replace('/library');
    }
  }, [document, router]);
  
  const handleDeleteDocument = () => {
    if (!document) return;
    
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeDocument(document.id);
            router.replace('/library');
          },
        },
      ]
    );
  };

  const handleGenerateQuestions = () => {
    if (!document) return;
    
    setIsGeneratingQuestions(true);
    
    // Simulate AI generating questions
    setTimeout(() => {
      const mockQuestions = [
        {
          text: 'What is the German word for "hello"?',
          options: ['Hallo', 'Tschüss', 'Danke', 'Bitte'],
          correctAnswer: 'Hallo',
        },
        {
          text: 'Which of these is a definite article in German?',
          options: ['ein', 'eine', 'der', 'mein'],
          correctAnswer: 'der',
        },
        {
          text: 'How do you say "thank you" in German?',
          options: ['Bitte', 'Danke', 'Entschuldigung', 'Willkommen'],
          correctAnswer: 'Danke',
        },
        {
          text: 'What is the German word for "goodbye"?',
          options: ['Hallo', 'Tschüss', 'Danke', 'Bitte'],
          correctAnswer: 'Tschüss',
        },
        {
          text: 'Which of these means "please" in German?',
          options: ['Hallo', 'Tschüss', 'Danke', 'Bitte'],
          correctAnswer: 'Bitte',
        },
      ];
      
      addQuestionsToDocument(document.id, mockQuestions);
      setIsGeneratingQuestions(false);
      
      Alert.alert(
        'Questions Generated',
        'AI has generated 5 questions based on your document. You can now practice with these questions.',
        [
          {
            text: 'OK',
          },
        ]
      );
    }, 3000);
  };

  const handleStartPractice = () => {
    if (!document || !document.questions || document.questions.length === 0) return;
    
    const sessionId = createSession(`Practice: ${document.title}`, document.questions);
    router.push(`/practice/${sessionId}`);
  };
  
  const getDocumentIcon = () => {
    if (!document) return null;
    
    switch (document.type) {
      case 'syllabus':
        return <FileText size={24} color={Colors.primary} />;
      case 'book':
        return <Book size={24} color={Colors.primary} />;
      default:
        return <FileText size={24} color={Colors.primary} />;
    }
  };
  
  if (!document) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  
  const hasQuestions = document.questions && document.questions.length > 0;
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{
          title: document.title,
          headerRight: () => (
            <TouchableOpacity onPress={handleDeleteDocument}>
              <Trash2 size={20} color={Colors.error} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.documentCard}>
          <View style={styles.documentHeader}>
            <View style={styles.documentIconContainer}>
              {getDocumentIcon()}
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>{document.title}</Text>
              <Text style={styles.documentType}>
                {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
              </Text>
              <Text style={styles.documentDate}>
                Uploaded on {new Date(document.uploadedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {document.thumbnail && (
            <Image 
              source={{ uri: document.thumbnail }} 
              style={styles.documentThumbnail} 
              resizeMode="cover"
            />
          )}
        </Card>
        
        {hasQuestions ? (
          <Card style={styles.questionsCard}>
            <View style={styles.questionsHeader}>
              <FileQuestion size={24} color={Colors.primary} />
              <Text style={styles.questionsTitle}>
                {document.questions?.length} Questions Available
              </Text>
            </View>
            <Text style={styles.questionsDescription}>
              Practice with AI-generated questions based on this document.
            </Text>
            <Button
              title="Start Practice"
              onPress={handleStartPractice}
              leftIcon={<Play size={16} color={Colors.card} />}
              style={styles.practiceButton}
            />
          </Card>
        ) : (
          <Card style={styles.questionsCard}>
            <View style={styles.questionsHeader}>
              <Brain size={24} color={Colors.primary} />
              <Text style={styles.questionsTitle}>
                Generate Practice Questions
              </Text>
            </View>
            <Text style={styles.questionsDescription}>
              Use AI to analyze this document and generate practice questions.
            </Text>
            <Button
              title="Generate Questions"
              onPress={handleGenerateQuestions}
              loading={isGeneratingQuestions}
              style={styles.practiceButton}
            />
          </Card>
        )}

{hasQuestions && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Question Preview</Text>
            
            {document.questions?.slice(0, 3).map((question, index) => (
              <Card key={index} style={styles.questionPreviewCard}>
                <Text style={styles.questionText}>{question.text}</Text>
                <View style={styles.optionsContainer}>
                  {question.options?.map((option, optionIndex) => (
                    <View 
                      key={optionIndex} 
                      style={[
                        styles.optionItem,
                        option === question.correctAnswer && styles.correctOption
                      ]}
                    >
                      <Text 
                        style={[
                          styles.optionText,
                          option === question.correctAnswer && styles.correctOptionText
                        ]}
                      >
                        {option}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            ))}
            
            {document.questions && document.questions.length > 3 && (
              <Text style={styles.moreQuestionsText}>
                +{document.questions.length - 3} more questions
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 32,
    },
    documentCard: {
      marginBottom: 16,
    },
    documentHeader: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    documentIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 8,
      backgroundColor: Colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    documentInfo: {
      flex: 1,
    },
    documentTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: Colors.text,
      marginBottom: 4,
    },
    documentType: {
      fontSize: 14,
      color: Colors.textLight,
      marginBottom: 2,
    },
    documentDate: {
      fontSize: 12,
      color: Colors.textLight,
    },
    documentThumbnail: {
      width: '100%',
      height: 200,
      borderRadius: 8,
    },
    questionsCard: {
      marginBottom: 16,
    },
    questionsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      },
      questionsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginLeft: 8,
      },
      questionsDescription: {
        fontSize: 14,
        color: Colors.textLight,
        marginBottom: 16,
      },
      practiceButton: {
        width: '100%',
      },
      previewContainer: {
        marginBottom: 16,
      },
      previewTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 12,
      },
      questionPreviewCard: {
        marginBottom: 12,
      },
      questionText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text,
        marginBottom: 12,
      },
      optionsContainer: {
        gap: 8,
      },
      optionItem: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.border,
      },
      correctOption: {
        backgroundColor: Colors.success + '20', // 20% opacity
        borderColor: Colors.success,
      },
      optionText: {
        fontSize: 14,
        color: Colors.text,
      },
      correctOptionText: {
        color: Colors.success,
        fontWeight: '500',
      },
      moreQuestionsText: {
        fontSize: 14,
        color: Colors.textLight,
        textAlign: 'center',
        marginTop: 8,
      },
    });
  