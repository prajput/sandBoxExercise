import React from "react";
import "./styles.css";

let keyCounter = 0;
let timerId = null;

export default class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {

    }
  }

  handleChange = (field, value) => {
    if(field == 'matrixCount') 
      this.setState({[field]: value, blockCount: value*value, blockIndexes: Array.from({length: value*value}, (v, i) => i)});
    else
      this.setState({[field]: value});
  }

  renderGame = () => {
    let {blockCount, matrixCount, interval, defaultCount} = this.state;
    if(!blockCount ||  !matrixCount || !interval || !defaultCount) return false;
    timerId = setInterval(() => this.getDefaultBlockItems(), interval*1000);
    this.setState({loadGame: true}, () => this.getDefaultBlockItems());
  }

  getDefaultBlockItems = () => {
    let {blockCount,defaultCount, coloredBlocks} = this.state;
    let defaultColoredBlocks = coloredBlocks || [];
    for(var i=0; i < defaultCount; i++) {
      let randomDefault =  this.randomNumber(0, blockCount);
      if(!defaultColoredBlocks.includes(randomDefault))defaultColoredBlocks.push(randomDefault);
    }
    this.setState({coloredBlocks : defaultColoredBlocks});
  }

  randomNumber = (min, max) => {
    let randomNum = Math.random() * (max - min) + min;
    return parseInt(randomNum);
  }  

  getBlocks = () => {
    keyCounter = 0;
    let {blockCount, matrixCount, interval, defaultCount} = this.state;
    if(!blockCount ||  !matrixCount || !interval || !defaultCount) return null;
    let blockRows = [];
    for(var i=0; i < matrixCount; i++) {
      let list = (
        <ul id={'list'+i} className='blockList'>
          {this.getblockItems()}
        </ul>
      )
      blockRows.push(list);
    }
    return blockRows;
  }

  getblockItems = () => {
    let {blockCount, matrixCount, interval, defaultCount, blockIndexes, coloredBlocks} = this.state;
    let blockCols = [];
    for(var i=0; i < matrixCount; i++) {
      let index = keyCounter;
      let listItem = (
        <li id={'listItem'+i+keyCounter} className={coloredBlocks && coloredBlocks.includes(keyCounter) ? 'blockItem colored' : 'blockItem'} onClick={()=>this.unColorIt(index)}>
          {keyCounter}
        </li>
      )
      blockCols.push(listItem);
      keyCounter++;
    }
    return blockCols;
  }

  unColorIt = (index) => {
    let {coloredBlocks} = this.state;
    coloredBlocks.splice(coloredBlocks.indexOf(index), 1);
    this.setState({coloredBlocks});
  }

  postResult = () => {
    let {coloredBlocks, blockCount} = this.state;
    if(coloredBlocks && coloredBlocks.length == 0){
      clearInterval(timerId);
      return 'You Won';
    } else if(coloredBlocks && coloredBlocks.length == blockCount) {
      clearInterval(timerId);
      return 'You Lost';
    } else{
      return '';
    }
  }

  render(){
    let {coloredBlocks, blockCount} = this.state;
    return (
      <div className="App">
        <div className='input-form'>
          <fieldset>
            <label>Matrix Count</label>
            <input name='matrixCount' type='number' value={this.state.matrixCount} onChange={(elem) => this.handleChange('matrixCount',elem.target.value)}/>
          </fieldset>
          <fieldset>
            <label>Time Interval</label>
            <input name='interval' type='number' value={this.state.interval}  onChange={(elem) => this.handleChange('interval',elem.target.value)}/>
          </fieldset>
          <fieldset>
            <label>Default Colored</label>
            <input name='defaultCount' type='number' value={this.state.defaultCount}  onChange={(elem) => this.handleChange('defaultCount',elem.target.value)}/>
          </fieldset>
          <button onClick={() => this.renderGame()} >Load Game</button>
        </div>
        {
          this.state.loadGame ? 
          <div className='game-container'>
            {
              this.getBlocks()
            }
          </div> : null
        }
        <p>{this.postResult()}</p>
      </div>
    );
  }
}
