import { useState, useRef } from "react"

function useRightMenu() {

    const [activeMenuItem, _setActiveMenuItem] = useState<"agent"|"settings"|"chain">("agent")
    const activeMenuItemRef = useRef<"agent"|"settings"|"chain">("agent")
    function setActiveMenuItem(menuItem: "agent"|"settings"|"chain") {
        _setActiveMenuItem(menuItem)
        activeMenuItemRef.current = menuItem
    }
    
    return {activeMenuItem, setActiveMenuItem, activeMenuItemRef}
}

export default useRightMenu