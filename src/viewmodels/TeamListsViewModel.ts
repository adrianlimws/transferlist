import { useState, useEffect } from 'react'
import { TeamList } from '../models/Types'
import axios from 'axios'

const EXCHANGE_RATE_KEY = 'EUR_GBP_EXCHANGE_RATE'
const EXCHANGE_RATE_TIMESTAMP_KEY = 'EUR_GBP_EXCHANGE_RATE_TIMESTAMP'
const RATE_REFRESH_INTERVAL = 24 * 60 * 60 * 1000

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
    const [exchangeRate, setExchangeRate] = useState<number | null>(null)

    useEffect(() => {
        loadExchangeRate()
    }, [])

    const loadExchangeRate = async () => {
        const storedRate = localStorage.getItem(EXCHANGE_RATE_KEY)
        const storedTimestamp = localStorage.getItem(
            EXCHANGE_RATE_TIMESTAMP_KEY
        )

        if (storedRate && storedTimestamp) {
            const timestamp = parseInt(storedTimestamp, 10)
            if (Date.now() - timestamp < RATE_REFRESH_INTERVAL) {
                setExchangeRate(parseFloat(storedRate))
                return
            }
        }

        await fetchExchangeRate()
    }

    const fetchExchangeRate = async () => {
        try {
            // const apiKey = import.meta.env.VITE_CURRENCY_API_KEY
            const response = await axios.get(
                'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_XPmNn9dZa0FOQgTCxEfrEKxvXen9FYSu6DgXDdYW'
            )
            const gbpRate = response.data.data.GBP
            setExchangeRate(gbpRate)
            localStorage.setItem(EXCHANGE_RATE_KEY, gbpRate.toString())
            localStorage.setItem(
                EXCHANGE_RATE_TIMESTAMP_KEY,
                Date.now().toString()
            )
        } catch (error) {
            console.error('Error fetching exchange rate:', error)
        }
    }

    const formatNumber = (num: number): string => {
        return num.toLocaleString('en-GB', {
            maximumFractionDigits: 0,
        })
    }

    const convertEuroToPounds = (euroAmount: number): string => {
        if (exchangeRate === null) {
            return '£ --'
        }
        const poundsAmount = euroAmount * exchangeRate
        return `£${formatNumber(poundsAmount)}`
    }

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

    const cancelEditPlayer = () => {
        setEditingPlayer(null)
        setEditPlayerName('')
        setEditPlayerPosition('')
        setEditPlayerPrice('')
    }

    const cancelRenameList = () => {
        setRenameListIndex(null)
        setRenameListName('')
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
        cancelEditPlayer,
        cancelRenameList,
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
        exchangeRate,
        convertEuroToPounds,
    }
}
