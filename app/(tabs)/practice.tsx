import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Brain, CheckCircle, Clock, Award, BookOpen } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { usePracticeStore } from '@/store/practiceStore';
import { useLibraryStore } from '@/store/libraryStore';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';

export default function PracticeScreen() {
  const router = useRouter();
  const { sessions, createSession } = usePracticeStore();
  const { documents } = useLibraryStore();
  const [activeTab, setActiveTab] = useState('exercises');
  
  const documentsWithQuestions = documents.filter(doc => 
    doc.questions && doc.questions.length > 0
  );
  
  const completedSessions = sessions.filter(session => session.completed);
  const inProgressSessions = sessions.filter(session => !session.completed);
  
  const startNewSession = (title: string, questions: any[]) => {
    if (questions.length === 0) {
      // No questions available
      return;
    }
    
    const sessionId = createSession(title, questions);
    router.push(`/practice/${sessionId}`);
  };
  
  const renderExercisesTab = () => {
    if (documentsWithQuestions.length === 0) {
      return (
        <EmptyState
          icon={<BookOpen size={48} color={Colors.primary} />}
          title="No Practice Materials Yet"
          description="Upload documents in the Library to get AI-generated practice exercises."
          actionLabel="Go to Library"
          onAction={() => router.push('/library')}
        />
      );
    }

    return (
        <ScrollView style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Document-Based Exercises</Text>
          
          {documentsWithQuestions.map(doc => (
            <Card key={doc.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseIconContainer}>
                  <BookOpen size={24} color={Colors.primary} />
                </View>
                <View style={styles.exerciseContent}>
                  <Text style={styles.exerciseTitle}>{doc.title}</Text>
                  <Text style={styles.exerciseDescription}>
                    {doc.questions?.length || 0} questions available
                  </Text>
                </View>
              </View>
              <Button
                title="Start Practice"
                onPress={() => startNewSession(`Practice: ${doc.title}`, doc.questions || [])}
                style={styles.exerciseButton}
              />
            </Card>
          ))}

<Text style={styles.sectionTitle}>Grammar Exercises</Text>
        
        <Card style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <View style={styles.exerciseIconContainer}>
              <Brain size={24} color={Colors.primary} />
            </View>
            <View style={styles.exerciseContent}>
              <Text style={styles.exerciseTitle}>German Articles</Text>
              <Text style={styles.exerciseDescription}>
                Practice der, die, das with common nouns
              </Text>
            </View>
          </View>
          <Button
            title="Start Practice"
            onPress={() => {
              // Mock questions for German articles
              const questions = [
                {
                  id: '1',
                  text: 'What is the correct article for "Buch" (book)?',
                  options: ['der', 'die', 'das'],
                  correctAnswer: 'das',
                  documentId: 'grammar',
                  createdAt: new Date().toISOString(),
                },
                {
                  id: '2',
                  text: 'What is the correct article for "Frau" (woman)?',
                  options: ['der', 'die', 'das'],
                  correctAnswer: 'die',
                  documentId: 'grammar',
                  createdAt: new Date().toISOString(),
                },
                {
                  id: '3',
                  text: 'What is the correct article for "Mann" (man)?',
                  options: ['der', 'die', 'das'],
                  correctAnswer: 'der',
                  documentId: 'grammar',
                  createdAt: new Date().toISOString(),
                },
              ];
              
              startNewSession('German Articles Practice', questions);
            }}
            style={styles.exerciseButton}
          />
        </Card>

        <Card style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <View style={styles.exerciseIconContainer}>
              <Brain size={24} color={Colors.primary} />
            </View>
            <View style={styles.exerciseContent}>
              <Text style={styles.exerciseTitle}>Basic Verb Conjugation</Text>
              <Text style={styles.exerciseDescription}>
                Practice conjugating common German verbs
              </Text>
            </View>
          </View>
          <Button
            title="Start Practice"
            onPress={() => {
              // Mock questions for verb conjugation
              const questions = [
                {
                  id: '1',
                  text: 'What is the correct conjugation of "sein" (to be) for "ich"?',
                  options: ['bin', 'bist', 'ist', 'sind'],
                  correctAnswer: 'bin',
                  documentId: 'grammar',
                  createdAt: new Date().toISOString(),
                },
                {
                  id: '2',
                  text: 'What is the correct conjugation of "haben" (to have) for "du"?',
                  options: ['habe', 'hast', 'hat', 'haben'],
                  correctAnswer: 'hast',
                  documentId: 'grammar',
                  createdAt: new Date().toISOString(),
                },
                {
                  id: '3',
                  text: 'What is the correct conjugation of "gehen" (to go) for "wir"?',
                  options: ['gehe', 'gehst', 'geht', 'gehen'],
                  correctAnswer: 'gehen',
                  documentId: 'grammar',
                  createdAt: new Date().toISOString(),
                },
              ];
              
              startNewSession('Verb Conjugation Practice', questions);
            }}
            style={styles.exerciseButton}
          />
        </Card>
      </ScrollView>
    );
    }

    const renderProgressTab = () => {
        if (sessions.length === 0) {
          return (
            <EmptyState
              icon={<Brain size={48} color={Colors.primary} />}
              title="No Practice Sessions Yet"
              description="Complete practice exercises to track your progress."
              actionLabel="Start Practicing"
              onAction={() => setActiveTab('exercises')}
            />
          );
        }
        
        return (
          <ScrollView style={styles.tabContent}>
            {inProgressSessions.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>In Progress</Text>
                {inProgressSessions.map(session => (
                  <TouchableOpacity
                    key={session.id}
                    style={styles.sessionCard}
                    onPress={() => router.push(`/practice/${session.id}`)}
                  >
                    <View style={styles.sessionIconContainer}>
                      <Clock size={24} color={Colors.primary} />
                    </View>
                    <View style={styles.sessionContent}>
                      <Text style={styles.sessionTitle}>{session.title}</Text>
                      <Text style={styles.sessionDescription}>
                        {session.questions.length} questions • Started {new Date(session.startedAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
            
            {completedSessions.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Completed</Text>
                {completedSessions.map(session => (
                  <TouchableOpacity
                    key={session.id}
                    style={styles.sessionCard}
                    onPress={() => router.push(`/practice/${session.id}`)}
                  >
                    <View style={[
                      styles.sessionIconContainer,
                      styles.completedSessionIcon
                    ]}>
                      <CheckCircle size={24} color={Colors.success} />
                    </View>
                    <View style={styles.sessionContent}>
                      <Text style={styles.sessionTitle}>{session.title}</Text>
                      <View style={styles.scoreContainer}>
                        <Text style={styles.sessionDescription}>
                          Score: {session.score}%
                        </Text>
                        <Text style={styles.sessionDate}>
                          {new Date(session.completedAt || '').toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
                 </>
        )}
        
        {completedSessions.length > 0 && (
          <Card style={styles.statsCard}>
            <Text style={styles.statsTitle}>Your Progress</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{completedSessions.length}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {Math.round(
                    completedSessions.reduce((sum, session) => sum + (session.score || 0), 0) / 
                    completedSessions.length
                  )}%
                </Text>
                <Text style={styles.statLabel}>Avg. Score</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {completedSessions.reduce((sum, session) => sum + session.questions.length, 0)}
                </Text>
                <Text style={styles.statLabel}>Questions</Text>
              </View>
            </View>
          </Card>
        )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'exercises' && styles.activeTab
          ]}
          onPress={() => setActiveTab('exercises')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'exercises' && styles.activeTabText
          ]}>
            Exercises
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'progress' && styles.activeTab
          ]}
          onPress={() => setActiveTab('progress')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'progress' && styles.activeTabText
          ]}>
            Progress
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'exercises' ? renderExercisesTab() : renderProgressTab()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    tabsContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
      backgroundColor: Colors.card,
    },
    tab: {
      flex: 1,
      paddingVertical: 16,
      alignItems: 'center',
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: Colors.primary,
    },
    tabText: {
      fontSize: 16,
      fontWeight: '500',
      color: Colors.textLight,
    },
    activeTabText: {
      color: Colors.primary,
      fontWeight: '600',
    },
    tabContent: {
      flex: 1,
      padding: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: Colors.text,
      marginBottom: 12,
      marginTop: 8,
    },
    exerciseCard: {
      marginBottom: 16,
    },
    exerciseHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    exerciseIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: Colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    exerciseContent: {
        flex: 1,
      },
      exerciseTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 4,
      },
      exerciseDescription: {
        fontSize: 14,
        color: Colors.textLight,
      },
      exerciseButton: {
        marginTop: 8,
      },
      sessionCard: {
        flexDirection: 'row',
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
      },
      sessionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
      },
      completedSessionIcon: {
        backgroundColor: Colors.success + '20', // 20% opacity
      },
      sessionContent: {
        flex: 1,
      },
      sessionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 4,
      },
      sessionDescription: {
        fontSize: 14,
        color: Colors.textLight,
      },
      scoreContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      sessionDate: {
        fontSize: 12,
        color: Colors.textLight,
      },
      statsCard: {
        marginTop: 16,
        marginBottom: 24,
      },
      statsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 16,
      },
      statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
      statItem: {
        alignItems: 'center',
      },
      statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.primary,
        marginBottom: 4,
      },
      statLabel: {
        fontSize: 12,
        color: Colors.textLight,
      },
    });