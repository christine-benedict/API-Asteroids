import React, { Component } from 'react';
import {Table} from 'react-bootstrap'
import './App.css';
import iss from './iss'

class App extends Component {
  constructor(props){
    super(props)
    let today = new Date()
    this.state = {
      apiKey: "6Ao1uENeqOpD9QHQQYOxfVDlwrtrNuKy8kKrV6jd",
      startDate: `${today.getFullYear()}-${today.getMonth() +1}-${today.getDate()}`,
      apiUrl: "https://api.nasa.gov/neo/rest/v1/feed",
      issLat: iss.iss_position.latitude,
      issLong: iss.iss_position.longitude,
      asteroids: []
    }
  }
  componentWillMount(){
    fetch(`${this.state.apiUrl}?start_date=${this.state.startDate}&api_key=${this.state.apiKey}`).then( (rawResponse) => {
      return rawResponse.json()
    }).then(( parsedResponse ) => {
      let neoData = parsedResponse.near_earth_objects
      let newAsteroids = []
      Object.keys(neoData).forEach( (date) => {
        neoData[date].forEach( (asteroid) => {
          newAsteroids.push({
            id: asteroid.neo_reference_id,
            name: asteroid.name,
            date: asteroid.close_approach_data[0].close_approach_date,
            diameterMin: asteroid.estimated_diameter.feet.estimated_diameter_min.toFixed(0),
            diameterMax: asteroid.estimated_diameter.feet.estimated_diameter_max.toFixed(0),
            closestApproach: asteroid.close_approach_data[0].miss_distance.miles,
            velocity: parseFloat(asteroid.close_approach_data[0].relative_velocity.miles_per_hour).toFixed(0),
            distance: asteroid.close_approach_data[0].miss_distance.miles
          })
        })
      })
      this.setState({ asteroids: newAsteroids })
    })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src="./armageddon.jpg" className="App-logo" alt="logo" />
          <h1 className="App-title">Asteroid List</h1>
        </header>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Estimated Diameter (feet)</th>
              <th>Date of Closest Approach</th>
              <th>Distance (miles)</th>
              <th>Velocity (miles/hour)</th>
            </tr>
          </thead>
          <tbody>
            {this.state.asteroids.map((asteroid)=>{
              return(
                <tr key={asteroid.id}>
                  <td>{asteroid.name}</td>
                  <td>{asteroid.diameterMin} - {asteroid.diameterMax}</td>
                  <td>{asteroid.date}</td>
                  <td>{asteroid.distance}</td>
                  <td>{asteroid.velocity}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default App;
