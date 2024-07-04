import React, { useRef } from 'react';
import { ChromePicker } from 'react-color';
import { useSoccerTeamListsViewModel } from '../viewmodels/TeamListsViewModel';
import AddPlayerIcon from '../assets/add-user.png'
import DeleteListIcon from '../assets/delete-list.png'
import DeletePlayerIcon from '../assets/delete-player.png'
import EditIcon from '../assets/edit.png'
import AddPlayerToListIcon from '../assets/add-player.png'
import CancelIcon from '../assets/cancel.png'
import SaveIcon from '../assets/save.png'
import AddListIcon from '../assets/add.png'
import HeartIcon from '../assets/heart.png'
import ImportIcon from '../assets/import.png'
import ExportIcon from '../assets/export.png'
import ColorWheelIcon from '../assets/color-wheel.png'

export function SoccerTeamLists() {
    const vm = useSoccerTeamListsViewModel();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [colorPickerVisible, setColorPickerVisible] = React.useState<number | null>(null);
    const handleDragStart = (e: React.DragEvent<HTMLLIElement>, listIndex: number, playerIndex: number) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ listIndex, playerIndex }));
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, toListIndex: number) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const { listIndex: fromListIndex, playerIndex } = data;

        if (fromListIndex !== toListIndex) {
            vm.movePlayer(fromListIndex, toListIndex, playerIndex);
        }
    };

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
                            vm.validateField('newListName', e.target.value, true);
                        }}
                        placeholder="Enter list name"
                    />
                    {vm.errors.newListName && <p style={{ color: 'red' }}>{vm.errors.newListName}</p>}
                    <button className="btn-add-list" type="submit">
                        <img src={AddListIcon} alt="Add List" />
                    </button>
                    <button className="btn-export-list" type="button" onClick={() => {
                        vm.validateField('newListName', vm.newListName, false);
                        vm.exportLists();
                    }}>
                        <img src={ExportIcon} />
                    </button>
                    <button className="btn-load-list" type="button" onClick={() => {
                        vm.validateField('newListName', vm.newListName, false);
                        fileInputRef.current?.click();
                    }}>
                        <img src={ImportIcon} />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            vm.validateField('newListName', vm.newListName, false);
                            vm.importLists(e);
                        }}
                        accept=".json"
                    />
                </form>
            </div>

            <div className='main-board'>
                {vm.lists.map((list, listIndex) => (
                    <div className="new-list"
                        key={listIndex}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, listIndex)}
                        style={{ backgroundColor: list.backgroundColor }}
                    >
                        {vm.renameListIndex === listIndex ? (
                            <form className='list-name-form' onSubmit={(e) => { e.preventDefault(); vm.submitRenameList(); }}>
                                <input
                                    type="input-save-list-name"
                                    className='input-rename'
                                    value={vm.renameListName}
                                    onChange={(e) => {
                                        vm.setRenameListName(e.target.value);
                                        vm.validateField('renameListName', e.target.value);
                                    }}
                                />
                                {vm.errors.renameListName && <p style={{ color: 'red' }}>{vm.errors.renameListName}</p>}
                                <button className='btn-save' type="submit"><img src={SaveIcon} /></button>
                                <button className='btn-cancel' type="button" onClick={() => vm.cancelRenameList()}><img src={CancelIcon} /></button>
                            </form>
                        ) : (
                            <div className="list-header">
                                <button onClick={() => setColorPickerVisible(listIndex)}><img src={ColorWheelIcon} /></button>
                                {colorPickerVisible === listIndex && (
                                    <div style={{ position: 'absolute', zIndex: 2 }}>
                                        <ChromePicker
                                            color={list.backgroundColor}
                                            onChange={(color) => vm.updateListBackgroundColor(listIndex, color.hex)}
                                        />
                                        <button onClick={() => setColorPickerVisible(null)}><img src={CancelIcon} /></button>
                                    </div>
                                )}
                                <button className='btn-edit' onClick={() => vm.startRenameList(listIndex)}>
                                    <img src={EditIcon} />
                                </button>
                                <h2 className='list-title'>
                                    <span className="player-count">{list.players.length}</span>
                                    {list.name}
                                </h2>

                                <div className="list-buttons">

                                    <button className='btn-delete' onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this list?')) {
                                            vm.deleteList(listIndex);
                                        }
                                    }}><img src={DeleteListIcon} /></button>

                                    <button className='btn-add-player' onClick={() => vm.setActiveListIndex(listIndex)}>
                                        <img src={AddPlayerIcon} /> </button>
                                </div>
                            </div>
                        )}

                        <ul>
                            {list.players.map((player, playerIndex) => (
                                <li key={playerIndex}
                                    draggable
                                    onDragStart={(e) => {
                                        handleDragStart(e, listIndex, playerIndex);
                                        e.currentTarget.classList.add('dragging');
                                    }}
                                    onDragEnd={(e) => e.currentTarget.classList.remove('dragging')}
                                >
                                    {vm.editingPlayer?.listIndex === listIndex && vm.editingPlayer?.playerIndex === playerIndex ? (
                                        <form className='edit-player-form' onSubmit={(e) => { e.preventDefault(); vm.submitEditPlayer(); }}>
                                            <input
                                                type="text"
                                                className='input-edit-player'
                                                value={vm.editPlayerName}
                                                onChange={(e) => vm.setEditPlayerName(e.target.value)}
                                            />
                                            <select
                                                className='input-edit-player'
                                                value={vm.editPlayerPosition}
                                                onChange={(e) => vm.setEditPlayerPosition(e.target.value)}
                                            >
                                                {vm.playerPositions.map((position) => (
                                                    <option key={position} value={position}>{position}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                className='input-edit-player'
                                                value={vm.editPlayerPrice}
                                                onChange={(e) => vm.setEditPlayerPrice(e.target.value)}
                                                placeholder="Price in € Euros"
                                            />
                                            <button type="submit"><img src={SaveIcon} /></button>
                                            <button type="button" onClick={() => vm.cancelEditPlayer()}><img src={CancelIcon} /></button>
                                        </form>
                                    ) : (

                                        <div className="player-info">
                                            <span className={`player-position ${vm.getPlayerCategory(player.position)}`}>
                                                {player.position}
                                            </span>
                                            <div className="edit-player-btn">
                                                <button className='btn-delete-player' onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this player?')) {
                                                        vm.deletePlayer(listIndex, playerIndex);
                                                    }
                                                }}>
                                                    <img src={DeletePlayerIcon} alt="Delete" />
                                                </button>
                                                <button onClick={() => vm.startEditPlayer(listIndex, playerIndex)}>
                                                    <img src={EditIcon} />
                                                </button>
                                            </div>
                                            <span className='player-name'> {player.name} </span>
                                            <span className="player-price">
                                                {player.price !== undefined &&
                                                    `est. €${vm.formatNumber(player.price)} / £${vm.convertEuroToCurrency(player.price, 'gbp')}`
                                                }
                                            </span>
                                        </div>

                                    )}
                                </li>
                            ))}
                        </ul>

                        {vm.activeListIndex === listIndex && (
                            <form className='add-player-form' onSubmit={(e) => { e.preventDefault(); vm.addPlayer(); }}>
                                <input
                                    type="text"
                                    className='input-add-player'
                                    value={vm.newPlayerName}
                                    onChange={(e) => {
                                        vm.setNewPlayerName(e.target.value);
                                        vm.validateField('newPlayerName', e.target.value);
                                    }}
                                    placeholder="Enter player name"
                                />

                                {vm.errors.newPlayerName && <p style={{ color: 'red' }}>{vm.errors.newPlayerName}</p>}
                                <select
                                    className='input-add-player'
                                    value={vm.newPlayerPosition}
                                    onChange={(e) => {
                                        vm.setNewPlayerPosition(e.target.value);
                                        vm.validateField('newPlayerPosition', e.target.value);
                                    }}
                                >
                                    <option value="">Select position</option>
                                    {vm.playerPositions.map((position) => (
                                        <option key={position} value={position}>{position}</option>
                                    ))}
                                </select>
                                {vm.errors.newPlayerPosition && <p style={{ color: 'red' }}>{vm.errors.newPlayerPosition}</p>}
                                <input
                                    type="number"
                                    className='input-add-player'
                                    value={vm.newPlayerPrice}
                                    onChange={(e) => vm.setNewPlayerPrice(e.target.value)}
                                    placeholder="Enter player price"
                                />
                                <button type="submit"><img src={AddPlayerToListIcon} /></button>
                                <button type="button" onClick={() => vm.setActiveListIndex(null)}><img src={CancelIcon} /></button>

                            </form>
                        )}
                    </div>
                ))}
            </div>

            <div className='footer'>
                <p>
                    Transferlist v1.0.12 by <a href='https://github.com/adrianlimws' target='_blank'>Adr1an</a>
                    |
                    <a href="https://buymeacoffee.com/adrianlimwk" target='_blank'><img src={HeartIcon} /> Buy me a pizza <img src={HeartIcon} /> </a>
                    |
                    <a href="https://github.com/adrianlimws/transferlist" target='_blank'>Fork this Project</a>
                </p>
            </div>
        </>
    );
}