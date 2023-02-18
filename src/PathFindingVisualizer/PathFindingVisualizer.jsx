import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import {Button, ButtonGroup} from '@material-ui/core';
import { Paper } from '@material-ui/core';
import Header from '../style/header';
import './PathFindingVisualizer.css';

let START_NODE_ROW = 10;
let START_NODE_COL = 5;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 35;

let ROWS_NUMBER = 20;
let COL_NUMBER = 40;

export default class PathFindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      isWallButtonPressed : false,
      changeSrc:false,
      changeDest:false,
      refresh:true
    };
  }

  componentDidMount() {

    if(window.innerWidth<1000){
      ROWS_NUMBER=40;
      COL_NUMBER=37;
    }

    const grid = getInitialGrid();
    this.setState({grid});
  }

  refresh(){
    window.location.reload()
  }

  addWall(){
    this.setState((state,props)=>({
      isWallButtonPressed : !state.isWallButtonPressed,
      changeDest:false,
      changeSrc:false
    }))
    
  }

  changeSrc(){
    this.setState((state , props)=>({
      changeSrc:!state.changeSrc,
      isWallButtonPressed:false,
      changeDest:false
    }))
  }

  changeDest(){
    this.setState((state , props)=>({
      changeDest:!state.changeDest,
      isWallButtonPressed:false,
      changeSrc:false
    }))
  }

  handleMouseDown(row, col) {

    if(this.state.changeSrc){
      START_NODE_ROW = row;
      START_NODE_COL = col;
      const grid = getInitialGrid();
      this.setState({grid})  
    }

    else if(this.state.changeDest){
      FINISH_NODE_COL=col;
      FINISH_NODE_ROW=row;
      const grid = getInitialGrid();
      this.setState({grid})
    }

      //When the mouse button is pressed down we want to add the wall to node
     else if(this.state.isWallButtonPressed){
    const newGrid = updateGridWithWall(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
      }
  }

  handleMouseEnter(row, col) {
      //Until the mousebutton is not released we want to add the wall
      //Basically mouse hover
    if (!this.state.mouseIsPressed) return;
    const newGrid = updateGridWithWall(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
      //Once the mouse is released we dont add walls any more
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        //This condition is reached after animating all the sides
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }

      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }


  render() {
    const {grid, mouseIsPressed} = this.state;
    
    return (
      <div id="backg">
      <Header />
        <br />
        <br />
        <div align="center">
        <ButtonGroup>
        <Button onClick={()=>this.visualizeDijkstra()} 
        variant="contained"
        
        >
        Visualize Dijkstra's Algorithm
        </Button>
        <Button onClick={()=> this.addWall()}
        variant="contained"
        color={this.state.isWallButtonPressed?'secondary':'primary'}
        >
        Add wall
        </Button>
        <Button onClick={()=>this.changeSrc()}
        variant="contained"
        color={this.state.changeSrc?'secondary':'primary'}
        >
          Change Source
        </Button>
        <Button onClick={()=>this.changeDest()}
        variant="contained"
        color={this.state.changeDest?'secondary':'primary'}
        >
          Change Dest
        </Button>
        <Button
        variant="contained"
        color='primary'
        onClick={()=>this.refresh()}
        >
         Refresh 
        </Button>
        </ButtonGroup>
        </div>
        <br/>
        <br/>
        <Paper elevation={7}>
        <div className="grid" align="center">
            
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
        </Paper>
      </div>
    );
  }
}

/**
 * grid is effectively a collection OR MORE PRECISELY A 2-D ARRAY 
 * of nodes where each node is an object
 * @returns {A 2-D array of grid}
 */
const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < ROWS_NUMBER; row++) {
    const currentRow = [];
    for (let col = 0; col < COL_NUMBER; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

/**
 * 
 * @param {Takes the column  value form getInitialGrid} col 
 * @param {Takes the row value from the above function} row
 * @returns {Node Object with column and row
 *  isStart : The starting point on the grid
 *  isFinish : The End point on the grid
 *  distance : In dijkstra algo all nodes are assumed to be at infinity
 *  isVisited : Used in Dijkstra algorithm
 *  isWall : used in animation of dijkstra
 * }  
 */

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

/**
 * 
 * @param {A 2-D array of node objects} grid 
 * @param {The row where the wall is to be added} row 
 * @param {The column where the wall is to be added} col 
 */
const updateGridWithWall = (grid, row, col) => {
  const GridWithWalls = grid.slice();
  const node = GridWithWalls[row][col];
  //Creates a new node at the selected row and column
  //Only inverts the isWall property
  //Inversion is required because if there is a wall already we need to remove the wall if clicked
  //on the node again
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  GridWithWalls[row][col] = newNode;
  return GridWithWalls;
};
