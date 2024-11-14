import { Box } from '@gluestack-ui/themed';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

import { useAuth } from '@hooks/useAuth';

import { AppRoutes } from './app.routes';
import { AuthRoutes } from './auth.routes';
import { gluestackUIConfig } from '../../config/gluestack-ui.config';

export function Routes() {
  const theme = DefaultTheme;
  const { user } = useAuth();
  theme.colors.background = gluestackUIConfig.tokens.colors.gray700;

  return (
    <Box flex={1} bg="$gray700">
      <NavigationContainer theme={theme}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}
