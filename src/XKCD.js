import React, {
  Component,
  StyleSheet,
  Image,
  Text,
  Alert,
  View,
  TouchableWithoutFeedback,
  TextInput,
  Animated,
  Dimensions
} from 'react-native';

import Button from 'apsl-react-native-button';

const REQUEST_URL = 'https://xkcd.com/{number}/info.0.json';

export default class XKCD extends Component {

  constructor(props) {
    super(props);

    this.handlePress = this.handlePress.bind(this);
    this.imageAnimation = this.imageAnimation.bind(this);

    this.currentNum;

    this.state = {
      number: '',
      fetching: false,
      xkcd: null,
      opacity: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.fetchData();
    this.imageAnimation();
  }

  imageAnimation() {
    Animated.parallel([
      Animated.timing(
        this.state.opacity,
        {
          toValue: 1,
          duration: 180,
        }
      ),
    ]).start();
  }

  handlePress() {
    this.fetchData(this.state.number);
  }

  generateNextNumber() {
    this.setState({
      ...this.state,
      number: '' + Math.floor(Math.random() * this.currentNum + 1)
    });
  }

  fetchData(number: string = 'last') {
    let replace;
    if (number === 'last') {
      replace = '';
    } else {
      replace = number + '/';
    }

    const url = REQUEST_URL.replace('{number}/', replace);

    this.setState({
      ...this.state,
      fetching: true
    });

    fetch(url)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
      return {};
    })
    .then((resData) => {
      this.setState({
        ...this.state,
        xkcd: resData
      });

      if (!this.currentNum) {
        this.currentNum = resData.num;
      }
    })
    .done(() => {
      this.generateNextNumber();
      this.setState({
        ...this.state,
        fetching: false
      });
    });
  }

  render() {
    const xkcd = this.state.xkcd;

    let xkcdComp = null;
    if (xkcd) {
      xkcdComp = (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            flexDirection: 'column'
          }}>
          <TouchableWithoutFeedback onPress={this.handlePress}>
            <Animated.Image
              source={{ uri: xkcd.img }}
              accessibilityLabel={xkcd.alt}
              onLoadStart={() => this.state.opacity.setValue(0)}
              onLoadEnd={this.imageAnimation}
              resizeMode="contain"
              indicator="bar"
              style={{
                width,
                height: height - 150,
                opacity: this.state.opacity
              }}
            />
          </TouchableWithoutFeedback>

           <TouchableWithoutFeedback
             onPress={() => Alert.alert(
               'Transcript',
               xkcd.transcript ? xkcd.transcript : xkcd.alt,
               {
                 text: 'OK',
                 onPress: () => console.log('Pressed ' + 1)
               }
             )}>
            <View style={styles.legend}>
              <Text style={styles.title}>{xkcd.title} {this.props.number}</Text>
              <Text style={styles.subtitle}>#{xkcd.num} ({xkcd.year})</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {xkcdComp}
        <View style={styles.form}>
          <Text style={{
              fontSize: 18
            }}
          >
            Next XKCD
          </Text>
          <TextInput
            keyboardType="numeric"
            placeholder="#XKCD"
            placeholderTextColor="#bdc3c7"
            clearButtonMode="unless-editing"
            maxLength={4}
            enable={this.state.fetching}
            style={{
              marginTop: 5,
              paddingLeft: 15,
              height: 40,
              width: 85,
              fontSize: 18,
              borderRadius: 4,
              borderColor: '#bdc3c7',
              borderWidth: 2
            }}
            onChangeText={
              (number) => {
                number = number.replace(/[^\d]*/g, '');
                this.setState({
                  ...this.state,
                  number
                });
              }
            }
            onEndEditing={this.handlePress}
            value={this.state.number}
          />
          <Button
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={this.handlePress}
            isLoading={this.state.fetching}
          >
            {'Show' + (this.state.number ? ` #${this.state.number}` : ' Last')}
          </Button>
        </View>
      </View>
    );
  }
}

let { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  legend: {
    alignSelf: 'center',
    paddingTop: 10,
    paddingBottom: 12,
  },
  form: {
    marginTop: 2,
    backgroundColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    width: width,
    paddingTop: 4,
    height: 58,
    justifyContent: 'space-around'
  },
  button: {
    backgroundColor: '#3498db',
    marginTop: 3,
    height: 44,
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 0,
    borderRadius: 4
  },
  buttonText: {
    fontSize: 16,
    color: '#ecf0f1'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 5,
    textAlign: 'center'
  },
  subtitle: {
    textAlign: 'center'
  }
});
