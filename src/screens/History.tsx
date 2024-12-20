import { useState } from 'react';
import { SectionList, StyleSheet } from 'react-native';

import { Heading, Text, VStack } from '@gluestack-ui/themed';

import { HistoryCard } from '@components/HistoryCard';
import { ScreenHeader } from '@components/ScreenHeader';

export function History() {
  const [exercises, setExercises] = useState([
    {
      title: '08.11.2024',
      data: ['Puxada frontal', 'Remada unilateral'],
    },
    {
      title: '09.11.2024',
      data: ['Rosca direta'],
    },
  ]);

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />
      <SectionList
        sections={exercises}
        keyExtractor={item => item}
        renderItem={() => <HistoryCard />}
        renderSectionHeader={({ section }) => (
          <Heading
            color="$gray200"
            fontSize="$md"
            mt="$10"
            mb="$3"
            fontFamily="$heading"
          >
            {section.title}
          </Heading>
        )}
        style={styles.containerExercises}
        contentContainerStyle={
          exercises.length === 0 && styles.contentContainerExercises
        }
        ListEmptyComponent={EmptySection}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
}

const EmptySection = () => (
  <Text color="$gray100" textAlign="center">
    Não há exercícios registrados ainda. {'\n'} Vamos fazer exercícios hoje ?
  </Text>
);

const styles = StyleSheet.create({
  contentContainerExercises: {
    flex: 1,
    justifyContent: 'center',
  },
  containerExercises: {
    paddingHorizontal: 32,
  },
});
