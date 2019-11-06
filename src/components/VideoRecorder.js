import React from 'react';
import { Button, Text, Header, Body, Icon, Title, Spinner } from 'native-base';
import * as Permissions from 'expo-permissions'
import * as FileSystem from 'expo-file-system'
import { Camera } from 'expo-camera'
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Layout from './Layout';
import delay from 'delay';

class RedirectTo extends React.Component {
    componentDidMount() {
        const { scene, navigation } = this.props;
        navigation.navigate(scene);
    }

    render() {
        return <View />;
    }
}

const printChronometer = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remseconds = seconds % 60;
    return '' + (minutes < 10 ? '0' : '') + minutes + ':' + (remseconds < 10 ? '0' : '') + remseconds;
};

class VideoRecorder extends React.Component {
    static navigationOptions = {
        header: () => (
            <Header>
                <Body>

                </Body>
            </Header>
        )
    };

    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
        recording: false,
        record: null,
        duration: 0,
        page : 0,
        go : 'forme3lan',
        redirect: false
    };

    async componentWillMount() {

        const { status: cameraStatus } = await Permissions.askAsync(Permissions.CAMERA);
        const { status: audioStatus } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        this.setState({ hasCameraPermission: cameraStatus === 'granted' && audioStatus === 'granted' });
    }

    async registerRecord() {
        const { recording, duration } = this.state;

        if (recording) {
            await delay(1000);
            this.setState(state => ({
                ...state,
                duration: state.duration + 1
            }));
            this.registerRecord();
        }
    }


    goBack() {
        const { navigation } = this.props;
        navigation.goBack();
        navigation.state.params.onSelect({ selected: true });
    }


    async startRecording() {
        if (!this.camera) {
            return;
        }

        await this.setState(state => ({ ...state, recording: true }));
        this.registerRecord();
        const record = await this.camera.recordAsync({ quality: '360' , maxDuration: 30})

            .then((data) => {
				this.props.navigation.navigate('notFine' , {
					recording : data
				});
            }).catch((err) => {

            });
    }

    async stopRecording() {
        if (!this.camera) {
            return;
        }

        await this.camera.stopRecording();
        this.setState(state => ({ ...state, recording: false, duration: 0 }));



    }

    toggleRecording() {
        const { recording } = this.state;

        return recording ? this.stopRecording() : this.startRecording();
    }

    render() {
        const { hasCameraPermission, recording, duration, redirect } = this.state;

        if (redirect) {
            return <RedirectTo scene={redirect} navigation={this.props.navigation} />;
        }

        if (hasCameraPermission === null) {
            return (
                <Layout style={styles.containerCenter}>
                    <Spinner />
                </Layout>
            );
        } else if (hasCameraPermission === false) {
            return (
                <Layout style={styles.containerCenter}>
                    <Text>No access to camera</Text>;
                </Layout>
            );
        } else {
            return (
                <Layout style={styles.containerCenter}>
                    <Camera
                        style={styles.containerCamera}
                        type={this.state.type}
                        ref={ref => {
                            this.camera = ref;
                        }}
                    >
                        <View style={styles.topActions}>
                            {recording && (
                                <Button iconLeft transparent light small style={styles.chronometer}>
                                    <Icon ios="ios-recording" android="md-recording" />
                                    <Text>{printChronometer(duration)}</Text>
                                </Button>
                            )}
                            {!recording && <View />}

                            <Button
                                small
                                transparent
                                success
                                style={styles.flipCamera}
                                onPress={() => {
                                    this.setState({
                                        type:
                                            this.state.type === Camera.Constants.Type.back
                                                ? Camera.Constants.Type.front
                                                : Camera.Constants.Type.back
                                    });
                                }}
                            >
                                <Icon ios="ios-reverse-camera" android="md-reverse-camera" />
                            </Button>
                        </View>
                        <View style={styles.bottonActions}>
                            <Button transparent onPress={() => { this.props.navigation.goBack()}}>
                                <Icon  type="Ionicons" name='ios-arrow-back' />
                            </Button>
                            <Button
                                danger
                                onPress={() => {
                                    this.toggleRecording();
                                }}
                            >
                                {recording ? (
                                    <Icon ios="ios-square" android="md-square" />
                                ) : (
                                    <Icon ios="ios-radio-button-on" android="md-radio-button-on" />
                                )}
                            </Button>
                            {/*<Button transparent onPress={() => { this.props.navigation.navigate(this.state.go)}}>*/}
                                {/*<Icon type="Ionicons" name='ios-arrow-back' />*/}
                            {/*</Button>*/}
                        </View>
                    </Camera>
                </Layout>
            );
        }
    }
}

const styles = StyleSheet.create({
    topActions: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    flipCamera: {
        margin: 10
    },
    chronometer: {
        margin: 10
    },
    bottonActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 10
    },
    containerCenter: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    containerCamera: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    }
});

export default VideoRecorder;