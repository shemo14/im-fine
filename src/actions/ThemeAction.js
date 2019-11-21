import { AsyncStorage } from 'react-native';

export const chooseTheme = theme => {
    setTheme(theme);

    return {
        type: 'chooseTheme',
        payload: theme
    }
};

export const batteryStatus = status => {
	batteryNotify(status);

	return {
		type: 'batteryNotify',
		payload: status
	}
};

const setTheme = async theme => {
    await AsyncStorage.setItem('theme', theme);
};

const batteryNotify = async status => {
    await AsyncStorage.setItem('batteryNotify', status);
};
