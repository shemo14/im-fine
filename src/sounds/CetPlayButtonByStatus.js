import React from 'react';
import { Button, Icon } from 'native-base';
import {Image, TouchableOpacity} from 'react-native';

const buttonStyle = {
    width: 64,
    height: 64,
    alignSelf: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const ICON_SIZE = 40;

const GetPlayButtonByStatus = (props) => {
    if (props.recordStatus === 'RECORDING') {
        return (
            <Button
                disabled
                style={{ ...buttonStyle }}
                onPress={() => {}}
            >
                <Icon
                    type="FontAwesome"
                    name="play"
                    color="white"
                    style={{ fontSize: ICON_SIZE }}
                />
            </Button>
        );
    } else {
        if (
            props.playStatus === 'BUFFERING' ||
            props.playStatus === 'LOADING' ||
            props.playStatus === 'NO_SOUND_FILE_AVAILABLE'
        ) {
            return (
                <TouchableOpacity
                    success
                    style={{ marginTop: 2 }}
                    //    onPress={props.onPlayPress}
                >
                    <Image source={props.plyImg} style={{ width: 20, height: 20,}} resizeMode={'contain'} />
                </TouchableOpacity>
            );
        } else if (props.playStatus === 'PAUSED') {
            return (
                <TouchableOpacity
                    success
                    style={{ marginTop: 2 }}
                    onPress={props.onPlayPress}
                >
                    <Image source={props.plyImg} style={{ width: 20, height: 20,}} resizeMode={'contain'} />
                </TouchableOpacity>
            );
        } else if (props.playStatus === 'STOPPED') {
            return (
                <TouchableOpacity
                    success
                    style={{ marginTop: 2 }}
                    onPress={props.onPlayPress}
                >
                    <Image source={props.plyImg} style={{ width: 20, height: 20,}} resizeMode={'contain'} />
                </TouchableOpacity>
            );
        } else if (props.playStatus === 'PLAYING') {
            return (
                <TouchableOpacity
                    success
                    style={{ marginTop: 2 }}
                    onPress={props.onPausePress}
                >
                    <Image source={props.pusImg} style={{ width: 20, height: 20,}} resizeMode={'contain'} />
                </TouchableOpacity>
            );
        } else if (props.playStatus === 'ERROR') {
            return (
                <Button danger style={buttonStyle} onPress={() => {}}>
                    <Icon
                        type="FontAwesome"
                        name="exclamation-triangle"
                        color="white"
                        style={{ fontSize: ICON_SIZE - 10}}
                    />
                </Button>
            );
        } else {
            console.warn(
                `GetPlayButtonByStatus: unknown playStatus ${props.playStatus}`
            );
            return (
                <Button danger style={buttonStyle} onPress={() => {}}>
                    <Icon
                        type="FontAwesome"
                        name="question-circle"
                        color="white"
                        style={{ fontSize: ICON_SIZE }}
                    />
                </Button>
            );
        }
    }
};

export default GetPlayButtonByStatus;
