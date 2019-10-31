import React, { Component } from "react";
import {Animated, AsyncStorage, Dimensions, View} from 'react-native';
import {connect} from "react-redux";
import {DoubleBounce} from "react-native-loader";
import COLORS from "../consts/colors";
import {chooseLang} from "../actions";

const height = Dimensions.get('window').height;
class InitScreen extends Component {
    constructor(props) {
        super(props);
		this.state={
			loader: false,
		}
	}

    async componentWillMount() {
        this.setState({ loader: true });

        if (this.props.auth == null || this.props.user == null)
            this.props.navigation.navigate('loginOrRegister');
        else
            this.props.navigation.navigate('DrawerNavigator');

        AsyncStorage.getItem('init').then(init => {
            if (init != 'true'){
                AsyncStorage.setItem('init', 'true');
                this.props.chooseLang('ar');
            }
        })
    }

	renderLoader(){
		if (!this.state.loader){
			return(
				<View style={{ alignItems: 'center', justifyContent: 'center', height: height , alignSelf:'center' , backgroundColor:'#fff' , width:'100%' , position:'absolute' , zIndex:1  }}>
					<DoubleBounce size={20} color={COLORS.labelBackground} />
				</View>
			);
		}

		return <View />
	}

    render() {
        // return this.renderLoader();
        return false;
    }
}

const mapStateToProps = ({ auth, profile, lang }) => {
    return {
        auth: auth.user,
        user: profile.user,
        lang: lang.lang
    };
};
export default connect(mapStateToProps, {chooseLang})(InitScreen);