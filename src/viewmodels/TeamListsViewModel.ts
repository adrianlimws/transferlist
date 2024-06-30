// viewmodels/SoccerTeamListsViewModel.ts
import { useState } from 'react'
import { TeamList } from '../models/Types'

export function useSoccerTeamListsViewModel() {
    const [lists, setLists] = useState<TeamList[]>([])
    const [newListName, setNewListName] = useState('')
    const [newPlayerName, setNewPlayerName] = useState('')
    const [newPlayerPosition, setNewPlayerPosition] = useState('')
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

    const addPlayer = () => {
        const isNameValid = validateField('newPlayerName', newPlayerName)
        const isPositionValid = validateField(
            'newPlayerPosition',
            newPlayerPosition
        )
        if (activeListIndex !== null && isNameValid && isPositionValid) {
            const updatedLists = [...lists]
            updatedLists[activeListIndex].players.push({
                name: newPlayerName,
                position: newPlayerPosition,
            })
            setLists(updatedLists)
            setNewPlayerName('')
            setNewPlayerPosition('')
            setActiveListIndex(null)
        }
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

    return {
        lists,
        newListName,
        deleteList,
        setNewListName,
        newPlayerName,
        setNewPlayerName,
        newPlayerPosition,
        setNewPlayerPosition,
        activeListIndex,
        setActiveListIndex,
        renameListIndex,
        renameListName,
        setRenameListName,
        errors,
        addList,
        addPlayer,
        startRenameList,
        submitRenameList,
        validateField,
    }
}
