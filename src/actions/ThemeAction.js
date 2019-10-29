import { AsyncStorage } from 'react-native';

export const chooseTheme = theme => {
    setTheme(theme);

    return {
        type: 'chooseTheme',
        payload: theme
    }
};

const setTheme = async theme => {
    await AsyncStorage.setItem('theme', theme);
};
