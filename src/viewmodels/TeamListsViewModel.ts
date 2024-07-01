import { useState } from 'react'
import { TeamList } from '../models/Types'

export function useSoccerTeamListsViewModel() {
    const [lists, setLists] = useState<TeamList[]>([])
    const [newListName, setNewListName] = useState('')
    const [newPlayerName, setNewPlayerName] = useState('')
    const [newPlayerPosition, setNewPlayerPosition] = useState('')
    const [newPlayerPrice, setNewPlayerPrice] = useState('')
    const [editingPlayer, setEditingPlayer] = useState<{
        listIndex: number
        playerIndex: number
    } | null>(null)
    const [editPlayerName, setEditPlayerName] = useState('')
    const [editPlayerPosition, setEditPlayerPosition] = useState('')
    const [editPlayerPrice, setEditPlayerPrice] = useState('')
    const [activeListIndex, setActiveListIndex] = useState<number | null>(null)
    const [renameListIndex, setRenameListIndex] = useState<number | null>(null)
    const [renameListName, setRenameListName] = useState('')
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const validateField = (name: string, value: string) => {
        if (!value.trim()) {
            setErrors((prev) => ({
                ...prev,
                [name]: 'This field cannot be empty',
            }))
            return false
        }
        if (name.toLowerCase().includes('price') && isNaN(parseFloat(value))) {
            setErrors((prev) => ({
                ...prev,
                [name]: 'Price must be a valid number',
            }))
            return false
        }
        setErrors((prev) => ({ ...prev, [name]: '' }))
        return true
    }

    const addList = () => {
        if (validateField('newListName', newListName)) {
            setLists([...lists, { name: newListName, players: [] }])
            setNewListName('')
        }
    }

    const deleteList = (indexToDelete: number) => {
        const updatedLists = lists.filter((_, index) => index !== indexToDelete)
        setLists(updatedLists)

        if (activeListIndex === indexToDelete) {
            setActiveListIndex(null)
        } else if (
            activeListIndex !== null &&
            indexToDelete < activeListIndex
        ) {
            setActiveListIndex(activeListIndex - 1)
        }
    }

    const startEditPlayer = (listIndex: number, playerIndex: number) => {
        const player = lists[listIndex].players[playerIndex]
        setEditingPlayer({ listIndex, playerIndex })
        setEditPlayerName(player.name)
        setEditPlayerPosition(player.position)
        setEditPlayerPrice(player.price?.toString() || '')
    }

    const submitEditPlayer = () => {
        if (
            editingPlayer &&
            validateField('editPlayerName', editPlayerName) &&
            validateField('editPlayerPosition', editPlayerPosition) &&
            validateField('editPlayerPrice', editPlayerPrice)
        ) {
            const updatedLists = [...lists]
            const player =
                updatedLists[editingPlayer.listIndex].players[
                    editingPlayer.playerIndex
                ]
            player.name = editPlayerName
            player.position = editPlayerPosition
            player.price = editPlayerPrice
                ? parseFloat(editPlayerPrice)
                : undefined
            setLists(updatedLists)
            setEditingPlayer(null)
        }
    }

    const addPlayer = () => {
        const isNameValid = validateField('newPlayerName', newPlayerName)
        const isPositionValid = validateField(
            'newPlayerPosition',
            newPlayerPosition
        )
        const isPriceValid = validateField('newPlayerPrice', newPlayerPrice)
        if (
            activeListIndex !== null &&
            isNameValid &&
            isPositionValid &&
            isPriceValid
        ) {
            const updatedLists = [...lists]
            updatedLists[activeListIndex].players.push({
                name: newPlayerName,
                position: newPlayerPosition,
                price: newPlayerPrice ? parseFloat(newPlayerPrice) : undefined,
            })
            setLists(updatedLists)
            setNewPlayerName('')
            setNewPlayerPosition('')
            setNewPlayerPrice('')
            setActiveListIndex(null)
        }
    }

    const movePlayer = (
        fromListIndex: number,
        toListIndex: number,
        playerIndex: number
    ) => {
        const updatedLists = [...lists]
        const [movedPlayer] = updatedLists[fromListIndex].players.splice(
            playerIndex,
            1
        )
        updatedLists[toListIndex].players = [
            ...updatedLists[toListIndex].players,
            movedPlayer,
        ]
        setLists(updatedLists)
    }

    const startRenameList = (index: number) => {
        setRenameListIndex(index)
        setRenameListName(lists[index].name)
    }

    const submitRenameList = () => {
        if (
            renameListIndex !== null &&
            validateField('renameListName', renameListName)
        ) {
            const updatedLists = [...lists]
            updatedLists[renameListIndex].name = renameListName
            setLists(updatedLists)
            setRenameListIndex(null)
            setRenameListName('')
        }
    }

    const deletePlayer = (listIndex: number, playerIndex: number) => {
        const updatedLists = [...lists]
        updatedLists[listIndex].players.splice(playerIndex, 1)
        setLists(updatedLists)
    }

    return {
        lists,
        newListName,
        newPlayerName,
        newPlayerPosition,
        newPlayerPrice,
        editingPlayer,
        editPlayerName,
        editPlayerPosition,
        editPlayerPrice,
        activeListIndex,
        renameListIndex,
        renameListName,
        deletePlayer,
        errors,
        setNewListName,
        setNewPlayerName,
        setNewPlayerPosition,
        setNewPlayerPrice,
        setEditPlayerName,
        setEditPlayerPosition,
        setEditPlayerPrice,
        setActiveListIndex,
        setRenameListName,
        addList,
        deleteList,
        startEditPlayer,
        submitEditPlayer,
        addPlayer,
        movePlayer,
        startRenameList,
        submitRenameList,
        validateField,
    }
}
