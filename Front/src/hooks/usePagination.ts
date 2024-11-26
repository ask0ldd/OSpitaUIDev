/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react"

function usePagination(nItemsPerPage : number, getItemsNumber : () => number){

    const [activePage, setActivePage] = useState<number>(0)

    function handlePageChange(direction: 'next' | 'prev'){
        const totalPages = Math.ceil(getItemsNumber() / nItemsPerPage)
        if(direction === 'next'){
            setActivePage(currentPage => currentPage + 1 < totalPages ? currentPage + 1 : 0)
        }else{
            setActivePage(currentPage => currentPage - 1 < 0 ? ( totalPages - 1 < 0 ? 0 : totalPages - 1 ) : currentPage - 1)
        }
    }

    function resetActivePage(){
        setActivePage(0)
    }

    return { handlePageChange, activePage, resetActivePage }
}

export default usePagination