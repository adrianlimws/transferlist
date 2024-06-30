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
    const [newListName, setNewListName] = useState('');
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newPlayerPosition, setNewPlayerPosition] = useState('');
    const [activeListIndex, setActiveListIndex] = useState<number | null>(null);
    const [renameListIndex, setRenameListIndex] = useState<number | null>(null);
    const [renameListName, setRenameListName] = useState('');

    const addList = (e: React.FormEvent) => {
        e.preventDefault();
        if (newListName) {
            setLists([...lists, { name: newListName, players: [] }]);
            setNewListName('');
        }
    };

    const addPlayer = (e: React.FormEvent) => {
        e.preventDefault();
        if (activeListIndex !== null && newPlayerName && newPlayerPosition) {
            const updatedLists = [...lists];
            updatedLists[activeListIndex].players.push({ name: newPlayerName, position: newPlayerPosition });
            setLists(updatedLists);
            setNewPlayerName('');
            setNewPlayerPosition('');
        }
    };

    const startRenameList = (index: number) => {
        setRenameListIndex(index);
        setRenameListName(lists[index].name);
    };

    const submitRenameList = (e: React.FormEvent) => {
        e.preventDefault();
        if (renameListIndex !== null && renameListName) {
            const updatedLists = [...lists];
            updatedLists[renameListIndex].name = renameListName;
            setLists(updatedLists);
            setRenameListIndex(null);
            setRenameListName('');
        }
    };

    return (
        <div>
            <h1>Soccer Team Lists</h1>

            <form onSubmit={addList}>
                <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Enter list name"
                />
                <button type="submit">Create New List</button>
            </form>

            {lists.map((list, listIndex) => (
                <div key={listIndex}>
                    {renameListIndex === listIndex ? (
                        <form onSubmit={submitRenameList}>
                            <input
                                type="text"
                                value={renameListName}
                                onChange={(e) => setRenameListName(e.target.value)}
                            />
                            <button type="submit">Save</button>
                        </form>
                    ) : (
                        <>
                            <h2>{list.name}</h2>
                            <button onClick={() => startRenameList(listIndex)}>Rename List</button>
                        </>
                    )}
                    <button onClick={() => setActiveListIndex(listIndex)}>Add Player to This List</button>
                    <ul>
                        {list.players.map((player, playerIndex) => (
                            <li key={playerIndex}>{player.name} - {player.position}</li>
                        ))}
                    </ul>
                </div>
            ))}

            {activeListIndex !== null && (
                <form onSubmit={addPlayer}>
                    <input
                        type="text"
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        placeholder="Enter player name"
                    />
                    <input
                        type="text"
                        value={newPlayerPosition}
                        onChange={(e) => setNewPlayerPosition(e.target.value)}
                        placeholder="Enter player position"
                    />
                    <button type="submit">Add Player</button>
                </form>
            )}
        </div>
    );
}

export default SoccerTeamLists;