import { useEffect, useState } from "react";

const storage = {
    getItem(key : string, initialValue : string) : string {
        if (typeof window === "undefined") {
            return initialValue;
        }
        try {
            const unparsedValue = window.localStorage[key];
            if (typeof unparsedValue === "undefined") {
                return initialValue;
            }
            return JSON.parse(unparsedValue);
        } catch (error) {
            return initialValue;
        }
    },

    setItem(key : string, value : string) {
        window.localStorage.setItem(key, JSON.stringify(value))
    },
};


function useLocalStorage(key : string, initialValue : string) : [string, (value: string) => void] {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(storage.getItem(key, initialValue))
    }, [key, initialValue])

    const setItem = (newValue : string) => {
        setValue(newValue);
        storage.setItem(key, newValue);
    };

    return [value, setItem];
}

export default useLocalStorage
