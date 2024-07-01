import { useSoccerTeamListsViewModel } from '../viewmodels/TeamListsViewModel';
import AddPlayerIcon from '../assets/add-user.png'
import DeleteIcon from '../assets/delete.png'
import EditIcon from '../assets/edit.png'
import AddPlayerToListIcon from '../assets/add-player.png'
import CancelIcon from '../assets/cancel.png'
import SaveIcon from '../assets/save.png'

export function SoccerTeamLists() {
    const vm = useSoccerTeamListsViewModel();

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
                    <div className="new-list"
                        key={listIndex}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, listIndex)}>
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
                            </form>
                        ) : (
                            <div className="list-header">
                                <h2 className='list-title'>{list.name}</h2>

                                <div className="list-buttons">
                                    <button className='btn-edit' onClick={() => vm.startRenameList(listIndex)}>
                                        <img src={EditIcon} />
                                    </button>
                                    <button className='btn-delete' onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this list?')) {
                                            vm.deleteList(listIndex);
                                        }
                                    }}><img src={DeleteIcon} /></button>

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
                                            <input
                                                type="text"
                                                className='input-edit-player'
                                                value={vm.editPlayerPosition}
                                                onChange={(e) => vm.setEditPlayerPosition(e.target.value)}
                                            />
                                            <input
                                                type="number"
                                                className='input-edit-player'
                                                value={vm.editPlayerPrice}
                                                onChange={(e) => vm.setEditPlayerPrice(e.target.value)}
                                                placeholder="Price"
                                            />
                                            <button type="submit"><img src={SaveIcon} /></button>
                                        </form>
                                    ) : (

                                        <div className="player-info">
                                            <h3>
                                                {player.name} [{player.position}]
                                                {player.price !== undefined && ` - €${player.price}`}
                                                <button onClick={() => vm.startEditPlayer(listIndex, playerIndex)}>Edit</button>
                                            </h3>
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
                                <input
                                    type="text"
                                    className='input-add-player'
                                    value={vm.newPlayerPosition}
                                    onChange={(e) => {
                                        vm.setNewPlayerPosition(e.target.value);
                                        vm.validateField('newPlayerPosition', e.target.value);
                                    }}
                                    placeholder="Enter player position"
                                />
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
        </>
    );
}