// components/SoccerTeamLists.tsx
import React from 'react';
import { useSoccerTeamListsViewModel } from '../viewmodels/TeamListsViewModel';

export function SoccerTeamLists() {
    const vm = useSoccerTeamListsViewModel();

    return (
        <div>
            <h1>Soccer Team Lists</h1>

            <form onSubmit={(e) => { e.preventDefault(); vm.addList(); }}>
                <input
                    type="text"
                    value={vm.newListName}
                    onChange={(e) => {
                        vm.setNewListName(e.target.value);
                        vm.validateField('newListName', e.target.value);
                    }}
                    placeholder="Enter list name"
                />
                {vm.errors.newListName && <p style={{ color: 'red' }}>{vm.errors.newListName}</p>}
                <button type="submit">Create New List</button>
            </form>

            {vm.lists.map((list, listIndex) => (
                <div key={listIndex}>
                    {vm.renameListIndex === listIndex ? (
                        <form onSubmit={(e) => { e.preventDefault(); vm.submitRenameList(); }}>
                            <input
                                type="text"
                                value={vm.renameListName}
                                onChange={(e) => {
                                    vm.setRenameListName(e.target.value);
                                    vm.validateField('renameListName', e.target.value);
                                }}
                            />
                            {vm.errors.renameListName && <p style={{ color: 'red' }}>{vm.errors.renameListName}</p>}
                            <button type="submit">Save</button>
                        </form>
                    ) : (
                        <>
                            <h2>{list.name}</h2>
                            <button onClick={() => vm.startRenameList(listIndex)}>Rename List</button>
                        </>
                    )}
                    <button onClick={() => vm.setActiveListIndex(listIndex)}>Add Player to This List</button>
                    <ul>
                        {list.players.map((player, playerIndex) => (
                            <li key={playerIndex}>{player.name} - {player.position}</li>
                        ))}
                    </ul>

                    {vm.activeListIndex === listIndex && (
                        <form onSubmit={(e) => { e.preventDefault(); vm.addPlayer(); }}>
                            <input
                                type="text"
                                value={vm.newPlayerName}
                                onChange={(e) => {
                                    vm.setNewPlayerName(e.target.value);
                                    vm.validateField('newPlayerName', e.target.value);
                                }}
                                placeholder="Enter player name"
                            />
                            {vm.errors.newPlayerName && <p style={{ color: 'red' }}>{vm.errors.newPlayerName}</p>}
                            <input
                                type="text"
                                value={vm.newPlayerPosition}
                                onChange={(e) => {
                                    vm.setNewPlayerPosition(e.target.value);
                                    vm.validateField('newPlayerPosition', e.target.value);
                                }}
                                placeholder="Enter player position"
                            />
                            {vm.errors.newPlayerPosition && <p style={{ color: 'red' }}>{vm.errors.newPlayerPosition}</p>}
                            <button type="submit">Add Player</button>
                            <button type="button" onClick={() => vm.setActiveListIndex(null)}>Cancel</button>
                        </form>
                    )}
                </div>
            ))}
        </div>
    );
}