import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import morningICO from './bgimages/morning-icon.png'; 
import nightICO from './bgimages/night-icon.png'; 
const url = 'https://api.openweathermap.org/data/2.5/onecall?lat=43.856259&lon=18.413076&units=metric&exclude=minutely&appid=ea733dcd19ffd3359ade153e9eebbbed'


class UpcomingDay extends React.Component{
  render(){
    
     
      let dayms=this.props.parameters.daily[this.props.daysFromToday].dt*1000
      let Dateobj=new Date(dayms)
      let day = ((Dateobj.toString()).split(' '))[0]
      let loTemp = Math.round(this.props.parameters.daily[this.props.daysFromToday].temp.min)
      let hiTemp = Math.round(this.props.parameters.daily[this.props.daysFromToday].temp.max)
     

      
    return(
      <div className={'UpcomingDay '+this.props.className}>
      <span className='UpcommingDaySpan'>{day}</span>
      <br/>
      <img className='UpcommingDayIcon' src={'http://openweathermap.org/img/wn/'+this.props.parameters.daily[this.props.daysFromToday].weather[0].icon+'@2x.png'} alt={""}></img>
      <br/>
      <span className='UpcommingDaySpan'>{hiTemp}°C   </span>
      <span className='loTemp UpcommingDaySpan'>{loTemp}°C</span>


      </div>
    )
  }
}

class CurrentDay extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      displayCurrentWeather: true,
      hours: (new Date()).getHours(),

      minutes: (new Date()).getMinutes(),

      crthours: (new Date()).getHours(),




    };

  }




  render() {
    

    const miliseconds = this.props.parameters.current.sunset * 1000
    const dateObject = new Date(miliseconds)


    const sunsetTimeFormatH = dateObject.getHours()
    const sunsetTimeFormatM = dateObject.getMinutes()
    let todayDate = (new Date()).toString().split(' ').splice(1, 3).join(' ');
    if(this.state.hours>sunsetTimeFormatH){
      document.querySelector('body').classList.add('night')
      
    }
    if(this.state.hours<=sunsetTimeFormatH){
      document.querySelector('body').classList.add('day')
    }




    return (
      <div>
      <div className='CurrentDay fromTop'>
        <span className='city'>Sarajevo</span>
        <br />
        <span className='temp'>{(this.state.displayCurrentWeather) ? Math.round(this.props.parameters.current.temp) : Math.round(this.props.parameters.hourly[this.state.hours - this.state.crthours].temp)}°C</span>
        <br />
        <img src={(this.state.displayCurrentWeather) ? ('http://openweathermap.org/img/wn/'+this.props.parameters.current.weather[0].icon+'@2x.png') : ('http://openweathermap.org/img/wn/'+this.props.parameters.hourly[this.state.hours - this.state.crthours].weather[0].icon+'@2x.png')}
        alt={this.props.parameters.hourly[this.state.hours - this.state.crthours].weather[0].description} ></img>
        <br/>
        <span>{(this.state.displayCurrentWeather) ? ((this.props.parameters.current.weather[0].main === "Clear") ? "Clear Sky" : this.props.parameters.current.weather[0].main) : ((this.props.parameters.hourly[this.state.hours - this.state.crthours].weather[0].main === "Clear") ? "Clear Sky" : this.props.parameters.hourly[this.state.hours - this.state.crthours].weather[0].main)}
        {(this.state.displayCurrentWeather) ? (null) : (", Precipitation: "+Math.round(this.props.parameters.hourly[this.state.hours - this.state.crthours].pop*100)+"%")}</span>
        <br />
        <span>Humidity: {(this.state.displayCurrentWeather) ? this.props.parameters.current.humidity : this.props.parameters.hourly[this.state.hours - this.state.crthours].humidity}%</span>
        <br />
        <span>Wind: {(this.state.displayCurrentWeather) ? (this.props.parameters.current.wind_speed) : (this.props.parameters.hourly[this.state.hours - this.state.crthours].wind_speed)} {' m/s | '}    
        {((this.state.displayCurrentWeather) ? ((this.props.parameters.current.wind_speed * (60 * 60) / 1000).toFixed(2)) : 
        ((this.props.parameters.hourly[this.state.hours - this.state.crthours].wind_speed * (60 * 60) / 1000).toFixed(2)))} km/h</span>
        {/* m/s to km/h = (m/s) * (60*60)/1000 */}
        <br/>
        
        <span>Sunset: {sunsetTimeFormatH}:{(sunsetTimeFormatM < 10) ? ("0" + sunsetTimeFormatM) : sunsetTimeFormatM}</span>

        <br />
        <span>{todayDate}, {this.state.hours}:{(this.state.minutes < 10) ? ('0' + this.state.minutes) : this.state.minutes}</span>
        <br />
        <img className='sliderBorderM' src={morningICO} alt={""} ></img>
        
        <input id="slider" className='slider' value={this.state.hours} type="range" min='0' max="23" onChange={(event) => { if (event.target.value > this.state.crthours) this.setState({ hours: event.target.value, displayCurrentWeather: false, minutes: 0 }) 
        document.querySelector('body').classList.remove('night')
        document.querySelector('body').classList.remove('day')
      
        if(this.state.hours>sunsetTimeFormatH){
          document.querySelector('body').classList.add('night')
        }
        if(this.state.hours<=sunsetTimeFormatH){
          document.querySelector('body').classList.add('day')
        }
        }} step="1" />
        <img className='sliderBorder' src={nightICO} alt={""}></img>
        <br/>
        <span>Use slider to see hourly forecast</span>



      </div>
      <span className='credits'>Created by Adin Đozo</span>
      </div>
    )
  }
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

 
  componentDidMount() {


    fetch(url)
      .then((result) => result.json())
      .then((result) => {
        console.log(result)
        this.setState({
          result
        })
      
      })
  }




  render() {
    if (!this.state.result) {
      return null;
    }


    return (
      <main>
      <div className='container'> 
        <CurrentDay parameters={this.state.result} ></CurrentDay>
        <div className='UpcommingDaysContainer'>
        <UpcomingDay parameters={this.state.result} daysFromToday={1} className='fromLeft'></UpcomingDay>
        <UpcomingDay parameters={this.state.result} daysFromToday={2} className='fromBottom' ></UpcomingDay>
        <UpcomingDay parameters={this.state.result} daysFromToday={3} className='fromRight'></UpcomingDay>
        </div>
      </div>
      </main>
    );
  }
}


ReactDOM.render(
  <App />,

  document.getElementById('root')
);


