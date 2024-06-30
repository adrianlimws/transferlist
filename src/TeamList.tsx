import React, { useState } from 'react';

interface Player {
    name: string;
    position: string;
}

interface TeamList {
    name: string;
    players: Player[];
}

function SoccerTeamLists() {
    const [lists, setLists] = useState<TeamList[]>([]);

    const addList = () => {
        const listName = prompt('Enter list name:');
        if (listName) {
            setLists([...lists, { name: listName, players: [] }]);
        }
    };

    const renameList = (index: number) => {
        const newName = prompt('Enter new list name:');
        if (newName) {
            const updatedLists = [...lists];
            updatedLists[index].name = newName;
            setLists(updatedLists);
        }
    };

    const addPlayer = (listIndex: number) => {
        const name = prompt('Enter player name:');
        const position = prompt('Enter player position:');

        if (name && position) {
            const updatedLists = [...lists];
            updatedLists[listIndex].players.push({ name, position });
            setLists(updatedLists);
        }
    };

    return (
        <div>
            <h1>Soccer Team Lists</h1>
            <button onClick={addList}>Create New List</button>
            {lists.map((list, listIndex) => (
                <div key={listIndex}>
                    <h2>{list.name}</h2>
                    <button onClick={() => renameList(listIndex)}>Rename List</button>
                    <button onClick={() => addPlayer(listIndex)}>Add Player</button>
                    <ul>
                        {list.players.map((player, playerIndex) => (
                            <li key={playerIndex}>{player.name} - {player.position}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default SoccerTeamLists;