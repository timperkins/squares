#Squares

---

### Node
#### Properties:
- x (Number)
- y (Number)

---


### ObstacleNode (extends Node)
#### Properties:
- obstacle (Obstacle)
	- Description: [optional], the obstacle that this node is tied to

---

### PathManager
#### Methods:
- findNextPointInPath(Block)
	- Description: Uses the blocks position and destination to determine the path. Calls this.findShortestPath()
	- Returns: (ObstacleNode): The next node to travel to

---

### TrafficManager
#### Methods:
- blockMove(Block)
	- Description: when a block moves: (for curBlock in blocks)
		- notifies the block if it is about to collide with curBlock (tell it the block it is about to collide with) aboutToCollideWith(curBlock)
		- if curBlock.moveToBlock is the block that is moving,  then tell the block to ask for a new path

---

### Obstacle
#### Properties:
- left (Number)
- top (Number)
- right (Number)
- bottom (Number)
- width (Number)
- height (Number)

---

### Block (extends Obstacle)
#### Description:
- Knows its current position, destination, next point (and object)

#### Properties:
- position (Node)
	- Description: The coordinates of the center of the block
- destination (Node)
- travelToPoint (Node)
- travelToObstacle (Obstacle)

#### Methods:
- askForNextPoint()
	- Description: calls pathManager.findNextPointInPath(this), updates travelToPoint/travelToObstacle if they change.
- updatePosition()
	- Description: Notifies trafficManager when it moves (every step)
- aboutToCollideWith(Block)
 
---

- knows its final destination point
- asks path-manager for coordinates to next point in path
- upon arriving at a point, if the point is not the destination then it asks the path-manager again
- knows the next point, can move there (does NOT know the full path)
- knows the object of the next point that it is moving to
- knows how to negotiate with another block it collides with
- tells the traffic-manager whenever it moves (every step)
- requestPath() =
     pathManager.getPath(this, toX, toY)
     if return path is same as this.toX, this.toY then do nothing

path-manager
- can find the most efficient path from point A to point B
     - ignore blocks that are moving
     - a block asks to find most efficient path to destination, it responds with the next point in the path and the object that it is moving to

traffic-manager
- listens to block movements
- when a block moves: (for curBlock in blocks)
     - notifies the block if it is about to collide with curBlock (tell it the block it is about to collide with) aboutToCollideWith(curBlock)
     - if curBlock.moveToBlock is the block that is moving,  then tell the block to ask for a new path
- listens to block additions/removals

obstacle
- knows its dimensions
