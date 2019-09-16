import './index.sass'
import React from 'react'

export default function ({ onSearch }) {

        const handleQuery = (event) => {
                event.preventDefault()
                const query = event.target.query.value

                onSearch(query)
        }

        return <form onSubmit={handleQuery}>
                <input type="text" name="query" placeholder="search" />
                <button><i class="fas fa-search"></i></button>
        </form>
}