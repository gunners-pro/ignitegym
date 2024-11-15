import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import {
  Heading,
  HStack,
  Text,
  Toast,
  ToastTitle,
  useToast,
  VStack,
} from '@gluestack-ui/themed';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { ExerciseCard } from '@components/ExerciseCard';
import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { Loading } from '@components/Loading';
import { ExerciseDTO } from '@dtos/ExerciseDTO';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';

export function Home() {
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [groupSelected, setGroupSelected] = useState('costas');
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const navigator = useNavigation<AppNavigatorRoutesProps>();

  function handleOpenExerciseDetails() {
    navigator.navigate('exercise');
  }

  const fetchExercisesByGroup = useCallback(() => {
    const fetchExercise = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/exercises/bygroup/${groupSelected}`);
        setExercises(response.data);
      } catch (error) {
        const isAppError = error instanceof AppError;
        const title = isAppError
          ? error.message
          : 'Não foi possível carregar os exercícios';

        toast.show({
          placement: 'top',
          render: () => (
            <Toast bg="$red500" action="error" mt="$16">
              <ToastTitle color="$white">{title}</ToastTitle>
            </Toast>
          ),
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercise();
  }, [groupSelected, toast]);

  const fetchGroups = useCallback(async () => {
    try {
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os grupos musculares';

      toast.show({
        placement: 'top',
        render: () => (
          <Toast bg="$red500" action="error" mt="$16">
            <ToastTitle color="$white">{title}</ToastTitle>
          </Toast>
        ),
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useFocusEffect(fetchExercisesByGroup);

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected.toLowerCase() === item.toLowerCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerGroup}
        style={styles.containerGroup}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <VStack px="$8" flex={1}>
          <HStack justifyContent="space-between" alignItems="center" mb="$5">
            <Heading color="$gray200" fontSize="$md" fontFamily="$heading">
              Exercícios
            </Heading>
            <Text color="$gray200" fontSize="$sm" fontFamily="$body">
              {exercises.length}
            </Text>
          </HStack>

          <FlatList
            data={exercises}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ExerciseCard onPress={handleOpenExerciseDetails} data={item} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainerExercises}
          />
        </VStack>
      )}
    </VStack>
  );
}

const styles = StyleSheet.create({
  contentContainerGroup: {
    paddingHorizontal: 32,
  },
  containerGroup: {
    marginVertical: 40,
    maxHeight: 44,
    minHeight: 44,
  },
  contentContainerExercises: {
    paddingBottom: 20,
  },
});
