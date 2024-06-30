import React from 'react';
import { useSoccerTeamListsViewModel } from '../viewmodels/TeamListsViewModel';
import AddIcon from '../assets/add.png'
import AddUserIcon from '../assets/add-user.png'
import DeleteIcon from '../assets/delete.png'
import EditIcon from '../assets/edit.png'

export function SoccerTeamLists() {
    const vm = useSoccerTeamListsViewModel();

    return (
        <>
            <div className='top-bar'>
                <h2>Transfer List</h2>
                <form className='create-list-form'
                    onSubmit={(e) => { e.preventDefault(); vm.addList(); }}>
                    <input
                        type="text"
                        className='input-text'
                        value={vm.newListName}
                        onChange={(e) => {
                            vm.setNewListName(e.target.value);
                            vm.validateField('newListName', e.target.value);
                        }}
                        placeholder="Enter list name"
                    />
                    {vm.errors.newListName && <p style={{ color: 'red' }}>{vm.errors.newListName}</p>}
                    <button className="add-list" type="submit">Create a New List</button>
                </form>
            </div>

            <div className='main-board'>
                {vm.lists.map((list, listIndex) => (
                    <div className="new-list" key={listIndex}>
                        {vm.renameListIndex === listIndex ? (
                            <form onSubmit={(e) => { e.preventDefault(); vm.submitRenameList(); }}>
                                <input
                                    type="text"
                                    className='input-text'
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
                            <div className="list-header">
                                <h2 className='list-title'>{list.name}</h2>

                                <div className="list-buttons">
                                    <button className='btn-edit' onClick={() => vm.startRenameList(listIndex)}>
                                        Rename List
                                    </button>
                                    <button className='btn-delete' onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this list?')) {
                                            vm.deleteList(listIndex);
                                        }
                                    }}>Delete List</button>

                                    <button className='btn-add-player' onClick={() => vm.setActiveListIndex(listIndex)}>
                                        Add Player </button>
                                </div>
                            </div>
                        )}

                        <ul>
                            {list.players.map((player, playerIndex) => (
                                <li key={playerIndex}>{player.name} - {player.position}</li>
                            ))}
                        </ul>

                        {vm.activeListIndex === listIndex && (
                            <form onSubmit={(e) => { e.preventDefault(); vm.addPlayer(); }}>
                                <input
                                    type="text"
                                    className='input-text'
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
                                    className='input-text'
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
        </>
    );
}