import { Text, Box, render, useApp, useInput } from "ink";
import React, { StrictMode, useState, useCallback, useEffect } from "react";

const SuperModeContext = React.createContext({
  superMode: false,
  goSuper: () => {},
});

function SuperModeContextProvider({ children }) {
  const [superMode, setSuperMode] = useState(false);
  const goSuper = useCallback(() => {
    setSuperMode(true);
  });
  return (
    <SuperModeContext.Provider value={{ superMode, goSuper }}>
      {children}
    </SuperModeContext.Provider>
  );
}

function useSuperMode() {
  return React.useContext(SuperModeContext);
}

function Chest() {
  return (
    <Box margin={1} height={3} aligItems="center">
      <Text>📦</Text>
    </Box>
  );
}

function Player() {
  const { superMode } = useSuperMode();
  const borderColor = superMode ? "green" : "grey";
  return (
    <Box
      margin={1}
      height={3}
      width={4}
      borderStyle="classic"
      borderColor={borderColor}
      aligItems="center"
    >
      <Text>{superMode ? "🦸‍♀️" : "👩‍💼"}</Text>
    </Box>
  );
}

function Enemy() {
  return (
    <Box margin={1} height={3} aligItems="center">
      <Text>👾</Text>
    </Box>
  );
}

function Tree() {
  return (
    <Box margin={1} height={3} aligItems="center">
      <Text>🌲</Text>
    </Box>
  );
}

function World({ children }) {
  return (
    <Box margin={2} height={10} borderStyle="double">
      {children}
    </Box>
  );
}

function WorldElement({ type }) {
  if (type === "chest") {
    return <Chest />;
  }
  if (type === "tree") {
    return <Tree />;
  }
  if (type === "player") {
    return <Player />;
  }
  if (type === "enemy") {
    return <Enemy />;
  }
}

function useWorld({ onGameOver }) {
  const [world, setWorld] = React.useState([
    "chest",
    "tree",
    "player",
    "tree",
    "tree",
    "tree",
    "tree",
    "tree",
    "enemy",
    "tree",
    "tree",
    "tree",
    "tree",
  ]);
  const { goSuper } = useSuperMode();

  const moveEnemy = useCallback((direction) => {
    setWorld((world) => {
      const newWorld = [...world];
      const enemyIndex = newWorld.indexOf("enemy");
      const playerIndex = newWorld.indexOf("player");
      const newIndex = enemyIndex + direction;
      if (newIndex === playerIndex) {
        onGameOver();
      }
      newWorld[enemyIndex] = "tree";
      newWorld[enemyIndex + direction] = "enemy";
      return newWorld;
    });
  });

  const moveEnemyRight = () => {
    moveEnemy(1);
  };

  const moveEnemyLeft = () => {
    moveEnemy(-1);
  };

  const movePlayer = useCallback((direction) => {
    setWorld((world) => {
      const newWorld = [...world];
      const playerIndex = newWorld.indexOf("player");
      const newIndex = playerIndex + direction;
      if (newWorld[newIndex] === "enemy") {
        onGameOver();
      }
      if (newWorld[newIndex] === "chest") {
        goSuper();
      }
      newWorld[playerIndex] = "tree";
      newWorld[newIndex] = "player";
      return newWorld;
    });
  });

  const movePlayerRight = () => {
    movePlayer(1);
  };

  const movePlayerLeft = () => {
    movePlayer(-1);
  };

  return {
    world,
    moveEnemyRight,
    moveEnemyLeft,
    movePlayerRight,
    movePlayerLeft,
  };
}

function App() {
  const { exit } = useApp();
  const [running, setRunning] = React.useState(true);
  const [displayText, setDisplayText] = React.useState(" ");

  const onGameOver = useCallback(() => {
    setDisplayText("Game Over");
    setRunning(false);
  });

  const {
    world,
    movePlayerLeft,
    movePlayerRight,
    moveEnemyRight,
    moveEnemyLeft,
  } = useWorld({ onGameOver });

  useEffect(() => {
    if (!running) {
      return;
    }
    const interval = setInterval(() => {
      const random = Math.random();
      if (random > 0.5) {
        setDisplayText("👾");
        moveEnemyRight();
      } else {
        setDisplayText("👾");
        moveEnemyLeft();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  useInput((input, key) => {
    if (input === "q") {
      exit();
      return;
    }
    if (!running) {
      return;
    }
    if (key.leftArrow) {
      setDisplayText("<--");
      movePlayerLeft();
      return;
    }
    if (key.rightArrow) {
      setDisplayText("-->");
      movePlayerRight();
      return;
    }
  });

  return (
    <>
      <Text>{displayText}</Text>
      <World>
        {world.map((type, i) => (
          <WorldElement key={`${type}-${i}`} type={type} />
        ))}
      </World>
    </>
  );
}

render(
  <StrictMode>
    <SuperModeContextProvider>
      <App />
    </SuperModeContextProvider>
  </StrictMode>
);
