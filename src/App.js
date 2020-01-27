import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const app = new Clarifai.App({
  apiKey: 'c320bc86b14447659c3cccede84c06a5'
 });

const particlesOptions = {
  
    particles: {
      number: {
        value:120,
        density: {
          enable:true,
          value_area:600
        }
      }
    }
  }


class App extends Component {
   constructor(){
    super();
    this.state= {
      input:'',
      imageUrl:'',
      box:{},
      route: 'SignIn',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
    
    }
  }

  displayFaceBox = (box) => {
    
        this.setState({box: box});
  } 

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  } 
    onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
       this.state.input)
       .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
        .catch(err => console.log(err));
   
  
  }  

  onRouteChange =(route) => {
    if (route === 'SignOut') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    return (
      <div className="App">
            <Particles className="particles"
              params={particlesOptions}
              
            />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        {this.state.route === 'home' 
        ? <div>
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
        </div>
        
        : (
          this.state.route === 'SignIn' ?
          <SignIn onRouteChange={this.onRouteChange} />
          : <Register onRouteChange={this.onRouteChange} />
        )}
          
          
      </div>
    );
  }
  
}

export default App;
