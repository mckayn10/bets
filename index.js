import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

//{
//  "ios": {
//    "provisioningProfilePath": "certs/ios/mybetz.mobileprovision",
//    "distributionCertificate": {
//      "path": "certs/ios/Certificates.p12",
//      "password": "MyBets!000"
//    }
//  }
//}
