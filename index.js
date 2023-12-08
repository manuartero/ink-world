import React, { useState, useEffect } from "react";
import { render, Text, Box, useInput, useApp } from "ink";

function Ground({ children }) {
  return (
    <Box height={10} margin={2} borderStyle="double">
      {children}
    </Box>
  );
}

function Character() {
  return (
    <Box
      margin={1}
      width={4}
      height={3}
      borderStyle="round"
      borderColor="green"
      alignItems="center"
    >
      <Text>🦸</Text>
    </Box>
  );
}

function Tree() {
  return (
    <Box margin={1} height={3} alignItems="center">
      <Text>🌲</Text>
    </Box>
  );
}

function Enemy() {
  return (
    <Box margin={1} borderStyle="classic" height={3} alignItems="center">
      <Text>👾</Text>
    </Box>
  );
}

function useWorld({ onGameOver, onGameWin }) {
  const [isMoving, setIsMoving] = useState(true);

  const [world, setWorld] = useState([
    "tree",
    "character",
    "tree",
    "tree",
    "tree",
    "enemy",
  ]);

  useEffect(() => {
    if (!isMoving) {
      return;
    }
    const interval = setInterval(() => {
      const random = Math.random();
      if (random > 0.5) {
        return moveEnemyRight();
      }
      if (random < 0.5) {
        return moveEnemyLeft();
      }
    }, 500);

    return () => clearInterval(interval);
  });

  const moveEnemyRight = () => {
    setWorld((currentWorld) => {
      const newWorld = [...currentWorld];
      const enemyIndex = newWorld.indexOf("enemy");
      const elementOnRight = newWorld[enemyIndex + 1];
      if (elementOnRight === "character") {
        onGameOver();
        setIsMoving(false);
      }
      newWorld[enemyIndex] = "tree";
      newWorld[enemyIndex + 1] = "enemy";
      return newWorld;
    });
  };

  const moveEnemyLeft = () => {
    setWorld((currentWorld) => {
      const newWorld = [...currentWorld];
      const enemyIndex = newWorld.indexOf("enemy");
      const elementOnLeft = newWorld[enemyIndex - 1];
      if (elementOnLeft === "character") {
        onGameOver();
        setIsMoving(false);
      }
      newWorld[enemyIndex] = "tree";
      newWorld[enemyIndex - 1] = "enemy";
      return newWorld;
    });
  };

  const moveCharacterRight = () => {
    setWorld((currentWorld) => {
      const newWorld = [...currentWorld];
      const characterIndex = newWorld.indexOf("character");
      const elementOnRight = newWorld[characterIndex + 1];
      if (elementOnRight === "enemy") {
        onGameWin();
        setIsMoving(false);
      }
      newWorld[characterIndex] = "tree";
      newWorld[characterIndex + 1] = "character";
      return newWorld;
    });
  };

  const moveCharacterLeft = () => {
    setWorld((currentWorld) => {
      const newWorld = [...currentWorld];
      const characterIndex = newWorld.indexOf("character");
      const elementOnLeft = newWorld[characterIndex - 1];
      if (elementOnLeft === "enemy") {
        onGameWin();
        setIsMoving(false);
      }
      newWorld[characterIndex] = "tree";
      newWorld[characterIndex - 1] = "character";
      return newWorld;
    });
  };

  return { world, moveCharacterRight, moveCharacterLeft };
}

function App() {
  const [displayText, setDisplayText] = useState("Hello World");
  const { exit } = useApp();
  const { world, moveCharacterRight, moveCharacterLeft } = useWorld({
    onGameOver: () => {
      setDisplayText("Game over!");
    },
    onGameWin: () => {
      setDisplayText("You win!");
    },
  });

  useInput((input, key) => {
    if (input === "q") {
      exit();
    }
    if (key.leftArrow) {
      setDisplayText("<-");
      return moveCharacterLeft();
    }
    if (key.rightArrow) {
      setDisplayText("->");
      return moveCharacterRight();
    }
  });

  return (
    <>
      <Ground>
        {world.map((type, i) => (
          <WorldElement key={`${type}-${i}`} type={type} />
        ))}
      </Ground>
      <Text>{displayText}</Text>
    </>
  );
}

function WorldElement({ type }) {
  if (type === "tree") {
    return <Tree />;
  } else if (type === "character") {
    return <Character />;
  }
  return <Enemy />;
}

render(<App />);
