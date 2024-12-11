import { useState, useRef } from "react"
import { TRightMenuOptions } from "../interfaces/TRightMenuOptions"

function useRightMenu() {

    const [activeMenuItem, _setActiveMenuItem] = useState<TRightMenuOptions>("agent")
    const activeMenuItemRef = useRef<TRightMenuOptions>("agent")
    function setActiveMenuItem(menuItem: TRightMenuOptions) {
        _setActiveMenuItem(menuItem)
        activeMenuItemRef.current = menuItem
    }
    
    return {activeMenuItem, setActiveMenuItem, activeMenuItemRef}
}

export default useRightMenu