import React from 'react';
import axios from 'axios';
import AddBeliever from './AddBeliever.js';
import ViewBeliever from './ViewBeliever.js';

class Believer extends React.Component {
    constructor(){
        super();
        this.state = {
          selectedBeliever : undefined,
          believerData : []
        };

      this.getAllBeliever();
    }

    getAllBeliever = () =>{
      let self = this;
      axios.get('http://localhost:8080/temple/believer')
      .then(function (response) {
        let believerList = response.data;
        let selectedBeliever = self.state.selectedBeliever;
        if(selectedBeliever !== undefined){
            let selectedBelieverList = believerList.filter(function(believer){
              return believer.id === selectedBeliever.id;
            });
            if(selectedBelieverList.length === 0){
              self.setState({selectedBeliever : undefined});
            }else{
              self.setState({selectedBeliever : selectedBelieverList[0]});
            }
        }
        self.setState({believerData : believerList});
      })
      .catch(function (error){
          console.log(error);
      });
    }

    handleRowSelect = (row, isSelected) => {
      if (isSelected) {
          this.setState({selectedBeliever: row});
      } else {
        this.setState({selectedBeliever: undefined});
      }
    }

    render() {
        return (
          <div>
            <div style = {{display : 'flex'}}>
              <AddBeliever getAllBeliever={this.getAllBeliever}/>
            </div>
            <ViewBeliever believerData={this.state.believerData} handleRowSelect={this.handleRowSelect}/>
          </div>
        );
    }
}

export default Believer;
