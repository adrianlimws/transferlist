import { useState, useEffect } from 'react'
import { TeamList } from '../models/Types'
import axios from 'axios'

const EXCHANGE_RATES_KEY = 'EUR_EXCHANGE_RATES'
const EXCHANGE_RATES_TIMESTAMP_KEY = 'EUR_EXCHANGE_RATES_TIMESTAMP'
const RATE_REFRESH_INTERVAL = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
const PLAYER_POSITIONS = [
    'GK',
    'RB',
    'LB',
    'RCB',
    'LCB',
    'CB',
    'DM',
    'BBM',
    'CM',
    'AM',
    'RW',
    'LW',
    'IF',
    'F9',
    'TM',
    'CF',
    'ST',
]

interface ExchangeRates {
    [key: string]: number
}

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
    const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(
        null
    )
    const exportLists = () => {
        const dataStr = JSON.stringify(lists)
        const dataUri =
            'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
        const exportFileDefaultName = 'soccer_team_lists.json'

        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
    }

    const importLists = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const importedLists = JSON.parse(e.target?.result as string)
                    setLists(importedLists)
                    saveLists(importedLists) // Save to localStorage
                } catch (error) {
                    console.error('Error parsing imported file:', error)
                }
            }
            reader.readAsText(file)
        }
    }

    // const clearLocalStorage = () => {
    //     window.localStorage.removeItem('soccerTeamLists')
    // }

    const saveLists = (listsToSave: TeamList[]) => {
        window.localStorage.setItem(
            'soccerTeamLists',
            JSON.stringify(listsToSave)
        )
    }

    useEffect(() => {
        loadExchangeRates()

        const savedLists = window.localStorage.getItem('soccerTeamLists')
        if (savedLists) {
            const parsedSavedLists = JSON.parse(savedLists)
            if (JSON.stringify(parsedSavedLists) !== JSON.stringify(lists)) {
                // Data mismatch - you could prompt the user here
                if (
                    window.confirm(
                        'There is existing data in your browser localStorage. Would you like to load it?'
                    )
                ) {
                    setLists(parsedSavedLists)
                } else {
                    // User chose not to load - overwrite localStorage with current state
                    saveLists(lists)
                }
            }
        } else {
            // No data in localStorage - save current state
            saveLists(lists)
        }
    }, [])

    const loadExchangeRates = async () => {
        const storedRates = window.localStorage.getItem(EXCHANGE_RATES_KEY)
        const storedTimestamp = window.localStorage.getItem(
            EXCHANGE_RATES_TIMESTAMP_KEY
        )

        if (storedRates && storedTimestamp) {
            const timestamp = parseInt(storedTimestamp, 10)
            if (Date.now() - timestamp < RATE_REFRESH_INTERVAL) {
                setExchangeRates(JSON.parse(storedRates))
                return
            }
        }

        await fetchExchangeRates()
    }

    const fetchExchangeRates = async () => {
        try {
            const response = await axios.get(
                'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json'
            )
            const rates = response.data.eur
            setExchangeRates(rates)
            window.localStorage.setItem(
                EXCHANGE_RATES_KEY,
                JSON.stringify(rates)
            )
            window.localStorage.setItem(
                EXCHANGE_RATES_TIMESTAMP_KEY,
                Date.now().toString()
            )
        } catch (error) {
            console.error('Error fetching exchange rates:', error)
        }
    }

    const formatNumber = (num: number): string => {
        return num.toLocaleString('en-GB', { maximumFractionDigits: 0 })
    }

    const convertEuroToCurrency = (
        euroAmount: number,
        currencyCode: string
    ): string => {
        if (!exchangeRates || !(currencyCode.toLowerCase() in exchangeRates)) {
            return '-- '
        }
        const rate = exchangeRates[currencyCode.toLowerCase()]
        const convertedAmount = Math.round(euroAmount * rate)
        return formatNumber(convertedAmount)
    }

    const validateField = (
        name: string,
        value: string,
        shouldValidate: boolean = true
    ) => {
        if (!shouldValidate) {
            setErrors((prev) => ({ ...prev, [name]: '' }))
            return true
        }

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
            const updatedLists = [
                ...lists,
                { name: newListName, players: [], backgroundColor: '#ffffff' },
            ]
            setLists(updatedLists)
            saveLists(updatedLists)
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

    const updateListBackgroundColor = (listIndex: number, color: string) => {
        const updatedLists = [...lists]
        updatedLists[listIndex].backgroundColor = color
        setLists(updatedLists)
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

    const getPlayerCategory = (position: string): string => {
        if (position === 'GK') return 'goalkeeper'
        if (['RB', 'LB', 'RCB', 'LCB', 'CB'].includes(position))
            return 'defender'
        if (['DM', 'BBM', 'CM', 'AM'].includes(position)) return 'midfielder'
        if (['RW', 'LW', 'IF', 'F9'].includes(position)) return 'attacker'
        if (['TM', 'CF', 'ST'].includes(position)) return 'striker'
        return 'unknown'
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
        exchangeRates,
        convertEuroToCurrency,
        formatNumber,
        exportLists,
        importLists,
        playerPositions: PLAYER_POSITIONS,
        getPlayerCategory,
        updateListBackgroundColor,
    }
}
