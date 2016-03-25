import React, {
  AppRegistry,
  Component,
  StyleSheet,
  View,
  Dimensions
} from 'react-native';

import XKCD from './src/XKCD';

class SimplyXKCD extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <XKCD />
      </View>
    );
  }
}

let {height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    height
  }
});

AppRegistry.registerComponent('SimplyXKCD', () => SimplyXKCD);
