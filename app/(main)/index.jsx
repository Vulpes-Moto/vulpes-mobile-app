import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { logOut, refreshUser } from '@/store/slices/userSlice';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

export default function HomeScreen() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(refreshUser())
    console.log('user was refreshed');
  }, [dispatch]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/NewVulpesLogo.png')}
          style={styles.vulpesLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to Vulpes!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Не судите строго.</ThemedText>
        <ThemedText>
          {'Это моё первое мобильное приложение. =)'}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Сканируй штрих код.</ThemedText>
        <ThemedText>
          {`Перейди на вкладку Scanner и сканируй все штрих коды по очереди.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Сохрани результат.</ThemedText>
        <ThemedText>
          {`Помни, сканы попадут в базу только после сохранения.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 4: Enjoy!</ThemedText>
        <Pressable onPress={() => {dispatch(logOut()); dispatch(refreshUser())}}>
          <ThemedText>Log Out</ThemedText>
        </Pressable>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  vulpesLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
