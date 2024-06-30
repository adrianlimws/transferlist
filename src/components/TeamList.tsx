import { useSoccerTeamListsViewModel } from '../viewmodels/TeamListsViewModel';
import AddPlayerIcon from '../assets/add-user.png'
import DeleteIcon from '../assets/delete.png'
import EditIcon from '../assets/edit.png'
import AddPlayerToListIcon from '../assets/add-player.png'
import CancelIcon from '../assets/cancel.png'
import SaveIcon from '../assets/save.png'

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
                                <li key={playerIndex}>{player.name} - {player.position}</li>
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