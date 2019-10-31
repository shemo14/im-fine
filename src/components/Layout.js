import React from 'react';
import {
    Container,
    Header,
    Title,
    Content,
    Footer,
    FooterTab,
    Button,
    Left,
    Right,
    Body,
    Icon,
    Text
} from 'native-base';

import { StyleSheet, View } from 'react-native';

export default class Layout extends React.Component {
    render() {
        const { children, style, footer = true } = this.props;

        return (
            <Container>
                <Content contentContainerStyle={style}>{children}</Content>


            </Container>
        );
    }
}
