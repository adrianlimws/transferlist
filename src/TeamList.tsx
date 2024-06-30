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
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateField = (name: string, value: string) => {
        if (!value.trim()) {
            setErrors(prev => ({ ...prev, [name]: 'This field cannot be empty' }));
            return false;
        }
        setErrors(prev => ({ ...prev, [name]: '' }));
        return true;
    };

    const addList = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateField('newListName', newListName)) {
            setLists([...lists, { name: newListName, players: [] }]);
            setNewListName('');
        }
    };

    const addPlayer = (e: React.FormEvent) => {
        e.preventDefault();
        const isNameValid = validateField('newPlayerName', newPlayerName);
        const isPositionValid = validateField('newPlayerPosition', newPlayerPosition);
        if (activeListIndex !== null && isNameValid && isPositionValid) {
            const updatedLists = [...lists];
            updatedLists[activeListIndex].players.push({ name: newPlayerName, position: newPlayerPosition });
            setLists(updatedLists);
            setNewPlayerName('');
            setNewPlayerPosition('');
            setActiveListIndex(null); // Close the form after adding
        }
    };

    const startRenameList = (index: number) => {
        setRenameListIndex(index);
        setRenameListName(lists[index].name);
    };

    const submitRenameList = (e: React.FormEvent) => {
        e.preventDefault();
        if (renameListIndex !== null && validateField('renameListName', renameListName)) {
            const updatedLists = [...lists];
            updatedLists[renameListIndex].name = renameListName;
            setLists(updatedLists);
            setRenameListIndex(null);
            setRenameListName('');
        }
    };

    return (
        <div>
            <form onSubmit={addList}>
                <input
                    type="text"
                    className='input-text'
                    value={newListName}
                    onChange={(e) => {
                        setNewListName(e.target.value);
                        validateField('newListName', e.target.value);
                    }}
                    placeholder="Enter list name"
                />
                {errors.newListName && <p style={{ color: 'red' }}>{errors.newListName}</p>}
                <button type="submit">Create New List</button>
            </form>

            {lists.map((list, listIndex) => (
                <div key={listIndex}>
                    {renameListIndex === listIndex ? (
                        <form onSubmit={submitRenameList}>
                            <input
                                type="text"
                                className='input-text'
                                value={renameListName}
                                onChange={(e) => {
                                    setRenameListName(e.target.value);
                                    validateField('renameListName', e.target.value);
                                }}
                            />
                            {errors.renameListName && <p style={{ color: 'red' }}>{errors.renameListName}</p>}
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

                    {activeListIndex === listIndex && (
                        <form onSubmit={addPlayer}>
                            <input
                                type="text"
                                className='input-text'
                                value={newPlayerName}
                                onChange={(e) => {
                                    setNewPlayerName(e.target.value);
                                    validateField('newPlayerName', e.target.value);
                                }}
                                placeholder="Enter player name"
                            />
                            {errors.newPlayerName && <p style={{ color: 'red' }}>{errors.newPlayerName}</p>}
                            <input
                                type="text"
                                className='input-text'
                                value={newPlayerPosition}
                                onChange={(e) => {
                                    setNewPlayerPosition(e.target.value);
                                    validateField('newPlayerPosition', e.target.value);
                                }}
                                placeholder="Enter player position"
                            />
                            {errors.newPlayerPosition && <p style={{ color: 'red' }}>{errors.newPlayerPosition}</p>}
                            <button type="submit">Add Player</button>
                            <button type="button" onClick={() => setActiveListIndex(null)}>Cancel</button>
                        </form>
                    )}
                </div>
            ))}
        </div>
    );
}

export default SoccerTeamLists;