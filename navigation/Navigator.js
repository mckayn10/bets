import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Auth_Screen from "../screens/Auth_Screen";
import Home_Screen from "../screens/Home_Screen";
import Startup_Screen from "../screens/Startup_Screen";

const AuthNavigator = createStackNavigator({
    Auth: {
        screen: Auth_Screen,
        navigationOptions: {
            headerShown: false
        }
    }
})

const MainNavigator = createSwitchNavigator({
    Startup: {
        screen: Startup_Screen
    },
    Auth: AuthNavigator,
    Home: Home_Screen
})

export default createAppContainer(MainNavigator)